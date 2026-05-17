# Aisly Documentation

> Complete documentation for the Aisly Indoor Supermarket Navigation System

## 📚 Documentation Structure

This documentation is organized into the following sections:

### 🚀 Getting Started
- **[Project Overview](PROJECT_OVERVIEW.md)** - Complete project architecture and features
- **[Setup Guide](SETUP_GUIDE.md)** - Installation and configuration instructions
- **[Project Status](PROJECT_STATUS_AND_TEAM_TASKS.md)** - Current implementation status and team tasks

### 🎯 Project Planning
Located in [`guides/`](guides/)
- **[Project Requirements](guides/PROJECT_REQUIREMENTS.md)** - Original project requirements and scope
- **[Implementation Summary](guides/IMPLEMENTATION_SUMMARY.md)** - Planning and implementation roadmap
- **[Supabase Setup](guides/SUPABASE_SETUP.md)** - Database configuration guide

### 🔧 Technical Documentation
Located in [`technical/`](technical/)

#### Core Features
- **[Pathfinding Algorithm](technical/PATHFINDING.md)** - A* implementation details
- **[Smart Search](technical/SMART_SEARCH_PLAN.md)** - Fuzzy search with synonyms
- **[Route Optimization](technical/MULTI_PRODUCT_ROUTE_OPTIMIZATION.md)** - Multi-product shopping routes

#### Components
- **[Location Selector](technical/LOCATION_SELECTOR_COMPONENT.md)** - User position selection
- **[Route Renderer](technical/ROUTE_RENDERER_COMPONENT.md)** - Visual route display
- **[Navigation State](technical/NAVIGATION_STATE_MANAGEMENT.md)** - State management hooks

#### Architecture
- **[Supermarket Layout](technical/SUPERMARKET_LAYOUT_PLAN.md)** - Store layout design
- **[Visual Editor](technical/VISUAL_EDITOR_MOCKUP.md)** - Layout editor mockup
- **[Turborepo Setup](technical/TURBOREPO_SETUP.md)** - Monorepo configuration

### 🎨 Frontend Documentation
Located in [`frontend/`](frontend/)

#### Customer View
- **[Customer View Implementation](frontend/CUSTOMER_VIEW_IMPLEMENTATION.md)** - Mobile shopping interface
- **[Customer View Testing](frontend/CUSTOMER_VIEW_TESTING.md)** - Testing guide

#### Editor
- **[Editor Implementation](frontend/EDITOR_IMPLEMENTATION.md)** - Visual layout editor
- **[Editor Usage](frontend/EDITOR_USAGE.md)** - User guide
- **[Editor Testing](frontend/EDITOR_TESTING.md)** - Testing checklist

#### Other
- **[Settings Explanation](frontend/SETTINGS_EXPLANATION.md)** - Configuration options
- **[UI Improvements](frontend/UI_IMPROVEMENTS.md)** - Design enhancements

### 🔌 Backend Documentation
Located in [`backend/`](backend/) and [`api/`](api/)
- **[API Reference](api/API_REFERENCE.md)** - Complete API documentation
- **[Backend Setup](backend/SETUP_GUIDE.md)** - Backend installation guide

---

## 🗺️ Quick Navigation

### For New Developers
1. Start with [Project Overview](PROJECT_OVERVIEW.md)
2. Follow [Setup Guide](SETUP_GUIDE.md)
3. Review [Project Requirements](guides/PROJECT_REQUIREMENTS.md)
4. Check [Project Status](PROJECT_STATUS_AND_TEAM_TASKS.md)

### For Frontend Developers
1. [Customer View Implementation](frontend/CUSTOMER_VIEW_IMPLEMENTATION.md)
2. [Editor Implementation](frontend/EDITOR_IMPLEMENTATION.md)
3. [Smart Search Plan](technical/SMART_SEARCH_PLAN.md)
4. [Pathfinding Algorithm](technical/PATHFINDING.md)

### For Backend Developers
1. [Backend Setup Guide](backend/SETUP_GUIDE.md)
2. [API Reference](api/API_REFERENCE.md)
3. [Supabase Setup](guides/SUPABASE_SETUP.md)

### For Designers/UX
1. [Visual Editor Mockup](technical/VISUAL_EDITOR_MOCKUP.md)
2. [UI Improvements](frontend/UI_IMPROVEMENTS.md)
3. [Supermarket Layout Plan](technical/SUPERMARKET_LAYOUT_PLAN.md)

---

## 📖 Documentation by Feature

### Product Search
- [Smart Search Plan](technical/SMART_SEARCH_PLAN.md)
- [Customer View Implementation](frontend/CUSTOMER_VIEW_IMPLEMENTATION.md)

### Navigation & Routing
- [Pathfinding Algorithm](technical/PATHFINDING.md)
- [Route Optimization](technical/MULTI_PRODUCT_ROUTE_OPTIMIZATION.md)
- [Route Renderer Component](technical/ROUTE_RENDERER_COMPONENT.md)
- [Navigation State Management](technical/NAVIGATION_STATE_MANAGEMENT.md)

### Store Layout
- [Supermarket Layout Plan](technical/SUPERMARKET_LAYOUT_PLAN.md)
- [Visual Editor Mockup](technical/VISUAL_EDITOR_MOCKUP.md)
- [Editor Implementation](frontend/EDITOR_IMPLEMENTATION.md)

