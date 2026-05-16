export interface Position {
    x: number;
    y: number;
}

export interface Dimensions {
    width: number;
    height: number;
}

export interface GridCell {
    x: number;
    y: number;
    walkable: boolean;
    occupied: boolean;
    type?: 'shelf' | 'walkway' | 'zone' | 'checkout' | 'entrance' | 'exit' | 'wall';
}

export interface Shelf {
    id: string;
    label: string;
    type: 'shelf';
    position: Position;
    dimensions: Dimensions;
    orientation: 'vertical' | 'horizontal';
    category: string;
    shelves: {
        left: {
            sections: ('top' | 'middle' | 'bottom')[];
        };
        right: {
            sections: ('top' | 'middle' | 'bottom')[];
        };
    };
}

export interface SpecialZone {
    id: string;
    label: string;
    type: 'produce_section' | 'deli_section' | 'bakery_section' | 'pharmacy_section';
    position: Position;
    dimensions: Dimensions;
    category: string;
}

export interface Checkout {
    id: string;
    position: Position;
    dimensions: Dimensions;
    type?: 'standard' | 'self' | 'express';
}

export interface EntryExit {
    id: string;
    type: 'entrance' | 'exit';
    position: Position;
    dimensions: Dimensions;
}

export interface Wall {
    id: string;
    type: 'wall';
    position: Position;
    dimensions: Dimensions;
    orientation: 'vertical' | 'horizontal';
}

export interface StoreLayout {
    store_id: string;
    store_name: string;
    version: string;
    dimensions: Dimensions & { unit: string };
    grid: {
        cell_size: number;
        walkable_paths: string[];
    };
    shelves: Shelf[];
    special_zones: SpecialZone[];
    checkouts: Checkout[];
    entry_exit: EntryExit[];
    walls: Wall[];
}

export interface Product {
    id: string;
    name: string;
    barcode?: string;
    category: string;
    location: {
        zone_type: 'shelf' | 'special_zone';
        zone_id: string;
        shelf_side?: 'left' | 'right';
        shelf_section?: 'top' | 'middle' | 'bottom';
        coordinates?: Position;
    };
    price?: number;
    image_url?: string;
    keywords?: string[];
}

export interface EditorState {
    selectedTool: 'select' | 'shelf' | 'zone' | 'checkout' | 'entrance' | 'exit' | 'wall';
    selectedElement: string | null;
    gridSize: number;
    snapToGrid: boolean;
    showGrid: boolean;
    zoom: number;
}

// Made with Bob
