/**
 * Aisly - Type Definitions
 *
 * Re-exports shared types from the editor type system (source of truth)
 * and defines pathfinding-specific types.
 */

import type {
  Position,
  Dimensions,
  GridCell,
  Shelf,
  SpecialZone,
  Checkout,
  EntryExit,
  Wall,
  StoreLayout,
  Product,
  EditorState,
} from '@/types/supermarket';

// Re-export all editor types as the single source of truth
export type {
  Position,
  Dimensions,
  GridCell,
  Shelf,
  SpecialZone,
  Checkout,
  EntryExit,
  Wall,
  StoreLayout,
  Product,
  EditorState,
};

// Point is a compatibility alias for Position ({ x, y })
export type Point = Position;

// ============================================================================
// Grid & Pathfinding Types
// ============================================================================

export type Grid = boolean[][];

export interface PathNode {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent?: PathNode;
}

export interface PathResult {
  path: Point[];
  distance: number;
  found: boolean;
}

// ============================================================================
// Product Location
// ============================================================================

export interface ProductLocation {
  zone_type: 'shelf' | 'special_zone';
  zone_id: string;
  shelf_side?: 'left' | 'right';
  shelf_section?: 'top' | 'middle' | 'bottom';
  coordinates?: Position;
}

// ============================================================================
// Search Types
// ============================================================================

export interface SearchOptions {
  threshold?: number;
  limit?: number;
  includeScore?: boolean;
  searchFields?: string[];
}

export interface SearchResult {
  product: Product;
  score: number;
  matches?: SearchMatch[];
}

export interface SearchMatch {
  field: string;
  value: string;
  indices?: number[][];
}

export interface SynonymMap {
  [key: string]: string[];
}

// ============================================================================
// Navigation Types
// ============================================================================

export interface UserLocation {
  type: 'entrance' | 'shelf' | 'zone' | 'checkout' | 'custom';
  id?: string;
  coordinates: Point;
  label: string;
}

export interface NavigationRequest {
  from: Point;
  to: Point;
  avoidAreas?: Point[];
}

export interface NavigationResult {
  path: Point[];
  distance: number;
  estimatedTime: number;
  instructions: string[];
  destination: ProductLocation;
}

// ============================================================================
// Utility Types
// ============================================================================

export interface GridConfig {
  width: number;
  height: number;
  cellSize?: number;
  defaultWalkable?: boolean;
}

export type Direction =
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'northeast'
  | 'northwest'
  | 'southeast'
  | 'southwest';

export type HeuristicFunction = (a: Point, b: Point) => number;

// Made with Bob
