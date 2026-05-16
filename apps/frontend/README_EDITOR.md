# Supermarket Layout Editor

Editor visual para diseñar layouts de supermercados con funcionalidad de arrastrar y soltar.

## Características

### ✨ Funcionalidades Principales

- **Editor Visual de Cuadrícula**: Canvas SVG interactivo con sistema de cuadrícula configurable
- **Arrastrar y Soltar**: Mueve elementos fácilmente por el canvas
- **Panel de Herramientas**: Selecciona diferentes tipos de elementos para agregar
- **Panel de Propiedades**: Edita propiedades de elementos seleccionados
- **Snap to Grid**: Alineación automática a la cuadrícula
- **Zoom**: Controles de zoom para mejor visualización
- **Exportar JSON**: Descarga el layout como archivo JSON

### 🏗️ Tipos de Elementos

1. **Aisles (Pasillos)**: Pasillos estándar con estantes en ambos lados
2. **Special Zones (Zonas Especiales)**: Produce, Deli, Bakery, Pharmacy
3. **Walkways (Pasillos)**: Áreas de circulación para clientes
4. **Checkouts (Cajas)**: Puntos de pago
5. **Entry/Exit (Entrada/Salida)**: Puntos de acceso

## Estructura de Componentes

```
src/
├── components/
│   ├── ui/                          # Componentes base de Shadcn UI
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── separator.tsx
│   └── editor/                      # Componentes del editor
│       ├── SupermarketEditor.tsx    # Componente principal
│       ├── GridCanvas.tsx           # Canvas SVG interactivo
│       ├── EditorControls.tsx       # Panel de controles izquierdo
│       └── PropertiesPanel.tsx      # Panel de propiedades derecho
├── types/
│   └── supermarket.ts               # Tipos TypeScript
└── lib/
    └── utils.ts                     # Utilidades (cn helper)
```

## Uso

### Iniciar el Editor

```bash
cd apps/frontend
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Controles del Editor

#### Panel Izquierdo - Herramientas

- **Select**: Modo de selección (clic para seleccionar elementos)
- **Aisle**: Agregar nuevo pasillo
- **Zone**: Agregar zona especial
- **Walkway**: Agregar pasillo de circulación
- **Checkout**: Agregar caja registradora
- **Entrance/Exit**: Agregar entrada o salida

#### Acciones Rápidas

- **Add Aisle**: Crea un nuevo pasillo con configuración por defecto
- **Add Special Zone**: Crea una nueva zona especial

#### Configuración de Cuadrícula

- **Grid Size**: Tamaño de cada celda de la cuadrícula (en metros)
- **Show Grid**: Mostrar/ocultar líneas de cuadrícula
- **Snap to Grid**: Activar/desactivar alineación automática

#### Controles de Vista

- **Zoom**: Ajusta el nivel de zoom (50% - 200%)
- **Reset**: Restaura zoom al 100%

#### Acciones

- **Save Layout**: Guarda el layout (actualmente en consola)
- **Export JSON**: Descarga el layout como archivo JSON

### Panel Derecho - Propiedades

Cuando seleccionas un elemento, puedes editar:

- **ID**: Identificador único (solo lectura)
- **Label**: Etiqueta visible del elemento
- **Position**: Coordenadas X, Y en metros
- **Dimensions**: Ancho y alto en metros
- **Category**: Categoría del elemento (para aisles y zones)
- **Shelves**: Configuración de estantes (solo para aisles)

### Interacción con el Canvas

1. **Seleccionar**: Clic en un elemento para seleccionarlo
2. **Mover**: Arrastra un elemento seleccionado para moverlo
3. **Deseleccionar**: Clic en el fondo del canvas

## Formato de Datos

### Estructura del Layout

```typescript
interface StoreLayout {
  store_id: string
  store_name: string
  version: string
  dimensions: {
    width: number
    height: number
    unit: string
  }
  grid: {
    cell_size: number
    walkable_paths: string[]
  }
  aisles: Aisle[]
  special_zones: SpecialZone[]
  checkouts: Checkout[]
  walkways: Walkway[]
  entry_exit: EntryExit[]
}
```

### Ejemplo de Aisle

```json
{
  "id": "aisle_a",
  "label": "A",
  "type": "standard_aisle",
  "position": { "x": 5, "y": 8 },
  "dimensions": { "width": 4, "height": 15 },
  "orientation": "vertical",
  "category": "Beverages & Snacks",
  "shelves": {
    "left": { "sections": ["top", "middle", "bottom"] },
    "right": { "sections": ["top", "middle", "bottom"] }
  }
}
```

## Tecnologías Utilizadas

- **Next.js 16.2.6**: Framework React
- **React 19**: Biblioteca UI
- **TypeScript**: Tipado estático
- **Tailwind CSS v4**: Estilos
- **Shadcn UI**: Componentes UI
- **Lucide React**: Iconos
- **SVG**: Renderizado del canvas

## Próximos Pasos

### Funcionalidades Planeadas

- [ ] Deshacer/Rehacer (Undo/Redo)
- [ ] Copiar/Pegar elementos
- [ ] Selección múltiple
- [ ] Plantillas predefinidas
- [ ] Importar layouts existentes
- [ ] Asignación de productos a ubicaciones
- [ ] Visualización de rutas
- [ ] Modo de vista previa
- [ ] Colaboración en tiempo real
- [ ] Integración con backend

### Mejoras de UX

- [ ] Atajos de teclado
- [ ] Guías de alineación
- [ ] Reglas y medidas
- [ ] Capas (layers)
- [ ] Historial de cambios
- [ ] Validación de colisiones
- [ ] Auto-guardado

## Desarrollo

### Agregar Nuevos Componentes UI

Para agregar más componentes de Shadcn UI:

```bash
# Ejemplo: agregar el componente Select
npx shadcn@latest add select
```

### Estructura de Archivos

- `src/components/ui/`: Componentes base reutilizables
- `src/components/editor/`: Componentes específicos del editor
- `src/types/`: Definiciones de tipos TypeScript
- `src/lib/`: Utilidades y helpers
- `public/`: Archivos estáticos y layouts de ejemplo

## Troubleshooting

### Errores de TypeScript

Los errores de TypeScript relacionados con módulos faltantes se resolverán automáticamente después de que se complete la instalación de dependencias.

### Canvas no Responde

Si el canvas no responde al arrastrar:
1. Verifica que el modo "Select" esté activo
2. Asegúrate de hacer clic directamente en un elemento
3. Revisa la consola del navegador para errores

### Elementos no se Alinean

Si los elementos no se alinean correctamente:
1. Activa "Snap to Grid"
2. Ajusta el "Grid Size" a un valor apropiado
3. Verifica que las dimensiones sean múltiplos del grid size

## Contribuir

Para contribuir al desarrollo del editor:

1. Crea una rama para tu feature
2. Implementa los cambios
3. Asegúrate de que no haya errores de TypeScript
4. Prueba la funcionalidad en el navegador
5. Crea un pull request

## Licencia

Este proyecto es parte del hackathon de navegación en supermercados.