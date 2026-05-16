# Turborepo Monorepo Setup

This project is a Turborepo monorepo containing a NestJS backend and Next.js frontend.

## Project Structure

```
.
├── apps/
│   ├── backend/          # NestJS backend application
│   └── frontend/         # Next.js frontend application
├── packages/             # Shared packages (empty for now)
├── turbo.json           # Turborepo configuration
└── package.json         # Root package.json with workspaces
```

## Apps

### Backend (NestJS)
- **Location**: `apps/backend`
- **Framework**: NestJS
- **Port**: 3000 (default)
- **Scripts**:
  - `npm run dev` - Start development server
  - `npm run build` - Build for production
  - `npm run start` - Start production server
  - `npm run lint` - Run ESLint
  - `npm run test` - Run tests

### Frontend (Next.js)
- **Location**: `apps/frontend`
- **Framework**: Next.js 16 with TypeScript
- **Features**: App Router, Tailwind CSS, ESLint
- **Port**: 3000 (default, will need to change if running both)
- **Scripts**:
  - `npm run dev` - Start development server
  - `npm run build` - Build for production
  - `npm run start` - Start production server
  - `npm run lint` - Run ESLint

## Getting Started

### Install Dependencies

From the root directory:

```bash
npm install
```

This will install dependencies for all workspaces.

### Development

Run all apps in development mode:

```bash
npm run dev
```

Or run individual apps:

```bash
# Backend only
cd apps/backend && npm run dev

# Frontend only
cd apps/frontend && npm run dev
```

### Build

Build all apps:

```bash
npm run build
```

### Lint

Lint all apps:

```bash
npm run lint
```

## Turborepo Features

- **Caching**: Turborepo caches build outputs to speed up subsequent builds
- **Parallel Execution**: Runs tasks across workspaces in parallel
- **Dependency Graph**: Automatically understands dependencies between packages

## Configuration Files

- **turbo.json**: Defines the build pipeline and caching strategy
- **package.json**: Root configuration with workspace definitions
- **.gitignore**: Ignores build outputs, dependencies, and environment files

## Next Steps

1. Install dependencies: `npm install`
2. Start development: `npm run dev`
3. Configure backend port if needed (to avoid conflicts with frontend)
4. Add shared packages in the `packages/` directory as needed
5. Configure environment variables for each app

## Notes

- The backend runs on port 3000 by default. You may want to change this to 3001 or another port to avoid conflicts with the frontend.
- Both apps have their own `.gitignore` files in addition to the root `.gitignore`.
- The monorepo uses npm workspaces for dependency management.