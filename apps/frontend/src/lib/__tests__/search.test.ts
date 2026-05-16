/**
 * Aisly - Product Search Tests
 * 
 * Comprehensive test suite for smart product search functionality
 */

import {
  searchProducts,
  normalizeQuery,
  searchByCategory,
  getProductSuggestions,
  searchByBarcode,
  getCategories,
  filterByPriceRange,
  searchWithFilters,
} from '../search';
import { expandQueryWithSynonyms } from '../synonyms';
import type { Product } from '../types';
import mockProductsData from '../data/mock-products.json';

const mockProducts: Product[] = mockProductsData.products as Product[];

describe('Product Search', () => {
  describe('normalizeQuery', () => {
    it('should convert to lowercase', () => {
      expect(normalizeQuery('COCA-COLA')).toBe('coca-cola');
    });

    it('should trim whitespace', () => {
      expect(normalizeQuery('  milk  ')).toBe('milk');
    });

    it('should normalize multiple spaces', () => {
      expect(normalizeQuery('coca   cola')).toBe('coca cola');
    });
  });

  describe('searchProducts - Exact Matches', () => {
    it('should find exact product name match', () => {
      const results = searchProducts('Coca-Cola Classic 2L', mockProducts);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].product.name).toContain('Coca-Cola');
    });

    it('should be case insensitive', () => {
      const results = searchProducts('coca-cola', mockProducts);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].product.name.toLowerCase()).toContain('coca-cola');
    });

    it('should return empty array for empty query', () => {
      const results = searchProducts('', mockProducts);
      expect(results).toEqual([]);
    });

    it('should return empty array for whitespace query', () => {
      const results = searchProducts('   ', mockProducts);
      expect(results).toEqual([]);
    });
  });

  describe('searchProducts - Fuzzy Matching', () => {
    it('should handle typos in product names', () => {
      const results = searchProducts('cocacola', mockProducts);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].product.name.toLowerCase()).toContain('coca');
    });

    it('should handle partial matches', () => {
      const results = searchProducts('milk', mockProducts);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.product.name.toLowerCase().includes('milk'))).toBe(true);
    });

    it('should find products with similar names', () => {
      const results = searchProducts('chees', mockProducts);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.product.name.toLowerCase().includes('cheese'))).toBe(true);
    });
  });

  describe('searchProducts - Synonym Support', () => {
    it('should find products using synonyms (coke -> Coca-Cola)', () => {
      const results = searchProducts('coke', mockProducts);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.product.name.toLowerCase().includes('coca'))).toBe(true);
    });

    it('should find products using synonyms (soda -> soft drinks)', () => {
      const results = searchProducts('soda', mockProducts);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.product.category === 'Beverages')).toBe(true);
    });

    it('should handle misspellings with synonyms', () => {
      const results = searchProducts('tomatoe', mockProducts);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.product.name.toLowerCase().includes('tomato'))).toBe(true);
    });
  });

  describe('searchProducts - Category Search', () => {
    it('should find products by category', () => {
      const results = searchProducts('beverages', mockProducts);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(r => r.product.category === 'Beverages')).toBe(true);
    });

    it('should find dairy products', () => {
      const results = searchProducts('dairy', mockProducts);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(r => r.product.category === 'Dairy')).toBe(true);
    });
  });

  describe('searchProducts - Options', () => {
    it('should respect limit option', () => {
      const results = searchProducts('milk', mockProducts, { limit: 3 });
      expect(results.length).toBeLessThanOrEqual(3);
    });

    it('should include scores when requested', () => {
      const results = searchProducts('milk', mockProducts, { includeScore: true });
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].score).toBeDefined();
      expect(typeof results[0].score).toBe('number');
    });

    it('should adjust threshold for stricter matching', () => {
      const strictResults = searchProducts('mlk', mockProducts, { threshold: 0.2 });
      const looseResults = searchProducts('mlk', mockProducts, { threshold: 0.6 });
      expect(looseResults.length).toBeGreaterThanOrEqual(strictResults.length);
    });
  });

  describe('searchProducts - Relevance Ranking', () => {
    it('should rank exact matches higher', () => {
      const results = searchProducts('milk', mockProducts);
      expect(results.length).toBeGreaterThan(0);
      // First result should have the best (lowest) score
      if (results.length > 1) {
        expect(results[0].score).toBeLessThanOrEqual(results[1].score);
      }
    });

    it('should return results sorted by relevance', () => {
      const results = searchProducts('bread', mockProducts);
      // Verify scores are in ascending order (lower is better)
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].score).toBeLessThanOrEqual(results[i + 1].score);
      }
    });
  });

  describe('searchByCategory', () => {
    it('should return all products in a category', () => {
      const results = searchByCategory('Dairy', mockProducts);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(p => p.category === 'Dairy')).toBe(true);
    });

    it('should be case insensitive', () => {
      const results = searchByCategory('dairy', mockProducts);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should handle partial category names', () => {
      const results = searchByCategory('bev', mockProducts);
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(p => p.category === 'Beverages')).toBe(true);
    });
  });

  describe('getProductSuggestions', () => {
    it('should return products starting with query', () => {
      const suggestions = getProductSuggestions('coc', mockProducts);
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(p => p.name.toLowerCase().startsWith('coc'))).toBe(true);
    });

    it('should respect limit parameter', () => {
      const suggestions = getProductSuggestions('milk', mockProducts, 2);
      expect(suggestions.length).toBeLessThanOrEqual(2);
    });

    it('should return empty array for empty query', () => {
      const suggestions = getProductSuggestions('', mockProducts);
      expect(suggestions).toEqual([]);
    });

    it('should check keywords for suggestions', () => {
      const suggestions = getProductSuggestions('sod', mockProducts);
      expect(suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('searchByBarcode', () => {
    it('should find product by exact barcode', () => {
      const product = searchByBarcode('049000042566', mockProducts);
      expect(product).toBeDefined();
      expect(product?.name).toContain('Coca-Cola');
    });

    it('should return undefined for non-existent barcode', () => {
      const product = searchByBarcode('999999999999', mockProducts);
      expect(product).toBeUndefined();
    });
  });

  describe('getCategories', () => {
    it('should return all unique categories', () => {
      const categories = getCategories(mockProducts);
      expect(categories.length).toBeGreaterThan(0);
      expect(new Set(categories).size).toBe(categories.length); // All unique
    });

    it('should return sorted categories', () => {
      const categories = getCategories(mockProducts);
      const sorted = [...categories].sort();
      expect(categories).toEqual(sorted);
    });

    it('should include common categories', () => {
      const categories = getCategories(mockProducts);
      expect(categories).toContain('Beverages');
      expect(categories).toContain('Dairy');
      expect(categories).toContain('Produce');
    });
  });

  describe('filterByPriceRange', () => {
    it('should filter products by minimum price', () => {
      const filtered = filterByPriceRange(mockProducts, 5.0);
      expect(filtered.every(p => p.price !== undefined && p.price >= 5.0)).toBe(true);
    });

    it('should filter products by maximum price', () => {
      const filtered = filterByPriceRange(mockProducts, undefined, 3.0);
      expect(filtered.every(p => p.price !== undefined && p.price <= 3.0)).toBe(true);
    });

    it('should filter products by price range', () => {
      const filtered = filterByPriceRange(mockProducts, 2.0, 5.0);
      expect(filtered.every(p => 
        p.price !== undefined && p.price >= 2.0 && p.price <= 5.0
      )).toBe(true);
    });

    it('should exclude products without price', () => {
      const filtered = filterByPriceRange(mockProducts, 0);
      expect(filtered.every(p => p.price !== undefined)).toBe(true);
    });
  });

  describe('searchWithFilters', () => {
    it('should search with category filter', () => {
      const results = searchWithFilters('milk', mockProducts, {
        category: 'Dairy',
      });
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(r => r.product.category === 'Dairy')).toBe(true);
    });

    it('should search with price range filter', () => {
      const results = searchWithFilters('milk', mockProducts, {
        minPrice: 3.0,
        maxPrice: 5.0,
      });
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(r => 
        r.product.price !== undefined && 
        r.product.price >= 3.0 && 
        r.product.price <= 5.0
      )).toBe(true);
    });

    it('should search with multiple filters', () => {
      const results = searchWithFilters('product', mockProducts, {
        category: 'Beverages',
        maxPrice: 4.0,
        limit: 5,
      });
      expect(results.length).toBeLessThanOrEqual(5);
      if (results.length > 0) {
        expect(results.every(r => 
          r.product.category === 'Beverages' &&
          r.product.price !== undefined &&
          r.product.price <= 4.0
        )).toBe(true);
      }
    });
  });

  describe('expandQueryWithSynonyms', () => {
    it('should expand query with synonyms', () => {
      const variations = expandQueryWithSynonyms('coke');
      expect(variations.length).toBeGreaterThan(1);
      expect(variations).toContain('coke');
      expect(variations.some(v => v.includes('cola'))).toBe(true);
    });

    it('should return original query if no synonyms found', () => {
      const variations = expandQueryWithSynonyms('uniqueproduct123');
      expect(variations).toEqual(['uniqueproduct123']);
    });

    it('should handle misspellings', () => {
      const variations = expandQueryWithSynonyms('tomatoe');
      expect(variations.some(v => v.includes('tomato'))).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should complete search in reasonable time', () => {
      const start = Date.now();
      searchProducts('milk', mockProducts);
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100); // Should complete in < 100ms
    });

    it('should handle large result sets efficiently', () => {
      const start = Date.now();
      searchProducts('a', mockProducts); // Common letter, many results
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(150);
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in query', () => {
      const results = searchProducts('coca-cola', mockProducts);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should handle numbers in query', () => {
      const results = searchProducts('2L', mockProducts);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should handle very long queries', () => {
      const longQuery = 'a'.repeat(100);
      const results = searchProducts(longQuery, mockProducts);
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle empty product array', () => {
      const results = searchProducts('milk', []);
      expect(results).toEqual([]);
    });
  });
});

// Made with Bob