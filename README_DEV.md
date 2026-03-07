# Development Run Guide (Reproducible)

This file explains the recommended, reproducible steps to run this project on another machine.

Prerequisites
- Node.js 18+ (LTS)
- npm (comes with Node)
- Docker (recommended) — or a local PostgreSQL instance

Quick steps (recommended: using Docker)

1. Clone the repo and enter the project folder:

```bash
git clone <repo-url>
cd Web-Weaver
```

2. Copy the example env and update values (especially `DATABASE_URL` and `SESSION_SECRET`):

```bash
cp .env.example .env
# generate a SESSION_SECRET and paste it into .env
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. Start the local Postgres container (requires Docker):

```bash
npm run compose:up
```

4. Install dependencies:

```bash
npm install
```

5. Push the database schema:

```bash
npm run db:push
```

6. (Optional) Create an admin user:

```bash
npm run setup-admin admin@umedhfoundation.org yourpassword123 "Admin" "User"
```

7. Start the development server (API + Vite):

```bash
npm run dev
```

Alternative single-step (if Docker is available):

```bash
npm run dev:docker
```

Docker development (recommended)

The repository includes a `docker-compose.yml` that starts Postgres and an `app` service for local development. The app is mapped to host port `5001`.

```bash
# start DB + app
docker compose up -d

# view app logs
docker compose logs -f app

# stop and remove containers
docker compose down
```

Access the site at: http://localhost:5001


Notes for non-Docker users
- Ensure PostgreSQL is installed and running and that `DATABASE_URL` in `.env` points to it.
- Create the DB manually if needed: `createdb umedh_foundation`

Troubleshooting
- If `drizzle-kit` errors with connection refused, ensure Postgres is running and reachable at `DATABASE_URL`.
- If `.bin` executables return `bad interpreter` on macOS, run the scripts via Node directly (e.g. `node ./node_modules/tsx/dist/cli.mjs server/index.ts`).

That's it — following the above will allow another developer to run this project locally.
