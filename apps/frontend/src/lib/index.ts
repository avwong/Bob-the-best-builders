/**
 * Aisly - Pathfinding Library
 * 
 * Main entry point for the pathfinding system
 * Exports all types, utilities, and pathfinding functions
 */

// Export all types
export type {
  // Coordinate & dimension primitives
  Point,
  Position,
  Dimensions,
  // Grid & pathfinding
  Grid,
  GridCell,
  PathNode,
  PathResult,
  GridConfig,
  // Store layout
  StoreLayout,
  Shelf,
  SpecialZone,
  Checkout,
  EntryExit,
  Wall,
  // Products
  Product,
  ProductLocation,
  // Search
  SearchOptions,
  SearchResult,
  SearchMatch,
  SynonymMap,
  // Navigation
  UserLocation,
  NavigationRequest,
  NavigationResult,
  // Editor
  EditorState,
} from './types';

// Export utility functions
export {
  manhattanDistance,
  euclideanDistance,
  pointsEqual,
  isInBounds,
  getNeighbors,
  getDirection,
  calculatePathLength,
  smoothPath,
  hasLineOfSight,
  simplifyPath,
  pixelToGrid,
  gridToPixel,
  estimateWalkingTime,
  formatTime,
  generateInstructions,
  visualizeGrid,
} from './utils';

// Export pathfinding functions
export {
  findPath,
  findPathEnhanced,
  createGridFromLayout,
  createSimpleGrid,
} from './pathfinding';

export type { PathfindingOptions } from './pathfinding';

// Export default pathfinding API
export { default as pathfinding } from './pathfinding';

// Export search functions
export {
  searchProducts,
  normalizeQuery,
  rankResults,
  searchByCategory,
  getProductSuggestions,
  searchByBarcode,
  getCategories,
  filterByPriceRange,
  searchWithFilters,
} from './search';

// Export default search API
export { default as search } from './search';

// Export synonym functions
export {
  PRODUCT_SYNONYMS,
  expandQueryWithSynonyms,
  getProductVariations,
} from './synonyms';

// Made with Bob
