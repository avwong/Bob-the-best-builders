export class ProductLocationDto {
  aisleNumber: number;
  aisleSegment: string;
  shelfSide: string;
  shelfSection: string;
  gridX: number;
  gridY: number;
}

export class ProductResponseDto {
  id: string;
  name: string;
  barcode?: string;
  category: string;
  supermarketId: string;
  aisleId?: string;
  location: ProductLocationDto;
  price?: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductWithAisleDto extends ProductResponseDto {
  aisle?: {
    id: string;
    aisleNumber: number;
    label: string;
    category?: string;
  };
}

export class PaginatedProductsDto {
  data: ProductResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Made with Bob
