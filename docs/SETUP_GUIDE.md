# Aisly - Complete Setup Guide

This guide will walk you through setting up the entire Aisly project from scratch, including both frontend and backend applications.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher
- **npm** 10.0.0 or higher
- **Git** (for cloning the repository)
- **PostgreSQL** database OR a **Supabase** account (recommended)

## 🚀 Quick Start (5 minutes)

```bash
# 1. Clone and install
git clone <repository-url>
cd Bob-the-best-builders
npm install

# 2. Set up environment variables
cp apps/backend/.env.example apps/backend/.env
# Edit apps/backend/.env with your database URL

# 3. Set up database
cd apps/backend
npx prisma migrate dev
npx prisma db seed

# 4. Start development servers
cd ../..
npm run dev
```

Access the applications:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

---

## 📦 Detailed Installation Steps

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Bob-the-best-builders
```

### Step 2: Install Dependencies

From the root directory, install all dependencies for both frontend and backend:

```bash
npm install
```

This will install dependencies for:
- Root workspace
- Backend application (`apps/backend`)
- Frontend application (`apps/frontend`)

---

## 🗄️ Database Setup

You have two options for the database: **Supabase (recommended)** or **Local PostgreSQL**.

### Option A: Supabase (Recommended)

#### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: `aisly-supermarket` (or any name)
   - **Database Password**: Create a strong password (**SAVE THIS!**)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is fine
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup to complete

#### 2. Get Your Connection String

1. In your Supabase dashboard, click **"Settings"** (gear icon)
2. Click **"Database"** in the settings menu
3. Scroll to **"Connection string"** section
4. Select the **"URI"** tab
5. Copy the connection string (looks like):
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with your actual password

#### 3. Configure Environment Variables

Create `.env` file in `apps/backend/`:

```bash
cd apps/backend
cp .env.example .env
```

Edit `apps/backend/.env`:

```env
# Database Connection (REQUIRED)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Application Configuration
PORT=3001
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

### Option B: Local PostgreSQL

If you prefer to use a local PostgreSQL database:

1. Install PostgreSQL on your machine
2. Create a database:
   ```sql
   CREATE DATABASE aisly;
   ```
3. Update `apps/backend/.env`:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/aisly?schema=public"
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

---

## 🔧 Backend Setup

### Step 1: Generate Prisma Client

```bash
cd apps/backend
npx prisma generate
```

### Step 2: Run Database Migrations

This creates all necessary tables:

```bash
npx prisma migrate dev --name init
```

You should see:
```
✔ Generated Prisma Client
✔ Database connection successful
✔ Migration applied successfully
```

### Step 3: Seed the Database

Load demo data (50+ products, 12 aisles, 1 supermarket):

#### Using psql (Recommended):
```bash
psql $DATABASE_URL -f prisma/seed.sql
```

#### Using Supabase Dashboard:
1. Go to your Supabase project
2. Click **"SQL Editor"**
3. Copy contents of `apps/backend/prisma/seed.sql`
4. Paste and click **"Run"**

#### Using Prisma Studio:
```bash
npx prisma studio
```
Then manually import the data.

### Step 4: Verify Database

Check that data loaded correctly:

```bash
npx prisma studio
```

You should see:
- 1 supermarket: "Aisly Demo Market"
- 12 aisles (A through L)
- 50+ products with locations

### Step 5: Start Backend Server

```bash
npm run dev
```

The API will be available at: **http://localhost:3001/api**

### Step 6: Test API Endpoints

```bash
# Get all products
curl http://localhost:3001/api/products

# Search for a product
curl "http://localhost:3001/api/products/search?name=coca"

# Get supermarket layout
curl http://localhost:3001/api/supermarkets/550e8400-e29b-41d4-a716-446655440000/layout
```

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend

```bash
cd apps/frontend
```

### Step 2: Install Dependencies (if not done)

