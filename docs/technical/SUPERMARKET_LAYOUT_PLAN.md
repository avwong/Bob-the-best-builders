# Aisly Demo Supermarket Layout Plan

## Executive Summary

This document outlines the complete strategy for creating a demo supermarket layout for Aisly, including:
- Recommended technology stack
- Supermarket layout design
- Data structure schema
- Visual rendering approach
- Sample product distribution
- Pathfinding integration
- Future scalability (Grid-Based Visual Editor)

---

## 1. Recommended Technology Stack

### Frontend: **Next.js 14+ with React & TypeScript**

**Rationale:**
- ✅ Fast development with hot reload
- ✅ Built-in routing and API routes (can handle backend in same project)
- ✅ TypeScript for type safety and better developer experience
- ✅ Excellent for demos and presentations
- ✅ Easy deployment (Vercel, Netlify)
- ✅ Modern, professional appearance
- ✅ Great ecosystem for UI libraries (Tailwind CSS, shadcn/ui)

**Alternative (if team prefers simpler):** React + Vite + TypeScript

### Map Rendering: **SVG with React Components**

**Rationale:**
- ✅ Scalable and resolution-independent
- ✅ Easy to animate routes
- ✅ Simple to add interactivity (hover, click)
- ✅ Can be styled with CSS
- ✅ Lightweight and performant
- ✅ Easy to manipulate with React state

**Why NOT Canvas:** Harder to make interactive elements, more complex for simple shapes
**Why NOT CSS Grid:** Limited for diagonal paths and complex routing visualization

---

## 2. Demo Supermarket Layout Design

### Layout Specifications

**Store Type:** Medium-sized supermarket (realistic for demo)

**Dimensions:**
- Grid: 60 units wide × 40 units tall
- Each unit = 1 meter (for realistic scale)
- Total: 60m × 40m = 2,400 m² (typical medium supermarket)

**Layout Structure:**

```
┌─────────────────────────────────────────────────────────┐
│  ENTRANCE                                               │
│  ════════                                               │
│                                                         │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐│
│  │  A  │  │  B  │  │  C  │  │  D  │  │  E  │  │  F  ││
│  │     │  │     │  │     │  │     │  │     │  │     ││
│  │     │  │     │  │     │  │     │  │     │  │     ││
│  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘│
│                                                         │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐│
│  │  G  │  │  H  │  │  I  │  │  J  │  │  K  │  │  L  ││
│  │     │  │     │  │     │  │     │  │     │  │     ││
│  │     │  │     │  │     │  │     │  │     │  │     ││
│  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘│
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   PRODUCE    │  │     DELI     │  │    BAKERY    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│  │ C1 │ │ C2 │ │ C3 │ │ C4 │ │ C5 │ │ C6 │ │ C7 │    │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘    │
│  CHECKOUTS                                    EXIT     │
└─────────────────────────────────────────────────────────┘
```

### Zone Breakdown

**Main Aisles (A-L):** 12 aisles
- Each aisle: 4m wide × 15m long
- 2m walkway between aisles
- Both sides have shelves (left/right)
- Each shelf divided into 3 sections (top/middle/bottom)

**Special Zones:**
- **Produce:** Fresh fruits and vegetables (8m × 6m)
- **Deli:** Meats and cheeses (8m × 6m)
- **Bakery:** Bread and pastries (8m × 6m)

**Checkouts:** 7 checkout lanes

**Entry/Exit Points:**
- Main entrance (top center)
- Exit (bottom right, near checkouts)

---

## 3. Data Structure Schema

### Store Layout JSON

