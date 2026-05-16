/**
 * Aisly - Product Synonym Mapping
 * 
 * Dictionary of common product name variations and synonyms
 * Used to expand search queries for better matching
 */

import type { SynonymMap } from './types';

/**
 * Product synonym dictionary
 * Maps common terms to their variations and brand names
 */
export const PRODUCT_SYNONYMS: SynonymMap = {
  // Beverages - Soft Drinks
  'coke': ['coca-cola', 'coca cola', 'coke', 'cola'],
  'pepsi': ['pepsi-cola', 'pepsi cola', 'pepsi'],
  'soda': ['soft drink', 'pop', 'fizzy drink', 'carbonated drink'],
  'sprite': ['sprite', 'lemon-lime soda'],
  'fanta': ['fanta', 'orange soda'],
  
  // Beverages - Other
  'juice': ['fruit juice', 'orange juice', 'apple juice'],
  'water': ['bottled water', 'mineral water', 'spring water'],
  'coffee': ['ground coffee', 'instant coffee', 'coffee beans'],
  'tea': ['tea bags', 'loose tea', 'iced tea'],
  
  // Dairy Products
  'milk': ['dairy milk', 'whole milk', 'skim milk', '2% milk', 'low-fat milk'],
  'cheese': ['cheddar', 'mozzarella', 'swiss', 'american cheese'],
  'yogurt': ['yoghurt', 'greek yogurt', 'yoghurt'],
  'butter': ['margarine', 'spread'],
  'cream': ['heavy cream', 'whipping cream', 'sour cream'],
  
  // Produce
  'apple': ['apples', 'red apple', 'green apple', 'granny smith'],
  'banana': ['bananas'],
  'tomato': ['tomatoes', 'cherry tomatoes', 'roma tomatoes'],
  'potato': ['potatoes', 'russet potato', 'red potato'],
  'lettuce': ['salad', 'romaine', 'iceberg lettuce'],
  'carrot': ['carrots', 'baby carrots'],
  'onion': ['onions', 'red onion', 'white onion', 'yellow onion'],
  
  // Bakery
  'bread': ['loaf', 'white bread', 'wheat bread', 'whole grain bread'],
  'bagel': ['bagels'],
  'muffin': ['muffins', 'blueberry muffin'],
  'donut': ['doughnut', 'donuts', 'doughnuts'],
  'cake': ['birthday cake', 'chocolate cake'],
  
  // Meat & Protein
  'chicken': ['chicken breast', 'chicken thighs', 'whole chicken', 'poultry'],
  'beef': ['ground beef', 'steak', 'beef roast'],
  'pork': ['pork chops', 'bacon', 'ham'],
  'fish': ['salmon', 'tuna', 'cod', 'seafood'],
  'eggs': ['egg', 'dozen eggs'],
  
  // Snacks
  'chips': ['potato chips', 'crisps', 'tortilla chips'],
  'cookies': ['biscuits', 'chocolate chip cookies'],
  'crackers': ['saltines', 'graham crackers'],
  'candy': ['chocolate', 'sweets', 'lollipop'],
  'nuts': ['peanuts', 'almonds', 'cashews', 'mixed nuts'],
  
  // Frozen Foods
  'ice cream': ['icecream', 'frozen dessert', 'gelato'],
  'pizza': ['frozen pizza'],
  'vegetables': ['frozen vegetables', 'frozen veggies', 'mixed vegetables'],
  
  // Pantry/Staples
  'pasta': ['spaghetti', 'macaroni', 'noodles', 'penne'],
  'rice': ['white rice', 'brown rice', 'basmati rice'],
  'cereal': ['breakfast cereal', 'corn flakes', 'oatmeal'],
  'oil': ['cooking oil', 'olive oil', 'vegetable oil'],
  'sugar': ['white sugar', 'brown sugar', 'cane sugar'],
  'flour': ['all-purpose flour', 'wheat flour', 'bread flour'],
  
  // Common Misspellings
  'tomatoe': ['tomato', 'tomatoes'],
  'potatoe': ['potato', 'potatoes'],
  'bannana': ['banana', 'bananas'],
  'choclate': ['chocolate'],
  'biscut': ['biscuit', 'biscuits'],
};

/**
 * Expand a search query with synonyms
 * Returns an array of query variations including the original
 * 
 * @param query - Original search query
 * @returns Array of query variations
 */
export function expandQueryWithSynonyms(query: string): string[] {
  const normalized = query.toLowerCase().trim();
  
  // Check if query matches any synonym key
  if (PRODUCT_SYNONYMS[normalized]) {
    return [normalized, ...PRODUCT_SYNONYMS[normalized]];
  }
  
  // Check if query is in any synonym list
  for (const [key, synonyms] of Object.entries(PRODUCT_SYNONYMS)) {
    if (synonyms.includes(normalized)) {
      return [normalized, key, ...synonyms.filter(s => s !== normalized)];
    }
  }
  
  // No synonyms found, return original
  return [normalized];
}

/**
 * Get all possible variations for a product name
 * Useful for indexing products with their synonyms
 * 
 * @param productName - Product name to expand
 * @returns Array of all variations
 */
export function getProductVariations(productName: string): string[] {
  const normalized = productName.toLowerCase().trim();
  const words = normalized.split(/\s+/);
  const variations = new Set<string>([normalized]);
  
  // Add variations for each word
  for (const word of words) {
    const expanded = expandQueryWithSynonyms(word);
    expanded.forEach(v => variations.add(v));
  }
  
  return Array.from(variations);
}

// Made with Bob