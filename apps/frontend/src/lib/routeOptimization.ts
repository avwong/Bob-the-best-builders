/**
 * Aisly - Multi-Product Route Optimization
 * 
 * Optimizes shopping routes for multiple products using nearest neighbor algorithm.
 * Solves the Traveling Salesman Problem (TSP) for efficient store navigation.
 */

import { Position, Grid, PathResult } from './types'
import { findPathEnhanced } from './pathfinding'
import { manhattanDistance } from './utils'

/**
 * Product with location information
 */
export interface ProductWithLocation {
  id: string
  name: string
  position: Position
  aisle?: string
  category?: string
}

/**
 * Route segment between two products
 */
export interface RouteSegment {
  from: ProductWithLocation
  to: ProductWithLocation
  path: Position[]
  distance: number
  estimatedTime: number
}

/**
 * Optimized shopping route result
 */
export interface OptimizedRoute {
  products: ProductWithLocation[]
  segments: RouteSegment[]
  totalDistance: number
  totalTime: number
  order: number[] // Indices of products in optimal order
  success: boolean
}

/**
 * Calculate optimal route through multiple products using Nearest Neighbor algorithm
 * 
 * This is a greedy approximation of the Traveling Salesman Problem.
 * Time complexity: O(n²) where n is number of products
 * 
 * @param grid - Walkability grid
 * @param startPosition - Starting position (user's current location)
 * @param products - List of products to visit
 * @returns Optimized route with segments
 */
export function optimizeShoppingRoute(
  grid: Grid,
  startPosition: Position,
  products: ProductWithLocation[]
): OptimizedRoute {
  if (products.length === 0) {
    return {
      products: [],
      segments: [],
      totalDistance: 0,
      totalTime: 0,
      order: [],
      success: false,
    }
  }

  // Single product - simple case
  if (products.length === 1) {
    const result = findPathEnhanced(grid, startPosition, products[0].position, {
      smoothPath: true,
      simplifyPath: true,
      includeTime: true,
    })

    if (!result.found) {
      return {
        products: [products[0]],
        segments: [],
        totalDistance: 0,
        totalTime: 0,
        order: [0],
        success: false,
      }
    }

    return {
      products: [products[0]],
      segments: [{
        from: { id: 'start', name: 'Start', position: startPosition },
        to: products[0],
        path: result.path,
        distance: result.distance,
        estimatedTime: result.estimatedTime || 0,
      }],
      totalDistance: result.distance,
      totalTime: result.estimatedTime || 0,
      order: [0],
      success: true,
    }
  }

  // Multiple products - use nearest neighbor algorithm
  const visited = new Set<number>()
  const order: number[] = []
  const segments: RouteSegment[] = []
  let currentPosition = startPosition
  let totalDistance = 0
  let totalTime = 0

  // Start with nearest product to starting position
  let nearestIndex = findNearestProduct(currentPosition, products, visited)
  
  while (nearestIndex !== -1) {
    const product = products[nearestIndex]
    
    // Calculate path to this product
    const result = findPathEnhanced(grid, currentPosition, product.position, {
      smoothPath: true,
      simplifyPath: true,
      includeTime: true,
    })

    if (!result.found) {
      // If path not found, skip this product
      visited.add(nearestIndex)
      nearestIndex = findNearestProduct(currentPosition, products, visited)
      continue
    }

    // Add segment
    const fromProduct = order.length === 0
      ? { id: 'start', name: 'Start', position: startPosition }
      : products[order[order.length - 1]]

    segments.push({
      from: fromProduct,
      to: product,
      path: result.path,
      distance: result.distance,
      estimatedTime: result.estimatedTime || 0,
    })

    // Update totals
    totalDistance += result.distance
    totalTime += result.estimatedTime || 0

    // Mark as visited and move to next
    visited.add(nearestIndex)
    order.push(nearestIndex)
    currentPosition = product.position

    // Find next nearest unvisited product
    nearestIndex = findNearestProduct(currentPosition, products, visited)
  }

  return {
    products: order.map(i => products[i]),
    segments,
    totalDistance,
    totalTime,
    order,
    success: order.length === products.length,
  }
}

/**
 * Find nearest unvisited product to current position
 */
