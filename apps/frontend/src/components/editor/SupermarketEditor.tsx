"use client"

import { useState } from "react"
import { GridCanvas } from "./GridCanvas"
import { EditorControls } from "./EditorControls"
import { PropertiesPanel } from "./PropertiesPanel"
import {
    StoreLayout,
    Shelf,
    SpecialZone,
    Checkout,
    EntryExit,
    Wall,
    EditorState,
    Position,
} from "@/types/supermarket"
import { createGridFromLayout, findPathEnhanced } from "@/lib/pathfinding"
import { formatTime } from "@/lib/utils"
import type { PathResult } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface SupermarketEditorProps {
    initialLayout?: StoreLayout
}

// BFS-like search for nearest walkable cell around a blocked target
function findNearestWalkable(
    grid: boolean[][],
    pos: Position,
    width: number,
    height: number
): Position | null {
    for (let r = 1; r <= 5; r++) {
        for (let dy = -r; dy <= r; dy++) {
            for (let dx = -r; dx <= r; dx++) {
                if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue
                const nx = pos.x + dx
                const ny = pos.y + dy
                if (nx >= 0 && nx < width && ny >= 0 && ny < height && grid[ny]?.[nx]) {
                    return { x: nx, y: ny }
                }
            }
        }
    }
    return null
}

