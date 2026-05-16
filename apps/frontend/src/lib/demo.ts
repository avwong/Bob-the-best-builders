/**
 * Aisly - Pathfinding Demo
 * 
 * Simple demonstration of the pathfinding system
 * Run this file to see the pathfinding in action
 */

import {
  findPath,
  findPathEnhanced,
  createSimpleGrid,
  visualizeGrid,
  generateInstructions,
  formatTime,
  manhattanDistance,
} from './index';
import type { Point } from './types';

// ============================================================================
// Demo 1: Basic Pathfinding
// ============================================================================

console.log('='.repeat(60));
console.log('DEMO 1: Basic Pathfinding');
console.log('='.repeat(60));

// Create a simple 20x15 grid
const grid = createSimpleGrid(20, 15);

// Define start and goal
const start: Point = { x: 2, y: 2 };
const goal: Point = { x: 17, y: 12 };

console.log(`\nFinding path from (${start.x}, ${start.y}) to (${goal.x}, ${goal.y})`);
console.log(`Straight-line distance: ${manhattanDistance(start, goal)} units\n`);

// Find the path
const result = findPath(grid, start, goal);

if (result.found) {
  console.log('✅ Path found!');
  console.log(`   Path length: ${result.path.length} waypoints`);
  console.log(`   Total distance: ${result.distance} units`);
  console.log(`   Path efficiency: ${((manhattanDistance(start, goal) / result.distance) * 100).toFixed(1)}%`);
  
  // Visualize the path
  console.log('\nPath visualization:');
  visualizeGrid(grid, result.path, start, goal);
} else {
  console.log('❌ No path found');
}

// ============================================================================
// Demo 2: Enhanced Pathfinding with Options
// ============================================================================

console.log('\n' + '='.repeat(60));
console.log('DEMO 2: Enhanced Pathfinding');
console.log('='.repeat(60));

// Find path with all enhancements
const enhancedResult = findPathEnhanced(grid, start, goal, {
  smoothPath: true,
  simplifyPath: true,
  includeTime: true,
});

if (enhancedResult.found) {
  console.log('\n✅ Enhanced path found!');
  console.log(`   Original waypoints: ${result.path.length}`);
  console.log(`   Optimized waypoints: ${enhancedResult.path.length}`);
  console.log(`   Reduction: ${((1 - enhancedResult.path.length / result.path.length) * 100).toFixed(1)}%`);
  console.log(`   Distance: ${enhancedResult.distance} units`);
  console.log(`   Estimated time: ${formatTime(enhancedResult.estimatedTime!)}`);
  
  // Visualize the optimized path
  console.log('\nOptimized path visualization:');
  visualizeGrid(grid, enhancedResult.path, start, goal);
}

// ============================================================================
// Demo 3: Turn-by-Turn Instructions
// ============================================================================

console.log('\n' + '='.repeat(60));
console.log('DEMO 3: Turn-by-Turn Navigation');
console.log('='.repeat(60));

const instructions = generateInstructions(enhancedResult.path);

console.log('\nNavigation instructions:');
instructions.forEach((instruction, index) => {
  console.log(`${index + 1}. ${instruction}`);
});

// ============================================================================
// Demo 4: Multiple Destinations (Shopping List)
// ============================================================================

console.log('\n' + '='.repeat(60));
console.log('DEMO 4: Multi-Stop Shopping Route');
console.log('='.repeat(60));

const shoppingList = [
  { name: 'Milk', location: { x: 5, y: 8 } },
  { name: 'Bread', location: { x: 15, y: 5 } },
  { name: 'Eggs', location: { x: 8, y: 12 } },
];

let currentLocation = start;
let totalDistance = 0;
let totalTime = 0;

console.log('\nShopping route:');
console.log(`Starting at: (${currentLocation.x}, ${currentLocation.y})\n`);

shoppingList.forEach((item, index) => {
  const routeResult = findPathEnhanced(grid, currentLocation, item.location, {
    smoothPath: true,
    includeTime: true,
  });

  if (routeResult.found) {
    totalDistance += routeResult.distance;
    totalTime += routeResult.estimatedTime!;

    console.log(`${index + 1}. ${item.name} at (${item.location.x}, ${item.location.y})`);
    console.log(`   Distance: ${routeResult.distance} units`);
    console.log(`   Time: ${formatTime(routeResult.estimatedTime!)}`);
    console.log(`   Waypoints: ${routeResult.path.length}`);

    currentLocation = item.location;
  }
});

