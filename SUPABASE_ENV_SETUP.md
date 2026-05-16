# Supabase Environment Variables Setup

## Required Environment Variables for Backend

Add these to `apps/backend/.env`:

```env
# Database Connection (REQUIRED)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Application Configuration
PORT=3001
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

## How to Get Your Supabase DATABASE_URL

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: `aisly-supermarket` (or any name you prefer)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is fine
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup to complete

### Step 2: Get Your Connection String

1. In your Supabase project dashboard, click **"Settings"** (gear icon in sidebar)
2. Click **"Database"** in the settings menu
3. Scroll down to **"Connection string"** section
4. Select the **"URI"** tab (NOT "Connection pooling")
5. Copy the connection string - it looks like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with the password you created in Step 1

### Step 3: Update Your .env File

1. Open `apps/backend/.env`
2. Replace the DATABASE_URL value with your Supabase connection string
3. Make sure to replace `[YOUR-PASSWORD]` with your actual password

**Example:**
```env
# Before (placeholder)
DATABASE_URL="postgresql://postgres:password@localhost:5432/aisly?schema=public"

# After (your actual Supabase URL)
DATABASE_URL="postgresql://postgres.abcdefghijklmnop:MySecurePassword123@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
```

## Important Notes

### ⚠️ Security
- **NEVER commit your .env file to git** (it's already in .gitignore)
- **NEVER share your database password publicly**
- Keep your connection string private

### 📝 Connection String Format

The Supabase connection string has this format:
```
postgresql://[USER].[PROJECT-REF]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

Where:
- `[USER]` = `postgres` (always)
- `[PROJECT-REF]` = Your unique project reference (e.g., `abcdefghijklmnop`)
- `[PASSWORD]` = Your database password
- `[HOST]` = Supabase host (e.g., `aws-0-us-west-1.pooler.supabase.com`)
- `[PORT]` = `5432` (default PostgreSQL port)
- `[DATABASE]` = `postgres` (default database name)

### 🔍 Troubleshooting

**Error: "Can't reach database server"**
- Check your internet connection
- Verify the connection string is correct
- Make sure you replaced `[YOUR-PASSWORD]` with your actual password
- Confirm your Supabase project is active (not paused)

**Error: "Authentication failed"**
- Double-check your password
- Make sure there are no extra spaces in the connection string
- Try resetting your database password in Supabase settings

**Error: "SSL connection required"**
- Supabase requires SSL by default (Prisma handles this automatically)
- If you see SSL errors, add `?sslmode=require` to the end of your connection string

## Verification

To verify your connection works:

```bash
cd apps/backend

# Generate Prisma client
npx prisma generate

# Test connection by running a migration
npx prisma migrate dev --name init

# If successful, you'll see:
# ✔ Generated Prisma Client
# ✔ Database connection successful
```

## Next Steps

Once your DATABASE_URL is configured:

1. ✅ Run migrations: `npx prisma migrate dev --name init`
2. ✅ Seed database: `psql $DATABASE_URL -f prisma/seed.sql`
3. ✅ Start server: `npm run dev`
4. ✅ Test API: `curl http://localhost:3001/api/products`

## Alternative: Using Supabase Dashboard

You can also manage your database directly in Supabase:

1. Go to your project dashboard
2. Click **"SQL Editor"** in the sidebar
3. Paste the contents of `apps/backend/prisma/seed.sql`
4. Click **"Run"** to execute

This is useful if you don't have `psql` installed locally.

## Environment Variables Summary

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ Yes | - | PostgreSQL connection string from Supabase |
| `PORT` | No | 3001 | Port for the backend server |
| `NODE_ENV` | No | development | Environment (development/production) |
| `FRONTEND_URL` | No | http://localhost:3000 | Frontend URL for CORS |

## Production Deployment

When deploying to production:

1. Create a separate Supabase project for production
2. Use environment variables in your hosting platform (Vercel, Railway, etc.)
3. Set `NODE_ENV=production`
4. Update `FRONTEND_URL` to your production domain
5. Never use development credentials in production

---

**Need Help?** Check the [SETUP_GUIDE.md](apps/backend/SETUP_GUIDE.md) for detailed setup instructions.