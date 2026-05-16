/**
 * Aisly - Smart Product Search
 * 
 * Intelligent product search with fuzzy matching, typo handling, and synonym support
 * Uses Fuse.js for advanced fuzzy search capabilities
 */

import Fuse, { IFuseOptions, FuseResult, FuseResultMatch } from 'fuse.js';
import type { Product, SearchOptions, SearchResult, SearchMatch } from './types';
import { expandQueryWithSynonyms } from './synonyms';

// ============================================================================
// Fuse.js Configuration
// ============================================================================

/**
 * Default Fuse.js options for product search
 * Optimized for supermarket product names and categories
 */
const DEFAULT_FUSE_OPTIONS: IFuseOptions<Product> = {
  keys: [
    { name: 'name', weight: 0.5 },        // Product name is most important
    { name: 'category', weight: 0.2 },    // Category is secondary
    { name: 'keywords', weight: 0.3 },    // Keywords help with synonyms
  ],
  threshold: 0.4,                         // Balance between fuzzy and exact (0.0 = exact, 1.0 = match anything)
  distance: 100,                          // Maximum distance for character matching
  minMatchCharLength: 2,                  // Minimum characters to match
  includeScore: true,                     // Return relevance scores
  includeMatches: true,                   // Return what matched
  ignoreLocation: true,                   // Search entire string, not just beginning
  useExtendedSearch: false,               // Don't use extended search syntax
  findAllMatches: false,                  // Stop at first match per field
  shouldSort: true,                       // Sort results by score
};

// ============================================================================
// Core Search Functions
// ============================================================================

/**
 * Search products with fuzzy matching and synonym expansion
 * 
 * @param query - Search query string
 * @param products - Array of products to search
 * @param options - Optional search configuration
 * @returns Array of search results with relevance scores
 * 
 * @example
 * ```typescript
 * const results = searchProducts("coke", products);
 * // Returns Coca-Cola products even with typos or variations
 * 
 * const results = searchProducts("milk", products, { limit: 5 });
 * // Returns top 5 milk products
 * ```
 */
export function searchProducts(
  query: string,
  products: Product[],
  options?: SearchOptions
): SearchResult[] {
  // Handle empty query
  if (!query || query.trim().length === 0) {
    return [];
  }

  // Normalize query
  const normalizedQuery = normalizeQuery(query);
  
  // Expand query with synonyms
  const queryVariations = expandQueryWithSynonyms(normalizedQuery);
  
  // Configure Fuse.js with custom options
  const fuseOptions: IFuseOptions<Product> = {
    ...DEFAULT_FUSE_OPTIONS,
    threshold: options?.threshold ?? DEFAULT_FUSE_OPTIONS.threshold,
    keys: options?.searchFields
      ? options.searchFields.map(field => ({ name: field, weight: 1 }))
      : DEFAULT_FUSE_OPTIONS.keys,
  };
  
  // Create Fuse instance
  const fuse = new Fuse(products, fuseOptions);
  
  // Search with all query variations and collect results
  const allResults = new Map<string, FuseResult<Product>>();
  
  for (const variation of queryVariations) {
    const results = fuse.search(variation);
    
    // Add results to map, keeping best score for each product
    for (const result of results) {
      const productId = result.item.id;
      const existing = allResults.get(productId);
      
      if (!existing || (result.score !== undefined && existing.score !== undefined && result.score < existing.score)) {
        allResults.set(productId, result);
      }
    }
  }
  
  // Convert to SearchResult array
  let searchResults: SearchResult[] = Array.from(allResults.values()).map(result => ({
    product: result.item,
    score: result.score ?? 1,
    matches: result.matches ? convertFuseMatches(result.matches) : undefined,
  }));
  
  // Rank and sort results
  searchResults = rankResults(searchResults);
  
  // Apply limit if specified
  if (options?.limit && options.limit > 0) {
    searchResults = searchResults.slice(0, options.limit);
  }
  
  // Remove matches if not requested
  if (!options?.includeScore) {
    searchResults = searchResults.map(({ product, score }) => ({
      product,
      score,
    }));
  }
  
  return searchResults;
}

/**
 * Normalize search query for consistent matching
 * 
 * @param query - Raw search query
 * @returns Normalized query string
 */
