/**
 * Aisly - Pathfinding Type Definitions
 * 
 * Core TypeScript interfaces for the pathfinding system
 */

// ============================================================================
// Grid & Cell Types
// ============================================================================

/**
 * Represents a single cell in the supermarket grid
 */
export interface GridCell {
  x: number;
  y: number;
  walkable: boolean;
  cost: number; // Movement cost (default: 1 for walkable, Infinity for obstacles)
}

/**
 * 2D grid representing the supermarket layout
 */
export type Grid = boolean[][]; // true = walkable, false = obstacle

// ============================================================================
// Pathfinding Node Types
// ============================================================================

/**
 * Node used in A* pathfinding algorithm
 */
export interface PathNode {
  x: number;
  y: number;
  g: number; // Cost from start node
  h: number; // Heuristic cost to goal
  f: number; // Total cost (g + h)
  parent?: PathNode; // Parent node for path reconstruction
}

/**
 * Simple 2D point/coordinate
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Path result from pathfinding algorithm
 */
export interface PathResult {
  path: Point[]; // Array of coordinates forming the path
  distance: number; // Total path distance
  found: boolean; // Whether a path was found
}

// ============================================================================
// Store Layout Types
// ============================================================================

/**
 * Dimensions of the store
 */
export interface StoreDimensions {
  width: number; // Width in meters/units
  height: number; // Height in meters/units
  unit: string; // Unit of measurement (e.g., "meters")
}

/**
 * Aisle configuration
 */
export interface Aisle {
  id: string; // e.g., "A", "B", "C"
  label: string; // Display name
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  entrances: Point[]; // Entry points to the aisle
}

/**
 * Special zone (Produce, Deli, Bakery, etc.)
 */
export interface SpecialZone {
  id: string;
  label: string;
  type: 'produce' | 'deli' | 'bakery' | 'other';
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  walkable: boolean; // Whether customers can walk through
}

/**
 * Checkout lane
 */
export interface Checkout {
  id: string;
  label: string;
  position: Point;
}

/**
 * Walkway/corridor
 */
export interface Walkway {
  id: string;
  start: Point;
  end: Point;
  width: number;
}

/**
 * Complete store layout
 */
export interface StoreLayout {
  store_id: string;
  store_name: string;
  dimensions: StoreDimensions;
  aisles: Aisle[];
  special_zones: SpecialZone[];
  checkouts: Checkout[];
  walkways: Walkway[];
  entrance: Point;
  exit: Point;
}

// ============================================================================
// Product Types
// ============================================================================

/**
 * Product location within the store
 */
export interface ProductLocation {
  zone_type: 'aisle' | 'special_zone';
  zone_id: string; // Aisle ID or Zone ID
  shelf_side?: 'left' | 'right'; // For aisles
  shelf_section?: 'top' | 'middle' | 'bottom'; // For aisles
  coordinates: Point; // Exact position on the grid
}

/**
 * Product information
 */
export interface Product {
  id: string;
  name: string;
  category: string;
  location: ProductLocation;
  price?: number;
  barcode?: string;
  keywords?: string[]; // Additional searchable keywords
}

// ============================================================================
// Product Search Types
// ============================================================================

/**
 * Options for product search
 */
export interface SearchOptions {
  threshold?: number; // Fuse.js threshold (0.0 = exact, 1.0 = match anything)
  limit?: number; // Maximum number of results to return
  includeScore?: boolean; // Include relevance score in results
  searchFields?: string[]; // Specific fields to search in
}

/**
 * Search result with product and relevance information
 */
export interface SearchResult {
  product: Product;
  score: number; // Relevance score (0-1, lower is better)
  matches?: SearchMatch[]; // What matched in the search
}

/**
 * Information about what matched in a search
 */
export interface SearchMatch {
  field: string; // Which field matched (name, category, keywords)
  value: string; // The matched value
  indices?: number[][]; // Character positions that matched
}

/**
 * Synonym mapping for product search
 */
export interface SynonymMap {
  [key: string]: string[]; // "coke" -> ["coca-cola", "coca cola", "coke"]
}

// ============================================================================
// Navigation Types
// ============================================================================

/**
 * User's current location in the store
 */
export interface UserLocation {
  type: 'entrance' | 'aisle' | 'zone' | 'checkout' | 'custom';
  id?: string; // Aisle/Zone/Checkout ID if applicable
  coordinates: Point;
  label: string; // Display name
}

/**
 * Navigation request
 */
export interface NavigationRequest {
  from: Point;
  to: Point;
  avoidAreas?: Point[]; // Optional areas to avoid
}

/**
 * Navigation result with route information
 */
export interface NavigationResult {
  path: Point[];
  distance: number;
  estimatedTime: number; // In seconds (assuming walking speed)
  instructions: string[]; // Turn-by-turn instructions
  destination: ProductLocation;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Direction for movement
 */
export type Direction = 'north' | 'south' | 'east' | 'west' | 'northeast' | 'northwest' | 'southeast' | 'southwest';

/**
 * Heuristic function type for A*
 */
export type HeuristicFunction = (a: Point, b: Point) => number;

/**
 * Grid configuration options
 */
export interface GridConfig {
  width: number;
  height: number;
  cellSize?: number; // Size of each cell in pixels (for rendering)
  defaultWalkable?: boolean;
}

// Made with Bob
