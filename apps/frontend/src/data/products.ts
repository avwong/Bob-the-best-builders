import { Product } from '@/types/customer';

export const MOCK_PRODUCTS: Product[] = [
    // Fruits & Vegetables
    { id: 'p1', name: 'Red Apples', category: 'Fruit', location: { x: 2, y: 3 }, price: 2.99, inStock: true },
    { id: 'p2', name: 'Bananas', category: 'Fruit', location: { x: 2, y: 3 }, price: 1.49, inStock: true },
    { id: 'p3', name: 'Oranges', category: 'Fruit', location: { x: 2, y: 4 }, price: 3.49, inStock: true },
    { id: 'p4', name: 'Lettuce', category: 'Vegetables', location: { x: 3, y: 3 }, price: 1.99, inStock: true },
    { id: 'p5', name: 'Tomatoes', category: 'Vegetables', location: { x: 3, y: 4 }, price: 2.49, inStock: true },
    { id: 'p6', name: 'Carrots', category: 'Vegetables', location: { x: 3, y: 5 }, price: 1.79, inStock: true },

    // Dairy
    { id: 'p7', name: 'Whole Milk', category: 'Dairy', location: { x: 5, y: 2 }, price: 3.99, inStock: true },
    { id: 'p8', name: 'Plain Yogurt', category: 'Dairy', location: { x: 5, y: 3 }, price: 2.49, inStock: true },
    { id: 'p9', name: 'Cheddar Cheese', category: 'Dairy', location: { x: 5, y: 4 }, price: 4.99, inStock: true },
    { id: 'p10', name: 'Butter', category: 'Dairy', location: { x: 6, y: 2 }, price: 3.49, inStock: true },

    // Bakery
    { id: 'p11', name: 'Whole Wheat Bread', category: 'Bakery', location: { x: 8, y: 3 }, price: 2.99, inStock: true },
    { id: 'p12', name: 'Croissants', category: 'Bakery', location: { x: 8, y: 4 }, price: 4.49, inStock: true },
    { id: 'p13', name: 'Bagels', category: 'Bakery', location: { x: 8, y: 5 }, price: 3.99, inStock: true },

    // Meat & Seafood
    { id: 'p14', name: 'Chicken Breast', category: 'Meat', location: { x: 10, y: 3 }, price: 7.99, inStock: true },
    { id: 'p15', name: 'Ground Beef', category: 'Meat', location: { x: 10, y: 4 }, price: 6.99, inStock: true },
    { id: 'p16', name: 'Fresh Salmon', category: 'Seafood', location: { x: 11, y: 3 }, price: 12.99, inStock: true },
    { id: 'p17', name: 'Shrimp', category: 'Seafood', location: { x: 11, y: 4 }, price: 9.99, inStock: true },

    // Pantry
    { id: 'p18', name: 'White Rice', category: 'Pantry', location: { x: 13, y: 3 }, price: 4.99, inStock: true },
    { id: 'p19', name: 'Spaghetti Pasta', category: 'Pantry', location: { x: 13, y: 4 }, price: 2.49, inStock: true },
    { id: 'p20', name: 'Black Beans', category: 'Pantry', location: { x: 13, y: 5 }, price: 1.99, inStock: true },
    { id: 'p21', name: 'Olive Oil', category: 'Pantry', location: { x: 14, y: 3 }, price: 8.99, inStock: true },
    { id: 'p22', name: 'Salt', category: 'Pantry', location: { x: 14, y: 4 }, price: 1.49, inStock: true },

    // Beverages
    { id: 'p23', name: 'Mineral Water', category: 'Beverages', location: { x: 16, y: 3 }, price: 1.99, inStock: true },
    { id: 'p24', name: 'Orange Juice', category: 'Beverages', location: { x: 16, y: 4 }, price: 3.99, inStock: true },
    { id: 'p25', name: 'Cola Soda', category: 'Beverages', location: { x: 16, y: 5 }, price: 2.49, inStock: true },
    { id: 'p26', name: 'Ground Coffee', category: 'Beverages', location: { x: 17, y: 3 }, price: 6.99, inStock: true },

    // Snacks
    { id: 'p27', name: 'Potato Chips', category: 'Snacks', location: { x: 19, y: 3 }, price: 2.99, inStock: true },
    { id: 'p28', name: 'Chocolate Cookies', category: 'Snacks', location: { x: 19, y: 4 }, price: 3.49, inStock: true },
    { id: 'p29', name: 'Mixed Nuts', category: 'Snacks', location: { x: 19, y: 5 }, price: 5.99, inStock: true },

    // Frozen
    { id: 'p30', name: 'Frozen Pizza', category: 'Frozen', location: { x: 21, y: 3 }, price: 5.99, inStock: true },
    { id: 'p31', name: 'Vanilla Ice Cream', category: 'Frozen', location: { x: 21, y: 4 }, price: 4.99, inStock: true },
    { id: 'p32', name: 'Mixed Vegetables', category: 'Frozen', location: { x: 21, y: 5 }, price: 3.49, inStock: true },
];

// Made with Bob
