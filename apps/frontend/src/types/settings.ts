export interface ColorSettings {
    brandColor: string
    mapFloor: string
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
        brandColor: "#10b981",
        mapFloor: "#f8fafc",
    },
    gridSize: 1,
    snapToGrid: true,
    showGrid: true,
}

// Made with Bob
