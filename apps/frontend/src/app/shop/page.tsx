'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, List, Map } from 'lucide-react';
import { ProductSearch } from '@/components/customer/ProductSearch';
import { ShoppingList } from '@/components/customer/ShoppingList';
import { SupermarketMap } from '@/components/customer/SupermarketMap';
import { ChatbotButton } from '@/components/customer/ChatbotButton';
import type { StoreLayoutForMap } from '@/lib/api';
import { useProducts } from '@/lib/hooks/useProducts';
import { useSupermarket } from '@/lib/hooks/useSupermarket';
import { createGridFromLayout, findPathEnhanced } from '@/lib/pathfinding';
import { Product, ShoppingListItem, UserPosition } from '@/types/customer';
import type { Position, StoreLayout } from '@/types/supermarket';

type TabView = 'search' | 'list' | 'map';

const aisleSegmentRatios: Record<string, number> = {
    A: 0.18,
    B: 0.38,
    C: 0.62,
    D: 0.82,
};

function getProductPositionForLayout(
    product: Product,
    layout: StoreLayoutForMap | null
): { x: number; y: number; label?: string } | undefined {
    const fallback =
        product.location.x !== undefined && product.location.y !== undefined
            ? {
                x: product.location.x,
                y: product.location.y,
                label: product.location.aisleNumber
                    ? `Aisle ${product.location.aisleNumber}`
                    : undefined,
            }
            : undefined;

    if (!layout || !product.location.aisleNumber) {
        return fallback;
    }

    const aisleNumber = product.location.aisleNumber;
    const shelf = layout.shelves.find((item) => {
        const numericLabel = Number(String(item.label).match(/\d+/)?.[0]);
        return numericLabel === aisleNumber;
    });

    if (!shelf) {
        return fallback;
    }

    const segmentRatio =
        aisleSegmentRatios[String(product.location.aisleSegment || '').toUpperCase()] ?? 0.5;
    const sideRatio = product.location.shelfSide === 'right' ? 0.75 : 0.25;

    if (shelf.orientation === 'horizontal') {
        return {
            x: Math.round(shelf.position.x + shelf.dimensions.width * segmentRatio),
            y: Math.round(shelf.position.y + shelf.dimensions.height * sideRatio),
            label: `Aisle ${aisleNumber}`,
        };
    }

    return {
        x: Math.round(shelf.position.x + shelf.dimensions.width * sideRatio),
        y: Math.round(shelf.position.y + shelf.dimensions.height * segmentRatio),
        label: `Aisle ${aisleNumber}`,
    };
}

function toPathfindingLayout(layout: StoreLayoutForMap): StoreLayout {
    return {
        store_id: 'shop-layout',
        store_name: 'Shop Layout',
        version: '1.0',
        dimensions: { ...layout.dimensions, unit: 'meters' },
        grid: { cell_size: 1, walkable_paths: [] },
        shelves: layout.shelves,
        freezers: layout.freezers,
        special_zones: layout.specialZones,
        checkouts: layout.checkouts,
        entry_exit: layout.entryExit,
        walls: layout.walls,
    };
}

function findNearestWalkable(
    grid: boolean[][],
    position: Position,
    width: number,
    height: number
): Position | null {
    const start = {
        x: Math.max(0, Math.min(width - 1, Math.floor(position.x))),
        y: Math.max(0, Math.min(height - 1, Math.floor(position.y))),
    };

    if (grid[start.y]?.[start.x]) {
        return start;
    }

    for (let radius = 1; radius <= 8; radius += 1) {
        for (let dy = -radius; dy <= radius; dy += 1) {
            for (let dx = -radius; dx <= radius; dx += 1) {
                if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) {
                    continue;
                }

                const x = start.x + dx;
                const y = start.y + dy;

                if (x >= 0 && x < width && y >= 0 && y < height && grid[y]?.[x]) {
                    return { x, y };
                }
            }
        }
    }

    return null;
}

