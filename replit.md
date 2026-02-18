# Umedh Foundation Website

## Overview

This is a full-stack web application for the **Umedh Foundation**, a non-profit organization focused on empowering underprivileged communities through education, healthcare, and sustainable development. The website serves as a public-facing platform for the NGO with features including program showcasing, online donations, event management, volunteer registration, blog/news, contact forms, and an admin dashboard.

The application supports **multilingual content** (English, Hindi, Marathi) and has a role-based system with four roles: Visitor, Donor, Volunteer, and Admin.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router)
- **State Management**: TanStack React Query for server state; no dedicated client state library
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives with Tailwind CSS
- **Styling**: Tailwind CSS with CSS variables for theming. Sky Blue primary, Green secondary, White background. Fonts: Outfit (headings), Inter (body)
- **Forms**: react-hook-form with Zod validation via @hookform/resolvers
- **Animations**: Framer Motion for scroll and transition effects
- **Internationalization**: i18next with react-i18next and browser language detection. Three languages: English, Hindi, Marathi
- **Icons**: Lucide React
- **Charts**: Recharts (used in admin dashboard)
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript, executed with tsx in development
- **API Pattern**: RESTful JSON API under `/api/*` prefix. Route definitions are shared between client and server via `shared/routes.ts` which includes Zod schemas for input validation and response typing
- **Build**: Custom build script using esbuild for server and Vite for client. Production output goes to `dist/`
- **Dev Server**: Vite dev server runs as middleware inside Express during development, with HMR support

### Data Storage
- **Database**: PostgreSQL (required, connected via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` and `shared/models/auth.ts`
- **Migrations**: Drizzle Kit with `drizzle-kit push` command (no migration files, direct push)
- **Tables**: users, sessions, programs, donations, events, event_registrations, volunteers, blog_posts, contact_messages

### Authentication & Authorization
- **Auth Provider**: Replit Auth (OpenID Connect)
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple, stored in a `sessions` table
- **User Roles**: visitor (default), donor, volunteer, admin — stored in the `users` table `role` column
- **Admin Protection**: Admin dashboard checks user role client-side and redirects non-admin users. Server-side uses `isAuthenticated` middleware from Replit Auth integration
- **Important**: The `users` and `sessions` tables are mandatory for Replit Auth and should not be dropped

### Shared Code Pattern
- `shared/schema.ts`: Drizzle table definitions and Zod insert schemas (shared between server and client)
- `shared/routes.ts`: API route contracts with paths, methods, input schemas, and response schemas. This enables type-safe API calls from the client
- `shared/models/auth.ts`: Auth-specific models (users, sessions)

### Key Pages
| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero section, featured programs, stats, CTA |
| `/about` | About | Mission, vision, values, team |
| `/programs` | Programs | Grid of all programs |
| `/programs/:slug` | ProgramDetail | Single program with donation CTA |
| `/donate` | Donate | Donation form with preset amounts |
| `/events` | Events | List of upcoming events |
| `/volunteer` | Volunteer | Volunteer registration form |
| `/contact` | Contact | Contact form with org info |
| `/admin` | Admin | Protected admin dashboard with stats/charts |

## External Dependencies

### Required Services
- **PostgreSQL Database**: Required. Connection via `DATABASE_URL` environment variable. Used for all data storage and session management
- **Replit Auth (OIDC)**: Authentication provider. Requires `ISSUER_URL`, `REPL_ID`, and `SESSION_SECRET` environment variables

### Key NPM Packages
- **drizzle-orm** + **drizzle-kit**: Database ORM and migration tooling
- **express** + **express-session**: HTTP server and session handling
- **connect-pg-simple**: PostgreSQL session store
- **passport** + **openid-client**: OIDC authentication flow
- **zod** + **drizzle-zod**: Schema validation (shared client/server)
- **i18next** + **react-i18next**: Internationalization
- **framer-motion**: Animations
- **recharts**: Admin dashboard charts
- **react-day-picker**: Calendar component
- **vaul**: Drawer component
- **embla-carousel-react**: Carousel component

### Environment Variables Required
- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — Secret for session encryption
- `REPL_ID` — Replit environment identifier (for auth)
- `ISSUER_URL` — OIDC issuer URL (defaults to `https://replit.com/oidc`)