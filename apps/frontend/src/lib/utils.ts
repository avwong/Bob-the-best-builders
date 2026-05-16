/**
 * Aisly - Pathfinding Utility Functions
 * 
 * Helper functions for grid operations, distance calculations, and path manipulation
 * Optimized for 4-directional movement (no diagonals) in supermarket aisles
 */

import type { Point } from './types';

// ============================================================================
// Distance Calculation
// ============================================================================

/**
 * Calculate Manhattan distance (L1 norm) between two points
 * Perfect for grid-based pathfinding where only 4-directional movement is allowed
 * (up, down, left, right - no diagonals through aisles)
 * 
 * @param a - First point
 * @param b - Second point
 * @returns Manhattan distance
 */
export function manhattanDistance(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * Calculate Euclidean distance (straight-line distance) between two points
 * Used for display purposes and distance estimation, not for pathfinding heuristic
 * 
 * @param a - First point
 * @param b - Second point
 * @returns Euclidean distance
 */
export function euclideanDistance(a: Point, b: Point): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// ============================================================================
// Point & Coordinate Operations
// ============================================================================

/**
 * Check if two points are equal
 * 
 * @param a - First point
 * @param b - Second point
 * @returns True if points are equal
 */
export function pointsEqual(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

/**
 * Check if a point is within grid bounds
 * 
 * @param point - Point to check
 * @param width - Grid width
 * @param height - Grid height
 * @returns True if point is within bounds
 */
export function isInBounds(point: Point, width: number, height: number): boolean {
  return point.x >= 0 && point.x < width && point.y >= 0 && point.y < height;
}

/**
 * Get neighboring points (4-directional only: up, down, left, right)
 * No diagonal movement - customers must follow walkways
 * 
 * @param point - Center point
 * @param width - Grid width
 * @param height - Grid height
 * @returns Array of valid neighbor points
 */
export function getNeighbors(point: Point, width: number, height: number): Point[] {
  const neighbors: Point[] = [];
  const directions = [
    { x: 0, y: -1 }, // North (up)
    { x: 1, y: 0 },  // East (right)
    { x: 0, y: 1 },  // South (down)
    { x: -1, y: 0 }, // West (left)
  ];

  for (const dir of directions) {
    const neighbor = { x: point.x + dir.x, y: point.y + dir.y };
    if (isInBounds(neighbor, width, height)) {
      neighbors.push(neighbor);
    }
  }

  return neighbors;
}

/**
 * Get direction from one point to another
 * 
 * @param from - Starting point
 * @param to - Ending point
 * @returns Direction string
 */
export function getDirection(from: Point, to: Point): 'north' | 'south' | 'east' | 'west' | 'none' {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (dx === 0 && dy < 0) return 'north';
  if (dx === 0 && dy > 0) return 'south';
  if (dx > 0 && dy === 0) return 'east';
  if (dx < 0 && dy === 0) return 'west';

  return 'none'; // Points are equal or not adjacent
}

// ============================================================================
// Path Operations
// ============================================================================

/**
 * Calculate total path length using Manhattan distance
 * 
 * @param path - Array of points forming the path
 * @returns Total distance in grid units
 */
export function calculatePathLength(path: Point[]): number {
  if (path.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    totalDistance += manhattanDistance(path[i], path[i + 1]);
  }

  return totalDistance;
}

/**
 * Smooth path by removing unnecessary waypoints
 * Uses line-of-sight algorithm to remove intermediate points
 * Only works with 4-directional movement
 * 
 * @param path - Original path
 * @param grid - Walkability grid
 * @returns Smoothed path
 */
export function smoothPath(path: Point[], grid: boolean[][]): Point[] {
  if (path.length <= 2) return path;

  const smoothed: Point[] = [path[0]];
  let current = 0;

  while (current < path.length - 1) {
    let farthest = current + 1;

    // Find the farthest point we can reach with line of sight
    for (let i = current + 2; i < path.length; i++) {
      if (hasLineOfSight(path[current], path[i], grid)) {
        farthest = i;
      } else {
        break;
      }
    }

    smoothed.push(path[farthest]);
    current = farthest;
  }

  return smoothed;
}

/**
 * Check if there's a clear line of sight between two points
 * Uses Bresenham's line algorithm for 4-directional movement
 * 
 * @param start - Starting point
 * @param end - Ending point
 * @param grid - Walkability grid
 * @returns True if line of sight exists
 */
export function hasLineOfSight(start: Point, end: Point, grid: boolean[][]): boolean {
  const points = bresenhamLine(start, end);

  for (const point of points) {
    if (!isInBounds(point, grid[0].length, grid.length)) return false;
    if (!grid[point.y][point.x]) return false;
  }

  return true;
}

/**
 * Generate points along a line using Bresenham's algorithm
 * 
 * @param start - Starting point
 * @param end - Ending point
 * @returns Array of points along the line
 */
export function bresenhamLine(start: Point, end: Point): Point[] {
  const points: Point[] = [];
  let x0 = start.x;
  let y0 = start.y;
  const x1 = end.x;
  const y1 = end.y;

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    points.push({ x: x0, y: y0 });

    if (x0 === x1 && y0 === y1) break;

    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }

  return points;
}

/**
 * Simplify path by removing collinear points
 * Removes intermediate points that lie on the same straight line
 * 
 * @param path - Original path
 * @returns Simplified path
 */
export function simplifyPath(path: Point[]): Point[] {
  if (path.length <= 2) return path;

  const simplified: Point[] = [path[0]];

  for (let i = 1; i < path.length - 1; i++) {
    const prev = path[i - 1];
    const current = path[i];
    const next = path[i + 1];

    // Check if points are collinear (on same horizontal or vertical line)
    const sameRow = prev.y === current.y && current.y === next.y;
    const sameCol = prev.x === current.x && current.x === next.x;

    if (!sameRow && !sameCol) {
      simplified.push(current);
    }
  }

  simplified.push(path[path.length - 1]);
  return simplified;
}

// ============================================================================
// Grid Conversion Utilities
// ============================================================================

/**
 * Convert pixel coordinates to grid coordinates
 * 
 * @param pixelX - X coordinate in pixels
 * @param pixelY - Y coordinate in pixels
 * @param cellSize - Size of each grid cell in pixels
 * @returns Grid coordinates
 */
export function pixelToGrid(pixelX: number, pixelY: number, cellSize: number): Point {
  return {
    x: Math.floor(pixelX / cellSize),
    y: Math.floor(pixelY / cellSize),
  };
}

/**
 * Convert grid coordinates to pixel coordinates (center of cell)
 * 
 * @param gridX - X coordinate in grid
 * @param gridY - Y coordinate in grid
 * @param cellSize - Size of each grid cell in pixels
 * @returns Pixel coordinates
 */
export function gridToPixel(gridX: number, gridY: number, cellSize: number): Point {
  return {
    x: gridX * cellSize + cellSize / 2,
    y: gridY * cellSize + cellSize / 2,
  };
}

// ============================================================================
// Time Estimation
// ============================================================================

/**
 * Estimate walking time based on path distance
 * Assumes average walking speed of 1.4 m/s (5 km/h)
 * 
 * @param distance - Distance in meters
 * @param walkingSpeed - Walking speed in m/s (default: 1.4)
 * @returns Estimated time in seconds
 */
export function estimateWalkingTime(distance: number, walkingSpeed: number = 1.4): number {
  return Math.ceil(distance / walkingSpeed);
}

/**
 * Format time in seconds to human-readable string
 * 
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  return `${minutes} min ${remainingSeconds} sec`;
}

// ============================================================================
// Turn-by-Turn Instructions
// ============================================================================

/**
 * Generate turn-by-turn instructions from a path
 * 
 * @param path - Array of points forming the path
 * @returns Array of instruction strings
 */
export function generateInstructions(path: Point[]): string[] {
  if (path.length < 2) return [];

  const instructions: string[] = [];
  let currentDirection = getDirection(path[0], path[1]);

  instructions.push(`Start at your current location`);

  for (let i = 1; i < path.length - 1; i++) {
    const nextDirection = getDirection(path[i], path[i + 1]);

    if (nextDirection !== currentDirection && nextDirection !== 'none') {
      const turn = getTurnDirection(currentDirection, nextDirection);
      instructions.push(`${turn} and continue ${nextDirection}`);
      currentDirection = nextDirection;
    }
  }

  instructions.push(`You have arrived at your destination`);
  return instructions;
}

/**
 * Determine turn direction between two movement directions
 * 
 * @param from - Current direction
 * @param to - Next direction
 * @returns Turn instruction
 */
function getTurnDirection(from: string, to: string): string {
  if (from === to) return 'Continue straight';

  const turns: Record<string, Record<string, string>> = {
    north: { east: 'Turn right', west: 'Turn left', south: 'Turn around' },
    east: { south: 'Turn right', north: 'Turn left', west: 'Turn around' },
    south: { west: 'Turn right', east: 'Turn left', north: 'Turn around' },
    west: { north: 'Turn right', south: 'Turn left', east: 'Turn around' },
  };

  return turns[from]?.[to] || 'Continue';
}

// ============================================================================
// Debug Utilities
// ============================================================================

/**
 * Visualize grid in console (for debugging)
 * 
 * @param grid - Walkability grid
 * @param path - Optional path to highlight
 * @param start - Optional start point
 * @param goal - Optional goal point
 */
export function visualizeGrid(
  grid: boolean[][],
  path?: Point[],
  start?: Point,
  goal?: Point
): void {
  const pathSet = new Set(path?.map(p => `${p.x},${p.y}`) || []);

  console.log('Grid Visualization:');
  console.log('Legend: . = walkable, # = obstacle, * = path, S = start, G = goal');
  console.log('');

  for (let y = 0; y < grid.length; y++) {
    let row = '';
    for (let x = 0; x < grid[0].length; x++) {
      if (start && start.x === x && start.y === y) {
        row += 'S ';
      } else if (goal && goal.x === x && goal.y === y) {
        row += 'G ';
      } else if (pathSet.has(`${x},${y}`)) {
        row += '* ';
      } else if (grid[y][x]) {
        row += '. ';
      } else {
        row += '# ';
      }
    }
    console.log(row);
  }
  console.log('');
}

// Made with Bob
