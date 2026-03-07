# Umedh Foundation Website

A full-stack web application for the **Umedh Foundation**, a non-profit organization focused on empowering underprivileged communities through education, healthcare, and sustainable development.

## 🚀 Features

### Public Features
- **Home Page** - Hero section, featured programs, statistics, and call-to-action
- **About Page** - Mission, vision, values, and team information
- **Programs** - Browse all programs with detailed descriptions and donation options
- **Donations** - Online donation system with preset amounts and custom donation support
- **Events** - View upcoming events and register for participation
- **Volunteer Registration** - Sign up to volunteer with skills and availability
- **Contact Form** - Contact the organization with inquiries
- **Blog/News** - Read blog posts and news updates
- **Multilingual Support** - English, Hindi, and Marathi language support

### Admin Features
- **Admin Dashboard** - Overview with statistics and charts
- **Donation Management** - View all donations, filter by date/campaign, export data
- **Volunteer Management** - View applications, approve/reject volunteers
- **Event Management** - Create, edit, and manage events
- **Blog Management** - Create, edit, and publish blog posts
- **User Management** - Manage user roles and permissions
- **Password-Based Authentication** - Secure admin login system

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **Wouter** - Lightweight routing
- **TanStack React Query** - Server state management
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **i18next** - Internationalization
- **React Hook Form** + **Zod** - Form validation

### Backend
- **Node.js** with **Express**
- **TypeScript**
- **PostgreSQL** - Database
- **Drizzle ORM** - Database ORM
- **Passport.js** - Authentication
- **bcryptjs** - Password hashing
- **Express Session** - Session management

## 📋 Prerequisites

- **Node.js** 20+ 
- **PostgreSQL** 16+
- **npm** or **yarn**

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd Web-Weaver
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up PostgreSQL Database

Create a PostgreSQL database:
```bash
# Using psql
createdb umedh_foundation

# Or using SQL
psql -U postgres
CREATE DATABASE umedh_foundation;
```

### 4. Configure Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/umedh_foundation
SESSION_SECRET=your-random-session-secret-here
PORT=5000
NODE_ENV=development
```

**Generate a secure SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Run Database Migrations

Push the schema to your database:
```bash
npm run db:push
```

This will create all necessary tables:
- `users` - User accounts and authentication
- `sessions` - Session storage
- `programs` - Program information
- `donations` - Donation records
- `events` - Event listings
- `event_registrations` - Event registrations
- `volunteers` - Volunteer applications
- `blog_posts` - Blog posts
- `contact_messages` - Contact form submissions

### 6. Create Admin User

Set up your first admin account:
```bash
tsx script/setup-admin.ts admin@umedhfoundation.org yourpassword123 "Admin" "User"
```

Or use the API endpoint after starting the server:
```bash
curl -X POST http://localhost:5000/api/auth/set-admin-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@umedhfoundation.org",
    "password": "yourpassword123",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

### 7. Start Development Server

```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5000
- **Admin Login**: http://localhost:5000/login
- **Admin Dashboard**: http://localhost:5000/admin

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run check` - Type check TypeScript code

## 🗄️ Database Schema

### Core Tables

**users**
- `id` (UUID) - Primary key
- `email` (VARCHAR) - Unique email
- `firstName` (VARCHAR) - First name
- `lastName` (VARCHAR) - Last name
- `role` (VARCHAR) - User role (visitor, donor, volunteer, admin)
- `passwordHash` (VARCHAR) - Hashed password (admin only)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

**programs**
- `id` (SERIAL) - Primary key
- `title` (TEXT) - Program title
- `slug` (TEXT) - URL-friendly slug
- `description` (TEXT) - Short description
- `longDescription` (TEXT) - Detailed description
- `goalAmount` (INTEGER) - Fundraising goal
- `raisedAmount` (INTEGER) - Amount raised
- `imageUrl` (TEXT) - Program image
- `createdAt` (TIMESTAMP)

