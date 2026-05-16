"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Settings, FileJson, Layout } from "lucide-react"

export default function Dashboard() {
    const router = useRouter()
    const [recentLayouts] = useState([
        { id: "1", name: "Main Store Layout", lastModified: "2026-05-16", shelves: 12 },
        { id: "2", name: "Express Store", lastModified: "2026-05-15", shelves: 6 },
    ])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Supermarket Layout Editor
                    </h1>
                    <p className="text-gray-600">
                        Create and manage your store layouts with ease
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500">
                        <CardHeader>
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                                <Plus className="w-6 h-6 text-white" />
                            </div>
                            <CardTitle>New Layout</CardTitle>
                            <CardDescription>
                                Start creating a new store layout from scratch
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={() => router.push("/editor")}
                                className="w-full"
                            >
                                Create New
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow border-2 border-transparent hover:border-green-500">
                        <CardHeader>
                            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                                <FileJson className="w-6 h-6 text-white" />
                            </div>
                            <CardTitle>Import Layout</CardTitle>
                            <CardDescription>
                                Load an existing layout from a JSON file
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={(e) => {
                                    e.stopPropagation()
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
                                Import JSON
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow border-2 border-transparent hover:border-purple-500">
                        <CardHeader>
                            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                                <Settings className="w-6 h-6 text-white" />
                            </div>
                            <CardTitle>Settings</CardTitle>
                            <CardDescription>
                                Customize colors and preferences for your store
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => router.push("/settings")}
                            >
                                Configure
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Layouts */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Layout className="w-5 h-5" />
                            Recent Layouts
                        </CardTitle>
                        <CardDescription>
                            Your recently edited store layouts
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentLayouts.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Layout className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>No layouts yet. Create your first one!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentLayouts.map((layout) => (
                                    <div
                                        key={layout.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="cursor-pointer flex-1" onClick={() => router.push("/editor")}>
                                            <h3 className="font-semibold text-gray-900">{layout.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {layout.shelves} shelves • Last modified: {layout.lastModified}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                router.push("/editor")
                                            }}
                                        >
                                            Open
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Features */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Layout className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="font-semibold mb-2 text-gray-900">Drag & Drop</h3>
                        <p className="text-sm text-gray-600">
                            Intuitive interface for creating layouts
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileJson className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="font-semibold mb-2 text-gray-900">Export & Import</h3>
                        <p className="text-sm text-gray-600">
                            Save and share your layouts as JSON
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Settings className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="font-semibold mb-2 text-gray-900">Customizable</h3>
                        <p className="text-sm text-gray-600">
                            Adapt colors to match your brand
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Made with Bob
