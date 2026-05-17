# LocationSelector Component Documentation

## Overview

The `LocationSelector` component allows users to select their current location in the supermarket. It provides a visual interface for choosing from predefined locations (entrance, aisles, zones, checkouts) or entering custom coordinates.

**Location**: `apps/frontend/src/components/customer/LocationSelector.tsx`

## Components

### LocationSelector

Main component for location selection with visual buttons and grouping.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `locations` | `LocationOption[]` | required | Available location options |
| `selectedLocation` | `LocationOption \| null` | required | Currently selected location |
| `onLocationSelect` | `(location: LocationOption) => void` | required | Callback when location selected |
| `title` | `string` | `"Where are you?"` | Component title |
| `description` | `string` | `"Select your current..."` | Component description |
| `compact` | `boolean` | `false` | Show as compact horizontal list |
| `allowCustom` | `boolean` | `false` | Enable custom coordinate input |
| `onCustomLocation` | `(position: Position) => void` | optional | Callback for custom location |
| `className` | `string` | optional | Custom CSS class |

#### Types

```typescript
export type LocationType = "entrance" | "aisle" | "zone" | "checkout" | "custom"

export interface LocationOption {
  id: string
  type: LocationType
  label: string
  description?: string
  position: Position
  icon?: string
}
```

## Usage

### Basic Usage

```tsx
import { LocationSelector, LocationOption } from "@/components/customer/LocationSelector"
import { useState } from "react"

const locations: LocationOption[] = [
  {
    id: "entrance",
    type: "entrance",
    label: "Entrance",
    position: { x: 30, y: 2 },
    icon: "🚪"
  },
  {
    id: "aisle_a",
    type: "aisle",
    label: "Aisle A",
    description: "Beverages",
    position: { x: 7, y: 15 },
    icon: "🛒"
  },
]

<LocationSelector
  locations={locations}
  selectedLocation={currentLocation}
  onLocationSelect={setCurrentLocation}
/>
```

### Compact Mode

```tsx
<LocationSelector
  locations={locations}
  selectedLocation={currentLocation}
  onLocationSelect={setCurrentLocation}
  compact={true}
  title="Current Location"
/>
```

### With Custom Location Input

```tsx
<LocationSelector
  locations={locations}
  selectedLocation={currentLocation}
  onLocationSelect={setCurrentLocation}
  allowCustom={true}
  onCustomLocation={(pos) => {
    console.log("Custom location:", pos)
  }}
/>
```

## Helper Function: generateLocationOptions

Automatically generates location options from a store layout JSON.

### Usage

```tsx
import { generateLocationOptions } from "@/components/customer/LocationSelector"

const layout = await fetch('/demo-layout.json').then(r => r.json())
const locations = generateLocationOptions(layout)
```

### What it generates:

- **Entrance**: From `entry_exit` array (type: "entrance")
- **Aisles**: From `aisles` array with labels (A, B, C, etc.)
- **Special Zones**: From `special_zones` (Produce, Deli, Bakery)
- **Checkouts**: From `checkouts` array (numbered 1, 2, 3, etc.)

## Features

- ✅ Visual location selection with icons
- ✅ Grouped by type (entrance, aisles, zones, checkouts)
- ✅ Compact and full card modes
- ✅ Custom coordinate input option
- ✅ Selected location display with position
- ✅ Responsive grid layout
- ✅ Emoji icons for visual identification
- ✅ Helper function to generate from layout JSON

## Location Icons

Default icons by type:
- 🚪 Entrance
- 🛒 Aisles
- 🏪 Special Zones
- 💳 Checkouts
- 📍 Custom

## Made with Bob