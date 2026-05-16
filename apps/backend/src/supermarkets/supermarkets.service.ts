import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupermarketResponseDto, SupermarketLayoutDto, AisleDto } from './dto/supermarket-response.dto';

@Injectable()
export class SupermarketsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<SupermarketResponseDto[]> {
    const supermarkets = await this.prisma.supermarket.findMany({
      orderBy: { name: 'asc' },
    });

    return supermarkets.map(s => this.mapToResponseDto(s));
  }

  async findOne(id: string): Promise<SupermarketResponseDto> {
    const supermarket = await this.prisma.supermarket.findUnique({
      where: { id },
    });

    if (!supermarket) {
      throw new NotFoundException(`Supermarket with ID ${id} not found`);
    }

    return this.mapToResponseDto(supermarket);
  }

  async getLayout(id: string): Promise<SupermarketLayoutDto> {
    const supermarket = await this.prisma.supermarket.findUnique({
      where: { id },
      include: {
        aisles: {
          orderBy: { aisleNumber: 'asc' },
        },
      },
    });

    if (!supermarket) {
      throw new NotFoundException(`Supermarket with ID ${id} not found`);
    }

    return {
      ...this.mapToResponseDto(supermarket),
      aisles: supermarket.aisles.map(a => this.mapAisleToDto(a)),
    };
  }

  private mapToResponseDto(supermarket: any): SupermarketResponseDto {
    return {
      id: supermarket.id,
      name: supermarket.name,
      width: supermarket.width,
      height: supermarket.height,
      createdAt: supermarket.createdAt,
      updatedAt: supermarket.updatedAt,
    };
  }

  private mapAisleToDto(aisle: any): AisleDto {
    return {
      id: aisle.id,
      aisleNumber: aisle.aisleNumber,
      label: aisle.label,
      category: aisle.category,
      positionX: aisle.positionX,
      positionY: aisle.positionY,
      width: aisle.width,
      height: aisle.height,
    };
  }
}

// Made with Bob
