# Aisly Store Layout Designer - Visual Editor Mockup

## Purpose
This document describes the visual mockup for the **Grid-Based Visual Editor** - a future feature that allows supermarket owners to design their own store layouts. Use this for your pitch deck to demonstrate scalability.

---

## Mockup Overview

### Main Interface Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  Aisly Store Layout Designer                    [Save] [Export] [?] │
├──────────────┬──────────────────────────────────────┬───────────────┤
│              │                                      │               │
│  COMPONENTS  │         CANVAS (Grid View)          │  PROPERTIES   │
│              │                                      │               │
│  [Search]    │  ┌────────────────────────────────┐ │  Selected:    │
│              │  │                                │ │  Aisle A      │
│  📦 Aisles   │  │    [Drag components here]     │ │               │
│   ├─ Standard│  │                                │ │  Label: A     │
│   ├─ Wide    │  │         60m × 40m Grid        │ │  Width: 4m    │
│   └─ Narrow  │  │                                │ │  Height: 15m  │
│              │  │    [Grid with snap-to-grid]   │ │  Category:    │
│  🚶 Walkways │  │                                │ │  [Dropdown]   │
│   ├─ Corridor│  │                                │ │               │
│   └─ Path    │  │                                │ │  Shelves:     │
│              │  │                                │ │  ☑ Left side  │
│  🏪 Zones    │  │                                │ │  ☑ Right side │
│   ├─ Produce │  │                                │ │               │
│   ├─ Bakery  │  │                                │ │  Sections:    │
│   ├─ Deli    │  │                                │ │  ☑ Top        │
│   └─ Pharmacy│  │                                │ │  ☑ Middle     │
│              │  │                                │ │  ☑ Bottom     │
│  💳 Checkouts│  │                                │ │               │
│              │  │                                │ │  [Delete]     │
│  🚪 Entry/Exit│ │                                │ │               │
│              │  └────────────────────────────────┘ │               │
│              │                                      │               │
│  [+ Custom]  │  Zoom: [−] 100% [+]  Grid: [On/Off] │               │
│              │                                      │               │
└──────────────┴──────────────────────────────────────┴───────────────┘
```

---

## Detailed Component Descriptions

### 1. Left Panel: Component Library

**Purpose:** Drag-and-drop components to build the store layout

**Components Available:**

#### 📦 Aisles
- **Standard Aisle** (4m × 15m)
  - Default aisle with shelves on both sides
  - Auto-labeled (A, B, C... or 1, 2, 3...)
  
- **Wide Aisle** (6m × 15m)
  - For high-traffic areas
  
- **Narrow Aisle** (3m × 15m)
  - For specialty sections

#### 🚶 Walkways
- **Main Corridor** (customizable width)
  - Primary customer pathway
  
- **Side Path** (2m width)
  - Secondary walkways

#### 🏪 Special Zones
- **Produce Section** (customizable size)
- **Bakery** (customizable size)
- **Deli** (customizable size)
- **Pharmacy** (customizable size)
- **Electronics** (customizable size)

#### 💳 Checkouts
- **Standard Checkout** (2m × 3m)
- **Self-Checkout** (3m × 3m)
- **Express Lane** (2m × 2m)

#### 🚪 Entry/Exit Points
- **Main Entrance**
- **Side Entrance**
- **Exit**
- **Emergency Exit**

#### Custom Components
- **+ Create Custom Zone**
  - Define custom dimensions
  - Add custom labels

---

### 2. Center Panel: Canvas (Grid View)

**Purpose:** Visual workspace for designing the store layout

**Features:**

#### Grid System
- Visible grid lines (1m × 1m)
- Snap-to-grid functionality (can be toggled off)
- Customizable grid size
- Zoom controls (50% - 200%)

#### Interaction Methods
- **Drag & Drop:** Drag components from left panel onto canvas
- **Click to Place:** Click component, then click canvas location
- **Multi-Select:** Shift+click or drag selection box
- **Copy/Paste:** Duplicate components quickly
- **Undo/Redo:** Full history support

#### Visual Indicators
- **Selected Component:** Blue outline with resize handles
- **Hover State:** Light highlight
- **Collision Detection:** Red outline if overlapping
- **Alignment Guides:** Dashed lines when aligning with other components

#### Canvas Controls (Bottom Bar)
```
[Zoom Out] [−] 100% [+] [Zoom In] | Grid: [On/Off] | Snap: [On/Off] | [Ruler] [Guide Lines]
```

---

### 3. Right Panel: Properties

**Purpose:** Configure selected component details

**Dynamic Properties Based on Selection:**

#### For Aisles:
```
┌─────────────────────┐
│ AISLE PROPERTIES    │
├─────────────────────┤
│ Label: [A        ]  │
│ Width: [4      ] m  │
│ Height: [15    ] m  │
│                     │
│ Category:           │
│ [Beverages ▼]       │
│                     │
│ Shelves:            │
│ ☑ Left side         │
│ ☑ Right side        │
│                     │
│ Shelf Sections:     │
│ ☑ Top               │
│ ☑ Middle            │
│ ☑ Bottom            │
│                     │
│ Color: [🎨]         │
│                     │
│ [Apply] [Delete]    │
└─────────────────────┘
```

#### For Special Zones:
```
┌─────────────────────┐
│ ZONE PROPERTIES     │
├─────────────────────┤
│ Name: [Produce   ]  │
│ Width: [8      ] m  │
│ Height: [6     ] m  │
│                     │
│ Type:               │
│ [Produce ▼]         │
│                     │
│ Sub-sections:       │
│ ☑ Fruits            │
│ ☑ Vegetables        │
│ ☑ Salads            │
│                     │
│ Color: [🎨]         │
│                     │
│ [Apply] [Delete]    │
└─────────────────────┘
```

#### For Walkways:
```
┌─────────────────────┐
│ WALKWAY PROPERTIES  │
├─────────────────────┤
│ Type: [Corridor ▼]  │
│ Width: [2      ] m  │
│ Length: [Auto   ]   │
│                     │
│ Traffic Level:      │
│ ○ Low               │
│ ● Medium            │
│ ○ High              │
│                     │
│ [Apply] [Delete]    │
└─────────────────────┘
```

---

## Top Toolbar Actions

```
┌─────────────────────────────────────────────────────────────────┐
│ 🏪 Aisly Store Layout Designer                                  │
│                                                                  │
│ [New] [Open] [Save] [Save As] | [Undo] [Redo] | [Export JSON]  │
│                                                                  │
│ Store Name: [Demo Supermarket        ]  Size: 60m × 40m        │
└─────────────────────────────────────────────────────────────────┘
```

**Actions:**
- **New:** Start fresh layout
- **Open:** Load existing layout
- **Save:** Save current layout
- **Save As:** Save with new name
- **Undo/Redo:** History navigation
- **Export JSON:** Download layout configuration file

---

## User Workflow Example

### Step-by-Step: Creating a Store Layout

1. **Set Store Dimensions**
   - Enter width: 60m
   - Enter height: 40m
   - Grid automatically adjusts

2. **Add Entrance**
   - Drag "Main Entrance" from left panel
   - Place at top center of canvas
   - Entrance snaps to grid

3. **Create Main Corridor**
   - Drag "Main Corridor" component
   - Stretch horizontally across store
   - Adjust width to 3m

4. **Add Aisles**
   - Drag "Standard Aisle" component
   - Place in grid
   - System auto-labels as "Aisle A"
   - Repeat for multiple aisles (B, C, D...)
   - Aisles auto-align with snap-to-grid

5. **Configure Aisle Properties**
   - Click on "Aisle A"
   - Right panel shows properties
   - Select category: "Beverages & Snacks"
   - Enable both shelf sides
   - Enable all sections (top, middle, bottom)

6. **Add Special Zones**
   - Drag "Produce" zone
   - Place in designated area
   - Resize to 8m × 6m
   - Repeat for Bakery, Deli

7. **Add Checkouts**
   - Drag "Standard Checkout" components
   - Place near exit
   - Arrange in row (7 checkouts)

8. **Add Exit**
   - Drag "Exit" component
   - Place at bottom right

9. **Review & Adjust**
   - Zoom out to see full layout
   - Check for proper spacing
   - Ensure all walkways are accessible
   - Verify no overlapping components

10. **Export**
    - Click "Export JSON"
    - System generates store-layout.json
    - File ready for use in Aisly app

---

## Visual Design Elements

### Color Scheme

```
Aisles:          #E5E7EB (Gray-200)
Walkways:        #FFFFFF (White)
Special Zones:   #FEF3C7 (Yellow-100)
Checkouts:       #DBEAFE (Blue-100)
Entry/Exit:      #D1FAE5 (Green-100)
Selected:        #3B82F6 (Blue-500 outline)
Grid Lines:      #D1D5DB (Gray-300)
Background:      #F9FAFB (Gray-50)
```

### Typography

```
Headers:         Inter Bold, 16px
Labels:          Inter Medium, 14px
Properties:      Inter Regular, 13px
Grid Numbers:    Inter Regular, 10px, Gray-400
```

### Icons

Use simple, recognizable icons:
- 📦 Box for aisles
- 🚶 Walking person for walkways
- 🏪 Store for special zones
- 💳 Credit card for checkouts
- 🚪 Door for entry/exit

---

## Advanced Features (Future Enhancements)

### Templates
```
┌─────────────────────────────┐
│ Start with a Template       │
├─────────────────────────────┤
│ ○ Small Store (10 aisles)   │
│ ○ Medium Store (20 aisles)  │
│ ○ Large Store (30+ aisles)  │
│ ○ Blank Canvas              │
│                             │
│        [Continue]           │
└─────────────────────────────┘
```

### Auto-Layout Suggestions
- AI-powered layout optimization
- Traffic flow analysis
- Accessibility compliance checking

### Collaboration
- Multi-user editing
- Comment system
- Version history

### Import Options
- Upload floor plan image
- Trace over existing layout
- Import from CAD files

---

## Export Format

### Generated JSON Structure

```json
{
  "store_id": "generated_uuid",
  "store_name": "Demo Supermarket",
  "created_at": "2026-05-16T06:30:00Z",
  "dimensions": {
    "width": 60,
    "height": 40,
    "unit": "meters"
  },
  "aisles": [
    {
      "id": "aisle_a",
      "label": "A",
      "position": { "x": 5, "y": 8 },
      "dimensions": { "width": 4, "height": 15 },
      "category": "Beverages & Snacks",
      "shelves": {
        "left": { "sections": ["top", "middle", "bottom"] },
        "right": { "sections": ["top", "middle", "bottom"] }
      }
    }
  ],
  "special_zones": [...],
  "walkways": [...],
  "checkouts": [...],
  "entry_exit": [...]
}
```

---

## Mockup Creation Tools

### Recommended Tools for Creating Visual Mockup:

1. **Figma** (Recommended)
   - Free tier available
   - Collaborative
   - Easy to share
   - Professional results

2. **Excalidraw**
   - Quick sketches
   - Hand-drawn style
   - Free and open-source

3. **PowerPoint/Google Slides**
   - Simple shapes and text
   - Quick to create
   - Easy to present

4. **Balsamiq**
   - Wireframe-focused
   - Sketch-like appearance
   - Good for mockups

---

## Pitch Deck Integration

### Slide Structure Recommendation

**Slide 1: Problem**
- "Every supermarket has a unique layout"
- "Current solution: Manual mapping for each store"

**Slide 2: Solution - Visual Editor**
- Show mockup of the editor interface
- Highlight drag-and-drop simplicity

**Slide 3: Key Features**
- ✅ Drag-and-drop interface
- ✅ Pre-built components
- ✅ 15-minute setup time
- ✅ Export to JSON
- ✅ Works with any store size

**Slide 4: Demo**
- Show JSON configuration
- "This demo uses a pre-configured layout..."
- "But any store can create their own in minutes"

**Slide 5: Business Value**
- Scalable to any supermarket
- No technical knowledge required
- One-time setup, continuous use
- Future: AI-powered optimization

---

## Key Talking Points for Pitch

1. **Scalability**
   > "While our demo shows one store layout, Aisly's Visual Editor allows any supermarket—regardless of size or configuration—to create their custom map in about 15 minutes."

2. **Ease of Use**
   > "Store managers simply drag and drop components. No coding required. No technical expertise needed."

3. **Flexibility**
   > "Whether you're a small corner store with 5 aisles or a hypermarket with 50 aisles, the system adapts to your needs."

4. **Future-Ready**
   > "We're building toward AI-powered layout optimization, automatic floor plan recognition, and real-time inventory integration."

5. **JSON-Based**
   > "The entire layout is stored as a simple JSON file, making it easy to backup, version control, and integrate with existing systems."

---

## Technical Implementation Notes (For Future Development)

### Frontend Framework
- React with TypeScript
- React DnD (Drag and Drop library)
- Konva.js or Fabric.js for canvas manipulation
- Zustand or Redux for state management

### Key Libraries
```json
{
  "react-dnd": "^16.0.1",
  "react-dnd-html5-backend": "^16.0.1",
  "konva": "^9.2.0",
  "react-konva": "^18.2.10",
  "zustand": "^4.4.1"
}
```

### Data Persistence
- Local storage for drafts
- Cloud storage for saved layouts
- Export/Import JSON functionality

---

## Mockup Checklist

When creating the visual mockup, ensure you include:

- [ ] Three-panel layout (Components | Canvas | Properties)
- [ ] Component library with icons
- [ ] Grid-based canvas with sample layout
- [ ] Properties panel showing aisle configuration
- [ ] Top toolbar with Save/Export buttons
- [ ] Zoom controls
- [ ] Color-coded components
- [ ] Clear labels and measurements
- [ ] Professional, clean design
- [ ] Annotations explaining key features

---

## Sample Mockup Annotations

Add these callouts to your mockup:

1. **Component Library** → "Drag pre-built components onto canvas"
2. **Grid Canvas** → "Visual workspace with snap-to-grid"
3. **Properties Panel** → "Configure selected component details"
4. **Export Button** → "Generate JSON configuration file"
5. **Auto-Labeling** → "Aisles automatically labeled A, B, C..."

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-16  
**Status:** Ready for Mockup Creation