```json
{
  "store_id": "demo_supermarket_001",
  "store_name": "Aisly Demo Market",
  "version": "1.0",
  "dimensions": {
    "width": 60,
    "height": 40,
    "unit": "meters"
  },
  "grid": {
    "cell_size": 1,
    "walkable_paths": [
      "Main horizontal corridor",
      "Vertical aisles",
      "Perimeter walkway"
    ]
  },
  "zones": [
    {
      "id": "entrance",
      "type": "entrance",
      "position": { "x": 30, "y": 2 },
      "dimensions": { "width": 4, "height": 2 }
    },
    {
      "id": "exit",
      "type": "exit",
      "position": { "x": 52, "y": 38 },
      "dimensions": { "width": 4, "height": 2 }
    }
  ],
  "aisles": [
    {
      "id": "A",
      "label": "Aisle A",
      "type": "standard_aisle",
      "position": { "x": 5, "y": 8 },
      "dimensions": { "width": 4, "height": 15 },
      "orientation": "vertical",
      "shelves": {
        "left": {
          "sections": ["top", "middle", "bottom"]
        },
        "right": {
          "sections": ["top", "middle", "bottom"]
        }
      },
      "category": "Beverages & Snacks"
    },
    {
      "id": "B",
      "label": "Aisle B",
      "type": "standard_aisle",
      "position": { "x": 11, "y": 8 },
      "dimensions": { "width": 4, "height": 15 },
      "orientation": "vertical",
      "shelves": {
        "left": { "sections": ["top", "middle", "bottom"] },
        "right": { "sections": ["top", "middle", "bottom"] }
      },
      "category": "Canned Goods & Pasta"
    }
    // ... Continue for aisles C-L
  ],
  "special_zones": [
    {
      "id": "produce",
      "label": "Produce",
      "type": "produce_section",
      "position": { "x": 5, "y": 28 },
      "dimensions": { "width": 8, "height": 6 },
      "category": "Fresh Produce"
    },
    {
      "id": "deli",
      "label": "Deli",
      "type": "deli_section",
      "position": { "x": 18, "y": 28 },
      "dimensions": { "width": 8, "height": 6 },
      "category": "Deli & Meats"
    },
    {
      "id": "bakery",
      "label": "Bakery",
      "type": "bakery_section",
      "position": { "x": 31, "y": 28 },
      "dimensions": { "width": 8, "height": 6 },
      "category": "Bakery"
    }
  ],
  "checkouts": [
    {
      "id": "checkout_1",
      "position": { "x": 8, "y": 36 },
      "dimensions": { "width": 2, "height": 3 }
    }
    // ... 7 checkouts total
  ],
  "walkways": [
    {
      "id": "main_corridor",
      "type": "horizontal",
      "position": { "x": 0, "y": 5 },
      "dimensions": { "width": 60, "height": 2 }
    },
    {
      "id": "perimeter_top",
      "type": "horizontal",
      "position": { "x": 0, "y": 0 },
      "dimensions": { "width": 60, "height": 4 }
    }
    // ... Additional walkways
  ]
}
```

### Product Database Schema

```typescript
interface Product {
  id: string;
  name: string;
  barcode?: string;
  category: string;
  location: {
    zone_type: 'aisle' | 'special_zone';
    zone_id: string; // e.g., "A", "produce"
    shelf_side?: 'left' | 'right'; // For aisles only
    shelf_section?: 'top' | 'middle' | 'bottom'; // For aisles only
    coordinates?: { x: number; y: number }; // Precise grid position
  };
  price?: number;
  image_url?: string;
}
```

**Example Products:**

```json
[
  {
    "id": "prod_001",
    "name": "Coca-Cola 2L",
    "barcode": "7501055300006",
    "category": "Beverages",
    "location": {
      "zone_type": "aisle",
      "zone_id": "A",
      "shelf_side": "left",
      "shelf_section": "middle",
      "coordinates": { "x": 6, "y": 12 }
    },
    "price": 2.99
  },
  {
    "id": "prod_002",
    "name": "Nutella 400g",
    "barcode": "8000500037560",
    "category": "Spreads",
    "location": {
      "zone_type": "aisle",
      "zone_id": "C",
      "shelf_side": "right",
      "shelf_section": "middle",
      "coordinates": { "x": 19, "y": 15 }
    },
    "price": 5.49
  },
  {
    "id": "prod_003",
    "name": "Fresh Bananas",
    "category": "Produce",
    "location": {
      "zone_type": "special_zone",
      "zone_id": "produce",
      "coordinates": { "x": 8, "y": 30 }
    },
    "price": 0.79
  }
]
```

---

## 4. Product Distribution Strategy

### Aisle Categories (Realistic Supermarket Organization)

