# Aisly — Indoor Supermarket Navigation

## Project Overview

Aisly is a hackathon MVP designed to help customers navigate supermarkets more efficiently.

The core idea is to create a "Google Maps for supermarkets" experience.

When a customer enters the supermarket, they can:
- Search for a product
- View the product location on a supermarket map
- Receive a visual route to the product
- Optimize shopping experience and reduce time spent searching

This project is intentionally scoped as a realistic MVP for a hackathon with approximately 1 day and 9 hours remaining.

---

# Main Goal

Build a functional demo that includes:

- Product search
- Interactive supermarket map
- Visual route generation
- Product location database
- Simple admin system for assigning product locations

The focus is:
- Strong UX
- Smooth demo experience
- Clear problem-solving
- Simple but polished implementation

NOT on advanced infrastructure or production-level systems.

---

# Core User Flow

1. User opens the app
2. User selects their current location OR scans a QR code
3. User searches for a product
4. The app finds the product
5. The supermarket map highlights the destination
6. A visual route is drawn on the map
7. The app displays:
   - aisle
   - shelf side
   - shelf section

Example:
- "Nutella"
- Aisle C
- Right shelf
- Middle section

---

# IMPORTANT PROJECT SCOPE

This project is intentionally designed as a simplified MVP.

DO NOT attempt:
- Real indoor GPS
- Real-time indoor positioning
- Full computer vision product recognition
- 3D mapping
- Complex authentication systems
- Production-ready architecture
- Hardware integrations

The priority is delivering a working, visually impressive demo.

---

# Indoor Positioning Decision

Indoor GPS inside supermarkets is inaccurate and difficult.

Standard smartphone GPS is NOT precise enough to distinguish between supermarket aisles.

Therefore, the project will use:

## Option A — Manual Location Selection

The user selects:
- Entrance
- Aisle A
- Aisle B
- Checkout
etc.

OR

## Option B — QR Code Positioning

Each aisle contains a QR code.
The user scans the QR code.
The app determines the user's current aisle.

This is:
- Low cost
- Realistic
- Hackathon-friendly
- Easy to implement
- Commercially viable

---

# Technical Architecture

## Frontend
Recommended:
- Next.js
- React

Responsibilities:
- UI
- Supermarket map
- Search bar
- Route visualization
- Animations

---

## Backend
Recommended:
- Node.js
OR
- .NET

Responsibilities:
- APIs
- Product management
- Route logic
- Database communication

---

## Database
Recommended:
- Azure SQL Database
OR
- PostgreSQL

Main product schema:

Products table:
- id
- name
- barcode
- aisle
- shelf_side
- shelf_section

---

# Map System

The supermarket map should NOT be realistic.

Use a simplified grid system.

Example:
- Rectangular aisles
- Entry point
- Checkout area
- Walkable paths

Possible implementation methods:
- SVG
- HTML div grid
- Canvas

---

# Route Generation

The route should visually resemble Google Maps.

However, the logic can remain simple.

Recommended approach:
- Grid-based pathfinding
- BFS
OR
- A* algorithm

The route should:
- Start from user location
- End at product location
- Draw a visible colored path

Optional:
- Animated route line

---

# Product Registration System

The supermarket already has products registered in inventory systems.

For the MVP, the project only needs:
- Product names
- Product locations

The simplest implementation:

## Admin Panel

Employees can:
- Add products
- Edit product locations
- Assign aisles and shelf positions

Optional:
- Barcode scanner integration

Example:
1. Employee scans barcode
2. Employee selects aisle
3. Product location is saved

---

# AI Integration

The project may use IBM AI tools (watsonx / Granite / hackathon-provided AI).

IMPORTANT:
AI should NOT become the core dependency of the project.

Use AI only for lightweight enhancements.

Recommended AI features:

## Smart Product Search

Examples:
- "coca"
- "coke zero"
- "black soda"

Should still find:
- Coca-Cola Zero 2L

Possible methods:
- Semantic search
- Embeddings
- Fuzzy matching
- IBM AI APIs

---

## Shopping Route Optimization

Example:
User shopping list:
- milk
- eggs
- cereal

The app generates the most efficient supermarket route.

---

## AI Assistant / Chatbot

Example:
"Where can I find gluten-free pasta?"

The app responds with:
- aisle
- shelf
- route

---

# Computer Vision Decision

The original idea included:
- Employees recording supermarket aisles with phone cameras
- Automatic product recognition
- Automatic shelf mapping

This feature is OUT OF SCOPE for the hackathon MVP.

Reason:
- Too complex
- Requires computer vision pipelines
- Requires product recognition models
- Requires training and tracking
- Too risky for limited time

Instead, the project should mention this as a FUTURE EXPANSION.

Suggested pitch wording:

"The platform can later evolve into an automated shelf-mapping solution using IBM computer vision APIs and smart inventory recognition systems."

---

# Priority Order

## ABSOLUTE PRIORITY

1. Product search
2. Supermarket map
3. Visual route generation

These features define the project.

---

## SECONDARY FEATURES

4. Database integration
5. Admin panel
6. QR positioning
7. Smart AI search
8. Animations

---

# Features To Cut First If Time Runs Out

1. AI assistant
2. QR scanning
3. Animations
4. Barcode scanning

NEVER cut:
- Product search
- Map
- Route visualization

---

# Team Task Distribution

## Person 1 — Frontend / UI / Map

Responsibilities:
- Main interface
- Supermarket map
- Route rendering
- Product visualization
- UI polish
- Animations

Deliverables:
- Working visual app

---

## Person 2 — Backend / Database / APIs

Responsibilities:
- Database setup
- Product APIs
- Admin panel
- Product management
- Frontend-backend connection

Deliverables:
- Functional data system

---

## Person 3 — Pathfinding / AI / Integration

Responsibilities:
- A* or BFS pathfinding
- Smart search
- QR location system
- Final integrations
- Demo preparation
- Pitch preparation

Deliverables:
- Intelligent routing system
- Final polished demo flow

---

# Recommended Development Timeline

## Phase 1 — First 4 Hours

Person 1:
- UI
- Map structure

Person 2:
- Database
- APIs

Person 3:
- Pathfinding algorithm

Goal:
- Basic systems working independently

---

## Phase 2 — Hours 5–8

Integrate:
- Search
- Map
- Route system

Goal:
- Functional MVP

---

## Phase 3 — Remaining Time

Add:
- AI features
- Animations
- Better visuals
- Demo polish

Goal:
- Impressive presentation quality

---

# Demo Strategy

The project should feel smooth and realistic.

Recommended demo flow:

1. Open app
2. Select current aisle
3. Search for a product
4. Watch map update
5. Watch route appear visually
6. Show product details
7. Optionally add item to shopping route

The visual experience is more important than technical complexity.

---

# Accessibility & Business Value

This solution helps:
- Elderly customers
- Tourists
- People unfamiliar with the store
- Customers in a hurry
- Customers with social anxiety
- Large supermarkets with complex layouts

Potential business benefits:
- Improved customer experience
- Faster shopping
- Better store navigation
- Reduced employee interruptions
- Increased customer satisfaction

---

# Final Product Philosophy

The project should prioritize:
- Simplicity
- Reliability
- UX
- Demo quality
- Clarity

The goal is NOT to build a perfect production system.

The goal is to create a polished and convincing hackathon MVP that clearly demonstrates:

"Indoor supermarket navigation powered by smart search and visual routing."

---

# Suggested Project Name

Project Name:
# Aisly

Reasoning:
- Short
- Modern
- Memorable
- Inspired by the word "aisle"
- Startup-friendly branding