export function SupermarketEditor({ initialLayout }: SupermarketEditorProps) {
    const [layout, setLayout] = useState<StoreLayout>(
        initialLayout || {
            store_id: "new_store",
            store_name: "New Supermarket",
            version: "1.0",
            dimensions: { width: 60, height: 40, unit: "meters" },
            grid: { cell_size: 1, walkable_paths: [] },
            shelves: [],
            special_zones: [],
            checkouts: [],
            entry_exit: [],
            walls: [],
        }
    )

    const [editorState, setEditorState] = useState<EditorState>({
        selectedTool: "select",
        selectedElement: null,
        gridSize: 1,
        snapToGrid: true,
        showGrid: true,
        zoom: 1,
    })

    // ── Navigate mode ────────────────────────────────────────────────────────
    const [mode, setMode] = useState<"edit" | "navigate">("edit")
    const [routeStart, setRouteStart] = useState<Position | null>(null)
    const [routeEnd, setRouteEnd] = useState<Position | null>(null)
    const [routeResult, setRouteResult] = useState<
        (PathResult & { estimatedTime?: number }) | null
    >(null)

    const getEntranceCenter = (l: StoreLayout): Position | null => {
        const entrance = l.entry_exit.find((e) => e.type === "entrance")
        if (!entrance) return null
        return {
            x: Math.floor(entrance.position.x + entrance.dimensions.width / 2),
            y: Math.floor(entrance.position.y + entrance.dimensions.height / 2),
        }
    }

    const handleToggleMode = () => {
        if (mode === "edit") {
            setMode("navigate")
            setRouteStart(getEntranceCenter(layout))
            setRouteEnd(null)
            setRouteResult(null)
        } else {
            setMode("edit")
            setRouteStart(null)
            setRouteEnd(null)
            setRouteResult(null)
        }
    }

    const handleNavigateClick = (position: Position) => {
        const grid = createGridFromLayout(layout)
        const { width, height } = layout.dimensions
        const gridX = Math.max(0, Math.min(width - 1, Math.floor(position.x)))
        const gridY = Math.max(0, Math.min(height - 1, Math.floor(position.y)))

        // No start yet — first click sets it
        if (!routeStart) {
            if (grid[gridY]?.[gridX]) {
                setRouteStart({ x: gridX, y: gridY })
            }
            return
        }

        // Start is set — compute route to clicked cell
        let end = { x: gridX, y: gridY }
        if (!grid[end.y]?.[end.x]) {
            const nearby = findNearestWalkable(grid, end, width, height)
            if (!nearby) return
            end = nearby
        }

        const result = findPathEnhanced(grid, routeStart, end, {
            simplifyPath: true,
            includeTime: true,
        })
        setRouteEnd(end)
        setRouteResult(result)
    }

    const handleResetRoute = () => {
        setRouteStart(getEntranceCenter(layout))
        setRouteEnd(null)
        setRouteResult(null)
    }

    // ── Editor handlers ──────────────────────────────────────────────────────
    const updateEditorState = (updates: Partial<EditorState>) => {
        setEditorState((prev) => ({ ...prev, ...updates }))
    }

    const handleSelectElement = (id: string | null) => {
        setEditorState((prev) => ({ ...prev, selectedElement: id }))
    }

    const handleUpdateElementPosition = (id: string, position: Position) => {
        setLayout((prev) => {
            const updatePosition = (items: any[]) =>
                items.map((item) => (item.id === id ? { ...item, position } : item))

            return {
                ...prev,
                shelves: updatePosition(prev.shelves),
                special_zones: updatePosition(prev.special_zones),
                checkouts: updatePosition(prev.checkouts),
                entry_exit: updatePosition(prev.entry_exit),
                walls: updatePosition(prev.walls),
            }
        })
    }

    const handleUpdateElement = (updates: any) => {
        if (!editorState.selectedElement) return

        setLayout((prev) => {
            const updateItem = (items: any[]) =>
                items.map((item) =>
                    item.id === editorState.selectedElement ? { ...item, ...updates } : item
                )

            return {
                ...prev,
                shelves: updateItem(prev.shelves),
                special_zones: updateItem(prev.special_zones),
                checkouts: updateItem(prev.checkouts),
                entry_exit: updateItem(prev.entry_exit),
                walls: updateItem(prev.walls),
            }
        })
    }

    const handleDeleteElement = () => {
        if (!editorState.selectedElement) return

        setLayout((prev) => {
            const filterOut = (items: any[]) =>
                items.filter((item) => item.id !== editorState.selectedElement)

            return {
                ...prev,
                shelves: filterOut(prev.shelves),
                special_zones: filterOut(prev.special_zones),
                checkouts: filterOut(prev.checkouts),
                entry_exit: filterOut(prev.entry_exit),
                walls: filterOut(prev.walls),
            }
        })

        setEditorState((prev) => ({ ...prev, selectedElement: null }))
    }

    const handleAddShelf = () => {
        const newShelf: Shelf = {
            id: `shelf_${Date.now()}`,
            label: `Shelf ${String.fromCharCode(65 + layout.shelves.length)}`,
            type: "shelf",
            position: { x: 5, y: 5 },
            dimensions: { width: 1, height: 6 },
            orientation: "vertical",
            category: "Uncategorized",
            shelves: {
                left: { sections: ["top", "middle", "bottom"] },
                right: { sections: ["top", "middle", "bottom"] },
            },
        }

        setLayout((prev) => ({
            ...prev,
            shelves: [...prev.shelves, newShelf],
        }))
    }

    const handleAddZone = () => {
        const newZone: SpecialZone = {
            id: `zone_${Date.now()}`,
            label: "New Zone",
            type: "produce_section",
            position: { x: 5, y: 15 },
            dimensions: { width: 6, height: 5 },
            category: "Special Zone",
        }

        setLayout((prev) => ({
            ...prev,
            special_zones: [...prev.special_zones, newZone],
        }))
    }

    const handleSave = () => {
        console.log("Saving layout:", layout)
        alert("Layout saved! (Check console for data)")
    }

    const handleExport = () => {
        const dataStr = JSON.stringify(layout, null, 2)
        const dataBlob = new Blob([dataStr], { type: "application/json" })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${layout.store_name.replace(/\s+/g, "_")}_layout.json`
        link.click()
        URL.revokeObjectURL(url)
    }

    const handlePlaceElement = (tool: EditorState["selectedTool"], position: Position) => {
        const id = `${tool}_${Date.now()}`

        switch (tool) {
            case "shelf":
                const newShelf: Shelf = {
                    id,
                    label: `Shelf ${String.fromCharCode(65 + layout.shelves.length)}`,
                    type: "shelf",
                    position,
                    dimensions: { width: 1, height: 6 },
                    orientation: "vertical",
                    category: "Uncategorized",
                    shelves: {
                        left: { sections: ["top", "middle", "bottom"] },
                        right: { sections: ["top", "middle", "bottom"] },
                    },
                }
                setLayout((prev) => ({ ...prev, shelves: [...prev.shelves, newShelf] }))
                break

            case "zone":
                const newZone: SpecialZone = {
                    id,
                    label: "New Zone",
                    type: "produce_section",
                    position,
                    dimensions: { width: 6, height: 5 },
                    category: "Special Zone",
                }
                setLayout((prev) => ({ ...prev, special_zones: [...prev.special_zones, newZone] }))
                break

            case "checkout":
                const newCheckout: Checkout = {
                    id,
                    position,
                    dimensions: { width: 2, height: 1 },
                }
                setLayout((prev) => ({ ...prev, checkouts: [...prev.checkouts, newCheckout] }))
                break

            case "entrance":
                const newEntrance: EntryExit = {
                    id,
                    type: "entrance",
                    position,
                    dimensions: { width: 3, height: 1 },
                }
                setLayout((prev) => ({ ...prev, entry_exit: [...prev.entry_exit, newEntrance] }))
                break

            case "exit":
                const newExit: EntryExit = {
                    id,
                    type: "exit",
                    position,
                    dimensions: { width: 3, height: 1 },
                }
                setLayout((prev) => ({ ...prev, entry_exit: [...prev.entry_exit, newExit] }))
                break

            case "wall":
                const newWall: Wall = {
                    id,
                    type: "wall",
                    position,
                    dimensions: { width: 1, height: 8 },
                    orientation: "vertical",
                }
                setLayout((prev) => ({ ...prev, walls: [...prev.walls, newWall] }))
                break
        }

        setEditorState((prev) => ({ ...prev, selectedTool: "select" }))
    }

    const getSelectedElement = () => {
        if (!editorState.selectedElement) return null

        const allElements = [
            ...layout.shelves,
            ...layout.special_zones,
            ...layout.checkouts,
            ...layout.entry_exit,
            ...layout.walls,
        ]

        return allElements.find((el) => el.id === editorState.selectedElement) || null
    }

    // ── Route info helpers ───────────────────────────────────────────────────
    const hasEntrance = layout.entry_exit.some((e) => e.type === "entrance")
    const routePath = routeResult?.path ?? []

    return (
        <div className="flex h-screen w-full bg-gray-100">
            {/* Left Panel */}
            <EditorControls
                editorState={editorState}
                mode={mode}
                onUpdateState={updateEditorState}
                onAddShelf={handleAddShelf}
                onAddZone={handleAddZone}
                onSave={handleSave}
                onExport={handleExport}
                onToggleMode={handleToggleMode}
            />

            {/* Center – Canvas */}
            <div className="flex-1 p-4 overflow-hidden relative">

                {/* Navigate Mode HUD */}
                {mode === "navigate" && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-white rounded-xl shadow-lg border border-blue-200 px-4 py-2 flex items-center gap-3 text-sm whitespace-nowrap">
                        {/* Start */}
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-green-500 inline-block flex-shrink-0" />
                            <span className="text-gray-700">
                                {routeStart
                                    ? `Start (${routeStart.x}, ${routeStart.y})`
                                    : hasEntrance
                                    ? "No entrance placed yet"
                                    : "Click to set start"}
                            </span>
                        </div>

                        <span className="text-gray-300">|</span>

                        {/* End */}
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-red-500 inline-block flex-shrink-0" />
                            <span className="text-gray-700">
                                {routeEnd
                                    ? `End (${routeEnd.x}, ${routeEnd.y})`
                                    : "Click destination on map"}
                            </span>
                        </div>

                        {/* Route result */}
                        {routeResult?.found && (
                            <>
                                <span className="text-gray-300">|</span>
                                <span className="text-blue-600 font-semibold">
                                    {Math.round(routeResult.distance)} m &middot;{" "}
                                    {formatTime(routeResult.estimatedTime ?? 0)}
                                </span>
                            </>
                        )}
                        {routeResult && !routeResult.found && (
                            <>
                                <span className="text-gray-300">|</span>
                                <span className="text-red-500 font-medium">No path found</span>
                            </>
                        )}

                        <Button size="sm" variant="outline" onClick={handleResetRoute}>
                            Reset
                        </Button>
                    </div>
                )}

                <div className="h-full bg-white rounded-lg shadow-lg">
                    <GridCanvas
                        storeWidth={layout.dimensions.width}
                        storeHeight={layout.dimensions.height}
                        gridSize={editorState.gridSize}
                        showGrid={editorState.showGrid}
                        snapToGrid={editorState.snapToGrid}
                        shelves={layout.shelves}
                        specialZones={layout.special_zones}
                        checkouts={layout.checkouts}
                        entryExit={layout.entry_exit}
                        walls={layout.walls}
                        selectedElement={editorState.selectedElement}
                        selectedTool={editorState.selectedTool}
                        onSelectElement={handleSelectElement}
                        onUpdateElement={handleUpdateElementPosition}
                        onPlaceElement={handlePlaceElement}
                        zoom={editorState.zoom}
                        onZoomChange={(zoom) => updateEditorState({ zoom })}
                        mode={mode}
                        routePath={routePath}
                        routeStart={routeStart}
                        routeEnd={routeEnd}
                        onNavigateClick={handleNavigateClick}
                    />
                </div>
            </div>

            {/* Right Panel – hidden in navigate mode */}
            {mode === "edit" && (
                <PropertiesPanel
                    selectedElement={getSelectedElement()}
                    onUpdateElement={handleUpdateElement}
                    onDeleteElement={handleDeleteElement}
                />
            )}
        </div>
    )
}

// Made with Bob
