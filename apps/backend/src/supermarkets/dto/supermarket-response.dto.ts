export class SupermarketResponseDto {
  id: string;
  name: string;
  width: number;
  height: number;
  createdAt: Date;
  updatedAt: Date;
}

export class AisleDto {
  id: string;
  aisleNumber: number;
  label: string;
  category?: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
}

export class LayoutElementDto {
  id: string;
  type: 'shelf' | 'freezer' | 'special_zone' | 'checkout' | 'entrance' | 'exit' | 'wall';
  label?: string;
  category?: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  orientation?: string;
  metadata?: Record<string, unknown>;
}

export class SupermarketLayoutDto extends SupermarketResponseDto {
  aisles: AisleDto[];
  layoutElements: LayoutElementDto[];
}

// Made with Bob