function findNearestProduct(
  position: Position,
  products: ProductWithLocation[],
  visited: Set<number>
): number {
  let nearestIndex = -1
  let minDistance = Infinity

  for (let i = 0; i < products.length; i++) {
    if (visited.has(i)) continue

    const distance = manhattanDistance(position, products[i].position)
    if (distance < minDistance) {
      minDistance = distance
      nearestIndex = i
    }
  }

  return nearestIndex
}

/**
 * Calculate total path by combining all segments
 */
export function combineSegmentPaths(segments: RouteSegment[]): Position[] {
  if (segments.length === 0) return []

  const combinedPath: Position[] = []

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    
    // Add all points except the last one (to avoid duplicates)
    if (i < segments.length - 1) {
      combinedPath.push(...segment.path.slice(0, -1))
    } else {
      // For last segment, add all points
      combinedPath.push(...segment.path)
    }
  }

  return combinedPath
}

/**
 * Get product order summary for display
 */
export function getProductOrderSummary(route: OptimizedRoute): string[] {
  return route.products.map((product, index) => {
    const segment = route.segments[index]
    const distance = segment ? segment.distance.toFixed(1) : '0.0'
    const time = segment ? Math.ceil(segment.estimatedTime) : 0
    return `${index + 1}. ${product.name} (${product.aisle || 'Unknown'}) - ${distance}m, ${time}s`
  })
}

/**
 * Alternative: Optimize using 2-opt improvement (better but slower)
 * This can be used for smaller lists (<10 products) for better results
 */
export function optimizeWith2Opt(
  grid: Grid,
  startPosition: Position,
  products: ProductWithLocation[],
  maxIterations: number = 100
): OptimizedRoute {
  // Start with nearest neighbor solution
  let currentRoute = optimizeShoppingRoute(grid, startPosition, products)
  
  if (!currentRoute.success || products.length < 3) {
    return currentRoute
  }

  let improved = true
  let iterations = 0

  while (improved && iterations < maxIterations) {
    improved = false
    iterations++

    // Try all possible 2-opt swaps
    for (let i = 0; i < currentRoute.order.length - 1; i++) {
      for (let j = i + 2; j < currentRoute.order.length; j++) {
        // Create new order by reversing segment between i and j
        const newOrder = [
          ...currentRoute.order.slice(0, i + 1),
          ...currentRoute.order.slice(i + 1, j + 1).reverse(),
          ...currentRoute.order.slice(j + 1),
        ]

        // Calculate new route
        const newProducts = newOrder.map(idx => products[idx])
        const newRoute = calculateRouteForOrder(grid, startPosition, newProducts)

        // If better, use new route
        if (newRoute.success && newRoute.totalDistance < currentRoute.totalDistance) {
          currentRoute = { ...newRoute, order: newOrder }
          improved = true
        }
      }
    }
  }

  return currentRoute
}

/**
 * Calculate route for a specific product order
 */
function calculateRouteForOrder(
  grid: Grid,
  startPosition: Position,
  orderedProducts: ProductWithLocation[]
): OptimizedRoute {
  const segments: RouteSegment[] = []
  let currentPosition = startPosition
  let totalDistance = 0
  let totalTime = 0

  for (let i = 0; i < orderedProducts.length; i++) {
    const product = orderedProducts[i]
    const result = findPathEnhanced(grid, currentPosition, product.position, {
      smoothPath: true,
      simplifyPath: true,
      includeTime: true,
    })

    if (!result.found) {
      return {
        products: orderedProducts,
        segments: [],
        totalDistance: 0,
        totalTime: 0,
        order: [],
        success: false,
      }
    }

    const fromProduct = i === 0
      ? { id: 'start', name: 'Start', position: startPosition }
      : orderedProducts[i - 1]

    segments.push({
      from: fromProduct,
      to: product,
      path: result.path,
      distance: result.distance,
      estimatedTime: result.estimatedTime || 0,
    })

    totalDistance += result.distance
    totalTime += result.estimatedTime || 0
    currentPosition = product.position
  }

  return {
    products: orderedProducts,
    segments,
    totalDistance,
    totalTime,
    order: orderedProducts.map((_, i) => i),
    success: true,
  }
}

// Made with Bob