| Aisle | Category | Example Products |
|-------|----------|------------------|
| **A** | Beverages & Snacks | Coca-Cola, Pepsi, Chips, Cookies |
| **B** | Canned Goods & Pasta | Tomato sauce, Beans, Spaghetti |
| **C** | Breakfast & Spreads | Cereal, Nutella, Peanut butter, Jam |
| **D** | Condiments & Sauces | Ketchup, Mustard, Mayo, Salad dressing |
| **E** | Baking & Spices | Flour, Sugar, Salt, Vanilla extract |
| **F** | International Foods | Asian, Mexican, Italian specialty items |
| **G** | Frozen Foods | Ice cream, Frozen pizza, Vegetables |
| **H** | Dairy & Eggs | Milk, Cheese, Yogurt, Butter |
| **I** | Personal Care | Shampoo, Soap, Toothpaste |
| **J** | Household Cleaning | Detergent, Bleach, Paper towels |
| **K** | Pet Supplies | Dog food, Cat food, Pet treats |
| **L** | Baby Products | Diapers, Baby food, Formula |

### Special Zones

- **Produce:** Fruits, Vegetables, Salads
- **Deli:** Sliced meats, Cheeses, Prepared foods
- **Bakery:** Fresh bread, Pastries, Cakes

---

## 5. Visual Rendering Approach

### SVG-Based Map Component

**Component Structure:**

```typescript
// SupermarketMap.tsx
interface MapProps {
  layout: StoreLayout;
  currentLocation?: { x: number; y: number };
  destination?: { x: number; y: number };
  route?: Array<{ x: number; y: number }>;
  highlightedAisle?: string;
}

const SupermarketMap: React.FC<MapProps> = ({
  layout,
  currentLocation,
  destination,
  route,
  highlightedAisle
}) => {
  return (
    <svg
      viewBox={`0 0 ${layout.dimensions.width} ${layout.dimensions.height}`}
      className="w-full h-full"
    >
      {/* Background */}
      <rect width="100%" height="100%" fill="#f5f5f5" />
      
      {/* Walkways */}
      {layout.walkways.map(walkway => (
        <rect
          key={walkway.id}
          x={walkway.position.x}
          y={walkway.position.y}
          width={walkway.dimensions.width}
          height={walkway.dimensions.height}
          fill="#ffffff"
          stroke="#ddd"
        />
      ))}
      
      {/* Aisles */}
      {layout.aisles.map(aisle => (
        <g key={aisle.id}>
          <rect
            x={aisle.position.x}
            y={aisle.position.y}
            width={aisle.dimensions.width}
            height={aisle.dimensions.height}
            fill={highlightedAisle === aisle.id ? "#fef3c7" : "#e5e7eb"}
            stroke="#9ca3af"
            strokeWidth="0.2"
            className="transition-all duration-300"
          />
          <text
            x={aisle.position.x + aisle.dimensions.width / 2}
            y={aisle.position.y + aisle.dimensions.height / 2}
            textAnchor="middle"
            fontSize="2"
            fontWeight="bold"
            fill="#374151"
          >
            {aisle.label}
          </text>
        </g>
      ))}
      
      {/* Route Path */}
      {route && route.length > 0 && (
        <polyline
          points={route.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-dash"
        />
      )}
      
      {/* Current Location Marker */}
      {currentLocation && (
        <circle
          cx={currentLocation.x}
          cy={currentLocation.y}
          r="1"
          fill="#10b981"
          stroke="#ffffff"
          strokeWidth="0.3"
        />
      )}
      
      {/* Destination Marker */}
      {destination && (
        <circle
          cx={destination.x}
          cy={destination.y}
          r="1"
          fill="#ef4444"
          stroke="#ffffff"
          strokeWidth="0.3"
        />
      )}
    </svg>
  );
};
```

### Styling & Animations

```css
/* Animated route line */
@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}

.animate-dash {
  stroke-dasharray: 5 5;
  stroke-dashoffset: 100;
  animation: dash 2s linear infinite;
}

/* Pulsing markers */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

.marker-pulse {
  animation: pulse 2s ease-in-out infinite;
}
```

---

## 6. Pathfinding Grid System

### Grid Configuration

**Grid Resolution:** 1 unit = 1 meter

**Walkable Cells:**
- All walkway areas
- Aisle entrances (top and bottom)
- Perimeter paths
- Special zone access points

**Non-walkable Cells:**
- Inside aisles (except entrances)
- Checkout counters
- Walls

