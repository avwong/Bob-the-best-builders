# RouteRenderer Component Documentation

## Overview

The `RouteRenderer` component renders navigation routes on SVG maps with smooth animations. It integrates with the pathfinding library to display routes from the customer's location to products.

**Location**: `apps/frontend/src/components/customer/RouteRenderer.tsx`

## Components

### RouteRenderer

Main component for rendering animated routes on SVG maps.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `path` | `Position[]` | required | Array of points forming the route |
| `start` | `Position` | first point | Starting position marker |
| `end` | `Position` | last point | Ending position marker |
| `animate` | `boolean` | `true` | Enable route drawing animation |
| `animationDuration` | `number` | `1500` | Animation duration in ms |
| `color` | `string` | `"#3b82f6"` | Route color |
| `strokeWidth` | `number` | `0.25` | Route line width |
| `showMarkers` | `boolean` | `true` | Show distance markers |
| `distance` | `number` | optional | Distance in meters |
| `estimatedTime` | `number` | optional | Time in seconds |
| `onAnimationComplete` | `() => void` | optional | Callback when animation completes |

#### Usage

```tsx
import { RouteRenderer } from "@/components/customer/RouteRenderer"

<svg viewBox="0 0 60 40">
  <RouteRenderer
    path={pathPoints}
    distance={12.5}
    estimatedTime={36}
    animate={true}
  />
</svg>
```

### RouteStats

Displays route statistics in a card format (outside SVG).

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `distance` | `number` | Distance in meters |
| `estimatedTime` | `number` | Time in seconds |
| `pathLength` | `number` | Number of path points |

#### Usage

```tsx
import { RouteStats } from "@/components/customer/RouteRenderer"

<RouteStats
  distance={12.5}
  estimatedTime={36}
  pathLength={25}
/>
```

## Integration with Pathfinding

### Calculate Path

```tsx
import { findPathEnhanced, createGridFromLayout } from "@/lib/pathfinding"

const grid = createGridFromLayout(storeLayout)
const result = findPathEnhanced(grid, start, end, {
  smoothPath: true,
  simplifyPath: true,
  includeTime: true,
})

if (result.found) {
  // Use result.path, result.distance, result.estimatedTime
}
```

### Render Route

```tsx
{result.found && (
  <RouteRenderer
    path={result.path}
    distance={result.distance}
    estimatedTime={result.estimatedTime}
  />
)}
```

## Features

- ✅ Animated route drawing with configurable duration
- ✅ Start marker (green "S") and end marker (red "E")
- ✅ Optional distance markers along the route
- ✅ Distance and time display near end marker
- ✅ Customizable colors and styling
- ✅ Drop shadow effects for visual depth
- ✅ Animation completion callback

## Implementation Notes

1. **Coordinates**: Uses grid coordinates (x, y) - adds 0.5 to center in cells
2. **Animation**: Uses requestAnimationFrame for smooth 60fps animation
3. **SVG**: Renders as SVG elements (polyline, circles, text)
4. **Performance**: Optimized for paths up to 100+ points

## Next Steps for Integration

1. Create `LocationSelector.tsx` - UI for choosing start position
2. Create `MapViewer.tsx` - Display store layout with route
3. Integrate with product search results
4. Add turn-by-turn instructions component

## Made with Bob