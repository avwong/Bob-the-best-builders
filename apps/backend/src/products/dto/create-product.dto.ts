import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsUUID, Min } from 'class-validator';

export enum ShelfSide {
  LEFT = 'left',
  RIGHT = 'right',
}

export enum ShelfSection {
  TOP = 'top',
  MIDDLE = 'middle',
  BOTTOM = 'bottom',
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsUUID()
  @IsNotEmpty()
  supermarketId: string;

  @IsUUID()
  @IsOptional()
  aisleId?: string;

  @IsNumber()
  @Min(1)
  aisleNumber: number;

  @IsString()
  @IsNotEmpty()
  aisleSegment: string;

  @IsEnum(ShelfSide)
  shelfSide: ShelfSide;

  @IsEnum(ShelfSection)
  shelfSection: ShelfSection;

  @IsNumber()
  @Min(0)
  gridX: number;

  @IsNumber()
  @Min(0)
  gridY: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

// Made with Bob
