import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SaveSupermarketLayoutDto } from './dto/save-layout.dto';
import { SupermarketResponseDto, SupermarketLayoutDto, AisleDto, LayoutElementDto } from './dto/supermarket-response.dto';

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
        layoutElements: {
          orderBy: [{ positionY: 'asc' }, { positionX: 'asc' }],
        },
      },
    });

    if (!supermarket) {
      throw new NotFoundException(`Supermarket with ID ${id} not found`);
    }

    return {
      ...this.mapToResponseDto(supermarket),
      aisles: supermarket.aisles.map(a => this.mapAisleToDto(a)),
      layoutElements: supermarket.layoutElements.map(e => this.mapLayoutElementToDto(e)),
    };
  }

  async saveLayout(
    id: string,
    layout: SaveSupermarketLayoutDto,
  ): Promise<SupermarketLayoutDto> {
    const supermarket = await this.prisma.supermarket.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!supermarket) {
      throw new NotFoundException(`Supermarket with ID ${id} not found`);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.supermarket.update({
        where: { id },
        data: {
          name: layout.name,
          width: layout.width,
          height: layout.height,
        },
      });

      await tx.layoutElement.deleteMany({
        where: { supermarketId: id },
      });

      if (layout.layoutElements.length > 0) {
        await tx.layoutElement.createMany({
          data: layout.layoutElements.map((element) => ({
            id: element.id,
            supermarketId: id,
            type: element.type,
            label: element.label,
            category: element.category,
            positionX: element.positionX,
            positionY: element.positionY,
            width: element.width,
            height: element.height,
            orientation: element.orientation,
            metadata: element.metadata as Prisma.InputJsonValue,
          })),
        });
      }

      await Promise.all(
        layout.layoutElements
          .filter((element) => element.type === 'shelf')
          .map((element) => {
            const aisleNumber = this.getAisleNumberFromLabel(element.label);

            if (!aisleNumber) {
              return Promise.resolve();
            }

            return tx.aisle.updateMany({
              where: {
                supermarketId: id,
                aisleNumber,
              },
              data: {
                category: element.category,
                positionX: element.positionX,
                positionY: element.positionY,
                width: element.width,
                height: element.height,
              },
            });
          }),
      );
    });

    return this.getLayout(id);
  }

  private getAisleNumberFromLabel(label?: string): number | null {
    const match = label?.match(/\d+/);
    return match ? Number(match[0]) : null;
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

  private mapLayoutElementToDto(element: any): LayoutElementDto {
    return {
      id: element.id,
      type: element.type,
      label: element.label,
      category: element.category,
      positionX: element.positionX,
      positionY: element.positionY,
      width: element.width,
      height: element.height,
      orientation: element.orientation,
      metadata: element.metadata,
    };
  }
}

// Made with Bob
