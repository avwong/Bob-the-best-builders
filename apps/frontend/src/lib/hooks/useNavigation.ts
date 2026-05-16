"use client"

import { useState, useCallback, useEffect } from "react"
import { Position, PathResult, Grid } from "@/lib/types"
import { findPathEnhanced } from "@/lib/pathfinding"
import type { LocationOption } from "@/components/customer/LocationSelector"

/**
 * Navigation state enum
 */
export enum NavigationState {
  IDLE = "idle",
  SELECTING_START = "selecting_start",
  SELECTING_DESTINATION = "selecting_destination",
  CALCULATING = "calculating",
  NAVIGATING = "navigating",
  ARRIVED = "arrived",
  ERROR = "error",
}

/**
 * Navigation context interface
 */
export interface NavigationContext {
  // Current state
  state: NavigationState
  
  // Locations
  currentLocation: LocationOption | null
  destination: Position | null
  destinationLabel?: string
  
  // Route information
  route: PathResult | null
  estimatedTime: number
  
  // Error handling
  error: string | null
  
  // Actions
  setCurrentLocation: (location: LocationOption) => void
  setDestination: (position: Position, label?: string) => void
  calculateRoute: (grid: Grid) => void
  clearRoute: () => void
  reset: () => void
  
  // State checks
  isNavigating: boolean
  hasRoute: boolean
  canNavigate: boolean
}

/**
 * useNavigation Hook
 * 
 * Manages navigation state for the customer app.
 * Handles location selection, route calculation, and navigation flow.
 * 
 * @param options - Configuration options
 * @returns Navigation context with state and actions
 */
export function useNavigation(options?: {
  autoCalculate?: boolean
  onRouteCalculated?: (route: PathResult) => void
  onError?: (error: string) => void
}): NavigationContext {
  const { autoCalculate = true, onRouteCalculated, onError } = options || {}

  // State
  const [state, setState] = useState<NavigationState>(NavigationState.IDLE)
  const [currentLocation, setCurrentLocationState] = useState<LocationOption | null>(null)
  const [destination, setDestinationState] = useState<Position | null>(null)
  const [destinationLabel, setDestinationLabel] = useState<string | undefined>()
  const [route, setRoute] = useState<PathResult | null>(null)
  const [estimatedTime, setEstimatedTime] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [grid, setGrid] = useState<Grid | null>(null)

  // Derived state
  const isNavigating = state === NavigationState.NAVIGATING
  const hasRoute = route !== null && route.found
  const canNavigate = currentLocation !== null && destination !== null

  /**
   * Set current location
   */
  const setCurrentLocation = useCallback((location: LocationOption) => {
    setCurrentLocationState(location)
    setError(null)
    
    if (state === NavigationState.IDLE) {
      setState(NavigationState.SELECTING_DESTINATION)
    }
  }, [state])

  /**
   * Set destination
   */
  const setDestination = useCallback((position: Position, label?: string) => {
    setDestinationState(position)
    setDestinationLabel(label)
    setError(null)
    
    if (currentLocation) {
      setState(NavigationState.SELECTING_DESTINATION)
    }
  }, [currentLocation])

  /**
   * Calculate route
   */
  const calculateRoute = useCallback((walkabilityGrid: Grid) => {
    if (!currentLocation || !destination) {
      setError("Please select both start and destination")
      setState(NavigationState.ERROR)
      onError?.("Missing location or destination")
      return
    }

    setState(NavigationState.CALCULATING)
    setError(null)
    setGrid(walkabilityGrid)

    try {
      // Calculate path using pathfinding algorithm
      const result = findPathEnhanced(
        walkabilityGrid,
        currentLocation.position,
        destination,
        {
          smoothPath: true,
          simplifyPath: true,
          includeTime: true,
        }
      )

      if (result.found) {
        setRoute(result)
        setEstimatedTime(result.estimatedTime || 0)
        setState(NavigationState.NAVIGATING)
        onRouteCalculated?.(result)
      } else {
        setError("No path found to destination")
        setState(NavigationState.ERROR)
        onError?.("No path found")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to calculate route"
      setError(errorMessage)
      setState(NavigationState.ERROR)
      onError?.(errorMessage)
    }
  }, [currentLocation, destination, onRouteCalculated, onError])

  /**
   * Clear current route
   */
  const clearRoute = useCallback(() => {
    setRoute(null)
    setEstimatedTime(0)
    setDestinationState(null)
    setDestinationLabel(undefined)
    setState(currentLocation ? NavigationState.SELECTING_DESTINATION : NavigationState.IDLE)
  }, [currentLocation])

  /**
   * Reset all navigation state
   */
  const reset = useCallback(() => {
    setCurrentLocationState(null)
    setDestinationState(null)
    setDestinationLabel(undefined)
    setRoute(null)
    setEstimatedTime(0)
    setError(null)
    setGrid(null)
    setState(NavigationState.IDLE)
  }, [])

  /**
   * Auto-calculate route when both locations are set
   */
  useEffect(() => {
    if (
      autoCalculate &&
      currentLocation &&
      destination &&
      grid &&
      state === NavigationState.SELECTING_DESTINATION
    ) {
      calculateRoute(grid)
    }
  }, [autoCalculate, currentLocation, destination, grid, state, calculateRoute])

  return {
    // State
    state,
    currentLocation,
    destination,
    destinationLabel,
    route,
    estimatedTime,
    error,
    
    // Actions
    setCurrentLocation,
    setDestination,
    calculateRoute,
    clearRoute,
    reset,
    
    // Derived state
    isNavigating,
    hasRoute,
    canNavigate,
  }
}

/**
 * Navigation step for turn-by-turn instructions
 */
export interface NavigationStep {
  instruction: string
  distance: number
  direction?: string
  position: Position
}

/**
 * Generate turn-by-turn instructions from path
 */
export function generateInstructions(path: Position[]): NavigationStep[] {
  if (path.length < 2) return []

  const steps: NavigationStep[] = []
  let currentDirection: string | null = null

  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i]
    const next = path[i + 1]
    
    // Calculate direction
    const dx = next.x - current.x
    const dy = next.y - current.y
    
    let direction: string
    if (dx > 0) direction = "east"
    else if (dx < 0) direction = "west"
    else if (dy > 0) direction = "south"
    else direction = "north"

    // Check if direction changed
    if (direction !== currentDirection) {
      const instruction = getDirectionInstruction(direction, currentDirection)
      steps.push({
        instruction,
        distance: 1,
        direction,
        position: current,
      })
      currentDirection = direction
    }
  }

  // Add final step
  steps.push({
    instruction: "You have arrived at your destination",
    distance: 0,
    position: path[path.length - 1],
  })

  return steps
}

/**
 * Get human-readable direction instruction
 */
function getDirectionInstruction(newDirection: string, oldDirection: string | null): string {
  if (!oldDirection) {
    return `Head ${newDirection}`
  }

  const turns: Record<string, Record<string, string>> = {
    north: {
      east: "Turn right",
      west: "Turn left",
      south: "Turn around",
    },
    south: {
      east: "Turn left",
      west: "Turn right",
      north: "Turn around",
    },
    east: {
      north: "Turn left",
      south: "Turn right",
      west: "Turn around",
    },
    west: {
      north: "Turn right",
      south: "Turn left",
      east: "Turn around",
    },
  }

  return turns[oldDirection]?.[newDirection] || `Head ${newDirection}`
}

// Made with Bob