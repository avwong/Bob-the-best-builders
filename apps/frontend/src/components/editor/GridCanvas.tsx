"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { Shelf, Freezer, SpecialZone, Checkout, EntryExit, Wall, Position, EditorState } from "@/types/supermarket"
import { ColorSettings } from "@/types/settings"

interface GridCanvasProps {
    storeWidth: number
    storeHeight: number
    gridSize: number
    showGrid: boolean
    snapToGrid: boolean
    shelves: Shelf[]
    freezers: Freezer[]
    specialZones: SpecialZone[]
    checkouts: Checkout[]
    entryExit: EntryExit[]
    walls: Wall[]
    selectedElement: string | null
    selectedTool: EditorState["selectedTool"]
    onSelectElement: (id: string | null) => void
    onUpdateElement: (id: string, position: Position) => void
    onPlaceElement: (tool: EditorState["selectedTool"], position: Position) => void
    zoom: number
    onZoomChange: (zoom: number) => void
    // Navigate mode
    mode?: "edit" | "navigate"
    routePath?: Position[]
    routeStart?: Position | null
    routeEnd?: Position | null
    onNavigateClick?: (pos: Position) => void
    // Custom colors
    colors?: ColorSettings
}

export function GridCanvas({
    storeWidth,
    storeHeight,
    gridSize,
    showGrid,
    snapToGrid,
    shelves,
    freezers,
    specialZones,
    checkouts,
    entryExit,
    walls,
    selectedElement,
    selectedTool,
    onSelectElement,
    onUpdateElement,
    onPlaceElement,
    zoom,
    onZoomChange,
    mode = "edit",
    routePath = [],
    routeStart = null,
    routeEnd = null,
    onNavigateClick,
    colors,
}: GridCanvasProps) {
    const svgRef = useRef<SVGSVGElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [draggedElement, setDraggedElement] = useState<string | null>(null)
    const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })

    // Pan state stored in SVG coordinate space
    const [isPanning, setIsPanning] = useState(false)
    const [panStart, setPanStart] = useState<Position>({ x: 0, y: 0 })
    const [viewOrigin, setViewOrigin] = useState<Position>({ x: -2, y: -2 })

    // Padding around the store area
    const padding = 2

    // Compute viewBox from zoom and pan
    const viewWidth = (storeWidth + padding * 2) / zoom
    const viewHeight = (storeHeight + padding * 2) / zoom
    const viewBox = `${viewOrigin.x} ${viewOrigin.y} ${viewWidth} ${viewHeight}`

    const snapPosition = useCallback(
        (pos: Position): Position => {
            if (!snapToGrid) return pos
            return {
                x: Math.round(pos.x / gridSize) * gridSize,
                y: Math.round(pos.y / gridSize) * gridSize,
            }
        },
        [snapToGrid, gridSize]
    )

    // Convert screen coordinates to SVG coordinates
    const getSVGPoint = useCallback((e: React.MouseEvent | MouseEvent): Position => {
        if (!svgRef.current) return { x: 0, y: 0 }
        const svg = svgRef.current
        const pt = svg.createSVGPoint()
        pt.x = e.clientX
        pt.y = e.clientY
        const ctm = svg.getScreenCTM()
        if (!ctm) return { x: 0, y: 0 }
        const svgP = pt.matrixTransform(ctm.inverse())
        return { x: svgP.x, y: svgP.y }
    }, [])

    // Mouse wheel zoom towards cursor position
    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        const newZoom = Math.max(0.3, Math.min(5, zoom + delta))

        // Zoom toward mouse position
        if (svgRef.current) {
            const mousePos = getSVGPoint(e as any)
            const zoomRatio = newZoom / zoom
            setViewOrigin(prev => ({
                x: mousePos.x - (mousePos.x - prev.x) / zoomRatio,
                y: mousePos.y - (mousePos.y - prev.y) / zoomRatio,
            }))
        }

        onZoomChange(newZoom)
    }, [zoom, onZoomChange, getSVGPoint])

    // Attach wheel listener with { passive: false } to allow preventDefault
    useEffect(() => {
        const svgEl = svgRef.current
        if (!svgEl) return
        svgEl.addEventListener("wheel", handleWheel, { passive: false })
        return () => svgEl.removeEventListener("wheel", handleWheel)
    }, [handleWheel])

    const handleMouseDown = (e: React.MouseEvent, elementId?: string) => {
        if (mode === "navigate") {
            // In navigate mode all element clicks are treated as canvas clicks
            e.stopPropagation()
            const svgPoint = getSVGPoint(e)
            onNavigateClick?.(svgPoint)
            return
        }

        if (elementId && selectedTool === "select") {
            // Start dragging an element
            e.stopPropagation()

            const allElements = [...shelves, ...freezers, ...specialZones, ...checkouts, ...entryExit, ...walls]
            const element = allElements.find((el) => el.id === elementId)
            if (!element) return

            const svgPoint = getSVGPoint(e)
            setDragOffset({
                x: svgPoint.x - element.position.x,
                y: svgPoint.y - element.position.y,
            })
            setDraggedElement(elementId)
            setIsDragging(true)
            onSelectElement(elementId)
        } else if (e.button === 0 && selectedTool === "select") {
            // Start panning
            const svgPoint = getSVGPoint(e)
            setIsPanning(true)
            setPanStart(svgPoint)
        }
    }

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (mode === "navigate") {
            const svgPoint = getSVGPoint(e)
            onNavigateClick?.(svgPoint)
            return
        }
        if (selectedTool !== "select" && !isDragging && !isPanning) {
            const svgPoint = getSVGPoint(e)
            const snappedPosition = snapPosition(svgPoint)
            onPlaceElement(selectedTool, snappedPosition)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "copy"
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const tool = e.dataTransfer.getData("tool")
        if (tool && tool !== "select") {
            const svgPoint = getSVGPoint(e as any)
            const snappedPosition = snapPosition(svgPoint)
            onPlaceElement(tool as EditorState["selectedTool"], snappedPosition)
        }
    }

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (isDragging && draggedElement) {
                const svgPoint = getSVGPoint(e as any)
                const newPosition = {
                    x: svgPoint.x - dragOffset.x,
                    y: svgPoint.y - dragOffset.y,
                }
                const snappedPosition = snapPosition(newPosition)
                onUpdateElement(draggedElement, snappedPosition)
            } else if (isPanning) {
                const currentPoint = getSVGPoint(e as any)
                const dx = currentPoint.x - panStart.x
                const dy = currentPoint.y - panStart.y
                setViewOrigin(prev => ({
                    x: prev.x - dx,
                    y: prev.y - dy,
                }))
            }
        },
        [isDragging, draggedElement, isPanning, dragOffset, panStart, getSVGPoint, snapPosition, onUpdateElement]
    )

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
        setDraggedElement(null)
        setIsPanning(false)
    }, [])

    // Global mouse events so dragging works even outside SVG
    useEffect(() => {
        if (isDragging || isPanning) {
            window.addEventListener("mousemove", handleMouseMove)
            window.addEventListener("mouseup", handleMouseUp)
            return () => {
                window.removeEventListener("mousemove", handleMouseMove)
                window.removeEventListener("mouseup", handleMouseUp)
            }
        }
    }, [isDragging, isPanning, handleMouseMove, handleMouseUp])

    const brandColor = colors?.brandColor || "#10b981"
    const mapFloor = colors?.mapFloor || "#f8fafc"

    const renderPath = () => {
        if (routePath.length < 2 && !routeStart && !routeEnd) return null

        const polylinePoints = routePath
            .map((p) => `${p.x + 0.5},${p.y + 0.5}`)
            .join(" ")

        return (
            <g>
                {/* Path line */}
                {routePath.length >= 2 && (
                    <polyline
                        points={polylinePoints}
                        fill="none"
                        stroke={brandColor}
                        strokeWidth={0.25}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="0.5 0.25"
                        opacity={0.85}
                    />
                )}

                {/* Start marker (green) */}
                {routeStart && (
                    <g>
                        <circle
                            cx={routeStart.x + 0.5}
                            cy={routeStart.y + 0.5}
                            r={0.55}
                            fill="#10b981"
                            stroke={mapFloor}
                            strokeWidth={0.12}
                        />
                        <text
                            x={routeStart.x + 0.5}
                            y={routeStart.y + 0.5}
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

                {/* End marker (red) */}
                {routeEnd && (
                    <g>
                        <circle
                            cx={routeEnd.x + 0.5}
                            cy={routeEnd.y + 0.5}
                            r={0.55}
                            fill="#ef4444"
                            stroke={mapFloor}
                            strokeWidth={0.12}
                        />
                        <text
                            x={routeEnd.x + 0.5}
                            y={routeEnd.y + 0.5}
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
            </g>
        )
    }

    const renderGrid = () => {
        if (!showGrid) return null

        const lines = []

        // Vertical lines
        for (let x = 0; x <= storeWidth; x += gridSize) {
            const isMajor = x % (gridSize * 5) === 0
            lines.push(
                <line
                    key={`v-${x}`}
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={storeHeight}
                    stroke="#cbd5e1"
                    strokeWidth={isMajor ? 0.08 : 0.04}
                    opacity={isMajor ? 0.7 : 0.35}
                />
            )
        }

        // Horizontal lines
        for (let y = 0; y <= storeHeight; y += gridSize) {
            const isMajor = y % (gridSize * 5) === 0
            lines.push(
                <line
                    key={`h-${y}`}
                    x1={0}
                    y1={y}
                    x2={storeWidth}
                    y2={y}
                    stroke="#cbd5e1"
                    strokeWidth={isMajor ? 0.08 : 0.04}
                    opacity={isMajor ? 0.7 : 0.35}
                />
            )
        }

        return lines
    }

    const renderShelf = (shelf: Shelf) => {
        const isSelected = selectedElement === shelf.id

        return (
            <g
                key={shelf.id}
                onMouseDown={(e) => handleMouseDown(e, shelf.id)}
                style={{ cursor: selectedTool === "select" ? "move" : "default" }}
            >
                <rect
                    x={shelf.position.x}
                    y={shelf.position.y}
                    width={shelf.dimensions.width}
                    height={shelf.dimensions.height}
                    fill={isSelected ? "#fef3c7" : "#8b5e3c"}
                    stroke={isSelected ? brandColor : "#6b4226"}
                    strokeWidth={isSelected ? 0.15 : 0.08}
                    rx={0.1}
                />
                <text
                    x={shelf.position.x + shelf.dimensions.width / 2}
                    y={shelf.position.y + shelf.dimensions.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={Math.min(shelf.dimensions.width, shelf.dimensions.height) * 0.4}
                    fontWeight="bold"
                    fill={isSelected ? "#374151" : "#fff"}
                    pointerEvents="none"
                >
                    {shelf.label}
                </text>
            </g>
        )
    }

    const renderFreezer = (freezer: Freezer) => {
        const isSelected = selectedElement === freezer.id

        return (
            <g
                key={freezer.id}
                onMouseDown={(e) => handleMouseDown(e, freezer.id)}
                style={{ cursor: selectedTool === "select" ? "move" : "default" }}
            >
                <rect
                    x={freezer.position.x}
                    y={freezer.position.y}
                    width={freezer.dimensions.width}
                    height={freezer.dimensions.height}
                    fill={isSelected ? "#dbeafe" : "#0ea5e9"}
                    stroke={isSelected ? brandColor : "#0369a1"}
                    strokeWidth={isSelected ? 0.15 : 0.08}
                    rx={0.15}
                />
                <line
                    x1={freezer.position.x + freezer.dimensions.width * 0.2}
                    y1={freezer.position.y + freezer.dimensions.height * 0.3}
                    x2={freezer.position.x + freezer.dimensions.width * 0.8}
                    y2={freezer.position.y + freezer.dimensions.height * 0.3}
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth={0.06}
                />
                <line
                    x1={freezer.position.x + freezer.dimensions.width * 0.2}
                    y1={freezer.position.y + freezer.dimensions.height * 0.7}
                    x2={freezer.position.x + freezer.dimensions.width * 0.8}
                    y2={freezer.position.y + freezer.dimensions.height * 0.7}
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth={0.06}
                />
                <text
                    x={freezer.position.x + freezer.dimensions.width / 2}
                    y={freezer.position.y + freezer.dimensions.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={Math.min(freezer.dimensions.width, freezer.dimensions.height) * 0.35}
                    fontWeight="bold"
                    fill={isSelected ? "#374151" : "#fff"}
                    pointerEvents="none"
                >
                    {freezer.label}
                </text>
            </g>
        )
    }

    const renderSpecialZone = (zone: SpecialZone) => {
        const isSelected = selectedElement === zone.id

        const zoneColors: Record<string, { fill: string; stroke: string }> = {
            produce_section: { fill: "#d1fae5", stroke: "#10b981" },
            deli_section: { fill: "#fef3c7", stroke: "#f59e0b" },
            bakery_section: { fill: "#fce7f3", stroke: "#ec4899" },
            pharmacy_section: { fill: "#dbeafe", stroke: "#3b82f6" },
        }
        const zoneColor = zoneColors[zone.type] || { fill: "#f3f4f6", stroke: "#9ca3af" }

        return (
            <g
                key={zone.id}
                onMouseDown={(e) => handleMouseDown(e, zone.id)}
                style={{ cursor: selectedTool === "select" ? "move" : "default" }}
            >
                <rect
                    x={zone.position.x}
                    y={zone.position.y}
                    width={zone.dimensions.width}
                    height={zone.dimensions.height}
                    fill={isSelected ? "#dbeafe" : zoneColor.fill}
                    stroke={isSelected ? brandColor : zoneColor.stroke}
                    strokeWidth={isSelected ? 0.15 : 0.08}
                    rx={0.15}
                    strokeDasharray={isSelected ? "none" : "0.3 0.15"}
                />
                <text
                    x={zone.position.x + zone.dimensions.width / 2}
                    y={zone.position.y + zone.dimensions.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={Math.min(zone.dimensions.width, zone.dimensions.height) * 0.25}
                    fontWeight="600"
                    fill="#374151"
                    pointerEvents="none"
                >
                    {zone.label}
                </text>
            </g>
        )
    }

    const renderCheckout = (checkout: Checkout) => {
        const isSelected = selectedElement === checkout.id

        return (
            <g
                key={checkout.id}
                onMouseDown={(e) => handleMouseDown(e, checkout.id)}
                style={{ cursor: selectedTool === "select" ? "move" : "default" }}
            >
                <rect
                    x={checkout.position.x}
                    y={checkout.position.y}
                    width={checkout.dimensions.width}
                    height={checkout.dimensions.height}
                    fill={isSelected ? "#dbeafe" : "#bfdbfe"}
                    stroke={isSelected ? brandColor : "#60a5fa"}
                    strokeWidth={isSelected ? 0.15 : 0.08}
                    rx={0.1}
                />
                <text
                    x={checkout.position.x + checkout.dimensions.width / 2}
                    y={checkout.position.y + checkout.dimensions.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={Math.min(checkout.dimensions.width, checkout.dimensions.height) * 0.5}
                    fontWeight="600"
                    fill="#374151"
                    pointerEvents="none"
                >
                    $
                </text>
            </g>
        )
    }

    const renderEntryExit = (point: EntryExit) => {
        const isSelected = selectedElement === point.id
        const color = point.type === "entrance" ? "#d1fae5" : "#fecaca"
        const strokeColor = point.type === "entrance" ? "#10b981" : "#ef4444"

        return (
            <g
                key={point.id}
                onMouseDown={(e) => handleMouseDown(e, point.id)}
                style={{ cursor: selectedTool === "select" ? "move" : "default" }}
            >
                <rect
                    x={point.position.x}
                    y={point.position.y}
                    width={point.dimensions.width}
                    height={point.dimensions.height}
                    fill={color}
                    stroke={isSelected ? brandColor : strokeColor}
                    strokeWidth={isSelected ? 0.15 : 0.08}
                    rx={0.1}
                />
                <text
                    x={point.position.x + point.dimensions.width / 2}
                    y={point.position.y + point.dimensions.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={Math.min(point.dimensions.width, point.dimensions.height) * 0.5}
                    fontWeight="600"
                    fill="#374151"
                    pointerEvents="none"
                >
                    {point.type === "entrance" ? "IN" : "OUT"}
                </text>
            </g>
        )
    }

    const renderWall = (wall: Wall) => {
        const isSelected = selectedElement === wall.id

        return (
            <g
                key={wall.id}
                onMouseDown={(e) => handleMouseDown(e, wall.id)}
                style={{ cursor: selectedTool === "select" ? "move" : "default" }}
            >
                <rect
                    x={wall.position.x}
                    y={wall.position.y}
                    width={wall.dimensions.width}
                    height={wall.dimensions.height}
                    fill={isSelected ? "#dbeafe" : "#6b7280"}
                    stroke={isSelected ? brandColor : "#374151"}
                    strokeWidth={isSelected ? 0.15 : 0.1}
                    rx={0.05}
                />
            </g>
        )
    }

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
                cursor: mode === "navigate"
                    ? "crosshair"
                    : isPanning
                        ? "grabbing"
                        : selectedTool !== "select"
                            ? "crosshair"
                            : "default",
            }}
        >
            <svg
                ref={svgRef}
                width="100%"
                height="100%"
                className="block"
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                onMouseDown={(e) => {
                    if (mode === "navigate") {
                        const svgPoint = getSVGPoint(e)
                        onNavigateClick?.(svgPoint)
                        return
                    }
                    const target = e.target as SVGElement
                    // If clicking on background or SVG itself
                    if (target === e.currentTarget || target.getAttribute("data-bg") === "true") {
                        if (selectedTool === "select") {
                            onSelectElement(null)
                            handleMouseDown(e)
                        } else {
                            handleCanvasClick(e)
                        }
                    }
                }}
                style={{
                    cursor: mode === "navigate"
                        ? "crosshair"
                        : isPanning
                            ? "grabbing"
                            : selectedTool !== "select"
                                ? "crosshair"
                                : "default",
                }}
            >
                {/* Full background, clickable for deselect/place */}
                <rect
                    data-bg="true"
                    x={viewOrigin.x - 100}
                    y={viewOrigin.y - 100}
                    width={viewWidth + 200}
                    height={viewHeight + 200}
                    fill="#f1f5f9"
                />

                {/* Store boundary */}
                <rect
                    data-bg="true"
                    x={0}
                    y={0}
                    width={storeWidth}
                    height={storeHeight}
                    fill={mapFloor}
                    stroke="#94a3b8"
                    strokeWidth={0.1}
                />

                {/* Grid */}
                {renderGrid()}

                {/* Store elements with pointer events disabled in navigate mode */}
                {/* Layer order: First = Behind, Last = Front */}
                <g style={{ pointerEvents: mode === "navigate" ? "none" : "auto" }}>
                    {/* Layer 1: Background elements (special zones always behind) */}
                    {specialZones.map(renderSpecialZone)}

                    {/* Layer 2: Walls */}
                    {walls.map(renderWall)}

                    {/* Layer 3: Main fixtures (shelves, freezers, checkouts, entry/exit) */}
                    {shelves.map(renderShelf)}
                    {freezers.map(renderFreezer)}
                    {checkouts.map(renderCheckout)}
                    {entryExit.map(renderEntryExit)}
                </g>

                {/* Pathfinding overlay */}
                {renderPath()}
            </svg>

            {/* Instructions overlay */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-xs text-gray-600">
                <p><strong>Scroll:</strong> Zoom</p>
                {mode === "navigate" ? (
                    <p><strong>Click map:</strong> Set destination</p>
                ) : selectedTool === "select" ? (
                    <>
                        <p><strong>Click + Drag bg:</strong> Pan canvas</p>
                        <p><strong>Click element:</strong> Select & drag</p>
                    </>
                ) : (
                    <p><strong>Click canvas:</strong> Place {selectedTool}</p>
                )}
            </div>
        </div>
    )
}

// Made with Bob
