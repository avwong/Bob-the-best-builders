"use client"

import { useState } from "react"
import { Position } from "@/types/supermarket"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

/**
 * Location types available in the supermarket
 */
export type LocationType = "entrance" | "aisle" | "zone" | "checkout" | "custom"

/**
 * Predefined location option
 */
export interface LocationOption {
  id: string
  type: LocationType
  label: string
  description?: string
  position: Position
  icon?: string
}

/**
 * Props for LocationSelector component
 */
interface LocationSelectorProps {
  /** Available location options */
  locations: LocationOption[]
  /** Currently selected location */
  selectedLocation: LocationOption | null
  /** Callback when location is selected */
  onLocationSelect: (location: LocationOption) => void
  /** Optional title */
  title?: string
  /** Optional description */
  description?: string
  /** Show as compact grid */
  compact?: boolean
  /** Allow custom location input */
  allowCustom?: boolean
  /** Callback for custom location */
  onCustomLocation?: (position: Position) => void
  /** Custom CSS class */
  className?: string
}

/**
 * LocationSelector Component
 * 
 * Allows users to select their current location in the supermarket.
 * Supports predefined locations (entrance, aisles, zones, checkouts) and custom positions.
 */
export function LocationSelector({
  locations,
  selectedLocation,
  onLocationSelect,
  title = "Where are you?",
  description = "Select your current location to get directions",
  compact = false,
  allowCustom = false,
  onCustomLocation,
  className,
}: LocationSelectorProps) {
  const [customX, setCustomX] = useState("")
  const [customY, setCustomY] = useState("")

  // Group locations by type
  const groupedLocations = locations.reduce((acc, location) => {
    if (!acc[location.type]) {
      acc[location.type] = []
    }
    acc[location.type].push(location)
    return acc
  }, {} as Record<LocationType, LocationOption[]>)

  const handleCustomSubmit = () => {
    const x = parseInt(customX)
    const y = parseInt(customY)
    
    if (!isNaN(x) && !isNaN(y) && onCustomLocation) {
      onCustomLocation({ x, y })
      setCustomX("")
      setCustomY("")
    }
  }

  const getLocationIcon = (type: LocationType): string => {
    switch (type) {
      case "entrance":
        return "🚪"
      case "aisle":
        return "🛒"
      case "zone":
        return "🏪"
      case "checkout":
        return "💳"
      case "custom":
        return "📍"
      default:
        return "📍"
    }
  }

  const getTypeLabel = (type: LocationType): string => {
    switch (type) {
      case "entrance":
        return "Entrance"
      case "aisle":
        return "Aisles"
      case "zone":
        return "Special Zones"
      case "checkout":
        return "Checkouts"
      case "custom":
        return "Custom"
      default:
        return "Locations"
    }
  }

  if (compact) {
    return (
      <div className={cn("space-y-2", className)}>
        <label className="text-sm font-medium text-gray-700">{title}</label>
        <div className="flex flex-wrap gap-2">
          {locations.map((location) => (
            <Button
              key={location.id}
              variant={selectedLocation?.id === location.id ? "default" : "outline"}
              size="sm"
              onClick={() => onLocationSelect(location)}
              className="flex items-center gap-1"
            >
              <span>{location.icon || getLocationIcon(location.type)}</span>
              <span>{location.label}</span>
            </Button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location groups */}
        {Object.entries(groupedLocations).map(([type, locs]) => (
          <div key={type} className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span>{getLocationIcon(type as LocationType)}</span>
              <span>{getTypeLabel(type as LocationType)}</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {locs.map((location) => (
                <Button
                  key={location.id}
                  variant={selectedLocation?.id === location.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => onLocationSelect(location)}
                  className={cn(
                    "flex flex-col items-center justify-center h-auto py-3 px-2",
                    selectedLocation?.id === location.id && "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  <span className="text-2xl mb-1">
                    {location.icon || getLocationIcon(location.type)}
                  </span>
                  <span className="text-xs font-medium">{location.label}</span>
                  {location.description && (
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      {location.description}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        ))}

        {/* Custom location input */}
        {allowCustom && (
          <div className="space-y-2 pt-4 border-t">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span>📍</span>
              <span>Custom Location</span>
            </h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="X"
                value={customX}
                onChange={(e) => setCustomX(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="number"
                placeholder="Y"
                value={customY}
                onChange={(e) => setCustomY(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                size="sm"
                onClick={handleCustomSubmit}
                disabled={!customX || !customY}
              >
                Set
              </Button>
            </div>
          </div>
        )}

        {/* Selected location display */}
        {selectedLocation && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {selectedLocation.icon || getLocationIcon(selectedLocation.type)}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900">
                  Current Location: {selectedLocation.label}
                </p>
                <p className="text-xs text-blue-700">
                  Position: ({selectedLocation.position.x}, {selectedLocation.position.y})
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Helper function to generate location options from store layout
 */
export function generateLocationOptions(layout: {
  aisles?: Array<{ id: string; label: string; position: Position; category?: string }>
  special_zones?: Array<{ id: string; label: string; position: Position; category?: string }>
  checkouts?: Array<{ id: string; position: Position }>
  entry_exit?: Array<{ id: string; type: string; position: Position }>
}): LocationOption[] {
  const locations: LocationOption[] = []

  // Add entrance
  if (layout.entry_exit) {
    layout.entry_exit
      .filter((e) => e.type === "entrance")
      .forEach((entrance) => {
        locations.push({
          id: entrance.id,
          type: "entrance",
          label: "Entrance",
          description: "Main entrance",
          position: entrance.position,
          icon: "🚪",
        })
      })
  }

  // Add aisles
  if (layout.aisles) {
    layout.aisles.forEach((aisle) => {
      locations.push({
        id: aisle.id,
        type: "aisle",
        label: `Aisle ${aisle.label}`,
        description: aisle.category,
        position: {
          x: aisle.position.x + 2, // Center of aisle
          y: aisle.position.y + 7,
        },
        icon: "🛒",
      })
    })
  }

  // Add special zones
  if (layout.special_zones) {
    layout.special_zones.forEach((zone) => {
      locations.push({
        id: zone.id,
        type: "zone",
        label: zone.label,
        description: zone.category,
        position: {
          x: zone.position.x + 4, // Center of zone
          y: zone.position.y + 3,
        },
        icon: zone.label === "Produce" ? "🥬" : zone.label === "Deli" ? "🥩" : "🍞",
      })
    })
  }

  // Add checkouts
  if (layout.checkouts) {
    layout.checkouts.forEach((checkout, index) => {
      locations.push({
        id: checkout.id,
        type: "checkout",
        label: `Checkout ${index + 1}`,
        position: {
          x: checkout.position.x + 1,
          y: checkout.position.y + 1,
        },
        icon: "💳",
      })
    })
  }

  return locations
}

// Made with Bob