### User Interface
- [Customer View Implementation](frontend/CUSTOMER_VIEW_IMPLEMENTATION.md)
- [Location Selector Component](technical/LOCATION_SELECTOR_COMPONENT.md)
- [UI Improvements](frontend/UI_IMPROVEMENTS.md)

---

## 🏗️ Project Structure

```
Bob-the-best-builders/
├── apps/
│   ├── backend/              # NestJS API
│   │   └── docs/            # Backend-specific docs
│   └── frontend/            # Next.js app
│       └── docs/            # Frontend-specific docs
├── docs/                    # Main documentation (this folder)
│   ├── guides/             # Planning & guides
│   ├── technical/          # Technical deep-dives
│   ├── api/               # API documentation (future)
│   ├── frontend/          # Frontend docs (future)
│   ├── backend/           # Backend docs (future)
│   └── archive/           # Deprecated docs (future)
└── README.md              # Project root README
```

---

## 🔍 Finding What You Need

### By Role

| Role | Start Here | Key Documents |
|------|-----------|---------------|
| **Project Manager** | [Project Overview](PROJECT_OVERVIEW.md) | [Project Status](PROJECT_STATUS_AND_TEAM_TASKS.md), [Requirements](guides/PROJECT_REQUIREMENTS.md) |
| **Frontend Dev** | [Setup Guide](SETUP_GUIDE.md) | [Customer View](../apps/frontend/docs/CUSTOMER_VIEW_IMPLEMENTATION.md), [Editor](../apps/frontend/docs/EDITOR_IMPLEMENTATION.md) |
| **Backend Dev** | [Backend Setup](../apps/backend/docs/SETUP_GUIDE.md) | [API Reference](../apps/backend/docs/API_REFERENCE.md), [Supabase](guides/SUPABASE_SETUP.md) |
| **Algorithm Dev** | [Pathfinding](technical/PATHFINDING.md) | [Route Optimization](technical/MULTI_PRODUCT_ROUTE_OPTIMIZATION.md), [Smart Search](technical/SMART_SEARCH_PLAN.md) |
| **Designer/UX** | [Project Overview](PROJECT_OVERVIEW.md) | [Visual Editor](technical/VISUAL_EDITOR_MOCKUP.md), [UI Improvements](../apps/frontend/docs/UI_IMPROVEMENTS.md) |

### By Task

| Task | Documentation |
|------|--------------|
| **Setup Development Environment** | [Setup Guide](SETUP_GUIDE.md), [Backend Setup](../apps/backend/docs/SETUP_GUIDE.md) |
| **Understand Architecture** | [Project Overview](PROJECT_OVERVIEW.md), [Turborepo Setup](technical/TURBOREPO_SETUP.md) |
| **Implement Search** | [Smart Search Plan](technical/SMART_SEARCH_PLAN.md) |
| **Implement Navigation** | [Pathfinding](technical/PATHFINDING.md), [Route Renderer](technical/ROUTE_RENDERER_COMPONENT.md) |
| **Design Store Layout** | [Supermarket Layout Plan](technical/SUPERMARKET_LAYOUT_PLAN.md), [Editor Usage](../apps/frontend/docs/EDITOR_USAGE.md) |
| **Test Features** | [Customer View Testing](../apps/frontend/docs/CUSTOMER_VIEW_TESTING.md), [Editor Testing](../apps/frontend/docs/EDITOR_TESTING.md) |
| **Use API** | [API Reference](../apps/backend/docs/API_REFERENCE.md) |

---

## 📝 Documentation Standards

### File Naming
- Use `SCREAMING_SNAKE_CASE.md` for documentation files
- Use descriptive names that indicate content
- Group related docs in subdirectories

### Content Structure
Each documentation file should include:
1. **Title** - Clear, descriptive heading
2. **Overview** - Brief summary of content
3. **Table of Contents** - For longer documents
4. **Main Content** - Well-organized sections
5. **Examples** - Code samples where applicable
6. **References** - Links to related docs

### Cross-References
- Use relative paths for internal links
- Keep links up-to-date when moving files
- Verify links work before committing

---

## 🔄 Recent Updates

### 2026-05-17
- ✅ Created comprehensive documentation index
- ✅ Organized docs into logical categories
- ✅ Added quick navigation guides
- ✅ Established documentation standards

### 2026-05-16
- ✅ Completed customer view implementation
- ✅ Completed editor implementation
- ✅ Added testing guides
- ✅ Updated project status

---

## 🤝 Contributing to Documentation

When adding or updating documentation:

1. **Choose the Right Location**
   - General docs → `docs/`
   - Frontend-specific → `apps/frontend/docs/`
   - Backend-specific → `apps/backend/docs/`
   - Planning/guides → `docs/guides/`
   - Technical details → `docs/technical/`

2. **Follow Standards**
   - Use markdown formatting
   - Include code examples
   - Add cross-references
   - Update this index

3. **Keep It Current**
   - Update docs when code changes
   - Mark deprecated content
   - Archive old documentation

---

## 📞 Support

For questions about documentation:
1. Check this index first
2. Search for keywords in relevant sections
3. Review related documents
4. Check the [Project Status](PROJECT_STATUS_AND_TEAM_TASKS.md)

---

**Last Updated**: 2026-05-17  
**Maintained By**: Bob-the-best-builders Team  
**Project**: Aisly - Indoor Supermarket Navigation