export function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Convert Fuse.js matches to our SearchMatch format
 *
 * @param fuseMatches - Fuse.js match results
 * @returns Array of SearchMatch objects
 */
function convertFuseMatches(fuseMatches: readonly FuseResultMatch[]): SearchMatch[] {
  return fuseMatches.map(match => ({
    field: match.key || 'unknown',
    value: match.value || '',
    indices: match.indices ? match.indices.map(([start, end]) => [start, end]) : undefined,
  }));
}

/**
 * Rank search results by relevance
 * Applies custom ranking logic to boost certain matches
 * 
 * @param results - Array of search results
 * @returns Sorted array of search results
 */
export function rankResults(results: SearchResult[]): SearchResult[] {
  return results
    .map(result => {
      let adjustedScore = result.score;
      
      // Boost exact name matches
      if (result.matches) {
        const nameMatch = result.matches.find(m => m.field === 'name');
        if (nameMatch) {
          adjustedScore *= 0.8; // Lower score = better match
        }
      }
      
      return { ...result, score: adjustedScore };
    })
    .sort((a, b) => a.score - b.score); // Sort by score (lower is better)
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Search products by category
 * 
 * @param category - Category name to search for
 * @param products - Array of products to search
 * @returns Array of products in the category
 */
export function searchByCategory(category: string, products: Product[]): Product[] {
  const normalizedCategory = normalizeQuery(category);
  return products.filter(p => 
    p.category.toLowerCase().includes(normalizedCategory)
  );
}

/**
 * Get product suggestions based on partial query
 * Returns products that start with the query
 * 
 * @param query - Partial search query
 * @param products - Array of products to search
 * @param limit - Maximum number of suggestions (default: 5)
 * @returns Array of suggested products
 */
export function getProductSuggestions(
  query: string,
  products: Product[],
  limit: number = 5
): Product[] {
  if (!query || query.trim().length === 0) {
    return [];
  }
  
  const normalizedQuery = normalizeQuery(query);
  
  // Find products that start with the query
  const suggestions = products.filter(p =>
    p.name.toLowerCase().startsWith(normalizedQuery) ||
    p.category.toLowerCase().startsWith(normalizedQuery) ||
    p.keywords?.some(k => k.toLowerCase().startsWith(normalizedQuery))
  );
  
  return suggestions.slice(0, limit);
}

/**
 * Search products by barcode
 * 
 * @param barcode - Product barcode
 * @param products - Array of products to search
 * @returns Product if found, undefined otherwise
 */
export function searchByBarcode(barcode: string, products: Product[]): Product | undefined {
  return products.find(p => p.barcode === barcode);
}

/**
 * Get all unique categories from products
 * 
 * @param products - Array of products
 * @returns Array of unique category names
 */
export function getCategories(products: Product[]): string[] {
  const categories = new Set(products.map(p => p.category));
  return Array.from(categories).sort();
}

/**
 * Filter products by price range
 * 
 * @param products - Array of products
 * @param minPrice - Minimum price (inclusive)
 * @param maxPrice - Maximum price (inclusive)
 * @returns Filtered array of products
 */
export function filterByPriceRange(
  products: Product[],
  minPrice?: number,
  maxPrice?: number
): Product[] {
  return products.filter(p => {
    if (p.price === undefined) return false;
    if (minPrice !== undefined && p.price < minPrice) return false;
    if (maxPrice !== undefined && p.price > maxPrice) return false;
    return true;
  });
}

/**
 * Search products with multiple filters
 * 
 * @param query - Search query
 * @param products - Array of products
 * @param filters - Filter options
 * @returns Filtered search results
 */
export function searchWithFilters(
  query: string,
  products: Product[],
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
  }
): SearchResult[] {
  let filteredProducts = products;
  
  // Apply category filter
  if (filters.category) {
    filteredProducts = searchByCategory(filters.category, filteredProducts);
  }
  
  // Apply price range filter
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    filteredProducts = filterByPriceRange(filteredProducts, filters.minPrice, filters.maxPrice);
  }
  
  // Perform search on filtered products
  return searchProducts(query, filteredProducts, { limit: filters.limit });
}

// ============================================================================
// Export Default Search API
// ============================================================================

/**
 * Default export: Main search function
 */
export default searchProducts;

// Made with Bob