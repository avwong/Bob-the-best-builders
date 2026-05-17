import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ShelfSection, ShelfSide } from './create-product.dto';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsUUID()
  @IsOptional()
  supermarketId?: string;

  @IsUUID()
  @IsOptional()
  aisleId?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  aisleNumber?: number;

  @IsString()
  @IsOptional()
  aisleSegment?: string;

  @IsEnum(ShelfSide)
  @IsOptional()
  shelfSide?: ShelfSide;

  @IsEnum(ShelfSection)
  @IsOptional()
  shelfSection?: ShelfSection;

  @IsNumber()
  @IsOptional()
  @Min(0)
  gridX?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  gridY?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
