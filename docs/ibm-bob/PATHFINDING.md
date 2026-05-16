# Aisly Pathfinding Library

A complete A* pathfinding implementation for supermarket navigation with 4-directional movement (no diagonals).

## 📋 Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Architecture](#architecture)
- [Performance](#performance)

## 🎯 Overview

This pathfinding library is specifically designed for indoor supermarket navigation where:
- Customers can only move in 4 directions (up, down, left, right)
- Aisles act as obstacles
- Walkways connect different areas
- Routes must be realistic and follow actual paths

### Key Features

✅ **A* Algorithm** - Optimal pathfinding with Manhattan distance heuristic  
✅ **4-Directional Movement** - Realistic supermarket navigation  
✅ **Path Smoothing** - Removes unnecessary waypoints  
✅ **Path Simplification** - Removes collinear points  
✅ **Time Estimation** - Calculates walking time  
✅ **Turn-by-Turn Instructions** - Generates navigation directions  
✅ **Grid Conversion** - Converts store layouts to walkable grids  
✅ **TypeScript** - Full type safety  

## 📦 Installation

The library is already included in the frontend project. Import from `@/lib`:

```typescript
import { findPath, createSimpleGrid } from '@/lib';
// or
import { findPath } from '@/lib/pathfinding';
```

## 🚀 Quick Start

### Basic Pathfinding

```typescript
import { findPath, createSimpleGrid } from '@/lib';

// Create a simple grid (true = walkable, false = obstacle)
const grid = createSimpleGrid(60, 40);

// Define start and goal points
const start = { x: 5, y: 5 };
const goal = { x: 50, y: 30 };

// Find the path
const result = findPath(grid, start, goal);

if (result.found) {
  console.log('Path found!');
  console.log('Distance:', result.distance);
  console.log('Path:', result.path);
} else {
  console.log('No path found');
}
```

### Enhanced Pathfinding with Options

```typescript
import { findPathEnhanced } from '@/lib';

const result = findPathEnhanced(grid, start, goal, {
  smoothPath: true,      // Remove unnecessary waypoints
  simplifyPath: true,    // Remove collinear points
  includeTime: true,     // Calculate estimated walking time
});

console.log('Estimated time:', result.estimatedTime, 'seconds');
```

### Creating Grid from Store Layout

```typescript
import { createGridFromLayout } from '@/lib';
import type { StoreLayout } from '@/lib';

// Load your store layout
const storeLayout: StoreLayout = {
  store_id: 'demo-store',
  store_name: 'Demo Supermarket',
  dimensions: { width: 60, height: 40, unit: 'meters' },
  aisles: [/* ... */],
  walkways: [/* ... */],
  // ... other properties
};

// Convert to walkability grid
const grid = createGridFromLayout(storeLayout);

// Now use the grid for pathfinding
const result = findPath(grid, entrance, productLocation);
```

## 📚 API Reference

### Core Functions

#### `findPath(grid, start, goal)`

Find the shortest path using A* algorithm.

**Parameters:**
- `grid: Grid` - 2D boolean array (true = walkable, false = obstacle)
- `start: Point` - Starting coordinates `{ x, y }`
- `goal: Point` - Goal coordinates `{ x, y }`

**Returns:** `PathResult`
```typescript
{
  path: Point[];      // Array of coordinates forming the path
  distance: number;   // Total path distance
  found: boolean;     // Whether a path was found
}
```

**Example:**
```typescript
const result = findPath(grid, { x: 0, y: 0 }, { x: 10, y: 10 });
```

---

#### `findPathEnhanced(grid, start, goal, options)`

Enhanced pathfinding with post-processing options.

**Parameters:**
- `grid: Grid` - Walkability grid
- `start: Point` - Starting point
- `goal: Point` - Goal point
- `options: PathfindingOptions` - Optional configuration

**Options:**
```typescript
{
  smoothPath?: boolean;     // Apply path smoothing (default: false)
  simplifyPath?: boolean;   // Remove collinear points (default: false)
  includeTime?: boolean;    // Calculate walking time (default: false)
}
```

**Returns:** `PathResult & { estimatedTime?: number }`

**Example:**
```typescript
const result = findPathEnhanced(grid, start, goal, {
  smoothPath: true,
  includeTime: true,
});
```

---

#### `createGridFromLayout(layout)`

Convert a store layout to a walkability grid.

**Parameters:**
- `layout: StoreLayout` - Store configuration object

**Returns:** `Grid` - 2D boolean array

**Example:**
```typescript
const grid = createGridFromLayout(storeLayout);
```

---

#### `createSimpleGrid(width, height)`

Create a simple test grid with demo aisles.

**Parameters:**
- `width: number` - Grid width
- `height: number` - Grid height

**Returns:** `Grid` - 2D boolean array

**Example:**
```typescript
const grid = createSimpleGrid(60, 40);
```

---

### Utility Functions

#### `manhattanDistance(a, b)`

Calculate Manhattan distance between two points.

```typescript
const distance = manhattanDistance({ x: 0, y: 0 }, { x: 3, y: 4 });
// Returns: 7
```

---

#### `calculatePathLength(path)`

Calculate total path length.

```typescript
const length = calculatePathLength(result.path);
```

---

#### `estimateWalkingTime(distance, walkingSpeed?)`

Estimate walking time in seconds.

```typescript
const time = estimateWalkingTime(50); // 50 meters
// Returns: ~36 seconds (at 1.4 m/s)
```

---

#### `formatTime(seconds)`

Format time to human-readable string.

```typescript
formatTime(90);  // "1 min 30 sec"
formatTime(45);  // "45 seconds"
```

---

#### `generateInstructions(path)`

Generate turn-by-turn navigation instructions.

```typescript
const instructions = generateInstructions(result.path);
// Returns: ["Start at your current location", "Turn right and continue east", ...]
```

---

#### `visualizeGrid(grid, path?, start?, goal?)`

Debug utility to visualize grid in console.

```typescript
visualizeGrid(grid, result.path, start, goal);
```

---

## 💡 Examples

### Example 1: Navigate from Entrance to Product

```typescript
import { findPathEnhanced, createGridFromLayout } from '@/lib';

// Assuming you have a store layout loaded
const grid = createGridFromLayout(storeLayout);

// User is at entrance
const userLocation = { x: 30, y: 0 };

// Product is in Aisle C
const productLocation = { x: 15, y: 20 };

// Find path with all enhancements
const result = findPathEnhanced(grid, userLocation, productLocation, {
  smoothPath: true,
  simplifyPath: true,
  includeTime: true,
});

if (result.found) {
  console.log(`Path found! Distance: ${result.distance}m`);
  console.log(`Estimated time: ${result.estimatedTime}s`);
  
  // Use result.path to draw on map
  drawPathOnMap(result.path);
}
```

### Example 2: Multi-Product Shopping Route

```typescript
import { findPath } from '@/lib';

const shoppingList = [
  { name: 'Milk', location: { x: 10, y: 15 } },
  { name: 'Bread', location: { x: 45, y: 25 } },
  { name: 'Eggs', location: { x: 20, y: 30 } },
];

let currentLocation = { x: 30, y: 0 }; // Entrance
let totalDistance = 0;

for (const item of shoppingList) {
  const result = findPath(grid, currentLocation, item.location);
  
  if (result.found) {
    console.log(`Route to ${item.name}: ${result.distance}m`);
    totalDistance += result.distance;
    currentLocation = item.location;
  }
}

console.log(`Total shopping distance: ${totalDistance}m`);
```

### Example 3: Real-time Path Updates

```typescript
import { findPathEnhanced, generateInstructions } from '@/lib';

function navigateToProduct(productId: string) {
  const product = getProductById(productId);
  const userLocation = getUserCurrentLocation();
  
  const result = findPathEnhanced(grid, userLocation, product.location, {
    smoothPath: true,
    includeTime: true,
  });
  
  if (result.found) {
    // Update UI with path
    updateMapPath(result.path);
    
    // Show instructions
    const instructions = generateInstructions(result.path);
    displayInstructions(instructions);
    
    // Show time estimate
    showTimeEstimate(result.estimatedTime);
  }
}
```

## 🏗️ Architecture

### Algorithm Choice: A* with Manhattan Distance

**Why A*?**
- Optimal: Always finds the shortest path
- Efficient: Uses heuristic to guide search
- Well-tested: Industry standard for grid pathfinding

**Why Manhattan Distance?**
- Perfect for 4-directional movement
- Admissible heuristic (never overestimates)
- Matches real supermarket navigation

### Data Structures

**Priority Queue (Min-Heap)**
- Efficiently manages open set
- O(log n) insertion and extraction
- Keeps nodes sorted by f-score

**Grid Representation**
- 2D boolean array for memory efficiency
- true = walkable, false = obstacle
- Simple and fast to query

### Performance Characteristics

- **Time Complexity**: O(b^d) where b is branching factor, d is depth
- **Space Complexity**: O(b^d) for storing nodes
- **Typical Performance**: < 100ms for 60×40 grid
- **Large Grid (100×100)**: < 1 second

## 🎯 Performance Tips

1. **Reuse Grids**: Create grid once, reuse for multiple pathfinding calls
2. **Path Smoothing**: Only use when needed (adds processing time)
3. **Grid Size**: Keep grids reasonable (< 100×100 for real-time)
4. **Caching**: Cache frequently used paths

```typescript
// Good: Reuse grid
const grid = createGridFromLayout(layout);
const path1 = findPath(grid, start1, goal1);
const path2 = findPath(grid, start2, goal2);

// Bad: Recreate grid each time
const path1 = findPath(createGridFromLayout(layout), start1, goal1);
const path2 = findPath(createGridFromLayout(layout), start2, goal2);
```

## 🐛 Debugging

### Visualize Grid

```typescript
import { visualizeGrid } from '@/lib';

const result = findPath(grid, start, goal);
visualizeGrid(grid, result.path, start, goal);
```

Output:
```
Grid Visualization:
Legend: . = walkable, # = obstacle, * = path, S = start, G = goal

S * * . . . . . . .
. . * . # # # . . .
. . * . # # # . . .
. . * * * * * * * G
```

### Common Issues

**No path found:**
- Check if start/goal are walkable
- Verify grid is correctly generated
- Ensure there's a valid path

**Path looks wrong:**
- Verify grid matches actual layout
- Check coordinate system (x, y vs y, x)
- Ensure obstacles are correctly placed

## 📝 Type Definitions

```typescript
// Core types
type Point = { x: number; y: number };
type Grid = boolean[][];

interface PathResult {
  path: Point[];
  distance: number;
  found: boolean;
}

interface PathfindingOptions {
  smoothPath?: boolean;
  simplifyPath?: boolean;
  includeTime?: boolean;
}
```

## 🔗 Related Files

- `types.ts` - TypeScript type definitions
- `utils.ts` - Utility functions
- `pathfinding.ts` - Core A* implementation
- `index.ts` - Main exports

## 📄 License

Part of the Aisly project - IBM Hackathon 2026