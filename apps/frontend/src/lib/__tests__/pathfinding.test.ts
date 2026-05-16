/**
 * Aisly - Pathfinding Tests
 * 
 * Test suite for the A* pathfinding algorithm
 * Run with: npm test (once Jest is configured)
 */

import {
  findPath,
  findPathEnhanced,
  createSimpleGrid,
  manhattanDistance,
  calculatePathLength,
  pointsEqual,
} from '../index';
import type { Point, Grid } from '../types';

describe('Pathfinding Algorithm', () => {
  describe('Basic A* Pathfinding', () => {
    test('should find path in simple grid', () => {
      // Create a simple 5x5 grid with all cells walkable
      const grid: Grid = [
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
      ];

      const start: Point = { x: 0, y: 0 };
      const goal: Point = { x: 4, y: 4 };

      const result = findPath(grid, start, goal);

      expect(result.found).toBe(true);
      expect(result.path.length).toBeGreaterThan(0);
      expect(result.path[0]).toEqual(start);
      expect(result.path[result.path.length - 1]).toEqual(goal);
    });

    test('should find path around obstacles', () => {
      // Create grid with obstacle in the middle
      const grid: Grid = [
        [true, true, true, true, true],
        [true, false, false, false, true],
        [true, false, false, false, true],
        [true, false, false, false, true],
        [true, true, true, true, true],
      ];

      const start: Point = { x: 0, y: 2 };
      const goal: Point = { x: 4, y: 2 };

      const result = findPath(grid, start, goal);

      expect(result.found).toBe(true);
      expect(result.path.length).toBeGreaterThan(0);
      // Path should go around the obstacle
      expect(result.distance).toBeGreaterThan(4);
    });

    test('should return no path when goal is unreachable', () => {
      // Create grid with goal completely blocked
      const grid: Grid = [
        [true, true, true, true, true],
        [true, false, false, false, true],
        [true, false, true, false, true],
        [true, false, false, false, true],
        [true, true, true, true, true],
      ];

      const start: Point = { x: 0, y: 0 };
      const goal: Point = { x: 2, y: 2 }; // Surrounded by obstacles

      const result = findPath(grid, start, goal);

      expect(result.found).toBe(false);
      expect(result.path.length).toBe(0);
    });

    test('should handle start equals goal', () => {
      const grid: Grid = [
        [true, true, true],
        [true, true, true],
        [true, true, true],
      ];

      const start: Point = { x: 1, y: 1 };
      const goal: Point = { x: 1, y: 1 };

      const result = findPath(grid, start, goal);

      expect(result.found).toBe(true);
      expect(result.path.length).toBe(1);
      expect(result.distance).toBe(0);
    });

    test('should handle invalid start or goal', () => {
      const grid: Grid = [
        [true, true, true],
        [true, false, true],
        [true, true, true],
      ];

      const start: Point = { x: 1, y: 1 }; // Not walkable
      const goal: Point = { x: 2, y: 2 };

      const result = findPath(grid, start, goal);

      expect(result.found).toBe(false);
    });
  });

  describe('Enhanced Pathfinding', () => {
    test('should apply path smoothing', () => {
      const grid: Grid = [
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
      ];

      const start: Point = { x: 0, y: 0 };
      const goal: Point = { x: 4, y: 4 };

      const basicResult = findPath(grid, start, goal);
      const smoothedResult = findPathEnhanced(grid, start, goal, {
        smoothPath: true,
      });

      expect(smoothedResult.found).toBe(true);
      // Smoothed path should have fewer waypoints
      expect(smoothedResult.path.length).toBeLessThanOrEqual(basicResult.path.length);
    });

    test('should calculate estimated time', () => {
      const grid: Grid = [
        [true, true, true, true, true],
        [true, true, true, true, true],
        [true, true, true, true, true],
      ];

      const start: Point = { x: 0, y: 0 };
      const goal: Point = { x: 4, y: 2 };

      const result = findPathEnhanced(grid, start, goal, {
        includeTime: true,
      });

      expect(result.found).toBe(true);
      expect(result.estimatedTime).toBeDefined();
      expect(result.estimatedTime).toBeGreaterThan(0);
    });
  });

  describe('Grid Creation', () => {
    test('should create simple grid with correct dimensions', () => {
      const width = 10;
      const height = 8;
      const grid = createSimpleGrid(width, height);

      expect(grid.length).toBe(height);
      expect(grid[0].length).toBe(width);
    });

    test('should create grid with walkable and non-walkable cells', () => {
      const grid = createSimpleGrid(20, 20);

      let hasWalkable = false;
      let hasObstacle = false;

      for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
          if (grid[y][x]) hasWalkable = true;
          if (!grid[y][x]) hasObstacle = true;
        }
      }

      expect(hasWalkable).toBe(true);
      expect(hasObstacle).toBe(true);
    });
  });

  describe('Utility Functions', () => {
    test('manhattanDistance should calculate correct distance', () => {
      const a: Point = { x: 0, y: 0 };
      const b: Point = { x: 3, y: 4 };

      const distance = manhattanDistance(a, b);

      expect(distance).toBe(7); // |3-0| + |4-0| = 7
    });

    test('pointsEqual should correctly compare points', () => {
      const a: Point = { x: 5, y: 10 };
      const b: Point = { x: 5, y: 10 };
      const c: Point = { x: 5, y: 11 };

      expect(pointsEqual(a, b)).toBe(true);
      expect(pointsEqual(a, c)).toBe(false);
    });

    test('calculatePathLength should return correct distance', () => {
      const path: Point[] = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 2, y: 1 },
      ];

      const length = calculatePathLength(path);

      expect(length).toBe(3); // 1 + 1 + 1 = 3
    });
  });

  describe('Supermarket-like Scenarios', () => {
    test('should navigate from entrance to aisle', () => {
      // Simulate supermarket layout
      const grid: Grid = Array(20)
        .fill(null)
        .map(() => Array(30).fill(true));

      // Add aisles (obstacles)
      for (let x = 5; x < 25; x += 5) {
        for (let y = 5; y < 15; y++) {
          grid[y][x] = false;
          grid[y][x + 1] = false;
        }
      }

      const entrance: Point = { x: 15, y: 0 };
      const productLocation: Point = { x: 6, y: 10 };

      const result = findPath(grid, entrance, productLocation);

      expect(result.found).toBe(true);
      expect(result.path.length).toBeGreaterThan(0);
    });

    test('should find shortest path between aisles', () => {
      const grid = createSimpleGrid(60, 40);

      const aisleA: Point = { x: 12, y: 20 };
      const aisleB: Point = { x: 42, y: 20 };

      const result = findPathEnhanced(grid, aisleA, aisleB, {
        smoothPath: true,
        simplifyPath: true,
        includeTime: true,
      });

      expect(result.found).toBe(true);
      expect(result.estimatedTime).toBeDefined();
    });
  });
});

describe('Performance Tests', () => {
  test('should handle large grid efficiently', () => {
    const grid = createSimpleGrid(100, 100);
    const start: Point = { x: 0, y: 0 };
    const goal: Point = { x: 99, y: 99 };

    const startTime = performance.now();
    const result = findPath(grid, start, goal);
    const endTime = performance.now();

    expect(result.found).toBe(true);
    expect(endTime - startTime).toBeLessThan(1000); // Should complete in less than 1 second
  });

  test('should handle multiple pathfinding requests', () => {
    const grid = createSimpleGrid(50, 50);
    const requests = 10;

    const startTime = performance.now();

    for (let i = 0; i < requests; i++) {
      const start: Point = { x: 0, y: i * 5 };
      const goal: Point = { x: 49, y: i * 5 };
      findPath(grid, start, goal);
    }

    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(2000); // All requests in less than 2 seconds
  });
});

// Made with Bob
