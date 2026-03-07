# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up PostgreSQL Database

#### Option A: Using PostgreSQL Command Line
```bash
# Create database
createdb umedh_foundation

# Or using psql
psql -U postgres
CREATE DATABASE umedh_foundation;
\q
```

#### Option B: Using Docker (Recommended for Development)
```bash
docker run --name umedh-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=umedh_foundation \
  -p 5432:5432 \
  -d postgres:16
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/umedh_foundation
SESSION_SECRET=generate-a-random-secret-here
PORT=5000
NODE_ENV=development
```

**Generate SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Initialize Database Schema
```bash
npm run db:push
```

This creates all necessary tables in your PostgreSQL database.

### 5. Create Admin User
```bash
npm run setup-admin admin@umedhfoundation.org yourpassword123 "Admin" "User"
```

Or manually:
```bash
tsx script/setup-admin.ts admin@umedhfoundation.org yourpassword123 "Admin" "User"
```

### 6. Start Development Server
```bash
npm run dev
```

### 7. Access the Application
- **Website**: http://localhost:5000
- **Admin Login**: http://localhost:5000/login
- **Admin Dashboard**: http://localhost:5000/admin

## Troubleshooting

### Database Connection Error
**Error**: `DATABASE_URL must be set`

**Solution**: 
1. Check that `.env` file exists
2. Verify `DATABASE_URL` is set correctly
3. Ensure PostgreSQL is running: `pg_isready` or `docker ps`

### Port Already in Use
**Error**: `Port 5000 is already in use`

**Solution**:
1. Change `PORT` in `.env` file
2. Or kill the process: `lsof -ti:5000 | xargs kill` (Mac/Linux)

### Admin Login Fails
**Error**: Cannot log in to admin dashboard

**Solution**:
1. Verify admin user exists: Check `users` table in database
2. Ensure password is at least 8 characters
3. Check browser console for errors
4. Verify cookies are enabled

### Schema Push Fails
**Error**: Database schema push errors

**Solution**:
1. Ensure database exists
2. Check database connection string format
3. Verify PostgreSQL version is 16+
4. Check user has CREATE TABLE permissions

## Common Issues

### Windows Users
- Use PowerShell or Git Bash for commands
- Ensure PostgreSQL is added to PATH
- Use `set` instead of `export` for environment variables (or use `.env` file)

### macOS Users
- Install PostgreSQL via Homebrew: `brew install postgresql@16`
- Start PostgreSQL: `brew services start postgresql@16`

### Linux Users
- Install PostgreSQL: `sudo apt-get install postgresql-16`
- Start service: `sudo systemctl start postgresql`

## Next Steps

After setup:
1. Log in to admin dashboard
2. Create programs, events, and blog posts
3. Test donation and volunteer registration
4. Configure multilingual content

## Production Deployment

For production:
1. Set `NODE_ENV=production` in `.env`
2. Use a secure `SESSION_SECRET`
3. Use a production PostgreSQL database
4. Run `npm run build`
5. Start with `npm start`