### Pathfinding Algorithm: **A* (A-Star)**

**Why A*:**
- ✅ Optimal path finding
- ✅ Efficient for grid-based navigation
- ✅ Produces natural-looking routes
- ✅ Well-documented and easy to implement

**Implementation Approach:**

```typescript
interface GridCell {
  x: number;
  y: number;
  walkable: boolean;
  cost: number; // Movement cost (1 for normal, higher for crowded areas)
}

interface PathNode {
  x: number;
  y: number;
  g: number; // Cost from start
  h: number; // Heuristic to goal
  f: number; // Total cost (g + h)
  parent?: PathNode;
}

function findPath(
  grid: GridCell[][],
  start: { x: number; y: number },
  goal: { x: number; y: number }
): Array<{ x: number; y: number }> {
  // A* implementation
  // Returns array of coordinates forming the path
}

// Heuristic: Manhattan distance (works well for grid-based movement)
function heuristic(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
```

### Route Smoothing

After pathfinding, apply smoothing for more natural routes:

```typescript
function smoothPath(path: Array<{ x: number; y: number }>): Array<{ x: number; y: number }> {
  // Remove unnecessary waypoints
  // Create curved transitions at corners
  // Return smoother path
}
```

---

## 7. Sample Product Database (50 Products)

### Complete Product List for Demo

```json
[
  // Aisle A - Beverages & Snacks
  { "id": "A001", "name": "Coca-Cola 2L", "aisle": "A", "side": "left", "section": "middle" },
  { "id": "A002", "name": "Pepsi 2L", "aisle": "A", "side": "left", "section": "middle" },
  { "id": "A003", "name": "Sprite 2L", "aisle": "A", "side": "left", "section": "middle" },
  { "id": "A004", "name": "Orange Juice 1L", "aisle": "A", "side": "left", "section": "top" },
  { "id": "A005", "name": "Lays Chips Original", "aisle": "A", "side": "right", "section": "middle" },
  { "id": "A006", "name": "Doritos Nacho Cheese", "aisle": "A", "side": "right", "section": "middle" },
  { "id": "A007", "name": "Oreo Cookies", "aisle": "A", "side": "right", "section": "bottom" },
  
  // Aisle B - Canned Goods & Pasta
  { "id": "B001", "name": "Tomato Sauce 400g", "aisle": "B", "side": "left", "section": "middle" },
  { "id": "B002", "name": "Black Beans Can", "aisle": "B", "side": "left", "section": "middle" },
  { "id": "B003", "name": "Corn Can", "aisle": "B", "side": "left", "section": "middle" },
  { "id": "B004", "name": "Spaghetti 500g", "aisle": "B", "side": "right", "section": "middle" },
  { "id": "B005", "name": "Penne Pasta 500g", "aisle": "B", "side": "right", "section": "middle" },
  
  // Aisle C - Breakfast & Spreads
  { "id": "C001", "name": "Nutella 400g", "aisle": "C", "side": "right", "section": "middle" },
  { "id": "C002", "name": "Peanut Butter 500g", "aisle": "C", "side": "right", "section": "middle" },
  { "id": "C003", "name": "Strawberry Jam", "aisle": "C", "side": "right", "section": "middle" },
  { "id": "C004", "name": "Corn Flakes 500g", "aisle": "C", "side": "left", "section": "top" },
  { "id": "C005", "name": "Cheerios 400g", "aisle": "C", "side": "left", "section": "top" },
  { "id": "C006", "name": "Granola 350g", "aisle": "C", "side": "left", "section": "top" },
  
  // Aisle D - Condiments & Sauces
  { "id": "D001", "name": "Ketchup 500ml", "aisle": "D", "side": "left", "section": "middle" },
  { "id": "D002", "name": "Mustard 350ml", "aisle": "D", "side": "left", "section": "middle" },
  { "id": "D003", "name": "Mayonnaise 450ml", "aisle": "D", "side": "left", "section": "middle" },
  { "id": "D004", "name": "BBQ Sauce", "aisle": "D", "side": "right", "section": "middle" },
  { "id": "D005", "name": "Soy Sauce 250ml", "aisle": "D", "side": "right", "section": "middle" },
  
  // Aisle E - Baking & Spices
  { "id": "E001", "name": "All-Purpose Flour 1kg", "aisle": "E", "side": "left", "section": "bottom" },
  { "id": "E002", "name": "White Sugar 1kg", "aisle": "E", "side": "left", "section": "bottom" },
  { "id": "E003", "name": "Brown Sugar 500g", "aisle": "E", "side": "left", "section": "bottom" },
  { "id": "E004", "name": "Vanilla Extract", "aisle": "E", "side": "right", "section": "middle" },
  { "id": "E005", "name": "Cinnamon Powder", "aisle": "E", "side": "right", "section": "middle" },
  
  // Aisle H - Dairy & Eggs
  { "id": "H001", "name": "Whole Milk 1L", "aisle": "H", "side": "left", "section": "middle" },
  { "id": "H002", "name": "Skim Milk 1L", "aisle": "H", "side": "left", "section": "middle" },
  { "id": "H003", "name": "Cheddar Cheese 200g", "aisle": "H", "side": "right", "section": "middle" },
  { "id": "H004", "name": "Greek Yogurt 500g", "aisle": "H", "side": "right", "section": "middle" },
  { "id": "H005", "name": "Eggs 12 pack", "aisle": "H", "side": "left", "section": "bottom" },
  { "id": "H006", "name": "Butter 250g", "aisle": "H", "side": "right", "section": "middle" },
  
  // Aisle I - Personal Care
  { "id": "I001", "name": "Shampoo 400ml", "aisle": "I", "side": "left", "section": "middle" },
  { "id": "I002", "name": "Conditioner 400ml", "aisle": "I", "side": "left", "section": "middle" },
  { "id": "I003", "name": "Body Soap", "aisle": "I", "side": "right", "section": "middle" },
  { "id": "I004", "name": "Toothpaste", "aisle": "I", "side": "right", "section": "middle" },
  { "id": "I005", "name": "Toothbrush", "aisle": "I", "side": "right", "section": "middle" },
  
  // Produce Section
  { "id": "P001", "name": "Bananas", "zone": "produce" },
  { "id": "P002", "name": "Apples", "zone": "produce" },
  { "id": "P003", "name": "Tomatoes", "zone": "produce" },
  { "id": "P004", "name": "Lettuce", "zone": "produce" },
  { "id": "P005", "name": "Carrots", "zone": "produce" },
  
  // Bakery Section
  { "id": "BK001", "name": "White Bread", "zone": "bakery" },
  { "id": "BK002", "name": "Whole Wheat Bread", "zone": "bakery" },
  { "id": "BK003", "name": "Croissants", "zone": "bakery" },
  { "id": "BK004", "name": "Bagels", "zone": "bakery" },
  
  // Deli Section
  { "id": "DL001", "name": "Sliced Turkey", "zone": "deli" },
  { "id": "DL002", "name": "Sliced Ham", "zone": "deli" },
  { "id": "DL003", "name": "Swiss Cheese", "zone": "deli" }
]
```

