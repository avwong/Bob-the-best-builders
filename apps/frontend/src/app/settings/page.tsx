"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, RotateCcw, Palette, Store, Grid3X3, Map } from "lucide-react"
import { AppSettings, defaultSettings } from "@/types/settings"

export default function SettingsPage() {
    const router = useRouter()
    const [settings, setSettings] = useState<AppSettings>(defaultSettings)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        const savedSettings = localStorage.getItem("appSettings")
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings)
                if (parsed.colors && ('primary' in parsed.colors || 'secondary' in parsed.colors)) {
                    parsed.colors = {
                        brandColor: parsed.colors.primary || defaultSettings.colors.brandColor,
                        mapFloor: parsed.colors.background || defaultSettings.colors.mapFloor,
                    }
                }
                setSettings(parsed)
            } catch {
                // ignore parse errors
            }
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

    const brandPresets = [
        { label: "Emerald", value: "#10b981" },
        { label: "Teal", value: "#14b8a6" },
        { label: "Blue", value: "#3b82f6" },
        { label: "Indigo", value: "#6366f1" },
        { label: "Rose", value: "#f43f5e" },
        { label: "Amber", value: "#f59e0b" },
    ]

    const floorPresets = [
        { label: "White", value: "#ffffff" },
        { label: "Snow", value: "#f8fafc" },
        { label: "Warm", value: "#fffbeb" },
        { label: "Cool", value: "#f0f9ff" },
        { label: "Cream", value: "#fef3c7" },
        { label: "Slate", value: "#f1f5f9" },
    ]

    return (
        <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 30%, #f0f9ff 100%)" }}>
            <div className="max-w-3xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                        style={{
                            background: "#fff",
                            color: "#64748b",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = "#10b981"
                            e.currentTarget.style.color = "#059669"
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = "#e2e8f0"
                            e.currentTarget.style.color = "#64748b"
                        }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <div>
                        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1e293b", letterSpacing: "-0.02em" }}>
                            Settings
                        </h1>
                        <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                            Customize your Aisly experience
                        </p>
                    </div>
                </div>

                {/* Store Information */}
                <div className="rounded-2xl mb-6 overflow-hidden" style={{ background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                    <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <Store className="w-5 h-5" style={{ color: "#94a3b8" }} />
                        <div>
                            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b" }}>Store Information</h2>
                            <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Basic info about your supermarket</p>
                        </div>
                    </div>
                    <div className="px-6 py-5 space-y-4">
                        <div className="space-y-2">
                            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b" }}>Store Name</label>
                            <input
                                value={settings.storeName}
                                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                                placeholder="My Supermarket"
                                className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 outline-none"
                                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#1e293b" }}
                                onFocus={e => e.currentTarget.style.borderColor = "#10b981"}
                                onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                            />
                        </div>
                        <div className="space-y-2">
                            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b" }}>Store ID</label>
                            <input
                                value={settings.storeId}
                                onChange={(e) => setSettings({ ...settings, storeId: e.target.value })}
                                placeholder="store_001"
                                className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 outline-none"
                                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#1e293b" }}
                                onFocus={e => e.currentTarget.style.borderColor = "#10b981"}
                                onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                            />
                        </div>
                    </div>
                </div>

                {/* Brand Color */}
                <div className="rounded-2xl mb-6 overflow-hidden" style={{ background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                    <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <Palette className="w-5 h-5" style={{ color: "#94a3b8" }} />
                        <div>
                            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b" }}>Brand Color</h2>
                            <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Used for selection highlights, route paths, and UI accents</p>
                        </div>
                    </div>
                    <div className="px-6 py-5 space-y-4">
                        <div className="flex flex-wrap gap-3">
                            {brandPresets.map(preset => (
                                <button
                                    key={preset.value}
                                    onClick={() => setSettings({ ...settings, colors: { ...settings.colors, brandColor: preset.value } })}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                                    style={{
                                        background: settings.colors.brandColor === preset.value ? "#f0fdf4" : "#f8fafc",
                                        border: settings.colors.brandColor === preset.value ? `2px solid ${preset.value}` : "2px solid #e2e8f0",
                                        color: "#1e293b",
                                    }}
                                >
                                    <div style={{ width: 18, height: 18, borderRadius: 6, background: preset.value, boxShadow: `0 2px 8px ${preset.value}30` }} />
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={settings.colors.brandColor}
                                onChange={(e) => setSettings({ ...settings, colors: { ...settings.colors, brandColor: e.target.value } })}
                                className="w-12 h-10 rounded-lg cursor-pointer border-0"
                                style={{ background: "transparent" }}
                            />
                            <input
                                value={settings.colors.brandColor}
                                onChange={(e) => setSettings({ ...settings, colors: { ...settings.colors, brandColor: e.target.value } })}
                                placeholder="#10b981"
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#1e293b", fontFamily: "monospace" }}
                                onFocus={e => e.currentTarget.style.borderColor = "#10b981"}
                                onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                            />
                            <div className="w-10 h-10 rounded-xl" style={{ background: settings.colors.brandColor, boxShadow: `0 4px 16px ${settings.colors.brandColor}30`, flexShrink: 0 }} />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {["Selection borders", "Route path", "Active buttons", "Highlights"].map(item => (
                                <span key={item} className="px-2.5 py-1 rounded-lg text-xs" style={{ background: `${settings.colors.brandColor}10`, color: settings.colors.brandColor, border: `1px solid ${settings.colors.brandColor}20` }}>
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Map Floor Color */}
                <div className="rounded-2xl mb-6 overflow-hidden" style={{ background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                    <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <Map className="w-5 h-5" style={{ color: "#94a3b8" }} />
                        <div>
                            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b" }}>Map Floor Color</h2>
                            <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Background color of the store floor in the editor and map</p>
                        </div>
                    </div>
                    <div className="px-6 py-5 space-y-4">
                        <div className="flex flex-wrap gap-3">
                            {floorPresets.map(preset => (
                                <button
                                    key={preset.value}
                                    onClick={() => setSettings({ ...settings, colors: { ...settings.colors, mapFloor: preset.value } })}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                                    style={{
                                        background: settings.colors.mapFloor === preset.value ? "#f0fdf4" : "#f8fafc",
                                        border: settings.colors.mapFloor === preset.value ? `2px solid ${preset.value}` : "2px solid #e2e8f0",
                                        color: "#1e293b",
                                    }}
                                >
                                    <div style={{ width: 18, height: 18, borderRadius: 6, background: preset.value, border: "1px solid #e2e8f0" }} />
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={settings.colors.mapFloor}
                                onChange={(e) => setSettings({ ...settings, colors: { ...settings.colors, mapFloor: e.target.value } })}
                                className="w-12 h-10 rounded-lg cursor-pointer border-0"
                                style={{ background: "transparent" }}
                            />
                            <input
                                value={settings.colors.mapFloor}
                                onChange={(e) => setSettings({ ...settings, colors: { ...settings.colors, mapFloor: e.target.value } })}
                                placeholder="#f8fafc"
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#1e293b", fontFamily: "monospace" }}
                                onFocus={e => e.currentTarget.style.borderColor = "#10b981"}
                                onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                            />
                            <div className="w-10 h-10 rounded-xl" style={{ background: settings.colors.mapFloor, border: "1px solid #e2e8f0", flexShrink: 0 }} />
                        </div>
                    </div>
                </div>

                {/* Editor Preferences */}
                <div className="rounded-2xl mb-8 overflow-hidden" style={{ background: "#fff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                    <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <Grid3X3 className="w-5 h-5" style={{ color: "#94a3b8" }} />
                        <div>
                            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b" }}>Editor Defaults</h2>
                            <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Default settings for the layout editor</p>
                        </div>
                    </div>
                    <div className="px-6 py-5 space-y-4">
                        <div className="space-y-2">
                            <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b" }}>Default Grid Size (meters)</label>
                            <input
                                type="number"
                                value={settings.gridSize}
                                onChange={(e) => setSettings({ ...settings, gridSize: Number(e.target.value) })}
                                min={0.5} max={5} step={0.5}
                                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                                style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#1e293b" }}
                                onFocus={e => e.currentTarget.style.borderColor = "#10b981"}
                                onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="snapToGrid" checked={settings.snapToGrid}
                                onChange={(e) => setSettings({ ...settings, snapToGrid: e.target.checked })}
                                className="h-4 w-4 rounded" style={{ accentColor: "#10b981" }} />
                            <label htmlFor="snapToGrid" className="cursor-pointer" style={{ fontSize: "0.85rem", color: "#475569" }}>
                                Enable Snap to Grid by default
                            </label>
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="showGrid" checked={settings.showGrid}
                                onChange={(e) => setSettings({ ...settings, showGrid: e.target.checked })}
                                className="h-4 w-4 rounded" style={{ accentColor: "#10b981" }} />
                            <label htmlFor="showGrid" className="cursor-pointer" style={{ fontSize: "0.85rem", color: "#475569" }}>
                                Show Grid by default
                            </label>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                        style={{
                            background: saved ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #10b981, #059669)",
                            color: "#fff",
                            boxShadow: "0 4px 24px rgba(16, 185, 129, 0.25)",
                            opacity: saved ? 0.85 : 1,
                        }}
                    >
                        <Save className="w-4 h-4" />
                        {saved ? "Saved ✓" : "Save Settings"}
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                        style={{
                            background: "#fff",
                            color: "#64748b",
                            border: "1px solid #e2e8f0",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = "#fca5a5"
                            e.currentTarget.style.color = "#ef4444"
                            e.currentTarget.style.background = "#fef2f2"
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = "#e2e8f0"
                            e.currentTarget.style.color = "#64748b"
                            e.currentTarget.style.background = "#fff"
                        }}
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </button>
                </div>
            </div>
        </div>
    )
}

// Made with Bob