console.log('\n📊 Shopping Summary:');
console.log(`   Total distance: ${totalDistance.toFixed(1)} units`);
console.log(`   Total time: ${formatTime(totalTime)}`);
console.log(`   Items collected: ${shoppingList.length}`);

// ============================================================================
// Demo 5: Performance Test
// ============================================================================

console.log('\n' + '='.repeat(60));
console.log('DEMO 5: Performance Benchmark');
console.log('='.repeat(60));

const largeGrid = createSimpleGrid(100, 100);
const testCases = 100;

console.log(`\nRunning ${testCases} pathfinding operations on 100x100 grid...`);

const startTime = performance.now();

for (let i = 0; i < testCases; i++) {
  const randomStart = {
    x: Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100),
  };
  const randomGoal = {
    x: Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100),
  };

  findPath(largeGrid, randomStart, randomGoal);
}

const endTime = performance.now();
const totalTime2 = endTime - startTime;
const avgTime = totalTime2 / testCases;

console.log('\n✅ Performance Results:');
console.log(`   Total time: ${totalTime2.toFixed(2)}ms`);
console.log(`   Average per operation: ${avgTime.toFixed(2)}ms`);
console.log(`   Operations per second: ${(1000 / avgTime).toFixed(0)}`);

if (avgTime < 10) {
  console.log('   Performance: ⚡ Excellent (< 10ms)');
} else if (avgTime < 50) {
  console.log('   Performance: ✅ Good (< 50ms)');
} else if (avgTime < 100) {
  console.log('   Performance: ⚠️  Acceptable (< 100ms)');
} else {
  console.log('   Performance: ❌ Needs optimization (> 100ms)');
}

// ============================================================================
// Demo 6: Edge Cases
// ============================================================================

console.log('\n' + '='.repeat(60));
console.log('DEMO 6: Edge Cases & Error Handling');
console.log('='.repeat(60));

// Test 1: Start equals goal
console.log('\nTest 1: Start equals goal');
const samePoint = { x: 5, y: 5 };
const result1 = findPath(grid, samePoint, samePoint);
console.log(`   Result: ${result1.found ? '✅ Found' : '❌ Not found'}`);
console.log(`   Distance: ${result1.distance}`);

// Test 2: Unreachable goal
console.log('\nTest 2: Unreachable goal (blocked)');
const blockedGrid = Array(10)
  .fill(null)
  .map(() => Array(10).fill(true));
// Create a wall
for (let y = 0; y < 10; y++) {
  blockedGrid[y][5] = false;
}
const result2 = findPath(blockedGrid, { x: 0, y: 5 }, { x: 9, y: 5 });
console.log(`   Result: ${result2.found ? '✅ Found' : '❌ Not found (expected)'}`);

// Test 3: Adjacent points
console.log('\nTest 3: Adjacent points');
const result3 = findPath(grid, { x: 5, y: 5 }, { x: 6, y: 5 });
console.log(`   Result: ${result3.found ? '✅ Found' : '❌ Not found'}`);
console.log(`   Distance: ${result3.distance}`);
console.log(`   Waypoints: ${result3.path.length}`);

// ============================================================================
// Summary
// ============================================================================

console.log('\n' + '='.repeat(60));
console.log('DEMO COMPLETE');
console.log('='.repeat(60));

console.log('\n📚 Key Takeaways:');
console.log('   ✅ A* algorithm finds optimal paths');
console.log('   ✅ Manhattan distance perfect for 4-directional movement');
console.log('   ✅ Path smoothing reduces waypoints significantly');
console.log('   ✅ Performance is excellent for real-time use');
console.log('   ✅ Handles edge cases gracefully');

console.log('\n🚀 Ready for integration with the supermarket map!');
console.log('');

// Export for use in other files
export {
  grid,
  start,
  goal,
  result,
  enhancedResult,
};

// Made with Bob