---

## 8. Implementation Roadmap

### Phase 1: Core Structure (Hours 1-2)
- [ ] Set up Next.js project with TypeScript
- [ ] Create store layout JSON file
- [ ] Create product database JSON file
- [ ] Build basic SVG map component
- [ ] Render aisles and zones

### Phase 2: Interactivity (Hours 3-4)
- [ ] Implement product search functionality
- [ ] Add map highlighting on search
- [ ] Create product detail display
- [ ] Add location selection (entrance/aisle)

### Phase 3: Pathfinding (Hours 5-6)
- [ ] Implement A* pathfinding algorithm
- [ ] Create walkable grid from layout
- [ ] Generate routes between locations
- [ ] Render animated route on map

### Phase 4: Polish (Hours 7-8)
- [ ] Add animations and transitions
- [ ] Improve UI/UX design
- [ ] Add product images (optional)
- [ ] Test demo flow thoroughly

### Phase 5: AI Integration (Hours 9-10)
- [ ] Implement smart search with fuzzy matching
- [ ] Add shopping list optimization
- [ ] Optional: Simple chatbot interface

---

## 9. Future Scalability: Grid-Based Visual Editor

### Pitch Deck Content

**Slide: "Scalable to Any Supermarket"**

> "While this demo uses a pre-configured layout, Aisly includes a **Store Layout Designer** that allows any supermarket to create their custom map in minutes."

