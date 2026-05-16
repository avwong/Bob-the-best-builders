/**
 * Aisly - Product Search Demo
 * 
 * Examples demonstrating how to use the smart product search functionality
 */

import {
  searchProducts,
  searchByCategory,
  getProductSuggestions,
  searchByBarcode,
  getCategories,
  searchWithFilters,
} from './search';
import { expandQueryWithSynonyms } from './synonyms';
import type { Product } from './types';
import mockProductsData from './data/mock-products.json';

// Load mock products
const products: Product[] = mockProductsData.products as Product[];

console.log('='.repeat(60));
console.log('Aisly - Smart Product Search Demo');
console.log('='.repeat(60));
console.log('');

// ============================================================================
// Example 1: Basic Search
// ============================================================================

console.log('📍 Example 1: Basic Product Search');
console.log('-'.repeat(60));

const basicResults = searchProducts('milk', products);
console.log(`Query: "milk"`);
console.log(`Found ${basicResults.length} results:`);
basicResults.slice(0, 3).forEach((result, index) => {
  console.log(`  ${index + 1}. ${result.product.name} - $${result.product.price}`);
  console.log(`     Category: ${result.product.category}`);
  console.log(`     Relevance Score: ${result.score.toFixed(3)}`);
});
console.log('');

// ============================================================================
// Example 2: Fuzzy Search with Typos
// ============================================================================

console.log('📍 Example 2: Fuzzy Search (Handles Typos)');
console.log('-'.repeat(60));

const typoResults = searchProducts('cocacola', products);
console.log(`Query: "cocacola" (typo for "Coca-Cola")`);
console.log(`Found ${typoResults.length} results:`);
typoResults.slice(0, 2).forEach((result, index) => {
  console.log(`  ${index + 1}. ${result.product.name} - $${result.product.price}`);
});
console.log('');

// ============================================================================
// Example 3: Synonym Expansion
// ============================================================================

console.log('📍 Example 3: Synonym Expansion');
console.log('-'.repeat(60));

const synonymQuery = 'coke';
const synonymVariations = expandQueryWithSynonyms(synonymQuery);
console.log(`Query: "${synonymQuery}"`);
console.log(`Expanded to: ${synonymVariations.join(', ')}`);

const synonymResults = searchProducts(synonymQuery, products);
console.log(`Found ${synonymResults.length} results:`);
synonymResults.slice(0, 2).forEach((result, index) => {
  console.log(`  ${index + 1}. ${result.product.name}`);
});
console.log('');

// ============================================================================
// Example 4: Search with Limit
// ============================================================================

console.log('📍 Example 4: Limited Results');
console.log('-'.repeat(60));

const limitedResults = searchProducts('bread', products, { limit: 3 });
console.log(`Query: "bread" (limit: 3)`);
console.log(`Showing top ${limitedResults.length} results:`);
limitedResults.forEach((result, index) => {
  console.log(`  ${index + 1}. ${result.product.name} - $${result.product.price}`);
});
console.log('');

// ============================================================================
// Example 5: Category Search
// ============================================================================

console.log('📍 Example 5: Search by Category');
console.log('-'.repeat(60));

const categories = getCategories(products);
console.log(`Available categories: ${categories.join(', ')}`);
console.log('');

const dairyProducts = searchByCategory('Dairy', products);
console.log(`Dairy products (${dairyProducts.length} total):`);
dairyProducts.slice(0, 4).forEach((product, index) => {
  console.log(`  ${index + 1}. ${product.name} - $${product.price}`);
});
console.log('');

// ============================================================================
// Example 6: Product Suggestions (Autocomplete)
// ============================================================================

console.log('📍 Example 6: Product Suggestions (Autocomplete)');
console.log('-'.repeat(60));

const partialQuery = 'choc';
const suggestions = getProductSuggestions(partialQuery, products, 5);
console.log(`Typing: "${partialQuery}"`);
console.log(`Suggestions:`);
suggestions.forEach((product, index) => {
  console.log(`  ${index + 1}. ${product.name}`);
});
console.log('');

