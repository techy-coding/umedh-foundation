#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "Starting reproducible dev flow..."

# Ensure .env exists
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "Copied .env.example to .env"
  else
    echo ".env.example not found; please create a .env file" >&2
    exit 1
  fi
fi

# Ensure SESSION_SECRET
if ! grep -q '^SESSION_SECRET=' .env; then
  SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
  echo "SESSION_SECRET=$SECRET" >> .env
  echo "Generated SESSION_SECRET"
fi

# Start Postgres via docker compose if Docker is available
if command -v docker >/dev/null 2>&1; then
  echo "Starting Postgres via Docker Compose..."
  docker compose up -d
else
  echo "Docker not found. Ensure PostgreSQL is running and DATABASE_URL in .env points to it."
fi

# Extract DB host and port from DATABASE_URL (fallback to localhost:5432)
DB_HOST=$(node -e "const fs=require('fs');const s=fs.readFileSync('.env','utf8');const m=s.match(/DATABASE_URL=(.*)/); if(!m){console.log('localhost'); process.exit(0);} try{const u=new URL(m[1]); console.log(u.hostname||'localhost')}catch(e){console.log('localhost')}"
)
DB_PORT=$(node -e "const fs=require('fs');const s=fs.readFileSync('.env','utf8');const m=s.match(/DATABASE_URL=(.*)/); if(!m){console.log('5432'); process.exit(0);} try{const u=new URL(m[1]); console.log(u.port||'5432')}catch(e){console.log('5432')}"
)

echo "Waiting for Postgres at ${DB_HOST}:${DB_PORT} (30s timeout)"
for i in {1..30}; do
  if nc -z "$DB_HOST" "$DB_PORT" >/dev/null 2>&1; then
    echo "Postgres is up"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "Timed out waiting for Postgres at ${DB_HOST}:${DB_PORT}. Please check your DB and try again." >&2
    exit 1
  fi
  sleep 1
done

echo "Installing dependencies..."
npm install

echo "Pushing DB schema..."
npm run db:push

echo "Schema push complete. To create an admin user run: npm run setup-admin <email> <password> \"First\" \"Last\""

echo "Starting dev server (API + Vite)..."
npm run dev
