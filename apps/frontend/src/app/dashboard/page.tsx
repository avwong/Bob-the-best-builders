"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Settings, FileJson, Layout, ShoppingCart, Map, Trash2, Package } from "lucide-react"

export default function Dashboard() {
    const router = useRouter()
    const [recentLayouts, setRecentLayouts] = useState<any[]>([])

    useEffect(() => {
        const savedLayoutsStr = localStorage.getItem('savedLayouts')
        if (savedLayoutsStr) {
            try {
                const layouts = JSON.parse(savedLayoutsStr)
                setRecentLayouts(layouts)
            } catch (error) {
                console.error("Error loading layouts:", error)
            }
        }
    }, [])

    const handleOpenLayout = (layout: any) => {
        localStorage.setItem('currentLayout', JSON.stringify(layout.data))
        router.push("/editor")
    }

    const handleDeleteLayout = (layoutId: string) => {
        const updated = recentLayouts.filter(l => l.id !== layoutId)
        setRecentLayouts(updated)
        localStorage.setItem('savedLayouts', JSON.stringify(updated))
    }

    return (
        <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 30%, #f0f9ff 100%)" }}>
            <div className="max-w-6xl mx-auto px-6 py-10">

                {/* Hero / Branding, left aligned */}
                <div className="mb-12" style={{ animation: "fadeInUp 0.6s ease-out" }}>
                    <div className="flex items-center gap-3 mb-3">
                        <div style={{
                            width: 52,
                            height: 52,
                            borderRadius: 14,
                            background: "linear-gradient(135deg, #10b981, #059669)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 8px 28px rgba(16, 185, 129, 0.3)",
                        }}>
                            <img
                                src="/aisly-logo.svg"
                                alt="Aisly Logo"
                                style={{
                                    width: 48,
                                    height: 48,
                                    objectFit: "contain",
                                    filter: "brightness(0) invert(1)",
                                }}
                            />
                        </div>
                        <h1 style={{
                            fontSize: "2.5rem",
                            fontWeight: 800,
                            color: "#064e3b",
                            letterSpacing: "-0.02em",
                        }}>
                            Aisly
                        </h1>
                    </div>
                    <p style={{
                        fontSize: "1.05rem",
                        color: "#64748b",
                        maxWidth: 480,
                        lineHeight: 1.6,
                    }}>
                        Indoor Supermarket Navigation - create layouts, manage products, and guide your customers.
                    </p>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">

                    {/* Customer View, Primary */}
                    <button
                        onClick={() => router.push("/shop")}
                        className="group text-left rounded-2xl p-6 transition-all duration-300"
                        style={{
                            background: "linear-gradient(135deg, #10b981, #059669)",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            boxShadow: "0 4px 24px rgba(16, 185, 129, 0.2)",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = "translateY(-4px)"
                            e.currentTarget.style.boxShadow = "0 12px 40px rgba(16, 185, 129, 0.3)"
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = "translateY(0)"
                            e.currentTarget.style.boxShadow = "0 4px 24px rgba(16, 185, 129, 0.2)"
                        }}
                    >
                        <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)",
                            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
                        }}>
                            <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                            Customer View
                        </h3>
                        <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.4 }}>
                            Navigate the store and find products
                        </p>
                    </button>

                    {/* Product Management */}
                    <button
                        onClick={() => router.push("/products")}
                        className="group text-left rounded-2xl p-6 transition-all duration-300"
                        style={{
                            background: "#fff",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = "translateY(-4px)"
                            e.currentTarget.style.borderColor = "#10b981"
                            e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = "translateY(0)"
                            e.currentTarget.style.borderColor = "#e2e8f0"
                            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"
                        }}
                    >
                        <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: "#ecfdf5",
                            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
                        }}>
                            <Package className="w-5 h-5" style={{ color: "#10b981" }} />
                        </div>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
                            Products
                        </h3>
                        <p style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.4 }}>
                            Manage catalog and locations
                        </p>
                    </button>

                    {/* Layout Editor */}
                    <button
                        onClick={() => router.push("/editor")}
                        className="group text-left rounded-2xl p-6 transition-all duration-300"
                        style={{
                            background: "#fff",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = "translateY(-4px)"
                            e.currentTarget.style.borderColor = "#10b981"
                            e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = "translateY(0)"
                            e.currentTarget.style.borderColor = "#e2e8f0"
                            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"
                        }}
                    >
                        <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: "#ecfdf5",
                            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
                        }}>
                            <Layout className="w-5 h-5" style={{ color: "#10b981" }} />
                        </div>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
                            Layout Editor
                        </h3>
                        <p style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.4 }}>
                            Design and edit store layouts
                        </p>
                    </button>

                    {/* Import Layout */}
                    <button
                        className="group text-left rounded-2xl p-6 transition-all duration-300"
                        style={{
                            background: "#fff",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = "translateY(-4px)"
                            e.currentTarget.style.borderColor = "#f59e0b"
                            e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = "translateY(0)"
                            e.currentTarget.style.borderColor = "#e2e8f0"
                            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"
                        }}
                        onClick={() => {
                            const input = document.createElement('input')
                            input.type = 'file'
                            input.accept = '.json'
                            input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0]
                                if (file) {
                                    const reader = new FileReader()
                                    reader.onload = (e) => {
                                        const content = e.target?.result
                                        localStorage.setItem('importedLayout', content as string)
                                        router.push("/editor?import=true")
                                    }
                                    reader.readAsText(file)
                                }
                            }
                            input.click()
                        }}
                    >
                        <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: "#fffbeb",
                            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
                        }}>
                            <FileJson className="w-5 h-5" style={{ color: "#f59e0b" }} />
                        </div>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
                            Import Layout
                        </h3>
                        <p style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.4 }}>
                            Load a layout from a JSON file
                        </p>
                    </button>

                    {/* Settings */}
                    <button
                        onClick={() => router.push("/settings")}
                        className="group text-left rounded-2xl p-6 transition-all duration-300"
                        style={{
                            background: "#fff",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = "translateY(-4px)"
                            e.currentTarget.style.borderColor = "#64748b"
                            e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)"
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = "translateY(0)"
                            e.currentTarget.style.borderColor = "#e2e8f0"
                            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"
                        }}
                    >
                        <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: "#f1f5f9",
                            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
                        }}>
                            <Settings className="w-5 h-5" style={{ color: "#64748b" }} />
                        </div>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>
                            Settings
                        </h3>
                        <p style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.4 }}>
                            Customize brand and preferences
                        </p>
                    </button>
                </div>

                {/* Recent Layouts */}
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                >
                    <div className="px-6 py-5" style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <div className="flex items-center gap-2">
                            <Layout className="w-5 h-5" style={{ color: "#94a3b8" }} />
                            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e293b" }}>
                                Recent Layouts
                            </h2>
                        </div>
                        <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: 2 }}>
                            Your recently saved store layouts
                        </p>
                    </div>
                    <div className="px-6 py-5">
                        {recentLayouts.length === 0 ? (
                            <div className="text-center py-10">
                                <Layout className="w-14 h-14 mx-auto mb-4" style={{ color: "#cbd5e1", opacity: 0.5 }} />
                                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                                    No layouts yet. Create your first one!
                                </p>
                                <button
                                    onClick={() => router.push("/editor")}
                                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                                    style={{
                                        background: "linear-gradient(135deg, #10b981, #059669)",
                                        color: "#fff",
                                        boxShadow: "0 4px 16px rgba(16, 185, 129, 0.25)",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                                >
                                    <Layout className="w-4 h-4" />
                                    Open Editor
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {recentLayouts.map((layout) => (
                                    <div
                                        key={layout.id}
                                        className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200"
                                        style={{
                                            background: "transparent",
                                            border: "1px solid transparent",
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = "#f8fafc"
                                            e.currentTarget.style.borderColor = "#e2e8f0"
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = "transparent"
                                            e.currentTarget.style.borderColor = "transparent"
                                        }}
                                    >
                                        <div className="cursor-pointer flex-1" onClick={() => handleOpenLayout(layout)}>
                                            <h3 style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                                                {layout.name}
                                            </h3>
                                            <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 2 }}>
                                                {layout.shelves} shelves • {layout.lastModified}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleOpenLayout(layout)
                                                }}
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                                                style={{
                                                    background: "#ecfdf5",
                                                    color: "#059669",
                                                    border: "1px solid #d1fae5",
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = "#d1fae5"}
                                                onMouseLeave={e => e.currentTarget.style.background = "#ecfdf5"}
                                            >
                                                Open
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteLayout(layout.id)
                                                }}
                                                className="p-1.5 rounded-lg transition-all duration-200"
                                                style={{ color: "#cbd5e1" }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.color = "#ef4444"
                                                    e.currentTarget.style.background = "#fef2f2"
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.color = "#cbd5e1"
                                                    e.currentTarget.style.background = "transparent"
                                                }}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-10">
                    <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                        Aisly - Indoor Supermarket Navigation • Built by Bob the Best Builders
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}

// Made with Bob
