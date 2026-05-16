/**
 * Aisly - A* Pathfinding Algorithm
 * 
 * Core pathfinding implementation for supermarket navigation
 * Uses A* algorithm with Manhattan distance heuristic for 4-directional movement
 */

import type { Point, PathNode, PathResult, Grid, StoreLayout } from './types';
import {
  manhattanDistance,
  pointsEqual,
  isInBounds,
  getNeighbors,
  calculatePathLength,
  smoothPath,
  simplifyPath,
  estimateWalkingTime,
} from './utils';

// ============================================================================
// Priority Queue Implementation (Min-Heap)
// ============================================================================

/**
 * Simple priority queue for A* open set
 * Maintains nodes sorted by f-score (lowest first)
 */
class PriorityQueue {
  private items: PathNode[] = [];

  /**
   * Add a node to the queue
   */
  enqueue(node: PathNode): void {
    this.items.push(node);
    this.bubbleUp(this.items.length - 1);
  }

  /**
   * Remove and return the node with lowest f-score
   */
  dequeue(): PathNode | undefined {
    if (this.items.length === 0) return undefined;
    if (this.items.length === 1) return this.items.pop();

    const min = this.items[0];
    this.items[0] = this.items.pop()!;
    this.bubbleDown(0);
    return min;
  }

  /**
   * Check if queue is empty
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Get queue size
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Bubble up element at index to maintain heap property
   */
  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.items[index].f >= this.items[parentIndex].f) break;

      [this.items[index], this.items[parentIndex]] = [this.items[parentIndex], this.items[index]];
      index = parentIndex;
    }
  }

  /**
   * Bubble down element at index to maintain heap property
   */
  private bubbleDown(index: number): void {
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let smallest = index;

      if (leftChild < this.items.length && this.items[leftChild].f < this.items[smallest].f) {
        smallest = leftChild;
      }

      if (rightChild < this.items.length && this.items[rightChild].f < this.items[smallest].f) {
        smallest = rightChild;
      }

      if (smallest === index) break;

      [this.items[index], this.items[smallest]] = [this.items[smallest], this.items[index]];
      index = smallest;
    }
  }
}

// ============================================================================
// A* Pathfinding Algorithm
// ============================================================================

/**
 * Find the shortest path between two points using A* algorithm
 * 
 * @param grid - 2D boolean array (true = walkable, false = obstacle)
 * @param start - Starting point
 * @param goal - Goal point
 * @returns PathResult with path, distance, and success status
 */
export function findPath(grid: Grid, start: Point, goal: Point): PathResult {
  // Validate inputs
  if (!grid || grid.length === 0 || grid[0].length === 0) {
    return { path: [], distance: 0, found: false };
  }

  const height = grid.length;
  const width = grid[0].length;

  // Check if start and goal are valid
  if (!isInBounds(start, width, height) || !isInBounds(goal, width, height)) {
    console.error('Start or goal is out of bounds');
    return { path: [], distance: 0, found: false };
  }

  if (!grid[start.y][start.x] || !grid[goal.y][goal.x]) {
    console.error('Start or goal is not walkable');
    return { path: [], distance: 0, found: false };
  }

  // If start equals goal, return immediately
  if (pointsEqual(start, goal)) {
    return { path: [start], distance: 0, found: true };
  }

  // Initialize data structures
  const openSet = new PriorityQueue();
  const closedSet = new Set<string>();
  const gScores = new Map<string, number>();
  const nodeMap = new Map<string, PathNode>();

  // Helper to create node key
  const getKey = (point: Point): string => `${point.x},${point.y}`;

  // Initialize start node
  const startNode: PathNode = {
    x: start.x,
    y: start.y,
    g: 0,
    h: manhattanDistance(start, goal),
    f: manhattanDistance(start, goal),
  };

  openSet.enqueue(startNode);
  gScores.set(getKey(start), 0);
  nodeMap.set(getKey(start), startNode);

  // A* main loop
  while (!openSet.isEmpty()) {
    const current = openSet.dequeue()!;
    const currentKey = getKey(current);

    // Check if we reached the goal
    if (current.x === goal.x && current.y === goal.y) {
      const path = reconstructPath(current);
      const distance = calculatePathLength(path);
      return { path, distance, found: true };
    }

    // Add to closed set
    closedSet.add(currentKey);

    // Explore neighbors
    const neighbors = getNeighbors(current, width, height);

    for (const neighbor of neighbors) {
      const neighborKey = getKey(neighbor);

      // Skip if already evaluated
      if (closedSet.has(neighborKey)) continue;

      // Skip if not walkable
      if (!grid[neighbor.y][neighbor.x]) continue;

      // Calculate tentative g score
      const tentativeG = current.g + 1; // Cost is always 1 for adjacent cells

      // Check if this path to neighbor is better
      const existingG = gScores.get(neighborKey);
      if (existingG !== undefined && tentativeG >= existingG) {
        continue; // Not a better path
      }

      // This is the best path so far, record it
      const h = manhattanDistance(neighbor, goal);
      const neighborNode: PathNode = {
        x: neighbor.x,
        y: neighbor.y,
        g: tentativeG,
        h: h,
        f: tentativeG + h,
        parent: current,
      };

      gScores.set(neighborKey, tentativeG);
      nodeMap.set(neighborKey, neighborNode);
      openSet.enqueue(neighborNode);
    }
  }

  // No path found
  console.warn('No path found from', start, 'to', goal);
  return { path: [], distance: 0, found: false };
}

