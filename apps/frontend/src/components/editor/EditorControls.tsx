"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Plus, ZoomIn, ZoomOut, Save, Download } from "lucide-react"
import { EditorState } from "@/types/supermarket"

interface EditorControlsProps {
    editorState: EditorState
    onUpdateState: (state: Partial<EditorState>) => void
    onAddShelf: () => void
    onAddZone: () => void
    onSave: () => void
    onExport: () => void
}

export function EditorControls({
    editorState,
    onUpdateState,
    onAddShelf,
    onAddZone,
    onSave,
    onExport,
}: EditorControlsProps) {
    const tools = [
        { id: "select", label: "Select", icon: "🖱️" },
        { id: "shelf", label: "Shelf", icon: "🗄️" },
        { id: "zone", label: "Zone", icon: "🏪" },
        { id: "checkout", label: "Checkout", icon: "💳" },
        { id: "entrance", label: "Entrance", icon: "🚪" },
        { id: "exit", label: "Exit", icon: "🚪" },
        { id: "wall", label: "Wall", icon: "🧱" },
    ] as const

    return (
        <div className="w-80 h-full overflow-y-auto bg-white border-l border-gray-200 p-4 space-y-4">
            {/* Tools Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        {tools.map((tool) => (
                            <Button
                                key={tool.id}
                                variant={editorState.selectedTool === tool.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => onUpdateState({ selectedTool: tool.id as EditorState["selectedTool"] })}
                                draggable={tool.id !== "select"}
                                onDragStart={(e) => {
                                    if (tool.id !== "select") {
                                        e.dataTransfer.setData("tool", tool.id)
                                        e.dataTransfer.effectAllowed = "copy"
                                    }
                                }}
                                className="justify-start"
                                style={{ cursor: tool.id === "select" ? "pointer" : "grab" }}
                            >
                                <span className="mr-2">{tool.icon}</span>
                                {tool.label}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button onClick={onAddShelf} variant="outline" size="sm" className="w-full justify-start">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Shelf
                    </Button>
                    <Button onClick={onAddZone} variant="outline" size="sm" className="w-full justify-start">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Special Zone
                    </Button>
                </CardContent>
            </Card>

            <Separator />

            {/* Grid Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Grid Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="gridSize">Grid Size (meters)</Label>
                        <Input
                            id="gridSize"
                            type="number"
                            value={editorState.gridSize}
                            onChange={(e) => onUpdateState({ gridSize: Number(e.target.value) })}
                            min={1}
                            max={10}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="showGrid"
                            checked={editorState.showGrid}
                            onChange={(e) => onUpdateState({ showGrid: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="showGrid" className="cursor-pointer">
                            Show Grid
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="snapToGrid"
                            checked={editorState.snapToGrid}
                            onChange={(e) => onUpdateState({ snapToGrid: e.target.checked })}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="snapToGrid" className="cursor-pointer">
                            Snap to Grid
                        </Label>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Zoom Controls */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">View</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Zoom</Label>
                        <span className="text-sm text-muted-foreground">{Math.round(editorState.zoom * 100)}%</span>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateState({ zoom: Math.max(0.3, editorState.zoom - 0.1) })}
                            disabled={editorState.zoom <= 0.3}
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateState({ zoom: 1 })}
                            className="flex-1"
                        >
                            Reset
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateState({ zoom: Math.min(5, editorState.zoom + 0.1) })}
                            disabled={editorState.zoom >= 5}
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Actions */}
            <div className="space-y-2">
                <Button onClick={onSave} className="w-full" variant="default">
                    <Save className="mr-2 h-4 w-4" />
                    Save Layout
                </Button>
                <Button onClick={onExport} className="w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export JSON
                </Button>
            </div>

            {/* Info */}
            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                    <p className="text-xs text-blue-900">
                        <strong>Tip:</strong> Click a tool, then click on the canvas to place it. Use Select mode to drag elements around.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

// Made with Bob
