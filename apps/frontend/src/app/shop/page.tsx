'use client';

import React, { useState, useEffect } from 'react';
import { Search, List, Map, ShoppingCart } from 'lucide-react';
import { ProductSearch } from '@/components/customer/ProductSearch';
import { ShoppingList } from '@/components/customer/ShoppingList';
import { SupermarketMap } from '@/components/customer/SupermarketMap';
import { ChatbotButton } from '@/components/customer/ChatbotButton';
import { MOCK_PRODUCTS } from '@/data/products';
import { Product, ShoppingListItem, UserPosition } from '@/types/customer';
import { Shelf, Freezer, SpecialZone, Checkout, EntryExit, Wall } from '@/types/supermarket';

type TabView = 'search' | 'list' | 'map';

export default function ShopPage() {
    const [activeTab, setActiveTab] = useState<TabView>('search');
    const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
    const [highlightedItem, setHighlightedItem] = useState<ShoppingListItem | null>(null);
    const [userPosition, setUserPosition] = useState<UserPosition>({ x: 30, y: 2 });

    // Store layout data
    const [storeLayout, setStoreLayout] = useState<{
        dimensions: { width: number; height: number };
        shelves: Shelf[];
        freezers: Freezer[];
        specialZones: SpecialZone[];
        checkouts: Checkout[];
        entryExit: EntryExit[];
        walls: Wall[];
    } | null>(null);

    // Load store layout
    useEffect(() => {
        fetch('/demo-layout.json')
            .then((res) => res.json())
            .then((data) => {
                // Support both old "aisles" key and new "shelves" key
                const rawShelves = data.shelves || data.aisles || [];
                const shelves: Shelf[] = rawShelves.map((s: any) => ({
                    id: s.id,
                    label: s.label,
                    type: 'shelf',
                    position: s.position,
                    dimensions: s.dimensions,
                    orientation: s.orientation || 'vertical',
                    category: s.category || '',
                    shelves: s.shelves || {
                        left: { sections: ['top', 'middle', 'bottom'] },
                        right: { sections: ['top', 'middle', 'bottom'] },
                    },
                }));

                const freezers: Freezer[] = (data.freezers || []).map((f: any) => ({
                    id: f.id,
                    label: f.label,
                    type: 'freezer' as const,
                    position: f.position,
                    dimensions: f.dimensions,
                    orientation: f.orientation || 'horizontal',
                    category: f.category || 'Frozen',
                }));

                const specialZones: SpecialZone[] = (data.special_zones || []).map((zone: any) => ({
                    id: zone.id,
                    label: zone.label,
                    type: zone.type,
                    position: zone.position,
                    dimensions: zone.dimensions,
                    category: zone.category || '',
                }));

                const checkouts: Checkout[] = (data.checkouts || []).map((checkout: any) => ({
                    id: checkout.id,
                    position: checkout.position,
                    dimensions: checkout.dimensions,
                }));

                const entryExit: EntryExit[] = (data.entry_exit || []).map((point: any) => ({
                    id: point.id,
                    type: point.type,
                    position: point.position,
                    dimensions: point.dimensions,
                }));

                setStoreLayout({
                    dimensions: data.dimensions,
                    shelves,
                    freezers,
                    specialZones,
                    checkouts,
                    entryExit,
                    walls: data.walls || [],
                });
            })
            .catch((error) => {
                console.error('Error loading store layout:', error);
            });
    }, []);

    // Add product to shopping list
    const handleAddToList = (product: Product) => {
        const existingItem = shoppingList.find((item) => item.productId === product.id);

        if (existingItem) {
            setShoppingList(
                shoppingList.map((item) =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            const newItem: ShoppingListItem = {
                id: `item-${Date.now()}`,
                productId: product.id,
                productName: product.name,
                quantity: 1,
                checked: false,
                location: product.location.x && product.location.y
                    ? { x: product.location.x, y: product.location.y }
                    : undefined,
            };
            setShoppingList([...shoppingList, newItem]);
        }
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
        if (product.location.x && product.location.y) {
            setActiveTab('map');
        }
    };

    // Render active tab content
    const renderTabContent = () => {
        if (!storeLayout) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Cargando mapa del supermercado...</p>
                    </div>
                </div>
            );
        }

        switch (activeTab) {
            case 'search':
                return (
                    <ProductSearch
                        products={MOCK_PRODUCTS}
                        onAddToList={handleAddToList}
                        onShowOnMap={handleShowProductOnMap}
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
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-b from-slate-50 to-gray-100">
            {/* Header */}
            <header className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-lg p-1.5">
                        <ShoppingCart className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">Aisly Market</h1>
                        <p className="text-xs text-emerald-100">Tu asistente de compras inteligente</p>
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
                    <span className="text-[11px] font-semibold">Buscar</span>
                </button>

                <button
                    onClick={() => setActiveTab('list')}
                    className={`flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-xl transition-all relative ${activeTab === 'list'
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <List className="h-5 w-5" />
                    <span className="text-[11px] font-semibold">Mi Lista</span>
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
                    <span className="text-[11px] font-semibold">Mapa</span>
                </button>
            </nav>

            {/* Chatbot Button */}
            <ChatbotButton />
        </div>
    );
}

// Made with Bob
