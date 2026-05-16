# Navigation State Management Documentation

## Overview

The `useNavigation` hook provides centralized state management for the customer navigation flow. It handles location selection, route calculation, and navigation state transitions.

**Location**: `apps/frontend/src/lib/hooks/useNavigation.ts`

## Hook: useNavigation

### Usage

```tsx
import { useNavigation } from "@/lib/hooks/useNavigation"

function NavigationApp() {
  const navigation = useNavigation({
    autoCalculate: true,
    onRouteCalculated: (route) => console.log("Route ready!", route),
    onError: (error) => console.error("Navigation error:", error),
  })

  return (
    <div>
      <LocationSelector
        locations={locations}
        selectedLocation={navigation.currentLocation}
        onLocationSelect={navigation.setCurrentLocation}
      />
      
      {navigation.hasRoute && (
        <RouteRenderer
          path={navigation.route.path}
          distance={navigation.route.distance}
          estimatedTime={navigation.estimatedTime}
        />
      )}
    </div>
  )
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoCalculate` | `boolean` | `true` | Auto-calculate route when locations set |
| `onRouteCalculated` | `(route: PathResult) => void` | optional | Callback when route calculated |
| `onError` | `(error: string) => void` | optional | Callback on error |

### Return Value: NavigationContext

#### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `state` | `NavigationState` | Current navigation state |
| `currentLocation` | `LocationOption \| null` | User's current location |
| `destination` | `Position \| null` | Destination coordinates |
| `destinationLabel` | `string \| undefined` | Destination name/label |
| `route` | `PathResult \| null` | Calculated route |
| `estimatedTime` | `number` | Walking time in seconds |
| `error` | `string \| null` | Error message if any |

#### Action Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `setCurrentLocation` | `(location: LocationOption) => void` | Set user's location |
| `setDestination` | `(position: Position, label?: string) => void` | Set destination |
| `calculateRoute` | `(grid: Grid) => void` | Calculate route manually |
| `clearRoute` | `() => void` | Clear current route |
| `reset` | `() => void` | Reset all state |

#### Derived State

| Property | Type | Description |
|----------|------|-------------|
| `isNavigating` | `boolean` | True if actively navigating |
| `hasRoute` | `boolean` | True if route exists |
| `canNavigate` | `boolean` | True if both locations set |

## Navigation States

```typescript
enum NavigationState {
  IDLE = "idle",                           // No location selected
  SELECTING_START = "selecting_start",     // Choosing start location
  SELECTING_DESTINATION = "selecting_destination", // Choosing destination
  CALCULATING = "calculating",             // Computing route
  NAVIGATING = "navigating",               // Route displayed
  ARRIVED = "arrived",                     // Reached destination
  ERROR = "error",                         // Error occurred
}
```

## State Flow

```
IDLE
  ↓ (setCurrentLocation)
SELECTING_DESTINATION
  ↓ (setDestination + autoCalculate)
CALCULATING
  ↓ (route found)
NAVIGATING
  ↓ (clearRoute)
SELECTING_DESTINATION
  ↓ (reset)
IDLE
```

## Helper Functions

### generateInstructions

Generates turn-by-turn instructions from a path.

```typescript
import { generateInstructions } from "@/lib/hooks/useNavigation"

const steps = generateInstructions(route.path)
// Returns: NavigationStep[]
```

#### NavigationStep Interface

```typescript
interface NavigationStep {
  instruction: string    // "Turn right", "Head north", etc.
  distance: number       // Distance in grid units
  direction?: string     // "north", "south", "east", "west"
  position: Position     // Position where instruction applies
}
```

## Complete Example

```tsx
"use client"

import { useEffect } from "react"
import { useNavigation, generateInstructions } from "@/lib/hooks/useNavigation"
import { LocationSelector, generateLocationOptions } from "@/components/customer/LocationSelector"
import { RouteRenderer, RouteStats } from "@/components/customer/RouteRenderer"
import { createGridFromLayout } from "@/lib/pathfinding"

export function CustomerNavigationApp({ layout, productLocation }) {
  const navigation = useNavigation({
    autoCalculate: true,
    onRouteCalculated: (route) => {
      console.log(`Route calculated: ${route.distance}m`)
    },
    onError: (error) => {
      alert(`Navigation error: ${error}`)
    },
  })

  // Generate location options from layout
  const locations = generateLocationOptions(layout)

  // Set product as destination
  useEffect(() => {
    if (productLocation) {
      navigation.setDestination(
        productLocation.position,
        productLocation.label
      )
    }
  }, [productLocation])

  // Calculate route when ready
  useEffect(() => {
    if (navigation.canNavigate) {
      const grid = createGridFromLayout(layout)
      navigation.calculateRoute(grid)
    }
  }, [navigation.canNavigate])

  // Generate turn-by-turn instructions
  const instructions = navigation.hasRoute
    ? generateInstructions(navigation.route.path)
    : []

  return (
    <div className="space-y-4">
      {/* Location Selector */}
      <LocationSelector
        locations={locations}
        selectedLocation={navigation.currentLocation}
        onLocationSelect={navigation.setCurrentLocation}
      />

      {/* Route Stats */}
      {navigation.hasRoute && (
        <RouteStats
          distance={navigation.route.distance}
          estimatedTime={navigation.estimatedTime}
          pathLength={navigation.route.path.length}
        />
      )}

      {/* Map with Route */}
      <svg viewBox={`0 0 ${layout.dimensions.width} ${layout.dimensions.height}`}>
        {/* Render map elements */}
        
        {navigation.hasRoute && (
          <RouteRenderer
            path={navigation.route.path}
            start={navigation.currentLocation.position}
            end={navigation.destination}
            distance={navigation.route.distance}
            estimatedTime={navigation.estimatedTime}
          />
        )}
      </svg>

      {/* Turn-by-turn Instructions */}
      {instructions.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Directions</h3>
          {instructions.map((step, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <span className="font-mono text-sm">{i + 1}.</span>
              <span>{step.instruction}</span>
            </div>
          ))}
        </div>
      )}

      {/* Error Display */}
      {navigation.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800">
          {navigation.error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={navigation.clearRoute}
          disabled={!navigation.hasRoute}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Clear Route
        </button>
        <button
          onClick={navigation.reset}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
```

## Features

- ✅ Centralized navigation state management
- ✅ Automatic route calculation
- ✅ State machine with clear transitions
- ✅ Error handling with callbacks
- ✅ Turn-by-turn instruction generation
- ✅ Derived state for UI logic
- ✅ TypeScript type safety
- ✅ React hooks best practices

## Integration with Other Components

### With LocationSelector
```tsx
<LocationSelector
  locations={locations}
  selectedLocation={navigation.currentLocation}
  onLocationSelect={navigation.setCurrentLocation}
/>
```

### With RouteRenderer
```tsx
{navigation.hasRoute && (
  <RouteRenderer
    path={navigation.route.path}
    distance={navigation.route.distance}
    estimatedTime={navigation.estimatedTime}
  />
)}
```

### With Product Search
```tsx
function handleProductSelect(product) {
  navigation.setDestination(
    product.location.position,
    product.name
  )
}
```

## Made with Bob