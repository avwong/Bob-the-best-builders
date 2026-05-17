"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Trash2 } from "lucide-react"
import { Shelf, Freezer, SpecialZone, Checkout, EntryExit, Wall } from "@/types/supermarket"

type AnyElement = Shelf | Freezer | SpecialZone | Checkout | EntryExit | Wall

interface PropertiesPanelProps {
    selectedElement: AnyElement | null
    onUpdateElement: (updates: Partial<AnyElement>) => void
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
                        <p className="text-sm text-gray-500 text-center">
                            Select an element to view and edit its properties
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const isShelf = "shelves" in selectedElement
    const isFreezer = "type" in selectedElement && selectedElement.type === "freezer"
    const isSpecialZone = "type" in selectedElement && typeof selectedElement.type === "string" && selectedElement.type.includes("_section")
    const isEntryExit = "type" in selectedElement && (selectedElement.type === "entrance" || selectedElement.type === "exit")
    const isWall = "type" in selectedElement && selectedElement.type === "wall"
    const isCheckout = !isShelf && !isFreezer && !isSpecialZone && !isEntryExit && !isWall

    const elementTypeName = isShelf ? "Shelf" : isFreezer ? "Freezer" : isSpecialZone ? "Zone" : isCheckout ? "Checkout" : isEntryExit ? "Entry/Exit" : "Wall"

    return (
        <div className="w-80 h-full overflow-y-auto bg-white border-l border-gray-200 p-4 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Properties - {elementTypeName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Common Properties */}
                    <div className="space-y-2">
                        <Label htmlFor="element-id" className="text-gray-700">ID</Label>
                        <Input
                            id="element-id"
                            value={selectedElement.id}
                            disabled
                            className="bg-gray-50 text-gray-600"
                        />
                    </div>

                    {(isShelf || isFreezer || isSpecialZone) && "label" in selectedElement && (
                        <div className="space-y-2">
                            <Label htmlFor="element-label" className="text-gray-700">Label</Label>
                            <Input
                                id="element-label"
                                value={(selectedElement as any).label}
                                onChange={(e) => onUpdateElement({ label: e.target.value } as any)}
                            />
                        </div>
                    )}

                    <Separator />

                    {/* Position */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-800">Position</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label htmlFor="pos-x" className="text-xs text-gray-600">X (meters)</Label>
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
                                <Label htmlFor="pos-y" className="text-xs text-gray-600">Y (meters)</Label>
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
                        <Label className="text-sm font-semibold text-gray-800">Dimensions</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label htmlFor="dim-width" className="text-xs text-gray-600">Width (m)</Label>
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
                                <Label htmlFor="dim-height" className="text-xs text-gray-600">Height (m)</Label>
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
                                <Label htmlFor="category" className="text-gray-700">Category</Label>
                                <Input
                                    id="category"
                                    value={(selectedElement as Shelf).category}
                                    onChange={(e) => onUpdateElement({ category: e.target.value } as any)}
                                    placeholder="e.g., Beverages & Snacks"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-800">Shelf Sides</Label>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="shelf-left"
                                            checked={(selectedElement as Shelf).shelves.left.sections.length > 0}
                                            onChange={(e) => {
                                                const sections: ("top" | "middle" | "bottom")[] = e.target.checked
                                                    ? ["top", "middle", "bottom"]
                                                    : []
                                                onUpdateElement({
                                                    shelves: {
                                                        ...(selectedElement as Shelf).shelves,
                                                        left: { sections },
                                                    },
                                                } as any)
                                            }}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <Label htmlFor="shelf-left" className="cursor-pointer text-sm text-gray-700">
                                            Left side
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="shelf-right"
                                            checked={(selectedElement as Shelf).shelves.right.sections.length > 0}
                                            onChange={(e) => {
                                                const sections: ("top" | "middle" | "bottom")[] = e.target.checked
                                                    ? ["top", "middle", "bottom"]
                                                    : []
                                                onUpdateElement({
                                                    shelves: {
                                                        ...(selectedElement as Shelf).shelves,
                                                        right: { sections },
                                                    },
                                                } as any)
                                            }}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <Label htmlFor="shelf-right" className="cursor-pointer text-sm text-gray-700">
                                            Right side
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-800">Orientation</Label>
                                <div className="flex gap-2">
                                    <Button
                                        variant={(selectedElement as Shelf).orientation === "vertical" ? "default" : "outline"}
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => onUpdateElement({ orientation: "vertical" } as any)}
                                    >
                                        Vertical
                                    </Button>
                                    <Button
                                        variant={(selectedElement as Shelf).orientation === "horizontal" ? "default" : "outline"}
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => onUpdateElement({ orientation: "horizontal" } as any)}
                                    >
                                        Horizontal
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Freezer-specific properties */}
                    {isFreezer && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <Label htmlFor="freezer-category" className="text-gray-700">Category</Label>
                                <Input
                                    id="freezer-category"
                                    value={(selectedElement as Freezer).category}
                                    onChange={(e) => onUpdateElement({ category: e.target.value } as any)}
                                    placeholder="e.g., Frozen Foods"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-800">Orientation</Label>
                                <div className="flex gap-2">
                                    <Button
                                        variant={(selectedElement as Freezer).orientation === "vertical" ? "default" : "outline"}
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => onUpdateElement({ orientation: "vertical" } as any)}
                                    >
                                        Vertical
                                    </Button>
                                    <Button
                                        variant={(selectedElement as Freezer).orientation === "horizontal" ? "default" : "outline"}
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => onUpdateElement({ orientation: "horizontal" } as any)}
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
                                <Label htmlFor="zone-category" className="text-gray-700">Category</Label>
                                <Input
                                    id="zone-category"
                                    value={(selectedElement as SpecialZone).category}
                                    onChange={(e) => onUpdateElement({ category: e.target.value } as any)}
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
                        {isFreezer && "Freezers store frozen and refrigerated products"}
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
