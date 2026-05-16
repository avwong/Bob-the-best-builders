"use client"

import { ProductWithLocation } from "@/lib/routeOptimization"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ShoppingListProps {
  products: ProductWithLocation[]
  onRemoveProduct: (productId: string) => void
  onClearList: () => void
  onOptimizeRoute?: () => void
  isOptimizing?: boolean
  optimizedOrder?: number[]
  totalDistance?: number
  totalTime?: number
  className?: string
}

/**
 * ShoppingList Component
 * 
 * Displays a list of products to purchase with route optimization.
 */
export function ShoppingList({
  products,
  onRemoveProduct,
  onClearList,
  onOptimizeRoute,
  isOptimizing = false,
  optimizedOrder,
  totalDistance,
  totalTime,
  className,
}: ShoppingListProps) {
  const hasProducts = products.length > 0
  const hasOptimizedRoute = optimizedOrder && optimizedOrder.length > 0

  // Reorder products if optimized order exists
  const displayProducts = hasOptimizedRoute
    ? optimizedOrder.map(index => products[index])
    : products

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              🛒 Shopping List
              {hasProducts && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({products.length} {products.length === 1 ? 'item' : 'items'})
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {hasProducts
                ? "Add products to optimize your shopping route"
                : "Your shopping list is empty"}
            </CardDescription>
          </div>
          {hasProducts && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearList}
              className="text-red-600 hover:text-red-700"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Product List */}
        {hasProducts ? (
          <div className="space-y-2">
            {displayProducts.map((product, index) => (
              <div
                key={product.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                  hasOptimizedRoute
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                )}
              >
                {/* Order number (if optimized) */}
                {hasOptimizedRoute && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                )}

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {product.aisle && `Aisle ${product.aisle}`}
                    {product.aisle && product.category && " • "}
                    {product.category}
                  </p>
                </div>

                {/* Remove button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveProduct(product.id)}
                  className="flex-shrink-0 text-gray-500 hover:text-red-600"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-4xl mb-2">🛒</p>
            <p className="text-sm">No products added yet</p>
            <p className="text-xs mt-1">Search and add products to get started</p>
          </div>
        )}

        {/* Route Summary */}
        {hasOptimizedRoute && totalDistance !== undefined && totalTime !== undefined && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              ✓ Optimized Route
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-green-700">Total Distance</p>
                <p className="text-2xl font-bold text-green-900">
                  {totalDistance.toFixed(1)}m
                </p>
              </div>
              <div>
                <p className="text-green-700">Estimated Time</p>
                <p className="text-2xl font-bold text-green-900">
                  {Math.ceil(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Optimize Button */}
        {hasProducts && onOptimizeRoute && (
          <Button
            onClick={onOptimizeRoute}
            disabled={isOptimizing}
            className="w-full"
            size="lg"
          >
            {isOptimizing ? (
              <>
                <span className="animate-spin mr-2">⚙️</span>
                Optimizing Route...
              </>
            ) : hasOptimizedRoute ? (
              <>🔄 Re-optimize Route</>
            ) : (
              <>🎯 Optimize Shopping Route</>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Compact Shopping List Badge
 * Shows product count with quick access
 */
interface ShoppingListBadgeProps {
  productCount: number
  onClick: () => void
  hasOptimizedRoute?: boolean
}

export function ShoppingListBadge({
  productCount,
  onClick,
  hasOptimizedRoute = false,
}: ShoppingListBadgeProps) {
  if (productCount === 0) return null

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-4 right-4 z-50",
        "flex items-center gap-2 px-4 py-3 rounded-full shadow-lg",
        "font-semibold text-white transition-all hover:scale-105",
        hasOptimizedRoute
          ? "bg-green-600 hover:bg-green-700"
          : "bg-blue-600 hover:bg-blue-700"
      )}
    >
      <span className="text-xl">🛒</span>
      <span>{productCount}</span>
      {hasOptimizedRoute && <span className="text-xs">✓</span>}
    </button>
  )
}

// Made with Bob