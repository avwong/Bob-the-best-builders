import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto, ProductWithAisleDto, PaginatedProductsDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        barcode: createProductDto.barcode,
        category: createProductDto.category,
        supermarketId: createProductDto.supermarketId,
        aisleId: createProductDto.aisleId,
        aisleNumber: createProductDto.aisleNumber,
        aisleSegment: createProductDto.aisleSegment,
        shelfSide: createProductDto.shelfSide,
        shelfSection: createProductDto.shelfSection,
        gridX: createProductDto.gridX,
        gridY: createProductDto.gridY,
        price: createProductDto.price,
        imageUrl: createProductDto.imageUrl,
      },
    });

    return this.mapToResponseDto(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        barcode: updateProductDto.barcode,
        category: updateProductDto.category,
        supermarketId: updateProductDto.supermarketId,
        aisleId: updateProductDto.aisleId,
        aisleNumber: updateProductDto.aisleNumber,
        aisleSegment: updateProductDto.aisleSegment,
        shelfSide: updateProductDto.shelfSide,
        shelfSection: updateProductDto.shelfSection,
        gridX: updateProductDto.gridX,
        gridY: updateProductDto.gridY,
        price: updateProductDto.price,
        imageUrl: updateProductDto.imageUrl,
      },
    });

    return this.mapToResponseDto(product);
  }

  async remove(id: string): Promise<void> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.prisma.product.delete({ where: { id } });
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    supermarketId?: string,
  ): Promise<PaginatedProductsDto> {
    const skip = (page - 1) * limit;

    const where = supermarketId ? { supermarketId } : {};

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products.map(p => this.mapToResponseDto(p)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async searchByName(name: string, supermarketId?: string): Promise<ProductResponseDto[]> {
    const where: any = {
      name: {
        contains: name,
        mode: 'insensitive',
      },
    };

    if (supermarketId) {
      where.supermarketId = supermarketId;
    }

    const products = await this.prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
      take: 50, // Limit search results
    });

    return products.map(p => this.mapToResponseDto(p));
  }

  async findOne(id: string): Promise<ProductWithAisleDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        aisle: {
          select: {
            id: true,
            aisleNumber: true,
            label: true,
            category: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.mapToResponseDtoWithAisle(product);
  }

  async getProductLocation(id: string): Promise<ProductWithAisleDto> {
    return this.findOne(id);
  }

  private mapToResponseDto(product: any): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      barcode: product.barcode,
      category: product.category,
      supermarketId: product.supermarketId,
      aisleId: product.aisleId,
      location: {
        aisleNumber: product.aisleNumber,
        aisleSegment: product.aisleSegment,
        shelfSide: product.shelfSide,
        shelfSection: product.shelfSection,
        gridX: product.gridX,
        gridY: product.gridY,
      },
      price: product.price ? parseFloat(product.price.toString()) : undefined,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private mapToResponseDtoWithAisle(product: any): ProductWithAisleDto {
    const baseDto = this.mapToResponseDto(product);
    return {
      ...baseDto,
      aisle: product.aisle,
    };
  }
}

// Made with Bob
