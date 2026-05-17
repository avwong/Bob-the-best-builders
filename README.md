# Aisly - Indoor Supermarket Navigation System

> "Google Maps for Supermarkets" - Navigate stores efficiently with AI-powered product search and optimal route planning

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 🎯 Overview

**Aisly** is an innovative indoor navigation system designed for supermarkets. It helps customers find products quickly, generates optimal shopping routes, and provides turn-by-turn navigation through the store.

### Key Features

- 🔍 **Smart Product Search** - Fuzzy matching with synonym support (e.g., "coke" finds "Coca-Cola")
- 🗺️ **Interactive Store Map** - Visual supermarket layout with real-time navigation
- 🧭 **A* Pathfinding** - Optimal route calculation between products
- 📱 **Mobile-First Design** - Touch-friendly customer interface
- 🛠️ **Visual Layout Editor** - Drag-and-drop store designer for administrators
- 🛒 **Shopping List Optimization** - Multi-product route planning
- ⚡ **Real-time Updates** - Live product locations and availability

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 10+
- PostgreSQL database (or Supabase account)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Bob-the-best-builders

# Install dependencies
npm install

# Set up environment variables
cp apps/backend/.env.example apps/backend/.env
# Edit apps/backend/.env with your database credentials

# Run database migrations
cd apps/backend
npx prisma migrate dev
npx prisma db seed

# Start development servers
cd ../..
npm run dev
```

The applications will be available at:
- **Frontend (Customer App)**: http://localhost:3000
- **Frontend (Editor)**: http://localhost:3000/editor
- **Backend API**: http://localhost:3001

## 📚 Documentation

> **[📖 Complete Documentation Index](docs/README.md)** - Start here for all documentation

### 🚀 Quick Start
- [**Setup Guide**](docs/SETUP_GUIDE.md) - Complete installation and configuration
- [**Project Overview**](docs/PROJECT_OVERVIEW.md) - Architecture and design decisions
- [**Project Status**](docs/PROJECT_STATUS_AND_TEAM_TASKS.md) - Current implementation status

### 🎨 Frontend Documentation
- [**Customer View**](docs/frontend/CUSTOMER_VIEW_IMPLEMENTATION.md) - Mobile shopping interface
- [**Editor**](docs/frontend/EDITOR_IMPLEMENTATION.md) - Visual layout editor
- [**Editor Usage**](docs/frontend/EDITOR_USAGE.md) - How to use the editor
- [**Testing Guides**](docs/frontend/CUSTOMER_VIEW_TESTING.md) - Testing procedures

### 🔌 Backend Documentation
- [**API Reference**](docs/api/API_REFERENCE.md) - Complete API documentation
- [**Backend Setup**](docs/backend/SETUP_GUIDE.md) - Backend installation guide

### 🔧 Technical Deep-Dives
- [**Pathfinding Algorithm**](docs/technical/PATHFINDING.md) - A* implementation details
- [**Smart Search**](docs/technical/SMART_SEARCH_PLAN.md) - Fuzzy search with synonyms
- [**Route Optimization**](docs/technical/MULTI_PRODUCT_ROUTE_OPTIMIZATION.md) - Shopping list optimization
- [**Navigation State**](docs/technical/NAVIGATION_STATE_MANAGEMENT.md) - State management hooks
- [**Supermarket Layout**](docs/technical/SUPERMARKET_LAYOUT_PLAN.md) - Store design system

### 📋 Planning & Guides
- [**Project Requirements**](docs/guides/PROJECT_REQUIREMENTS.md) - Original requirements
- [**Implementation Summary**](docs/guides/IMPLEMENTATION_SUMMARY.md) - Development roadmap
- [**Supabase Setup**](docs/guides/SUPABASE_SETUP.md) - Database configuration

## 🏗️ Project Structure

```
Bob-the-best-builders/
├── apps/
│   ├── backend/              # NestJS API server
│   │   ├── src/
│   │   │   ├── products/     # Product management
│   │   │   ├── supermarkets/ # Store layouts
│   │   │   └── prisma/       # Database client
│   │   └── prisma/
│   │       ├── schema.prisma # Database schema
│   │       └── seed.sql      # Demo data
│   │
│   └── frontend/             # Next.js application
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.tsx          # Landing page
│       │   │   ├── shop/             # Customer shopping view
│       │   │   ├── editor/           # Store layout editor
│       │   │   └── settings/         # Configuration
│       │   ├── components/
│       │   │   ├── customer/         # Customer UI components
│       │   │   ├── editor/           # Editor components
│       │   │   └── ui/               # Shared UI components
│       │   └── lib/
│       │       ├── pathfinding.ts    # A* algorithm
│       │       ├── search.ts         # Product search
│       │       └── routeOptimization.ts
│       └── public/
│           └── demo-layout.json      # Sample store layout
│
└── docs/                     # Documentation
    ├── technical/            # Technical deep-dives
    └── guides/               # User guides
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI
- **State Management**: React Hooks
- **Icons**: Lucide React

### Backend
- **Framework**: NestJS 10
- **Language**: TypeScript 5
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Validation**: class-validator
- **API**: RESTful endpoints

### Algorithms & Libraries
- **Pathfinding**: A* algorithm (custom implementation)
- **Search**: Fuse.js for fuzzy matching
- **Route Optimization**: Nearest Neighbor + 2-opt

## 🎮 Usage Examples

### Customer Shopping Flow

1. **Open the app** at `/shop`
2. **Search for a product** (e.g., "milk", "nutella")
3. **View product location** on the interactive map
4. **Get navigation route** from your current location
5. **Add multiple products** to optimize your shopping route

### Store Manager Flow

1. **Open the editor** at `/editor`
2. **Design store layout** using drag-and-drop
3. **Configure aisles** with categories and shelf sections
4. **Add special zones** (produce, bakery, deli)
5. **Export layout** as JSON for deployment

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run backend tests
cd apps/backend
npm run test

# Run frontend tests
cd apps/frontend
npm run test

# Run e2e tests
npm run test:e2e
```

## 📦 Deployment

### Frontend (Vercel)
```bash
cd apps/frontend
vercel deploy
```

### Backend (Railway/Render)
```bash
cd apps/backend
# Set environment variables in platform
# Deploy via Git integration
```

## 🤝 Contributing

This is a hackathon project. For contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 👥 Team

**Bob-the-best-builders** - IBM Hackathon 2026

- Person 1: Frontend UI/UX
- Person 2: Backend & Integration
- Person 3: Navigation & Algorithms

## 🙏 Acknowledgments

- IBM for hosting the hackathon
- Supabase for database hosting
- Next.js and NestJS communities
- All open-source contributors

## 📞 Support

For questions or issues:
- Check the [Documentation](docs/)
- Open an issue on GitHub

---