function buildRoutePath(
    layout: StoreLayoutForMap | null,
    userPosition: UserPosition,
    shoppingList: ShoppingListItem[]
): Position[] {
    const remainingItems = shoppingList
        .filter((item) => item.location && !item.checked)
        .map((item) => item.location!);

    if (!layout || remainingItems.length === 0) {
        return [];
    }

    const pathfindingLayout = toPathfindingLayout(layout);
    const grid = createGridFromLayout(pathfindingLayout);
    const { width, height } = pathfindingLayout.dimensions;
    const start = findNearestWalkable(grid, userPosition, width, height);

    if (!start) {
        return [];
    }

    const stops = remainingItems
        .map((item) => findNearestWalkable(grid, item, width, height))
        .filter((item): item is Position => Boolean(item));

    const fullPath: Position[] = [start];
    const unvisited = [...stops];
    let current = start;

    while (unvisited.length > 0) {
        let bestIndex = -1;
        let bestPath: Position[] = [];
        let bestDistance = Number.POSITIVE_INFINITY;

        unvisited.forEach((stop, index) => {
            const result = findPathEnhanced(grid, current, stop, {
                simplifyPath: true,
                includeTime: true,
            });

            if (result.found && result.distance < bestDistance) {
                bestIndex = index;
                bestPath = result.path;
                bestDistance = result.distance;
            }
        });

        if (bestIndex === -1 || bestPath.length === 0) {
            break;
        }

        fullPath.push(...bestPath.slice(1));
        current = unvisited[bestIndex];
        unvisited.splice(bestIndex, 1);
    }

    return fullPath;
}

