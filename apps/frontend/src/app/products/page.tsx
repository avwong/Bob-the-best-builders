'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Plus, RefreshCw, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
    BackendProduct,
    createProduct,
    deleteProduct,
    getProducts,
    getSupermarketLayout,
    getSupermarkets,
    ProductMutationInput,
    Supermarket,
    SupermarketLayout,
    updateProduct,
} from '@/lib/api';

type ProductForm = Omit<ProductMutationInput, 'price'> & {
    id?: string;
    price: string;
};

const emptyForm = (supermarketId = '', aisleId = ''): ProductForm => ({
    name: '',
    barcode: '',
    category: '',
    supermarketId,
    aisleId,
    aisleNumber: 1,
    aisleSegment: 'A',
    shelfSide: 'left',
    shelfSection: 'middle',
    gridX: 1,
    gridY: 1,
    price: '',
    imageUrl: '',
});

function productToForm(product: BackendProduct): ProductForm {
    return {
        id: product.id,
        name: product.name,
        barcode: product.barcode || '',
        category: product.category,
        supermarketId: product.supermarketId,
        aisleId: product.aisleId || '',
        aisleNumber: product.location.aisleNumber,
        aisleSegment: product.location.aisleSegment,
        shelfSide: product.location.shelfSide as 'left' | 'right',
        shelfSection: product.location.shelfSection as 'top' | 'middle' | 'bottom',
        gridX: product.location.gridX,
        gridY: product.location.gridY,
        price: product.price ? String(product.price) : '',
        imageUrl: product.imageUrl || '',
    };
}

function formToPayload(form: ProductForm): ProductMutationInput {
    return {
        name: form.name,
        barcode: form.barcode || undefined,
        category: form.category,
        supermarketId: form.supermarketId,
        aisleId: form.aisleId || undefined,
        aisleNumber: Number(form.aisleNumber),
        aisleSegment: form.aisleSegment || 'A',
        shelfSide: form.shelfSide,
        shelfSection: form.shelfSection,
        gridX: Number(form.gridX),
        gridY: Number(form.gridY),
        price: form.price ? Number(form.price) : undefined,
        imageUrl: form.imageUrl || undefined,
    };
}

