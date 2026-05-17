# Aisly Backend - Quick Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Supabase account recommended)
- npm or yarn package manager

## Step-by-Step Setup

### 1. Get Your Supabase Database URL

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the **Connection String** (URI format)
5. It should look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### 2. Configure Environment Variables

Update `apps/backend/.env`:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Install Dependencies

```bash
cd apps/backend
npm install
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Create Database Tables

```bash
npx prisma migrate dev --name init
```

This will:
- Create all tables (supermarkets, aisles, products)
- Set up relationships and indexes
- Generate migration files

### 6. Seed the Database

#### Option A: Using psql (Recommended)

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" -f prisma/seed.sql
```

#### Option B: Using Prisma Studio

```bash
npx prisma studio
```

Then manually copy and paste the SQL from `prisma/seed.sql` into the SQL editor.

#### Option C: Using Supabase Dashboard

1. Go to your Supabase project
2. Click on **SQL Editor**
3. Copy the contents of `prisma/seed.sql`
4. Paste and run

### 7. Verify Data

Check that data was loaded:

```bash
npx prisma studio
```

You should see:
- 1 supermarket
- 12 aisles
- 50+ products

### 8. Start the Server

```bash
npm run dev
```

The API will be available at: **http://localhost:3001/api**

### 9. Test the API

Open your browser or use curl:

```bash
# Get all products
curl http://localhost:3001/api/products

# Search for Coca-Cola
curl "http://localhost:3001/api/products/search?name=coca"

# Get supermarket layout
curl http://localhost:3001/api/supermarkets/550e8400-e29b-41d4-a716-446655440000/layout
```

## Troubleshooting

### Error: "Can't reach database server"

- Check your DATABASE_URL is correct
- Verify your Supabase project is active
- Check your internet connection
- Make sure you replaced `[YOUR-PASSWORD]` with your actual password

### Error: "Prisma Client not generated"

Run:
```bash
npx prisma generate
```

### Error: "Table does not exist"

Run migrations:
```bash
npx prisma migrate dev
```

### Seed data not loading

Make sure you:
1. Ran migrations first
2. Used the correct database URL
3. Have proper permissions on the database

### Port 3001 already in use

Change the PORT in `.env` to another port like 3002 or 4000.

## What's Included

### Database Schema

- **3 tables**: supermarkets, aisles, products
- **Relationships**: Products belong to supermarkets and aisles
- **Enums**: ShelfSide (left/right), ShelfSection (top/middle/bottom)

### API Endpoints

#### Products
- `GET /api/products` - List all products (paginated)
- `GET /api/products/search?name=:name` - Search products
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get product details
- `GET /api/products/:id/location` - Get product location

#### Supermarkets
- `GET /api/supermarkets` - List all supermarkets
- `GET /api/supermarkets/:id` - Get supermarket details
- `GET /api/supermarkets/:id/layout` - Get complete layout with aisles

### Demo Data

- **1 Supermarket**: "Aisly Demo Market" (60x40 grid)
- **12 Aisles**: A through L with categories
- **50+ Products**: Real products like Coca-Cola, Nutella, Milk, etc.

## Next Steps

1. ✅ Database is set up
2. ✅ API is running
3. 🔄 Connect your frontend to the API
4. 🔄 Test the endpoints
5. 🔄 Build your supermarket navigation UI

## Useful Commands

```bash
# Start development server
npm run dev

# View database in browser
npx prisma studio

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Format Prisma schema
npx prisma format

# Check Prisma schema for errors
npx prisma validate
```

## API Documentation

See [README_API.md](./README_API.md) for complete API documentation with examples.

## Support

If you encounter issues:

1. Check the error message carefully
2. Verify your DATABASE_URL is correct
3. Make sure migrations ran successfully
4. Check that seed data loaded properly
5. Review the [README_API.md](./README_API.md) for detailed documentation

## Success Checklist

- [ ] Supabase project created
- [ ] DATABASE_URL configured in .env
- [ ] Dependencies installed (`npm install`)
- [ ] Prisma client generated (`npx prisma generate`)
- [ ] Migrations run (`npx prisma migrate dev`)
- [ ] Database seeded (50+ products visible in Prisma Studio)
- [ ] Server running (`npm run dev`)
- [ ] API responding (test with curl or browser)

Once all items are checked, you're ready to build the frontend! 🚀