"use client"

import { useState, useCallback, useEffect } from "react"
import { Position, Grid } from "@/lib/types"
import {
  ProductWithLocation,
  OptimizedRoute,
  optimizeShoppingRoute,
  optimizeWith2Opt,
  combineSegmentPaths,
} from "@/lib/routeOptimization"

/**
 * Shopping list state
 */
export interface ShoppingListState {
  // Products
  products: ProductWithLocation[]
  
  // Route
  optimizedRoute: OptimizedRoute | null
  isOptimizing: boolean
  
  // Actions
  addProduct: (product: ProductWithLocation) => void
  removeProduct: (productId: string) => void
  clearList: () => void
  optimizeRoute: (grid: Grid, startPosition: Position, use2Opt?: boolean) => void
  
  // Derived state
  productCount: number
  totalDistance: number
  totalTime: number
  hasRoute: boolean
}

/**
 * useShoppingList Hook
 * 
 * Manages a shopping list and calculates optimal routes through multiple products.
 * 
 * @param options - Configuration options
 * @returns Shopping list state and actions
 */
export function useShoppingList(options?: {
  autoOptimize?: boolean
  use2Opt?: boolean
  onRouteOptimized?: (route: OptimizedRoute) => void
  onError?: (error: string) => void
}): ShoppingListState {
  const {
    autoOptimize = false,
    use2Opt = false,
    onRouteOptimized,
    onError,
  } = options || {}

  // State
  const [products, setProducts] = useState<ProductWithLocation[]>([])
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [grid, setGrid] = useState<Grid | null>(null)
  const [startPosition, setStartPosition] = useState<Position | null>(null)

  // Derived state
  const productCount = products.length
  const totalDistance = optimizedRoute?.totalDistance || 0
  const totalTime = optimizedRoute?.totalTime || 0
  const hasRoute = optimizedRoute !== null && optimizedRoute.success

  /**
   * Add product to shopping list
   */
  const addProduct = useCallback((product: ProductWithLocation) => {
    setProducts(prev => {
      // Check if product already exists
      if (prev.some(p => p.id === product.id)) {
        return prev
      }
      return [...prev, product]
    })
  }, [])

  /**
   * Remove product from shopping list
   */
  const removeProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId))
    
    // Clear route if product was in it
    setOptimizedRoute(prev => {
      if (prev && prev.products.some(p => p.id === productId)) {
        return null
      }
      return prev
    })
  }, [])

  /**
   * Clear entire shopping list
   */
  const clearList = useCallback(() => {
    setProducts([])
    setOptimizedRoute(null)
  }, [])

  /**
   * Optimize route through all products
   */
  const optimizeRoute = useCallback(
    (walkabilityGrid: Grid, start: Position, shouldUse2Opt?: boolean) => {
      if (products.length === 0) {
        onError?.("Shopping list is empty")
        return
      }

      setIsOptimizing(true)
      setGrid(walkabilityGrid)
      setStartPosition(start)

      try {
        // Use 2-opt for small lists (<10 products) or if explicitly requested
        const useAdvanced = shouldUse2Opt ?? (use2Opt && products.length < 10)
        
        const route = useAdvanced
          ? optimizeWith2Opt(walkabilityGrid, start, products)
          : optimizeShoppingRoute(walkabilityGrid, start, products)

        if (route.success) {
          setOptimizedRoute(route)
          onRouteOptimized?.(route)
        } else {
          onError?.("Could not find route to all products")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to optimize route"
        onError?.(errorMessage)
      } finally {
        setIsOptimizing(false)
      }
    },
    [products, use2Opt, onRouteOptimized, onError]
  )

  /**
   * Auto-optimize when products change (if enabled)
   */
  useEffect(() => {
    if (autoOptimize && products.length > 0 && grid && startPosition) {
      optimizeRoute(grid, startPosition)
    }
  }, [autoOptimize, products, grid, startPosition, optimizeRoute])

  return {
    // State
    products,
    optimizedRoute,
    isOptimizing,
    
    // Actions
    addProduct,
    removeProduct,
    clearList,
    optimizeRoute,
    
    // Derived
    productCount,
    totalDistance,
    totalTime,
    hasRoute,
  }
}

/**
 * Get combined path for rendering
 */
export function useOptimizedPath(route: OptimizedRoute | null): Position[] {
  return route ? combineSegmentPaths(route.segments) : []
}

// Made with Bob