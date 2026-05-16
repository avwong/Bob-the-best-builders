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

export class SupermarketLayoutDto extends SupermarketResponseDto {
  aisles: AisleDto[];
}

// Made with Bob
