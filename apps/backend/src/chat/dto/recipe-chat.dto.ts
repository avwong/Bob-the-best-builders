import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class RecipeChatRequestDto {
  @IsString()
  @MinLength(3)
  message: string;

  @IsUUID()
  @IsOptional()
  supermarketId?: string;
}

export interface RecipeIngredientDto {
  ingredient: string;
  quantity: string;
  note: string;
  product: {
    id: string;
    name: string;
    category: string;
    location: {
      aisleId?: string;
      x: number;
      y: number;
    };
    price: number;
    inStock: boolean;
  } | null;
}

export interface RecipeChatResponseDto {
  reply: string;
  ingredients: RecipeIngredientDto[];
}
