export interface Product {
    id: string;
    name: string;
    category: string;
    location: {
        aisleId?: string;
        aisleNumber?: number;
        aisleSegment?: string;
        shelfSide?: 'left' | 'right';
        shelfSection?: 'top' | 'middle' | 'bottom';
        zoneId?: string;
        x?: number;
        y?: number;
    };
    price: number;
    inStock: boolean;
}

export interface ShoppingListItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    checked: boolean;
    location?: { x: number; y: number; label?: string };
}

export interface UserPosition {
    x: number;
    y: number;
}

// Made with Bob
