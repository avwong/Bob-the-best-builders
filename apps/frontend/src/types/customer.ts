export interface Product {
    id: string;
    name: string;
    category: string;
    location: { aisleId?: string; zoneId?: string; x?: number; y?: number };
    price: number;
    inStock: boolean;
}

export interface ShoppingListItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    checked: boolean;
    location?: { x: number; y: number };
}

export interface UserPosition {
    x: number;
    y: number;
}

// Made with Bob