export default function ProductsPage() {
    const router = useRouter();
    const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
    const [layout, setLayout] = useState<SupermarketLayout | null>(null);
    const [products, setProducts] = useState<BackendProduct[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [form, setForm] = useState<ProductForm>(emptyForm());
    const [status, setStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const selectedSupermarket = supermarkets[0];
    const aisles = layout?.aisles || [];

    const selectedProduct = useMemo(
        () => products.find((product) => product.id === selectedProductId) || null,
        [products, selectedProductId]
    );

    const loadData = async () => {
        setIsLoading(true);
        setStatus(null);

        try {
            const allSupermarkets = await getSupermarkets();
            const supermarket = allSupermarkets[0];

            if (!supermarket) {
                throw new Error('No supermarket found');
            }

            const [storeLayout, productPage] = await Promise.all([
                getSupermarketLayout(supermarket.id),
                getProducts({ supermarketId: supermarket.id, limit: 200 }),
            ]);

            setSupermarkets(allSupermarkets);
            setLayout(storeLayout);
            setProducts(productPage.data);

            if (!selectedProductId) {
                const firstAisle = storeLayout.aisles[0];
                setForm(
                    emptyForm(
                        supermarket.id,
                        firstAisle?.id || ''
                    )
                );
            }
        } catch (err) {
            setStatus(err instanceof Error ? err.message : 'Could not load products');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (selectedProduct) {
            setForm(productToForm(selectedProduct));
        }
    }, [selectedProduct]);

    const handleAisleChange = (aisleId: string) => {
        const aisle = aisles.find((item) => item.id === aisleId);

        setForm((current) => ({
            ...current,
            aisleId,
            aisleNumber: aisle?.aisleNumber || current.aisleNumber,
            category: current.category || aisle?.category || '',
            gridX: aisle ? aisle.positionX + 1 : current.gridX,
            gridY: aisle ? aisle.positionY + 1 : current.gridY,
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setStatus('Saving product...');

        try {
            if (form.id) {
                await updateProduct(form.id, formToPayload(form));
            } else {
                await createProduct(formToPayload(form));
            }

            setStatus('Product saved');
            setSelectedProductId(null);
            await loadData();
        } catch (err) {
            setStatus(err instanceof Error ? err.message : 'Could not save product');
        }
    };

    const handleDelete = async () => {
        if (!form.id) {
            return;
        }

        setStatus('Deleting product...');

        try {
            await deleteProduct(form.id);
            setSelectedProductId(null);
            await loadData();
            setStatus('Product deleted');
        } catch (err) {
            setStatus(err instanceof Error ? err.message : 'Could not delete product');
        }
    };

    const handleNew = () => {
        const firstAisle = aisles[0];
        setSelectedProductId(null);
        setForm(emptyForm(selectedSupermarket?.id, firstAisle?.id || ''));
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Product Management</h1>
                            <p className="text-sm text-slate-500">Create, edit, and place products in aisles.</p>
                        </div>
                    </div>
                    <button
                        onClick={loadData}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </button>
                </div>

                {status && (
                    <div className="mb-4 rounded-lg border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-700">
                        {status}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
                    <div className="rounded-xl border border-slate-200 bg-white">
                        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                            <h2 className="text-sm font-bold text-slate-900">
                                Products {isLoading ? '' : `(${products.length})`}
                            </h2>
                            <button
                                onClick={handleNew}
                                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                            >
                                <Plus className="h-4 w-4" />
                                New
                            </button>
                        </div>
                        <div className="max-h-[70vh] overflow-y-auto">
                            {products.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => setSelectedProductId(product.id)}
                                    className={`grid w-full grid-cols-[1fr_120px_100px] gap-3 border-b border-slate-100 px-4 py-3 text-left text-sm hover:bg-slate-50 ${
                                        selectedProductId === product.id ? 'bg-emerald-50' : ''
                                    }`}
                                >
                                    <div>
                                        <p className="font-semibold text-slate-900">{product.name}</p>
                                        <p className="text-xs text-slate-500">{product.category}</p>
                                    </div>
                                    <div className="text-slate-600">Aisle {product.location.aisleNumber}</div>
                                    <div className="text-right font-semibold text-emerald-600">
                                        ${(product.price || 0).toFixed(2)}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-4">
                        <h2 className="mb-4 text-sm font-bold text-slate-900">
                            {form.id ? 'Edit Product' : 'New Product'}
                        </h2>
                        <div className="space-y-3">
                            <label className="block text-xs font-semibold text-slate-600">
                                Name
                                <input
                                    value={form.name}
                                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                                    required
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                />
                            </label>
                            <label className="block text-xs font-semibold text-slate-600">
                                Category
                                <input
                                    value={form.category}
                                    onChange={(event) => setForm({ ...form, category: event.target.value })}
                                    required
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                />
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="block text-xs font-semibold text-slate-600">
                                    Barcode
                                    <input
                                        value={form.barcode}
                                        onChange={(event) => setForm({ ...form, barcode: event.target.value })}
                                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    />
                                </label>
                                <label className="block text-xs font-semibold text-slate-600">
                                    Price
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={form.price}
                                        onChange={(event) => setForm({ ...form, price: event.target.value })}
                                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    />
                                </label>
                            </div>
                            <label className="block text-xs font-semibold text-slate-600">
                                Aisle
                                <select
                                    value={form.aisleId}
                                    onChange={(event) => handleAisleChange(event.target.value)}
                                    required
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                >
                                    {aisles.map((aisle) => (
                                        <option key={aisle.id} value={aisle.id}>
                                            {aisle.label} - {aisle.category}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                <label className="block text-xs font-semibold text-slate-600">
                                    Segment
                                    <input
                                        value={form.aisleSegment}
                                        onChange={(event) => setForm({ ...form, aisleSegment: event.target.value.toUpperCase() })}
                                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    />
                                </label>
                                <label className="block text-xs font-semibold text-slate-600">
                                    Side
                                    <select
                                        value={form.shelfSide}
                                        onChange={(event) => setForm({ ...form, shelfSide: event.target.value as ProductForm['shelfSide'] })}
                                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    >
                                        <option value="left">Left</option>
                                        <option value="right">Right</option>
                                    </select>
                                </label>
                                <label className="block text-xs font-semibold text-slate-600">
                                    Shelf
                                    <select
                                        value={form.shelfSection}
                                        onChange={(event) => setForm({ ...form, shelfSection: event.target.value as ProductForm['shelfSection'] })}
                                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    >
                                        <option value="top">Top</option>
                                        <option value="middle">Middle</option>
                                        <option value="bottom">Bottom</option>
                                    </select>
                                </label>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="block text-xs font-semibold text-slate-600">
                                    Grid X
                                    <input
                                        type="number"
                                        value={form.gridX}
                                        onChange={(event) => setForm({ ...form, gridX: Number(event.target.value) })}
                                        required
                                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    />
                                </label>
                                <label className="block text-xs font-semibold text-slate-600">
                                    Grid Y
                                    <input
                                        type="number"
                                        value={form.gridY}
                                        onChange={(event) => setForm({ ...form, gridY: Number(event.target.value) })}
                                        required
                                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="mt-5 flex gap-2">
                            <button
                                type="submit"
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                            >
                                <Save className="h-4 w-4" />
                                Save
                            </button>
                            {form.id && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
