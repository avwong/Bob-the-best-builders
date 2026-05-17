import {
  IsArray,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SaveLayoutElementDto {
  @IsString()
  id: string;

  @IsIn(['shelf', 'freezer', 'special_zone', 'checkout', 'entrance', 'exit', 'wall'])
  type: 'shelf' | 'freezer' | 'special_zone' | 'checkout' | 'entrance' | 'exit' | 'wall';

  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsInt()
  @Min(0)
  positionX: number;

  @IsInt()
  @Min(0)
  positionY: number;

  @IsInt()
  @Min(1)
  width: number;

  @IsInt()
  @Min(1)
  height: number;

  @IsString()
  @IsOptional()
  orientation?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class SaveSupermarketLayoutDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(10)
  width: number;

  @IsInt()
  @Min(10)
  height: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveLayoutElementDto)
  layoutElements: SaveLayoutElementDto[];
}
