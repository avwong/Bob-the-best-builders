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

interface SupermarketEditorProps {
    initialLayout?: StoreLayout
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
        // TODO: Implement save to backend/localStorage
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

        // Switch back to select tool after placing
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

    return (
        <div className="flex h-screen w-full bg-gray-100">
            {/* Left Panel - Controls */}
            <EditorControls
                editorState={editorState}
                onUpdateState={updateEditorState}
                onAddShelf={handleAddShelf}
                onAddZone={handleAddZone}
                onSave={handleSave}
                onExport={handleExport}
            />

            {/* Center - Canvas */}
            <div className="flex-1 p-4 overflow-hidden">
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
                    />
                </div>
            </div>

            {/* Right Panel - Properties */}
            <PropertiesPanel
                selectedElement={getSelectedElement()}
                onUpdateElement={handleUpdateElement}
                onDeleteElement={handleDeleteElement}
            />
        </div>
    )
}

// Made with Bob
