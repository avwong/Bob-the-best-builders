# 🎨 Explicación de Settings (Configuración)

## ¿Qué hace la página de Settings?

La página de **Settings** (`/settings`) permite personalizar la apariencia y comportamiento del **Editor de Layouts** del supermercado. Es una herramienta para que cada tienda pueda adaptar el editor a su identidad de marca.

---

## 🎯 Funcionalidades Principales

### 1. **Información de la Tienda**
Permite configurar:
- **Nombre de la tienda**: Identificador personalizado
- **ID de la tienda**: Código único para la tienda

### 2. **Colores de Marca** 🎨
Personaliza los colores del editor para que coincidan con la identidad visual de tu marca:

#### Colores Configurables:

| Color | Uso | Ejemplo |
|-------|-----|---------|
| **Primary** | Botones y elementos destacados | Azul (#3b82f6) |
| **Secondary** | Pasillos y estantes | Gris claro (#e5e7eb) |
| **Accent** | Zonas especiales | Naranja (#f59e0b) |
| **Background** | Fondo del canvas | Blanco (#ffffff) |
| **Text** | Etiquetas y texto | Gris oscuro (#374151) |

#### ¿Cómo funciona?
- Cada color tiene un **selector de color visual** (color picker)
- También puedes ingresar el código hexadecimal manualmente
- Los cambios se previsualizan en tiempo real
- Los colores se aplican al **editor de layouts** (no al app del cliente)

### 3. **Preferencias del Editor**
Configura el comportamiento predeterminado:

- **Tamaño de cuadrícula**: Define el tamaño de cada celda (0.5 - 5 metros)
- **Snap to Grid**: Activa/desactiva el ajuste automático a la cuadrícula
- **Mostrar cuadrícula**: Muestra/oculta las líneas de la cuadrícula

---

## 💾 Almacenamiento

Los settings se guardan en **localStorage** del navegador:
- Persisten entre sesiones
- Son específicos por navegador/dispositivo
- Se pueden resetear a valores predeterminados

---

## 🎨 Ejemplo de Uso

### Caso: Supermercado "Fresh Market"

**Antes** (colores predeterminados):
- Primary: Azul estándar
- Accent: Naranja estándar

**Después** (personalizado):
- Primary: Verde (#10b981) - color de marca
- Accent: Amarillo (#fbbf24) - color secundario de marca
- Nombre: "Fresh Market"

**Resultado**: El editor ahora usa los colores de Fresh Market, haciendo que la herramienta se sienta parte de su ecosistema de marca.

---

## 🔄 Flujo de Trabajo

```
1. Usuario abre /settings
2. Modifica colores y preferencias
3. Hace clic en "Save Settings"
4. Settings se guardan en localStorage
5. Al abrir /editor, se aplican los colores personalizados
6. Los elementos del editor usan los nuevos colores
```

---

## 🎯 Beneficios

✅ **Consistencia de Marca**: Editor alineado con identidad visual  
✅ **Flexibilidad**: Cada tienda puede tener su propia configuración  
✅ **Facilidad de Uso**: Interfaz visual intuitiva  
✅ **Persistencia**: Configuración guardada automáticamente  
✅ **Reversible**: Botón de reset a valores predeterminados  

---

## 🔧 Implementación Técnica

### Tipos de Datos
```typescript
interface ColorSettings {
    primary: string      // Color principal
    secondary: string    // Color secundario
    accent: string       // Color de acento
    background: string   // Fondo
    text: string        // Texto
}

interface AppSettings {
    storeName: string
    storeId: string
    colors: ColorSettings
    gridSize: number
    snapToGrid: boolean
    showGrid: boolean
}
```

### Valores Predeterminados
```typescript
{
    storeName: "My Supermarket",
    storeId: "store_001",
    colors: {
        primary: "#3b82f6",    // Azul
        secondary: "#e5e7eb",  // Gris claro
        accent: "#f59e0b",     // Naranja
        background: "#ffffff", // Blanco
        text: "#374151"        // Gris oscuro
    },
    gridSize: 1,
    snapToGrid: true,
    showGrid: true
}
```

---

## 📝 Notas Importantes

⚠️ **Los colores de Settings solo afectan al EDITOR**, no a la app del cliente (`/shop`)  
⚠️ Los settings son locales al navegador (no se sincronizan entre dispositivos)  
⚠️ Para aplicar cambios, es necesario hacer clic en "Save Settings"  

---

## 🚀 Mejoras Futuras Sugeridas

1. **Sincronización en la nube**: Guardar settings en base de datos
2. **Temas predefinidos**: Plantillas de colores populares
3. **Exportar/Importar**: Compartir configuraciones entre tiendas
4. **Vista previa en vivo**: Ver cambios en el editor sin guardar
5. **Más opciones**: Fuentes, tamaños, estilos de bordes

---

*Documento creado por Bob - Tu asistente de desarrollo* 🤖