import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  RecipeChatRequestDto,
  RecipeChatResponseDto,
  RecipeIngredientDto,
} from './dto/recipe-chat.dto';

type CatalogProduct = {
  id: string;
  name: string;
  category: string;
  aisleId: string | null;
  gridX: number;
  gridY: number;
  price: Prisma.Decimal | null;
};

type ModelIngredient = {
  ingredient: string;
  quantity: string;
  matchedProductId: string | null;
  note: string;
};

type ModelRecipeResponse = {
  reply: string;
  ingredients: ModelIngredient[];
};

type OpenAITextContent = {
  type?: string;
  text?: string;
};

type OpenAIOutputItem = {
  type?: string;
  content?: OpenAITextContent[];
};

type OpenAIResponse = {
  output_text?: string;
  output?: OpenAIOutputItem[];
  error?: {
    message?: string;
  };
};

@Injectable()
export class ChatService {
  private readonly openAiUrl = 'https://api.openai.com/v1/responses';

  constructor(private prisma: PrismaService) {}

  async suggestRecipeIngredients(
    request: RecipeChatRequestDto,
  ): Promise<RecipeChatResponseDto> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new ServiceUnavailableException(
        'OPENAI_API_KEY is not configured on the backend',
      );
    }

    const catalog = await this.getCatalog(request.supermarketId);
    const modelResponse = await this.callOpenAI(apiKey, request.message, catalog);

    return {
      reply: modelResponse.reply,
      ingredients: modelResponse.ingredients.map((ingredient) =>
        this.mapIngredient(ingredient, catalog),
      ),
    };
  }

  private async getCatalog(supermarketId?: string): Promise<CatalogProduct[]> {
    return this.prisma.product.findMany({
      where: supermarketId ? { supermarketId } : undefined,
      select: {
        id: true,
        name: true,
        category: true,
        aisleId: true,
        gridX: true,
        gridY: true,
        price: true,
      },
      orderBy: { name: 'asc' },
      take: 120,
    });
  }

  private async callOpenAI(
    apiKey: string,
    message: string,
    catalog: CatalogProduct[],
  ): Promise<ModelRecipeResponse> {
    const response = await fetch(this.openAiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        instructions:
          'You are Aisly, a supermarket shopping assistant. Convert the customer request into a concise ingredient shopping list. Match ingredients to the provided product catalog whenever a reasonable product exists. Only use product IDs from the catalog. If no catalog product fits, use null for matchedProductId.',
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: JSON.stringify({
                  customerRequest: message,
                  catalog: catalog.map((product) => ({
                    id: product.id,
                    name: product.name,
                    category: product.category,
                  })),
                }),
              },
            ],
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'recipe_shopping_list',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              required: ['reply', 'ingredients'],
              properties: {
                reply: {
                  type: 'string',
                  description:
                    'A short helpful sentence explaining the suggested shopping list.',
                },
                ingredients: {
                  type: 'array',
                  minItems: 1,
                  maxItems: 16,
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    required: [
                      'ingredient',
                      'quantity',
                      'matchedProductId',
                      'note',
                    ],
                    properties: {
                      ingredient: { type: 'string' },
                      quantity: { type: 'string' },
                      matchedProductId: {
                        type: ['string', 'null'],
                        description:
                          'A product ID from the catalog, or null when no product matches.',
                      },
                      note: {
                        type: 'string',
                        description:
                          'Short preparation or substitution note. Use an empty string if not needed.',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
    });

    const body = (await response.json().catch(() => null)) as OpenAIResponse | null;

    if (!response.ok) {
      throw new ServiceUnavailableException(
        body?.error?.message || 'OpenAI request failed',
      );
    }

    const outputText = this.extractOutputText(body);

    if (!outputText) {
      throw new InternalServerErrorException('OpenAI returned an empty response');
    }

    return this.parseModelResponse(outputText);
  }

  private extractOutputText(response: OpenAIResponse | null): string | null {
    if (!response) {
      return null;
    }

    if (response.output_text) {
      return response.output_text;
    }

    for (const item of response.output || []) {
      for (const content of item.content || []) {
        if (
          (content.type === 'output_text' || content.type === 'text') &&
          content.text
        ) {
          return content.text;
        }
      }
    }

    return null;
  }

  private parseModelResponse(outputText: string): ModelRecipeResponse {
    const parsed = JSON.parse(outputText) as ModelRecipeResponse;

    if (!parsed.reply || !Array.isArray(parsed.ingredients)) {
      throw new InternalServerErrorException('OpenAI returned invalid recipe data');
    }

    return parsed;
  }

  private mapIngredient(
    ingredient: ModelIngredient,
    catalog: CatalogProduct[],
  ): RecipeIngredientDto {
    const product =
      catalog.find((item) => item.id === ingredient.matchedProductId) ||
      this.findFallbackMatch(ingredient.ingredient, catalog);

    return {
      ingredient: ingredient.ingredient,
      quantity: ingredient.quantity,
      note: ingredient.note,
      product: product
        ? {
            id: product.id,
            name: product.name,
            category: product.category,
            location: {
              aisleId: product.aisleId || undefined,
              x: product.gridX,
              y: product.gridY,
            },
            price: product.price ? Number(product.price) : 0,
            inStock: true,
          }
        : null,
    };
  }

  private findFallbackMatch(
    ingredient: string,
    catalog: CatalogProduct[],
  ): CatalogProduct | null {
    const ingredientWords = this.normalizeWords(ingredient);
    let bestMatch: CatalogProduct | null = null;
    let bestScore = 0;

    for (const product of catalog) {
      const productWords = this.normalizeWords(`${product.name} ${product.category}`);
      const score = ingredientWords.filter((word) => productWords.includes(word)).length;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = product;
      }
    }

    return bestScore > 0 ? bestMatch : null;
  }

  private normalizeWords(value: string): string[] {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2);
  }
}
