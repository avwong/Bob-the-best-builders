"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Save, RotateCcw } from "lucide-react"
import { AppSettings, defaultSettings } from "@/types/settings"

export default function SettingsPage() {
    const router = useRouter()
    const [settings, setSettings] = useState<AppSettings>(defaultSettings)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        // Load settings from localStorage
        const savedSettings = localStorage.getItem("appSettings")
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings))
        }
    }, [])

    const handleSave = () => {
        localStorage.setItem("appSettings", JSON.stringify(settings))
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const handleReset = () => {
        setSettings(defaultSettings)
        localStorage.removeItem("appSettings")
    }

    const updateColor = (key: keyof typeof settings.colors, value: string) => {
        setSettings({
            ...settings,
            colors: {
                ...settings.colors,
                [key]: value,
            },
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/dashboard")}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
                        <p className="text-gray-600">Customize your editor experience</p>
                    </div>
                </div>

                {/* Store Information */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Store Information</CardTitle>
                        <CardDescription>
                            Basic information about your supermarket
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="storeName">Store Name</Label>
                            <Input
                                id="storeName"
                                value={settings.storeName}
                                onChange={(e) =>
                                    setSettings({ ...settings, storeName: e.target.value })
                                }
                                placeholder="My Supermarket"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="storeId">Store ID</Label>
                            <Input
                                id="storeId"
                                value={settings.storeId}
                                onChange={(e) =>
                                    setSettings({ ...settings, storeId: e.target.value })
                                }
                                placeholder="store_001"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Color Customization */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Brand Colors</CardTitle>
                        <CardDescription>
                            Customize the editor colors to match your brand
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="primary">Primary Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="primary"
                                        type="color"
                                        value={settings.colors.primary}
                                        onChange={(e) => updateColor("primary", e.target.value)}
                                        className="w-20 h-10 cursor-pointer"
                                    />
                                    <Input
                                        value={settings.colors.primary}
                                        onChange={(e) => updateColor("primary", e.target.value)}
                                        placeholder="#3b82f6"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    Used for buttons and highlights
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="secondary">Secondary Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="secondary"
                                        type="color"
                                        value={settings.colors.secondary}
                                        onChange={(e) => updateColor("secondary", e.target.value)}
                                        className="w-20 h-10 cursor-pointer"
                                    />
                                    <Input
                                        value={settings.colors.secondary}
                                        onChange={(e) => updateColor("secondary", e.target.value)}
                                        placeholder="#e5e7eb"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Used for aisles</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="accent">Accent Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="accent"
                                        type="color"
                                        value={settings.colors.accent}
                                        onChange={(e) => updateColor("accent", e.target.value)}
                                        className="w-20 h-10 cursor-pointer"
                                    />
                                    <Input
                                        value={settings.colors.accent}
                                        onChange={(e) => updateColor("accent", e.target.value)}
                                        placeholder="#f59e0b"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Used for special zones</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="background">Background Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="background"
                                        type="color"
                                        value={settings.colors.background}
                                        onChange={(e) => updateColor("background", e.target.value)}
                                        className="w-20 h-10 cursor-pointer"
                                    />
                                    <Input
                                        value={settings.colors.background}
                                        onChange={(e) => updateColor("background", e.target.value)}
                                        placeholder="#ffffff"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Canvas background</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="text">Text Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="text"
                                        type="color"
                                        value={settings.colors.text}
                                        onChange={(e) => updateColor("text", e.target.value)}
                                        className="w-20 h-10 cursor-pointer"
                                    />
                                    <Input
                                        value={settings.colors.text}
                                        onChange={(e) => updateColor("text", e.target.value)}
                                        placeholder="#374151"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Labels and text</p>
                            </div>
                        </div>

                        <Separator />

                        {/* Color Preview */}
                        <div>
                            <Label className="mb-4 block">Preview</Label>
                            <div className="grid grid-cols-5 gap-4">
                                <div className="text-center">
                                    <div
                                        className="w-full h-20 rounded-lg mb-2 border"
                                        style={{ backgroundColor: settings.colors.primary }}
                                    />
                                    <p className="text-xs text-gray-600">Primary</p>
                                </div>
                                <div className="text-center">
                                    <div
                                        className="w-full h-20 rounded-lg mb-2 border"
                                        style={{ backgroundColor: settings.colors.secondary }}
                                    />
                                    <p className="text-xs text-gray-600">Secondary</p>
                                </div>
                                <div className="text-center">
                                    <div
                                        className="w-full h-20 rounded-lg mb-2 border"
                                        style={{ backgroundColor: settings.colors.accent }}
                                    />
                                    <p className="text-xs text-gray-600">Accent</p>
                                </div>
                                <div className="text-center">
                                    <div
                                        className="w-full h-20 rounded-lg mb-2 border"
                                        style={{ backgroundColor: settings.colors.background }}
                                    />
                                    <p className="text-xs text-gray-600">Background</p>
                                </div>
                                <div className="text-center">
                                    <div
                                        className="w-full h-20 rounded-lg mb-2 border flex items-center justify-center"
                                        style={{
                                            backgroundColor: settings.colors.background,
                                            color: settings.colors.text
                                        }}
                                    >
                                        <span className="font-bold">Aa</span>
                                    </div>
                                    <p className="text-xs text-gray-600">Text</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Editor Preferences */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Editor Preferences</CardTitle>
                        <CardDescription>
                            Default settings for the editor
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="gridSize">Default Grid Size (meters)</Label>
                            <Input
                                id="gridSize"
                                type="number"
                                value={settings.gridSize}
                                onChange={(e) =>
                                    setSettings({ ...settings, gridSize: Number(e.target.value) })
                                }
                                min={0.5}
                                max={5}
                                step={0.5}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="snapToGrid"
                                checked={settings.snapToGrid}
                                onChange={(e) =>
                                    setSettings({ ...settings, snapToGrid: e.target.checked })
                                }
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="snapToGrid" className="cursor-pointer">
                                Enable Snap to Grid by default
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="showGrid"
                                checked={settings.showGrid}
                                onChange={(e) =>
                                    setSettings({ ...settings, showGrid: e.target.checked })
                                }
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="showGrid" className="cursor-pointer">
                                Show Grid by default
                            </Label>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-4">
                    <Button onClick={handleSave} className="flex-1">
                        <Save className="w-4 h-4 mr-2" />
                        {saved ? "Saved!" : "Save Settings"}
                    </Button>
                    <Button onClick={handleReset} variant="outline">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset to Defaults
                    </Button>
                </div>
            </div>
        </div>
    )
}

// Made with Bob
