export interface ColorSettings {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
}

export interface AppSettings {
    storeName: string
    storeId: string
    colors: ColorSettings
    gridSize: number
    snapToGrid: boolean
    showGrid: boolean
}

export const defaultSettings: AppSettings = {
    storeName: "My Supermarket",
    storeId: "store_001",
    colors: {
        primary: "#3b82f6",
        secondary: "#e5e7eb",
        accent: "#f59e0b",
        background: "#ffffff",
        text: "#374151",
    },
    gridSize: 1,
    snapToGrid: true,
    showGrid: true,
}

// Made with Bob
