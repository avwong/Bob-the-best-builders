import type { Product } from '@/types/customer';
import type {
    Checkout,
    EntryExit,
    Freezer,
    Shelf,
    SpecialZone,
    StoreLayout,
    Wall,
} from '@/types/supermarket';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface BackendProductLocation {
    aisleNumber: number;
    aisleSegment: string;
    shelfSide: string;
    shelfSection: string;
    gridX: number;
    gridY: number;
}

export interface BackendProduct {
    id: string;
    name: string;
    barcode?: string;
    category: string;
    supermarketId: string;
    aisleId?: string;
    location: BackendProductLocation;
    price?: number;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductMutationInput {
    name: string;
    barcode?: string;
    category: string;
    supermarketId: string;
    aisleId?: string;
    aisleNumber: number;
    aisleSegment: string;
    shelfSide: 'left' | 'right';
    shelfSection: 'top' | 'middle' | 'bottom';
    gridX: number;
    gridY: number;
    price?: number;
    imageUrl?: string;
}

export interface PaginatedProducts {
    data: BackendProduct[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface Supermarket {
    id: string;
    name: string;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
}

export interface BackendAisle {
    id: string;
    aisleNumber: number;
    label: string;
    category?: string;
    positionX: number;
    positionY: number;
    width: number;
    height: number;
}

export interface BackendLayoutElement {
    id: string;
    type: 'shelf' | 'freezer' | 'special_zone' | 'checkout' | 'entrance' | 'exit' | 'wall';
    label?: string;
    category?: string;
    positionX: number;
    positionY: number;
    width: number;
    height: number;
    orientation?: 'vertical' | 'horizontal';
    metadata?: Record<string, any>;
}

export interface SupermarketLayout extends Supermarket {
    aisles: BackendAisle[];
    layoutElements?: BackendLayoutElement[];
}

export interface StoreLayoutForMap {
    dimensions: { width: number; height: number };
    shelves: Shelf[];
    freezers: Freezer[];
    specialZones: SpecialZone[];
    checkouts: Checkout[];
    entryExit: EntryExit[];
    walls: Wall[];
}

export interface RecipeIngredientSuggestion {
    ingredient: string;
    quantity: string;
    note: string;
    product: Product | null;
}

export interface RecipeChatResponse {
    reply: string;
    ingredients: RecipeIngredientSuggestion[];
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const headers = new Headers(init?.headers);

    if (init?.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...init,
        headers,
    });

    if (!response.ok) {
        const message = await response.text().catch(() => response.statusText);
        throw new Error(message || `API request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
}

function toQuery(params: Record<string, string | number | undefined>) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
            searchParams.set(key, String(value));
        }
    });

    const query = searchParams.toString();
    return query ? `?${query}` : '';
}

export function mapBackendProduct(product: BackendProduct): Product {
    return {
        id: product.id,
        name: product.name,
        category: product.category,
        location: {
            aisleId: product.aisleId,
            aisleNumber: product.location.aisleNumber,
            aisleSegment: product.location.aisleSegment,
            shelfSide: product.location.shelfSide as 'left' | 'right',
            shelfSection: product.location.shelfSection as 'top' | 'middle' | 'bottom',
            x: product.location.gridX,
            y: product.location.gridY,
        },
        price: product.price ?? 0,
        inStock: true,
    };
}

export function mapSupermarketLayout(layout: SupermarketLayout): StoreLayoutForMap {
    const elements = mapLayoutElements(layout);

    return {
        dimensions: { width: layout.width, height: layout.height },
        shelves: elements.shelves,
        freezers: elements.freezers,
        specialZones: elements.specialZones,
        checkouts: elements.checkouts,
        entryExit: elements.entryExit,
        walls: elements.walls,
    };
}

export function mapSupermarketLayoutToEditor(layout: SupermarketLayout): StoreLayout {
    const elements = mapLayoutElements(layout);

    return {
        store_id: layout.id,
        store_name: layout.name,
        version: '1.0',
        dimensions: { width: layout.width, height: layout.height, unit: 'meters' },
        grid: { cell_size: 1, walkable_paths: [] },
        shelves: elements.shelves,
        freezers: elements.freezers,
        special_zones: elements.specialZones,
        checkouts: elements.checkouts,
        entry_exit: elements.entryExit,
        walls: elements.walls,
    };
}

function mapLayoutElements(layout: SupermarketLayout) {
    const defaultShelfSections = (): ('top' | 'middle' | 'bottom')[] => [
        'top',
        'middle',
        'bottom',
    ];

    const shelves: Shelf[] = [];
    const freezers: Freezer[] = [];
    const specialZones: SpecialZone[] = [];
    const checkouts: Checkout[] = [];
    const entryExit: EntryExit[] = [];
    const walls: Wall[] = [];

    const layoutElements =
        layout.layoutElements && layout.layoutElements.length > 0
            ? layout.layoutElements
            : layout.aisles.map((aisle) => ({
                id: aisle.id,
                type: 'shelf' as const,
                label: String(aisle.aisleNumber),
                category: aisle.category,
                positionX: aisle.positionX,
                positionY: aisle.positionY,
                width: aisle.width,
                height: aisle.height,
                orientation: 'vertical' as const,
                metadata: {},
            }));

    layoutElements.forEach((element) => {
        const base = {
            id: element.id,
            position: { x: element.positionX, y: element.positionY },
            dimensions: { width: element.width, height: element.height },
        };

        if (element.type === 'shelf') {
            shelves.push({
                ...base,
                label: element.label || element.id,
                type: 'shelf',
                orientation: element.orientation || 'vertical',
                category: element.category || '',
                shelves: element.metadata?.shelves || {
                    left: { sections: defaultShelfSections() },
                    right: { sections: defaultShelfSections() },
                },
            });
        }

        if (element.type === 'freezer') {
            freezers.push({
                ...base,
                label: element.label || 'Freezer',
                type: 'freezer',
                orientation: element.orientation || 'vertical',
                category: element.category || 'Frozen',
            });
        }

        if (element.type === 'special_zone') {
            specialZones.push({
                ...base,
                label: element.label || 'Zone',
                type: element.metadata?.zoneType || 'produce_section',
                category: element.category || '',
            });
        }

        if (element.type === 'checkout') {
            checkouts.push({
                ...base,
                type: element.metadata?.checkoutType || 'standard',
            });
        }

        if (element.type === 'entrance' || element.type === 'exit') {
            entryExit.push({
                ...base,
                type: element.type,
            });
        }

        if (element.type === 'wall') {
            walls.push({
                ...base,
                type: 'wall',
                orientation: element.orientation || 'horizontal',
            });
        }
    });

    return { shelves, freezers, specialZones, checkouts, entryExit, walls };
}

export function serializeEditorLayout(layout: StoreLayout) {
    const common = (element: {
        id: string;
        position: { x: number; y: number };
        dimensions: { width: number; height: number };
    }) => ({
        id: element.id,
        positionX: Math.round(element.position.x),
        positionY: Math.round(element.position.y),
        width: Math.max(1, Math.round(element.dimensions.width)),
        height: Math.max(1, Math.round(element.dimensions.height)),
    });

    return {
        name: layout.store_name,
        width: Math.max(10, Math.round(layout.dimensions.width)),
        height: Math.max(10, Math.round(layout.dimensions.height)),
        layoutElements: [
            ...layout.shelves.map((shelf) => ({
                ...common(shelf),
                type: 'shelf',
                label: shelf.label,
                category: shelf.category,
                orientation: shelf.orientation,
                metadata: { shelves: shelf.shelves },
            })),
            ...layout.freezers.map((freezer) => ({
                ...common(freezer),
                type: 'freezer',
                label: freezer.label,
                category: freezer.category,
                orientation: freezer.orientation,
                metadata: {},
            })),
            ...layout.special_zones.map((zone) => ({
                ...common(zone),
                type: 'special_zone',
                label: zone.label,
                category: zone.category,
                orientation: 'horizontal',
                metadata: { zoneType: zone.type },
            })),
            ...layout.checkouts.map((checkout) => ({
                ...common(checkout),
                type: 'checkout',
                label: checkout.id,
                orientation: 'horizontal',
                metadata: { checkoutType: checkout.type || 'standard' },
            })),
            ...layout.entry_exit.map((point) => ({
                ...common(point),
                type: point.type,
                label: point.type === 'entrance' ? 'Entrance' : 'Exit',
                orientation: 'horizontal',
                metadata: {},
            })),
            ...layout.walls.map((wall) => ({
                ...common(wall),
                type: 'wall',
                label: wall.id,
                orientation: wall.orientation,
                metadata: {},
            })),
        ],
    };
}

export async function getProducts(options?: {
    page?: number;
    limit?: number;
    supermarketId?: string;
}): Promise<PaginatedProducts> {
    return apiFetch<PaginatedProducts>(
        `/products${toQuery({
            page: options?.page ?? 1,
            limit: options?.limit ?? 100,
            supermarketId: options?.supermarketId,
        })}`
    );
}

export async function searchProducts(name: string, supermarketId?: string): Promise<BackendProduct[]> {
    return apiFetch<BackendProduct[]>(
        `/products/search${toQuery({
            name,
            supermarketId,
        })}`
    );
}

export async function getProduct(id: string): Promise<BackendProduct> {
    return apiFetch<BackendProduct>(`/products/${id}`);
}

export async function getProductLocation(id: string): Promise<BackendProduct> {
    return apiFetch<BackendProduct>(`/products/${id}/location`);
}

export async function createProduct(product: ProductMutationInput): Promise<BackendProduct> {
    return apiFetch<BackendProduct>('/products', {
        method: 'POST',
        body: JSON.stringify(product),
    });
}

export async function updateProduct(
    id: string,
    product: Partial<ProductMutationInput>
): Promise<BackendProduct> {
    return apiFetch<BackendProduct>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(product),
    });
}

export async function deleteProduct(id: string): Promise<{ deleted: true }> {
    return apiFetch<{ deleted: true }>(`/products/${id}`, {
        method: 'DELETE',
    });
}

export async function getSupermarkets(): Promise<Supermarket[]> {
    return apiFetch<Supermarket[]>('/supermarkets');
}

export async function getSupermarket(id: string): Promise<Supermarket> {
    return apiFetch<Supermarket>(`/supermarkets/${id}`);
}

export async function getSupermarketLayout(id: string): Promise<SupermarketLayout> {
    return apiFetch<SupermarketLayout>(`/supermarkets/${id}/layout`);
}

export async function saveSupermarketLayout(id: string, layout: StoreLayout): Promise<SupermarketLayout> {
    return apiFetch<SupermarketLayout>(`/supermarkets/${id}/layout`, {
        method: 'PUT',
        body: JSON.stringify(serializeEditorLayout(layout)),
    });
}

export async function getRecipeSuggestions(
    message: string,
    supermarketId?: string
): Promise<RecipeChatResponse> {
    return apiFetch<RecipeChatResponse>('/chat/recipe', {
        method: 'POST',
        body: JSON.stringify({
            message,
            supermarketId,
        }),
    });
}