// ============================================================================
// Example 7: Barcode Search
// ============================================================================

console.log('📍 Example 7: Barcode Lookup');
console.log('-'.repeat(60));

const barcode = '049000042566';
const barcodeProduct = searchByBarcode(barcode, products);
console.log(`Barcode: ${barcode}`);
if (barcodeProduct) {
  console.log(`Found: ${barcodeProduct.name}`);
  console.log(`Price: $${barcodeProduct.price}`);
  console.log(`Category: ${barcodeProduct.category}`);
} else {
  console.log('Product not found');
}
console.log('');

// ============================================================================
// Example 8: Advanced Search with Filters
// ============================================================================

console.log('📍 Example 8: Search with Multiple Filters');
console.log('-'.repeat(60));

const filteredResults = searchWithFilters('product', products, {
  category: 'Beverages',
  maxPrice: 4.0,
  limit: 5,
});
console.log(`Query: "product"`);
console.log(`Filters: Category=Beverages, MaxPrice=$4.00, Limit=5`);
console.log(`Found ${filteredResults.length} results:`);
filteredResults.forEach((result, index) => {
  console.log(`  ${index + 1}. ${result.product.name} - $${result.product.price}`);
});
console.log('');

// ============================================================================
// Example 9: Search with Custom Threshold
// ============================================================================

console.log('📍 Example 9: Adjusting Search Sensitivity');
console.log('-'.repeat(60));

const strictResults = searchProducts('mlk', products, { threshold: 0.2 });
const looseResults = searchProducts('mlk', products, { threshold: 0.6 });

console.log(`Query: "mlk" (typo for "milk")`);
console.log(`Strict matching (threshold: 0.2): ${strictResults.length} results`);
console.log(`Loose matching (threshold: 0.6): ${looseResults.length} results`);
console.log('');

// ============================================================================
// Example 10: Handling Common Misspellings
// ============================================================================

console.log('📍 Example 10: Common Misspellings');
console.log('-'.repeat(60));

const misspellings = ['tomatoe', 'potatoe', 'bannana', 'choclate'];
misspellings.forEach(misspelling => {
  const results = searchProducts(misspelling, products, { limit: 1 });
  if (results.length > 0) {
    console.log(`"${misspelling}" → Found: ${results[0].product.name}`);
  }
});
console.log('');

// ============================================================================
// Example 11: Search Performance
// ============================================================================

console.log('📍 Example 11: Search Performance');
console.log('-'.repeat(60));

const performanceTests = [
  { query: 'milk', description: 'Common term' },
  { query: 'a', description: 'Single character' },
  { query: 'chocolate chip cookies', description: 'Multi-word query' },
];

performanceTests.forEach(test => {
  const start = Date.now();
  const results = searchProducts(test.query, products);
  const duration = Date.now() - start;
  console.log(`Query: "${test.query}" (${test.description})`);
  console.log(`  Results: ${results.length}, Time: ${duration}ms`);
});
console.log('');

// ============================================================================
// Summary
// ============================================================================

console.log('='.repeat(60));
console.log('✅ Demo Complete!');
console.log('='.repeat(60));
console.log('');
console.log('Key Features Demonstrated:');
console.log('  ✓ Basic product search');
console.log('  ✓ Fuzzy matching (typo tolerance)');
console.log('  ✓ Synonym expansion');
console.log('  ✓ Result limiting');
console.log('  ✓ Category filtering');
console.log('  ✓ Autocomplete suggestions');
console.log('  ✓ Barcode lookup');
console.log('  ✓ Advanced filtering');
console.log('  ✓ Adjustable sensitivity');
console.log('  ✓ Misspelling handling');
console.log('  ✓ Performance optimization');
console.log('');
console.log('Total products in database:', products.length);
console.log('Total categories:', getCategories(products).length);
console.log('');

// Made with Bob