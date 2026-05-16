# Multi-Product Route Optimization Documentation

## Overview

The multi-product route optimization feature allows customers to add multiple products to a shopping list and automatically calculates the most efficient route to collect all items, minimizing walking distance.

## Components

### 1. Route Optimization Algorithm (`routeOptimization.ts`)

**Location**: `apps/frontend/src/lib/routeOptimization.ts`

#### Main Functions

##### optimizeShoppingRoute

Calculates optimal route using **Nearest Neighbor Algorithm** (greedy approach).

```typescript
import { optimizeShoppingRoute } from "@/lib/routeOptimization"

const route = optimizeShoppingRoute(grid, startPosition, products)
```

**Algorithm**: O(n²) time complexity
- Starts at user's location
- Repeatedly visits nearest unvisited product
- Fast and efficient for most use cases

##### optimizeWith2Opt

Enhanced optimization using **2-opt improvement algorithm**.

```typescript
import { optimizeWith2Opt } from "@/lib/routeOptimization"

const route = optimizeWith2Opt(grid, startPosition, products, maxIterations)
```

**Algorithm**: Improves nearest neighbor solution
- Better results for small lists (<10 products)
- Slower but more optimal
- Configurable iteration limit

#### Types

```typescript
interface ProductWithLocation {
  id: string
  name: string
  position: Position
  aisle?: string
  category?: string
}

interface RouteSegment {
  from: ProductWithLocation
  to: ProductWithLocation
  path: Position[]
  distance: number
  estimatedTime: number
}

interface OptimizedRoute {
  products: ProductWithLocation[]      // Products in optimal order
  segments: RouteSegment[]             // Path segments between products
  totalDistance: number                // Total walking distance
  totalTime: number                    // Total estimated time
  order: number[]                      // Indices in optimal order
  success: boolean                     // Whether route was found
}
```

### 2. Shopping List Hook (`useShoppingList.ts`)

**Location**: `apps/frontend/src/lib/hooks/useShoppingList.ts`

Manages shopping list state and route optimization.

#### Usage

```typescript
import { useShoppingList } from "@/lib/hooks/useShoppingList"

const shoppingList = useShoppingList({
  autoOptimize: true,
  use2Opt: false,
  onRouteOptimized: (route) => console.log("Route ready!", route),
  onError: (error) => console.error(error),
})
```

#### API

| Property/Method | Type | Description |
|----------------|------|-------------|
| `products` | `ProductWithLocation[]` | Current shopping list |
| `optimizedRoute` | `OptimizedRoute \| null` | Calculated route |
| `isOptimizing` | `boolean` | Optimization in progress |
| `addProduct` | `(product) => void` | Add product to list |
| `removeProduct` | `(id) => void` | Remove product from list |
| `clearList` | `() => void` | Clear entire list |
| `optimizeRoute` | `(grid, start) => void` | Calculate optimal route |
| `productCount` | `number` | Number of products |
| `totalDistance` | `number` | Total route distance |
| `totalTime` | `number` | Total estimated time |
| `hasRoute` | `boolean` | Whether route exists |

### 3. Shopping List UI Component (`ShoppingList.tsx`)

**Location**: `apps/frontend/src/components/customer/ShoppingList.tsx`

Visual component for displaying and managing shopping list.

#### Usage

```typescript
import { ShoppingList } from "@/components/customer/ShoppingList"

<ShoppingList
  products={shoppingList.products}
  onRemoveProduct={shoppingList.removeProduct}
  onClearList={shoppingList.clearList}
  onOptimizeRoute={() => shoppingList.optimizeRoute(grid, startPosition)}
  isOptimizing={shoppingList.isOptimizing}
  optimizedOrder={shoppingList.optimizedRoute?.order}
  totalDistance={shoppingList.totalDistance}
  totalTime={shoppingList.totalTime}
/>
```

#### Features

- ✅ Product list with remove buttons
- ✅ Numbered order when optimized
- ✅ Route summary (distance & time)
- ✅ Optimize button
- ✅ Clear all functionality
- ✅ Empty state

### 4. Shopping List Badge (`ShoppingListBadge`)

Floating badge showing product count.

```typescript
import { ShoppingListBadge } from "@/components/customer/ShoppingList"

<ShoppingListBadge
  productCount={shoppingList.productCount}
  onClick={() => setShowList(true)}
  hasOptimizedRoute={shoppingList.hasRoute}
/>
```

## Complete Integration Example