/**
 * Reconstruct path from goal node by following parent pointers
 * 
 * @param goalNode - The goal node reached by A*
 * @returns Array of points forming the path from start to goal
 */
function reconstructPath(goalNode: PathNode): Point[] {
  const path: Point[] = [];
  let current: PathNode | undefined = goalNode;

  while (current) {
    path.unshift({ x: current.x, y: current.y });
    current = current.parent;
  }

  return path;
}

// ============================================================================
// Enhanced Pathfinding with Options
// ============================================================================

/**
 * Options for enhanced pathfinding
 */
export interface PathfindingOptions {
  smoothPath?: boolean; // Apply path smoothing
  simplifyPath?: boolean; // Remove collinear points
  includeTime?: boolean; // Calculate estimated walking time
}

/**
 * Enhanced pathfinding with post-processing options
 * 
 * @param grid - Walkability grid
 * @param start - Starting point
 * @param goal - Goal point
 * @param options - Pathfinding options
 * @returns Enhanced PathResult
 */
export function findPathEnhanced(
  grid: Grid,
  start: Point,
  goal: Point,
  options: PathfindingOptions = {}
): PathResult & { estimatedTime?: number } {
  // Find basic path
  let result = findPath(grid, start, goal);

  if (!result.found || result.path.length === 0) {
    return result;
  }

  // Apply path smoothing if requested
  if (options.smoothPath && result.path.length > 2) {
    result.path = smoothPath(result.path, grid);
    result.distance = calculatePathLength(result.path);
  }

  // Apply path simplification if requested
  if (options.simplifyPath && result.path.length > 2) {
    result.path = simplifyPath(result.path);
    result.distance = calculatePathLength(result.path);
  }

  // Calculate estimated time if requested
  if (options.includeTime) {
    const estimatedTime = estimateWalkingTime(result.distance);
    return { ...result, estimatedTime };
  }

  return result;
}

// ============================================================================
// Grid Creation from Store Layout
// ============================================================================

/**
 * Create a walkability grid from store layout
 * 
 * @param layout - Store layout configuration
 * @returns 2D boolean grid (true = walkable, false = obstacle)
 */
export function createGridFromLayout(layout: StoreLayout): Grid {
  const { width, height } = layout.dimensions;
  
  // Initialize grid - all cells are obstacles by default
  const grid: Grid = Array(height)
    .fill(null)
    .map(() => Array(width).fill(false));

  // Mark walkways as walkable
  for (const walkway of layout.walkways) {
    markRectangleWalkable(
      grid,
      walkway.start.x,
      walkway.start.y,
      walkway.end.x,
      walkway.end.y
    );
  }

  // Mark special zones as walkable if specified
  for (const zone of layout.special_zones) {
    if (zone.walkable) {
      markRectangleWalkable(
        grid,
        zone.position.x,
        zone.position.y,
        zone.position.x + zone.position.width,
        zone.position.y + zone.position.height
      );
    }
  }

  // Mark aisle entrances as walkable
  for (const aisle of layout.aisles) {
    for (const entrance of aisle.entrances) {
      if (isInBounds(entrance, width, height)) {
        grid[entrance.y][entrance.x] = true;
      }
    }
  }

  return grid;
}

/**
 * Mark a rectangular area as walkable in the grid
 * 
 * @param grid - Grid to modify
 * @param x1 - Start x coordinate
 * @param y1 - Start y coordinate
 * @param x2 - End x coordinate
 * @param y2 - End y coordinate
 */
function markRectangleWalkable(
  grid: Grid,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): void {
  const minX = Math.max(0, Math.min(x1, x2));
  const maxX = Math.min(grid[0].length - 1, Math.max(x1, x2));
  const minY = Math.max(0, Math.min(y1, y2));
  const maxY = Math.min(grid.length - 1, Math.max(y1, y2));

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      grid[y][x] = true;
    }
  }
}

// ============================================================================
// Simplified Grid Creation (for testing/demo)
// ============================================================================

/**
 * Create a simple test grid with walkways and obstacles
 * Useful for testing and demos
 * 
 * @param width - Grid width
 * @param height - Grid height
 * @returns Simple walkability grid
 */
export function createSimpleGrid(width: number, height: number): Grid {
  // Create grid with all cells walkable
  const grid: Grid = Array(height)
    .fill(null)
    .map(() => Array(width).fill(true));

  // Add some obstacles (aisles) for demo
  // This creates a simple supermarket-like layout
  const aisleWidth = 4;
  const aisleSpacing = 6;

  for (let i = 0; i < 6; i++) {
    const aisleX = 10 + i * aisleSpacing;
    for (let y = 5; y < height - 5; y++) {
      for (let x = aisleX; x < aisleX + aisleWidth && x < width; x++) {
        grid[y][x] = false; // Mark as obstacle
      }
    }
  }

  return grid;
}

// ============================================================================
// Export Main API
// ============================================================================

export default {
  findPath,
  findPathEnhanced,
  createGridFromLayout,
  createSimpleGrid,
};

// Made with Bob