**donations**
- `id` (SERIAL) - Primary key
- `amount` (INTEGER) - Donation amount (in smallest currency unit)
- `currency` (TEXT) - Currency code (default: INR)
- `donorName` (TEXT) - Donor name
- `donorEmail` (TEXT) - Donor email
- `programId` (INTEGER) - Reference to program
- `paymentId` (TEXT) - Payment gateway ID
- `status` (TEXT) - Payment status (pending, completed, failed)
- `isRecurring` (BOOLEAN) - Recurring donation flag
- `createdAt` (TIMESTAMP)

**events**
- `id` (SERIAL) - Primary key
- `title` (TEXT) - Event title
- `slug` (TEXT) - URL-friendly slug
- `description` (TEXT) - Event description
- `date` (TIMESTAMP) - Event date/time
- `location` (TEXT) - Event location
- `imageUrl` (TEXT) - Event image
- `capacity` (INTEGER) - Maximum attendees
- `registeredCount` (INTEGER) - Current registrations
- `createdAt` (TIMESTAMP)

**volunteers**
- `id` (SERIAL) - Primary key
- `name` (TEXT) - Volunteer name
- `email` (TEXT) - Unique email
- `phone` (TEXT) - Phone number
- `skills` (TEXT) - Skills and expertise
- `availability` (TEXT) - Availability information
- `resumeUrl` (TEXT) - Resume URL
- `status` (TEXT) - Application status (pending, approved, rejected)
- `createdAt` (TIMESTAMP)

**blog_posts**
- `id` (SERIAL) - Primary key
- `title` (TEXT) - Post title
- `slug` (TEXT) - URL-friendly slug
- `content` (TEXT) - Post content
- `imageUrl` (TEXT) - Featured image
- `authorId` (TEXT) - Reference to user
- `published` (BOOLEAN) - Publication status
- `createdAt` (TIMESTAMP)

**contact_messages**
- `id` (SERIAL) - Primary key
- `name` (TEXT) - Sender name
- `email` (TEXT) - Sender email
- `message` (TEXT) - Message content
- `createdAt` (TIMESTAMP)

## 🔐 Authentication

### Admin Authentication
- Password-based authentication using Passport Local Strategy
- Passwords are hashed using bcryptjs
- Sessions stored in PostgreSQL
- Admin-only routes protected with `isAdmin` middleware

### User Roles
- **visitor** - Default role for all users
- **donor** - Users who have made donations
- **volunteer** - Approved volunteers
- **admin** - Full access to admin dashboard

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/programs` - List all programs
- `GET /api/programs/:slug` - Get program by slug
- `POST /api/donations` - Create donation
- `GET /api/events` - List all events
- `GET /api/events/:slug` - Get event by slug
- `POST /api/events/:id/register` - Register for event
- `POST /api/volunteers` - Register as volunteer
- `GET /api/blog` - List blog posts
- `GET /api/blog/:slug` - Get blog post by slug
- `POST /api/contact` - Submit contact form

### Protected Endpoints (Admin)
- `GET /api/auth/user` - Get current user
- `POST /api/login` - Admin login
- `POST /api/logout` - Logout
- `GET /api/donations` - List all donations (admin only)
- `POST /api/auth/set-admin-password` - Set admin password
- `POST /api/auth/change-password` - Change password (requires auth)

## 🚢 Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
Make sure to set:
- `NODE_ENV=production`
- `DATABASE_URL` - Production database URL
- `SESSION_SECRET` - Strong random secret
- `PORT` - Server port (default: 5000)

### Start Production Server
```bash
npm start
```

## 📝 Development Notes

- The project uses **Drizzle ORM** with direct schema push (no migration files)
- Client and server share types via `shared/` directory
- API routes are type-safe using Zod schemas
- Forms use React Hook Form with Zod validation
- Internationalization supports English, Hindi, and Marathi

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License

## 🆘 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL format: `postgresql://user:password@host:port/database`
- Ensure database exists: `psql -l`

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using the port: `lsof -ti:5000 | xargs kill`

### Admin Login Not Working
- Verify admin user exists: Check database `users` table
- Ensure password is at least 8 characters
- Check browser console for errors
- Verify session cookies are enabled

## 📞 Support

For issues and questions, please open an issue on the repository.
