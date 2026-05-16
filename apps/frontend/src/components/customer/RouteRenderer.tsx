"use client"

import { useEffect, useState } from "react"
import { Position } from "@/types/supermarket"

interface RouteRendererProps {
  /** Array of points forming the route path */
  path: Position[]
  /** Starting position (optional, defaults to first point in path) */
  start?: Position
  /** Ending position (optional, defaults to last point in path) */
  end?: Position
  /** Whether to animate the route drawing */
  animate?: boolean
  /** Animation duration in milliseconds */
  animationDuration?: number
  /** Route color */
  color?: string
  /** Route width */
  strokeWidth?: number
  /** Whether to show distance markers along the route */
  showMarkers?: boolean
  /** Distance in meters (for display) */
  distance?: number
  /** Estimated time in seconds (for display) */
  estimatedTime?: number
  /** Callback when animation completes */
  onAnimationComplete?: () => void
}

/**
 * RouteRenderer Component
 * 
 * Renders a navigation route on an SVG map with optional animation.
 * Designed to work with the pathfinding library output.
 * 
 * Features:
 * - Animated route drawing
 * - Start/End markers
 * - Distance and time display
 * - Customizable styling
 * - Smooth path rendering
 */
export function RouteRenderer({
  path,
  start,
  end,
  animate = true,
  animationDuration = 1500,
  color = "#3b82f6",
  strokeWidth = 0.25,
  showMarkers = true,
  distance,
  estimatedTime,
  onAnimationComplete,
}: RouteRendererProps) {
  const [animationProgress, setAnimationProgress] = useState(animate ? 0 : 1)

  // Determine start and end positions
  const startPos = start || (path.length > 0 ? path[0] : null)
  const endPos = end || (path.length > 1 ? path[path.length - 1] : null)

  // Animate route drawing
  useEffect(() => {
    if (!animate || path.length < 2) {
      setAnimationProgress(1)
      return
    }

    setAnimationProgress(0)
    const startTime = Date.now()

    const animationFrame = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / animationDuration, 1)
      
      setAnimationProgress(progress)

      if (progress < 1) {
        requestAnimationFrame(animationFrame)
      } else if (onAnimationComplete) {
        onAnimationComplete()
      }
    }

    requestAnimationFrame(animationFrame)
  }, [path, animate, animationDuration, onAnimationComplete])

  // Don't render if no path
  if (path.length < 2) {
    return null
  }

  // Calculate visible portion of path based on animation progress
  const totalSegments = path.length - 1
  const visibleSegments = Math.floor(totalSegments * animationProgress)
  const partialSegmentProgress = (totalSegments * animationProgress) % 1

  // Build the visible path
  const visiblePath = path.slice(0, visibleSegments + 1)
  
  // Add partial segment if animating
  if (visibleSegments < totalSegments && partialSegmentProgress > 0) {
    const lastPoint = path[visibleSegments]
    const nextPoint = path[visibleSegments + 1]
    const partialPoint = {
      x: lastPoint.x + (nextPoint.x - lastPoint.x) * partialSegmentProgress,
      y: lastPoint.y + (nextPoint.y - lastPoint.y) * partialSegmentProgress,
    }
    visiblePath.push(partialPoint)
  }

  // Convert path to polyline points (center of each grid cell)
  const polylinePoints = visiblePath
    .map((p) => `${p.x + 0.5},${p.y + 0.5}`)
    .join(" ")

  // Calculate path length for dash animation
  const pathLength = path.length * 1.5 // Approximate

  return (
    <g className="route-renderer">
      {/* Route path with animated drawing */}
      <polyline
        points={polylinePoints}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.9}
        style={{
          filter: "drop-shadow(0 0 2px rgba(0,0,0,0.2))",
        }}
      />

      {/* Animated dashed overlay for visual effect */}
      {animate && animationProgress < 1 && (
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="0.5 0.5"
          opacity={0.5}
          style={{
            animation: `dash 1s linear infinite`,
          }}
        />
      )}

      {/* Distance markers along the route */}
      {showMarkers && animationProgress === 1 && path.length > 4 && (
        <>
          {path
            .filter((_, index) => index % Math.ceil(path.length / 5) === 0 && index > 0 && index < path.length - 1)
            .map((point, index) => (
              <circle
                key={`marker-${index}`}
                cx={point.x + 0.5}
                cy={point.y + 0.5}
                r={0.15}
                fill={color}
                opacity={0.6}
              />
            ))}
        </>
      )}

      {/* Start marker (green circle with "S") */}
      {startPos && animationProgress > 0.1 && (
        <g className="start-marker">
          <circle
            cx={startPos.x + 0.5}
            cy={startPos.y + 0.5}
            r={0.6}
            fill="#10b981"
            stroke="#fff"
            strokeWidth={0.15}
            style={{
              filter: "drop-shadow(0 0 3px rgba(16, 185, 129, 0.5))",
            }}
          />
          <text
            x={startPos.x + 0.5}
            y={startPos.y + 0.5}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={0.5}
            fontWeight="bold"
            fill="#fff"
            pointerEvents="none"
          >
            S
          </text>
        </g>
      )}

      {/* End marker (red circle with "E") - only show when animation complete */}
      {endPos && animationProgress === 1 && (
        <g className="end-marker">
          <circle
            cx={endPos.x + 0.5}
            cy={endPos.y + 0.5}
            r={0.6}
            fill="#ef4444"
            stroke="#fff"
            strokeWidth={0.15}
            style={{
              filter: "drop-shadow(0 0 3px rgba(239, 68, 68, 0.5))",
            }}
          />
          <text
            x={endPos.x + 0.5}
            y={endPos.y + 0.5}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={0.5}
            fontWeight="bold"
            fill="#fff"
            pointerEvents="none"
          >
            E
          </text>
        </g>
      )}

      {/* Route info display (distance and time) */}
      {(distance !== undefined || estimatedTime !== undefined) && animationProgress === 1 && endPos && (
        <g className="route-info">
          <foreignObject
            x={endPos.x - 2}
            y={endPos.y - 2.5}
            width={4}
            height={1.5}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                border: `2px solid ${color}`,
                borderRadius: "0.3rem",
                padding: "0.2rem 0.4rem",
                fontSize: "0.35rem",
                fontWeight: "600",
                color: "#374151",
                textAlign: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {distance !== undefined && (
                <div>{distance.toFixed(1)}m</div>
              )}
              {estimatedTime !== undefined && (
                <div>{Math.ceil(estimatedTime)}s</div>
              )}
            </div>
          </foreignObject>
        </g>
      )}

      {/* CSS for dash animation */}
      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -1;
          }
        }
      `}</style>
    </g>
  )
}

/**
 * RouteStats Component
 * 
 * Displays route statistics in a card format (for use outside the SVG)
 */
interface RouteStatsProps {
  distance: number
  estimatedTime: number
  pathLength: number
}

export function RouteStats({ distance, estimatedTime, pathLength }: RouteStatsProps) {
  const minutes = Math.floor(estimatedTime / 60)
  const seconds = Math.ceil(estimatedTime % 60)

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
      <h3 className="text-lg font-semibold text-gray-800">Route Information</h3>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-600">{distance.toFixed(1)}</div>
          <div className="text-xs text-gray-600">meters</div>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-green-600">
            {minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}s`}
          </div>
          <div className="text-xs text-gray-600">walk time</div>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-purple-600">{pathLength}</div>
          <div className="text-xs text-gray-600">steps</div>
        </div>
      </div>
    </div>
  )
}

// Made with Bob