```typescript
"use client"

import { useState, useEffect } from "react"
import { useShoppingList } from "@/lib/hooks/useShoppingList"
import { useNavigation } from "@/lib/hooks/useNavigation"
import { ShoppingList, ShoppingListBadge } from "@/components/customer/ShoppingList"
import { RouteRenderer } from "@/components/customer/RouteRenderer"
import { LocationSelector, generateLocationOptions } from "@/components/customer/LocationSelector"
import { createGridFromLayout } from "@/lib/pathfinding"
import { combineSegmentPaths } from "@/lib/routeOptimization"

export function MultiProductNavigationApp({ layout }) {
  const [showList, setShowList] = useState(false)
  
  // Shopping list management
  const shoppingList = useShoppingList({
    autoOptimize: false, // Manual optimization
    use2Opt: true,       // Use better algorithm for small lists
    onRouteOptimized: (route) => {
      console.log(`Optimized route: ${route.totalDistance.toFixed(1)}m`)
    },
  })

  // Location management
  const navigation = useNavigation()
  const locations = generateLocationOptions(layout)

  // Calculate route when optimize button clicked
  const handleOptimize = () => {
    if (navigation.currentLocation) {
      const grid = createGridFromLayout(layout)
      shoppingList.optimizeRoute(grid, navigation.currentLocation.position)
    }
  }

  // Get combined path for rendering
  const combinedPath = shoppingList.optimizedRoute
    ? combineSegmentPaths(shoppingList.optimizedRoute.segments)
    : []

  return (
    <div className="flex gap-4">
      {/* Left Panel - Shopping List */}
      <div className="w-96">
        <LocationSelector
          locations={locations}
          selectedLocation={navigation.currentLocation}
          onLocationSelect={navigation.setCurrentLocation}
          compact={true}
        />

        <ShoppingList
          products={shoppingList.products}
          onRemoveProduct={shoppingList.removeProduct}
          onClearList={shoppingList.clearList}
          onOptimizeRoute={handleOptimize}
          isOptimizing={shoppingList.isOptimizing}
          optimizedOrder={shoppingList.optimizedRoute?.order}
          totalDistance={shoppingList.totalDistance}
          totalTime={shoppingList.totalTime}
        />

        {/* Product segments */}
        {shoppingList.optimizedRoute?.segments.map((segment, i) => (
          <div key={i} className="p-2 bg-gray-50 rounded text-sm">
            {i + 1}. {segment.to.name} - {segment.distance.toFixed(1)}m
          </div>
        ))}
      </div>

      {/* Right Panel - Map */}
      <div className="flex-1">
        <svg viewBox={`0 0 ${layout.dimensions.width} ${layout.dimensions.height}`}>
          {/* Render map elements */}
          
          {/* Render optimized route */}
          {combinedPath.length > 0 && (
            <RouteRenderer
              path={combinedPath}
              start={navigation.currentLocation?.position}
              distance={shoppingList.totalDistance}
              estimatedTime={shoppingList.totalTime}
              color="#10b981"
            />
          )}

          {/* Render product markers */}
          {shoppingList.products.map((product, i) => (
            <g key={product.id}>
              <circle
                cx={product.position.x + 0.5}
                cy={product.position.y + 0.5}
                r={0.5}
                fill="#ef4444"
                stroke="#fff"
                strokeWidth={0.1}
              />
              <text
                x={product.position.x + 0.5}
                y={product.position.y + 0.5}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={0.4}
                fill="#fff"
                fontWeight="bold"
              >
                {shoppingList.optimizedRoute?.order.indexOf(i) + 1 || i + 1}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Floating badge */}
      <ShoppingListBadge
        productCount={shoppingList.productCount}
        onClick={() => setShowList(!showList)}
        hasOptimizedRoute={shoppingList.hasRoute}
      />
    </div>
  )
}
```

## Algorithm Details

### Nearest Neighbor Algorithm

1. Start at user's current location
2. Find nearest unvisited product
3. Calculate path to that product
4. Mark as visited and move to product location
5. Repeat until all products visited

**Pros**: Fast O(n²), good for real-time use
**Cons**: Not always optimal (approximation)

### 2-Opt Improvement

1. Start with nearest neighbor solution
2. Try swapping pairs of route segments
3. Keep swap if it reduces total distance
4. Repeat until no improvement found

**Pros**: Better results, still reasonable speed
**Cons**: Slower, best for <10 products

## Performance Considerations

- **Small lists (1-5 products)**: Use 2-opt for best results
- **Medium lists (6-15 products)**: Nearest neighbor is sufficient
- **Large lists (15+ products)**: Consider grouping by aisle first

## Helper Functions

### combineSegmentPaths

Combines route segments into single path for rendering.

```typescript
import { combineSegmentPaths } from "@/lib/routeOptimization"

const fullPath = combineSegmentPaths(route.segments)
```

### getProductOrderSummary

Gets human-readable summary of product order.

```typescript
import { getProductOrderSummary } from "@/lib/routeOptimization"

const summary = getProductOrderSummary(route)
// ["1. Milk (Aisle A) - 5.2m, 15s", "2. Bread (Aisle C) - 8.1m, 24s", ...]
```

## Features

- ✅ Add/remove products from shopping list
- ✅ Automatic route optimization
- ✅ Two optimization algorithms (nearest neighbor & 2-opt)
- ✅ Visual route display with numbered stops
- ✅ Total distance and time calculation
- ✅ Route segments with individual distances
- ✅ Floating badge for quick access
- ✅ Empty state handling
- ✅ Error handling

## Made with Bob