"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Trash2 } from "lucide-react"
import { Shelf, SpecialZone, Checkout, EntryExit, Wall } from "@/types/supermarket"

interface PropertiesPanelProps {
    selectedElement: Shelf | SpecialZone | Checkout | EntryExit | Wall | null
    onUpdateElement: (updates: Partial<Shelf | SpecialZone | Checkout | EntryExit | Wall>) => void
    onDeleteElement: () => void
}

export function PropertiesPanel({
    selectedElement,
    onUpdateElement,
    onDeleteElement,
}: PropertiesPanelProps) {
    if (!selectedElement) {
        return (
            <div className="w-80 h-full bg-white border-l border-gray-200 p-4">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground text-center">
                            Select an element to view and edit its properties
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const isShelf = "shelves" in selectedElement
    const isSpecialZone = "type" in selectedElement && selectedElement.type && typeof selectedElement.type === "string" && selectedElement.type.includes("_section")
    const isEntryExit = "type" in selectedElement && selectedElement.type && (selectedElement.type === "entrance" || selectedElement.type === "exit")
    const isWall = "type" in selectedElement && selectedElement.type === "wall"
    const isCheckout = !isShelf && !isSpecialZone && !isEntryExit && !isWall

    return (
        <div className="w-80 h-full overflow-y-auto bg-white border-l border-gray-200 p-4 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Common Properties */}
                    <div className="space-y-2">
                        <Label htmlFor="element-id">ID</Label>
                        <Input
                            id="element-id"
                            value={selectedElement.id}
                            disabled
                            className="bg-gray-50"
                        />
                    </div>

                    {(isShelf || isSpecialZone) && "label" in selectedElement && (
                        <div className="space-y-2">
                            <Label htmlFor="element-label">Label</Label>
                            <Input
                                id="element-label"
                                value={selectedElement.label}
                                onChange={(e) => onUpdateElement({ label: e.target.value })}
                            />
                        </div>
                    )}

                    <Separator />

                    {/* Position */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Position</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label htmlFor="pos-x" className="text-xs">X (meters)</Label>
                                <Input
                                    id="pos-x"
                                    type="number"
                                    value={selectedElement.position.x}
                                    onChange={(e) =>
                                        onUpdateElement({
                                            position: { ...selectedElement.position, x: Number(e.target.value) },
                                        })
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="pos-y" className="text-xs">Y (meters)</Label>
                                <Input
                                    id="pos-y"
                                    type="number"
                                    value={selectedElement.position.y}
                                    onChange={(e) =>
                                        onUpdateElement({
                                            position: { ...selectedElement.position, y: Number(e.target.value) },
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dimensions */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">Dimensions</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label htmlFor="dim-width" className="text-xs">Width (m)</Label>
                                <Input
                                    id="dim-width"
                                    type="number"
                                    value={selectedElement.dimensions.width}
                                    onChange={(e) =>
                                        onUpdateElement({
                                            dimensions: { ...selectedElement.dimensions, width: Number(e.target.value) },
                                        })
                                    }
                                    min={1}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="dim-height" className="text-xs">Height (m)</Label>
                                <Input
                                    id="dim-height"
                                    type="number"
                                    value={selectedElement.dimensions.height}
                                    onChange={(e) =>
                                        onUpdateElement({
                                            dimensions: { ...selectedElement.dimensions, height: Number(e.target.value) },
                                        })
                                    }
                                    min={1}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Shelf-specific properties */}
                    {isShelf && "category" in selectedElement && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    value={selectedElement.category}
                                    onChange={(e) => onUpdateElement({ category: e.target.value })}
                                    placeholder="e.g., Beverages & Snacks"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Shelf Sides</Label>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="shelf-left"
                                            checked={selectedElement.shelves.left.sections.length > 0}
                                            onChange={(e) => {
                                                const sections: ("top" | "middle" | "bottom")[] = e.target.checked
                                                    ? ["top", "middle", "bottom"]
                                                    : []
                                                onUpdateElement({
                                                    shelves: {
                                                        ...selectedElement.shelves,
                                                        left: { sections },
                                                    },
                                                })
                                            }}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <Label htmlFor="shelf-left" className="cursor-pointer text-sm">
                                            Left side
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="shelf-right"
                                            checked={selectedElement.shelves.right.sections.length > 0}
                                            onChange={(e) => {
                                                const sections: ("top" | "middle" | "bottom")[] = e.target.checked
                                                    ? ["top", "middle", "bottom"]
                                                    : []
                                                onUpdateElement({
                                                    shelves: {
                                                        ...selectedElement.shelves,
                                                        right: { sections },
                                                    },
                                                })
                                            }}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <Label htmlFor="shelf-right" className="cursor-pointer text-sm">
                                            Right side
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Orientation</Label>
                                <div className="flex gap-2">
                                    <Button
                                        variant={selectedElement.orientation === "vertical" ? "default" : "outline"}
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => onUpdateElement({ orientation: "vertical" })}
                                    >
                                        Vertical
                                    </Button>
                                    <Button
                                        variant={selectedElement.orientation === "horizontal" ? "default" : "outline"}
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => onUpdateElement({ orientation: "horizontal" })}
                                    >
                                        Horizontal
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Special Zone properties */}
                    {isSpecialZone && "category" in selectedElement && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <Label htmlFor="zone-category">Category</Label>
                                <Input
                                    id="zone-category"
                                    value={selectedElement.category}
                                    onChange={(e) => onUpdateElement({ category: e.target.value })}
                                    placeholder="e.g., Fresh Produce"
                                />
                            </div>
                        </>
                    )}

                    <Separator />

                    {/* Delete Button */}
                    <Button
                        onClick={onDeleteElement}
                        variant="destructive"
                        size="sm"
                        className="w-full"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Element
                    </Button>
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-gray-50">
                <CardContent className="pt-4">
                    <p className="text-xs text-gray-600">
                        {isShelf && "Shelves hold products on both sides"}
                        {isSpecialZone && "Special zones are for produce, bakery, deli, etc."}
                        {isCheckout && "Checkout counters for customer payment"}
                        {isEntryExit && "Entry and exit points for customers"}
                        {isWall && "Walls define store boundaries"}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

// Made with Bob
