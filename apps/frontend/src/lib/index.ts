/**
 * Aisly - Pathfinding Library
 * 
 * Main entry point for the pathfinding system
 * Exports all types, utilities, and pathfinding functions
 */

// Export all types
export type {
  Point,
  Grid,
  GridCell,
  PathNode,
  PathResult,
  StoreLayout,
  StoreDimensions,
  Aisle,
  SpecialZone,
  Checkout,
  Walkway,
  Product,
  ProductLocation,
  UserLocation,
  NavigationRequest,
  NavigationResult,
  GridConfig,
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

// Made with Bob