**Key Features to Mention:**

1. **Drag-and-Drop Interface**
   - Visual editor for creating store layouts
   - Pre-built components (aisles, zones, checkouts)
   - Grid-based snapping for alignment

2. **Flexible Configuration**
   - Support for any store size
   - Custom aisle naming (A-Z, 1-50, zones)
   - Multiple floor support

3. **Easy Product Assignment**
   - Bulk import from existing inventory systems
   - Visual product placement
   - Category-based auto-assignment

4. **Export & Deploy**
   - One-click deployment
   - QR code generation for each aisle
   - Mobile-optimized customer interface

### Mockup Description

Create a simple wireframe showing:
- Left panel: Component library (aisle, walkway, checkout, zone)
- Center: Canvas with grid and drag-and-drop functionality
- Right panel: Properties (dimensions, labels, categories)
- Bottom: Save/Export buttons

**Tool Suggestion:** Figma, Excalidraw, or even a simple PowerPoint slide

---

## 10. Technical Considerations

### Performance Optimization
- Lazy load product images
- Memoize pathfinding calculations
- Use React.memo for map components
- Debounce search input

### Mobile Responsiveness
- Touch-friendly map controls
- Pinch-to-zoom on map
- Responsive layout for small screens
- Bottom sheet for product details

### Accessibility
- Keyboard navigation
- Screen reader support
- High contrast mode
- Clear visual indicators

### Browser Compatibility
- Test on Chrome, Safari, Firefox
- Fallback for older browsers
- Progressive enhancement approach

---

## 11. Demo Script

### Recommended Demo Flow (3-5 minutes)

1. **Introduction (30 seconds)**
   - "Meet Aisly - Google Maps for supermarkets"
   - Show the problem: customers wasting time searching

2. **User Journey (2 minutes)**
   - Open app → Select entrance as current location
   - Search for "Nutella"
   - Watch map highlight Aisle C
   - See route appear with animation
   - Show product details (Aisle C, Right shelf, Middle section)

3. **Additional Features (1 minute)**
   - Search for multiple items
   - Show optimized route
   - Demonstrate smart search ("chocolate spread" → finds Nutella)

4. **Scalability Pitch (1 minute)**
   - "This works for any supermarket"
   - Show layout JSON structure
   - Mention future visual editor
   - Highlight business value

5. **Closing (30 seconds)**
   - Recap benefits
   - Call to action

---

## 12. Files to Create

### Project Structure

```
aisly-demo/
├── public/
│   ├── store-layout.json          # Store configuration
│   └── products.json               # Product database
├── src/
│   ├── components/
│   │   ├── SupermarketMap.tsx     # Main map component
│   │   ├── SearchBar.tsx          # Product search
│   │   ├── ProductCard.tsx        # Product details
│   │   ├── RouteDisplay.tsx       # Route information
│   │   └── LocationSelector.tsx   # Current location picker
│   ├── lib/
│   │   ├── pathfinding.ts         # A* algorithm
│   │   ├── types.ts               # TypeScript interfaces
│   │   └── utils.ts               # Helper functions
│   ├── app/
│   │   ├── page.tsx               # Main page
│   │   └── layout.tsx             # Root layout
│   └── styles/
│       └── globals.css            # Global styles
├── docs/
│   ├── LAYOUT_PLAN.md             # This document
│   └── PITCH_DECK.md              # Presentation notes
└── package.json
```

---

## 13. Next Steps

1. **Review this plan** - Confirm approach and make adjustments
2. **Set up development environment** - Install Next.js, TypeScript
3. **Create layout and product JSON files** - Based on schemas above
4. **Build map component** - Start with static rendering
5. **Implement search** - Connect products to map
6. **Add pathfinding** - Implement A* algorithm
7. **Polish and test** - Animations, UX improvements
8. **Prepare pitch** - Create presentation materials

---

## Questions for Refinement

1. Do you want to adjust the number of aisles (currently 12)?
2. Should we include more special zones (pharmacy, electronics)?
3. Do you prefer a specific color scheme for the map?
4. Should we create a mobile-first or desktop-first design?
5. Do you want QR code scanning in the demo, or just manual location selection?

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-16  
**Status:** Ready for Review