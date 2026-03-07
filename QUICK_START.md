# Quick Start Guide

## ✅ What Was Fixed

1. **Removed Replit Dependencies**
   - Removed Replit database integration from `.replit`
   - Removed Replit-specific Vite plugins
   - Cleaned up all Replit authentication code

2. **PostgreSQL Database Setup**
   - Configured PostgreSQL connection via `DATABASE_URL`
   - Set up Drizzle ORM for database operations
   - Created database schema with all necessary tables

3. **Password-Based Admin Authentication**
   - Implemented secure password authentication
   - Created admin login page
   - Set up session management

4. **Setup Scripts & Documentation**
   - Created `.env.example` for configuration
   - Added admin setup script
   - Comprehensive README and setup guides

## 🚀 How to Run

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up PostgreSQL

**Option A: Local PostgreSQL**
```bash
# Create database
createdb umedh_foundation
```

**Option B: Docker (Easier)**
```bash
docker run --name umedh-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=umedh_foundation \
  -p 5432:5432 \
  -d postgres:16
```

### Step 3: Configure Environment

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/umedh_foundation
SESSION_SECRET=your-random-secret-here
PORT=5000
NODE_ENV=development
```

Generate SESSION_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Initialize Database
```bash
npm run db:push
```

### Step 5: Create Admin User
```bash
npm run setup-admin admin@umedhfoundation.org yourpassword123 "Admin" "User"
```

### Step 6: Start Server
```bash
npm run dev
```

### Step 7: Access Application
- **Website**: http://localhost:5000
- **Admin Login**: http://localhost:5000/login
- **Admin Dashboard**: http://localhost:5000/admin

## 📋 Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run db:push      # Push database schema
npm run setup-admin  # Create admin user
npm run check        # Type check TypeScript
```

## 🗄️ Database Tables

The following tables are created automatically:
- `users` - User accounts and authentication
- `sessions` - Session storage
- `programs` - Program information
- `donations` - Donation records
- `events` - Event listings
- `event_registrations` - Event registrations
- `volunteers` - Volunteer applications
- `blog_posts` - Blog posts
- `contact_messages` - Contact form submissions

## 🔐 Admin Login

**Default Admin Credentials** (after setup):
- Email: `admin@umedhfoundation.org` (or what you set)
- Password: `yourpassword123` (or what you set)

## 🐛 Troubleshooting

### Error: DATABASE_URL must be set
- Check that `.env` file exists
- Verify `DATABASE_URL` is set correctly
- Ensure PostgreSQL is running

### Error: Port 5000 already in use
- Change `PORT` in `.env` file
- Or kill the process: `lsof -ti:5000 | xargs kill`

### Error: Cannot connect to database
- Verify PostgreSQL is running: `pg_isready`
- Check database exists: `psql -l`
- Verify connection string format

### Admin login not working
- Verify admin user exists in database
- Check password is at least 8 characters
- Clear browser cookies and try again

## 📚 Documentation

- **README.md** - Full project documentation
- **SETUP.md** - Detailed setup instructions
- **FEATURES.md** - Complete features list
- **replit.md** - Technical architecture details

## 🎯 Next Steps

1. Log in to admin dashboard
2. Create programs and events
3. Test donation and volunteer forms
4. Customize content and styling
5. Deploy to production

## 💡 Tips

- Use Docker for easy PostgreSQL setup
- Keep `.env` file secure (don't commit it)
- Use strong passwords for admin accounts
- Regularly backup your database
- Check logs for debugging issues

## 🆘 Need Help?

Check the troubleshooting section in:
- `README.md` - General troubleshooting
- `SETUP.md` - Setup-specific issues
- Check browser console for client errors
- Check server logs for backend errors
