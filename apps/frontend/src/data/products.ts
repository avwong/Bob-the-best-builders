import { Product } from '@/types/customer';

export const MOCK_PRODUCTS: Product[] = [
    // Fruits & Vegetables
    { id: 'p1', name: 'Manzanas Rojas', category: 'Frutas', location: { x: 2, y: 3 }, price: 2.99, inStock: true },
    { id: 'p2', name: 'Bananas', category: 'Frutas', location: { x: 2, y: 3 }, price: 1.49, inStock: true },
    { id: 'p3', name: 'Naranjas', category: 'Frutas', location: { x: 2, y: 4 }, price: 3.49, inStock: true },
    { id: 'p4', name: 'Lechuga', category: 'Verduras', location: { x: 3, y: 3 }, price: 1.99, inStock: true },
    { id: 'p5', name: 'Tomates', category: 'Verduras', location: { x: 3, y: 4 }, price: 2.49, inStock: true },
    { id: 'p6', name: 'Zanahorias', category: 'Verduras', location: { x: 3, y: 5 }, price: 1.79, inStock: true },

    // Dairy
    { id: 'p7', name: 'Leche Entera', category: 'Lácteos', location: { x: 5, y: 2 }, price: 3.99, inStock: true },
    { id: 'p8', name: 'Yogurt Natural', category: 'Lácteos', location: { x: 5, y: 3 }, price: 2.49, inStock: true },
    { id: 'p9', name: 'Queso Cheddar', category: 'Lácteos', location: { x: 5, y: 4 }, price: 4.99, inStock: true },
    { id: 'p10', name: 'Mantequilla', category: 'Lácteos', location: { x: 6, y: 2 }, price: 3.49, inStock: true },

    // Bakery
    { id: 'p11', name: 'Pan Integral', category: 'Panadería', location: { x: 8, y: 3 }, price: 2.99, inStock: true },
    { id: 'p12', name: 'Croissants', category: 'Panadería', location: { x: 8, y: 4 }, price: 4.49, inStock: true },
    { id: 'p13', name: 'Bagels', category: 'Panadería', location: { x: 8, y: 5 }, price: 3.99, inStock: true },

    // Meat & Seafood
    { id: 'p14', name: 'Pechuga de Pollo', category: 'Carnes', location: { x: 10, y: 3 }, price: 7.99, inStock: true },
    { id: 'p15', name: 'Carne Molida', category: 'Carnes', location: { x: 10, y: 4 }, price: 6.99, inStock: true },
    { id: 'p16', name: 'Salmón Fresco', category: 'Pescados', location: { x: 11, y: 3 }, price: 12.99, inStock: true },
    { id: 'p17', name: 'Camarones', category: 'Pescados', location: { x: 11, y: 4 }, price: 9.99, inStock: true },

    // Pantry
    { id: 'p18', name: 'Arroz Blanco', category: 'Despensa', location: { x: 13, y: 3 }, price: 4.99, inStock: true },
    { id: 'p19', name: 'Pasta Spaghetti', category: 'Despensa', location: { x: 13, y: 4 }, price: 2.49, inStock: true },
    { id: 'p20', name: 'Frijoles Negros', category: 'Despensa', location: { x: 13, y: 5 }, price: 1.99, inStock: true },
    { id: 'p21', name: 'Aceite de Oliva', category: 'Despensa', location: { x: 14, y: 3 }, price: 8.99, inStock: true },
    { id: 'p22', name: 'Sal', category: 'Despensa', location: { x: 14, y: 4 }, price: 1.49, inStock: true },

    // Beverages
    { id: 'p23', name: 'Agua Mineral', category: 'Bebidas', location: { x: 16, y: 3 }, price: 1.99, inStock: true },
    { id: 'p24', name: 'Jugo de Naranja', category: 'Bebidas', location: { x: 16, y: 4 }, price: 3.99, inStock: true },
    { id: 'p25', name: 'Refresco Cola', category: 'Bebidas', location: { x: 16, y: 5 }, price: 2.49, inStock: true },
    { id: 'p26', name: 'Café Molido', category: 'Bebidas', location: { x: 17, y: 3 }, price: 6.99, inStock: true },

    // Snacks
    { id: 'p27', name: 'Papas Fritas', category: 'Snacks', location: { x: 19, y: 3 }, price: 2.99, inStock: true },
    { id: 'p28', name: 'Galletas Chocolate', category: 'Snacks', location: { x: 19, y: 4 }, price: 3.49, inStock: true },
    { id: 'p29', name: 'Nueces Mixtas', category: 'Snacks', location: { x: 19, y: 5 }, price: 5.99, inStock: true },

    // Frozen
    { id: 'p30', name: 'Pizza Congelada', category: 'Congelados', location: { x: 21, y: 3 }, price: 5.99, inStock: true },
    { id: 'p31', name: 'Helado Vainilla', category: 'Congelados', location: { x: 21, y: 4 }, price: 4.99, inStock: true },
    { id: 'p32', name: 'Vegetales Mixtos', category: 'Congelados', location: { x: 21, y: 5 }, price: 3.49, inStock: true },
];

// Made with Bob