export default function ShopPage() {
    const [activeTab, setActiveTab] = useState<TabView>('search');
    const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
    const [highlightedItem, setHighlightedItem] = useState<ShoppingListItem | null>(null);
    const [userPosition] = useState<UserPosition>({ x: 30, y: 2 });
    const {
        selectedSupermarket,
        layout: backendLayout,
        isLoading: isSupermarketLoading,
        error: supermarketError,
    } = useSupermarket();
    const {
        products: backendProducts,
        isLoading: isProductsLoading,
        error: productsError,
        searchProducts,
    } = useProducts({ supermarketId: selectedSupermarket?.id });

    const products = backendProducts;
    const storeLayout = backendLayout;
    const getProductPosition = useCallback(
        (product: Product) => getProductPositionForLayout(product, storeLayout),
        [storeLayout]
    );

    useEffect(() => {
        setShoppingList((currentList) =>
            currentList.map((item) => {
                const product = products.find((candidate) => candidate.id === item.productId);
                const location = product ? getProductPosition(product) : item.location;

                return {
                    ...item,
                    location,
                };
            })
        );
    }, [getProductPosition, products]);

    const routePath = useMemo(
        () => buildRoutePath(storeLayout, userPosition, shoppingList),
        [shoppingList, storeLayout, userPosition]
    );

    // Add product to shopping list
    const handleAddToList = (product: Product) => {
        setShoppingList((currentList) => {
            const existingItem = currentList.find((item) => item.productId === product.id);

            if (existingItem) {
                return currentList.map((item) =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            const newItem: ShoppingListItem = {
                id: `item-${Date.now()}-${product.id}`,
                productId: product.id,
                productName: product.name,
                quantity: 1,
                checked: false,
                location: getProductPosition(product),
            };

            return [...currentList, newItem];
        });
    };

    // Toggle item checked status
    const handleAddCustomItem = (name: string) => {
        setShoppingList((currentList) => [
            ...currentList,
            {
                id: `custom-${Date.now()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                productId: `custom-${Date.now()}`,
                productName: name,
                quantity: 1,
                checked: false,
            },
        ]);
    };

    // Toggle item checked status
    const handleToggleCheck = (itemId: string) => {
        setShoppingList(
            shoppingList.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
            )
        );
    };

    // Remove item from list
    const handleRemoveItem = (itemId: string) => {
        setShoppingList(shoppingList.filter((item) => item.id !== itemId));
    };

    // Update item quantity
    const handleUpdateQuantity = (itemId: string, quantity: number) => {
        setShoppingList(
            shoppingList.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    // Show item on map
    const handleShowOnMap = (item: ShoppingListItem) => {
        setHighlightedItem(item);
        setActiveTab('map');

        // Clear highlight after 3 seconds
        setTimeout(() => {
            setHighlightedItem(null);
        }, 3000);
    };

    // Show product on map from search
    const handleShowProductOnMap = (product: Product) => {
        if (getProductPosition(product)) {
            setActiveTab('map');
        }
    };

    const handleShowRoute = () => {
        setActiveTab('map');
    };

    // Render active tab content
    const renderTabContent = () => {
        if (supermarketError) {
            return (
                <div className="flex h-full items-center justify-center p-6">
                    <div className="max-w-sm rounded-xl border border-red-100 bg-white p-5 text-center shadow-sm">
                        <p className="text-base font-semibold text-gray-900">
                            Could not load backend supermarket data
                        </p>
                        <p className="mt-2 text-sm text-red-600">{supermarketError}</p>
                    </div>
                </div>
            );
        }

        if (!storeLayout) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">
                            {isSupermarketLoading ? 'Loading supermarket from backend...' : 'Waiting for backend layout...'}
                        </p>
                    </div>
                </div>
            );
        }

        switch (activeTab) {
            case 'search':
                return (
                    <ProductSearch
                        products={products}
                        onAddToList={handleAddToList}
                        onShowOnMap={handleShowProductOnMap}
                        onSearch={searchProducts}
                        isLoading={isProductsLoading}
                        error={productsError}
                    />
                );
            case 'list':
                return (
                    <ShoppingList
                        items={shoppingList}
                        onToggleCheck={handleToggleCheck}
                        onRemoveItem={handleRemoveItem}
                        onUpdateQuantity={handleUpdateQuantity}
                        onShowOnMap={handleShowOnMap}
                    />
                );
            case 'map':
                return (
                    <SupermarketMap
                        storeWidth={storeLayout.dimensions.width}
                        storeHeight={storeLayout.dimensions.height}
                        gridSize={1}
                        shelves={storeLayout.shelves}
                        freezers={storeLayout.freezers}
                        specialZones={storeLayout.specialZones}
                        checkouts={storeLayout.checkouts}
                        entryExit={storeLayout.entryExit}
                        walls={storeLayout.walls}
                        userPosition={userPosition}
                        shoppingListItems={shoppingList}
                        highlightedItem={highlightedItem}
                        routePath={routePath}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-b from-slate-50 to-gray-100">
            <header className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-lg p-1.5 flex items-center justify-center">
                        <img 
                            src="/aisly-logo.svg" 
                            alt="Aisly Logo" 
                            style={{
                                width: 24,
                                height: 24,
                                objectFit: "contain",
                                filter: "brightness(0) invert(1)",
                            }} 
                        />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">Aisly Market</h1>
                        <p className="text-xs text-emerald-100">Your smart shopping assistant</p>
                    </div>
                </div>
                {shoppingList.length > 0 && (
                    <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        {shoppingList.length} {shoppingList.length === 1 ? 'item' : 'items'}
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden">
                {renderTabContent()}
            </main>

            {/* Bottom Navigation */}
            <nav className="bg-white border-t border-gray-200 px-2 py-1.5 flex items-center justify-around sticky bottom-0 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
                <button
                    onClick={() => setActiveTab('search')}
                    className={`flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-xl transition-all ${activeTab === 'search'
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Search className="h-5 w-5" />
                    <span className="text-[11px] font-semibold">Search</span>
                </button>

                <button
                    onClick={() => setActiveTab('list')}
                    className={`flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-xl transition-all relative ${activeTab === 'list'
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <List className="h-5 w-5" />
                    <span className="text-[11px] font-semibold">My List</span>
                    {shoppingList.length > 0 && (
                        <span className="absolute -top-0.5 right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                            {shoppingList.length}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('map')}
                    className={`flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-xl transition-all ${activeTab === 'map'
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Map className="h-5 w-5" />
                    <span className="text-[11px] font-semibold">Map</span>
                </button>
            </nav>

            {/* Chatbot Button */}
            <ChatbotButton
                supermarketId={selectedSupermarket?.id}
                onAddToList={handleAddToList}
                onAddCustomItem={handleAddCustomItem}
                onShowRoute={handleShowRoute}
            />
        </div>
    );
}

// Made with Bob