```bash
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

The frontend will be available at: **http://localhost:3000**

### Step 4: Verify Frontend

Open your browser and navigate to:
- **Customer View**: http://localhost:3000/shop
- **Editor View**: http://localhost:3000/editor
- **Settings**: http://localhost:3000/settings

---

## 🔍 Troubleshooting

### Database Connection Issues

**Error: "Can't reach database server"**
- ✅ Check your internet connection
- ✅ Verify DATABASE_URL is correct
- ✅ Ensure you replaced `[YOUR-PASSWORD]`
- ✅ Confirm Supabase project is active

**Error: "Authentication failed"**
- ✅ Double-check your password
- ✅ Remove extra spaces in connection string
- ✅ Try resetting database password in Supabase

**Error: "SSL connection required"**
- ✅ Add `?sslmode=require` to connection string

### Prisma Issues

**Error: "Prisma Client not generated"**
```bash
npx prisma generate
```

**Error: "Table does not exist"**
```bash
npx prisma migrate dev
```

### Port Conflicts

**Error: "Port 3001 already in use"**

Change the port in `apps/backend/.env`:
```env
PORT=3002
```

Or kill the process using the port:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### Frontend Issues

**Error: "Module not found"**
```bash
cd apps/frontend
npm install
```

**Error: "Cannot find module '@/lib/...'**
- ✅ Check `tsconfig.json` has correct paths
- ✅ Restart TypeScript server in VS Code

---

## 📊 Verify Installation

Run this checklist to ensure everything is set up correctly:

### Backend Checklist
- [ ] Supabase project created
- [ ] DATABASE_URL configured in `.env`
- [ ] Dependencies installed (`npm install`)
- [ ] Prisma client generated (`npx prisma generate`)
- [ ] Migrations run (`npx prisma migrate dev`)
- [ ] Database seeded (50+ products in Prisma Studio)
- [ ] Server running (`npm run dev`)
- [ ] API responding (test with curl)

### Frontend Checklist
- [ ] Dependencies installed
- [ ] Development server running
- [ ] Can access http://localhost:3000
- [ ] Customer view loads (`/shop`)
- [ ] Editor view loads (`/editor`)
- [ ] No console errors

---

## 🎯 Next Steps

Once setup is complete:

1. **Explore the Customer View** (`/shop`)
   - Search for products
   - Add items to shopping list
   - View products on map

2. **Try the Editor** (`/editor`)
   - Create store layouts
   - Add aisles and zones
   - Export JSON configuration

3. **Test the API**
   - Review API documentation: [API_REFERENCE.md](../apps/backend/docs/API_REFERENCE.md)
   - Test endpoints with Postman or curl

4. **Read the Documentation**
   - [Project Overview](PROJECT_OVERVIEW.md)
   - [Customer App Guide](../apps/frontend/docs/CUSTOMER_APP_GUIDE.md)
   - [Editor Guide](../apps/frontend/docs/EDITOR_GUIDE.md)

---

## 🔐 Security Notes

### Important Security Practices

⚠️ **NEVER commit your `.env` file to git** (it's in `.gitignore`)  
⚠️ **NEVER share your database password publicly**  
⚠️ **Keep your connection string private**  
⚠️ **Use different credentials for production**

### Environment Variables

The `.env` file contains sensitive information:
- Database credentials
- API keys
- Secret tokens

Always use environment variables for:
- Database URLs
- API endpoints
- Authentication secrets
- Third-party service keys

---

## 🚢 Production Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy

```bash
cd apps/frontend
vercel deploy --prod
```

### Backend (Railway/Render)

1. Create new project
2. Connect GitHub repository
3. Set environment variables:
   - `DATABASE_URL`
   - `NODE_ENV=production`
   - `FRONTEND_URL=<your-frontend-url>`
4. Deploy

### Database (Supabase Production)

1. Create separate production project
2. Run migrations on production database
3. Update production environment variables
4. Never use development credentials in production

---

## 📚 Additional Resources

### Documentation
- [API Reference](../apps/backend/docs/API_REFERENCE.md)
- [Pathfinding Algorithm](technical/PATHFINDING.md)
- [Smart Search](technical/SMART_SEARCH_PLAN.md)
- [Components](COMPONENTS.md)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

## 💬 Getting Help

If you encounter issues:

1. Check this setup guide thoroughly
2. Review the [Troubleshooting](#troubleshooting) section
3. Check the [Project Status](PROJECT_STATUS_AND_TEAM_TASKS.md)
4. Review error messages carefully
5. Search existing issues on GitHub
6. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)

---

## ✅ Success!

If you've completed all steps successfully, you should have:

✅ Backend API running on http://localhost:3001  
✅ Frontend app running on http://localhost:3000  
✅ Database with demo data  
✅ All tests passing  
✅ No console errors  

**You're ready to start developing! 🎉**

---

**Last Updated**: 2026-05-17  
**Version**: 2.0  
**Status**: Production Ready