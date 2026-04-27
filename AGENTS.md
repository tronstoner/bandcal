# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

## Build & Development Commands

This project uses [Taskfile](https://taskfile.dev/) for orchestration and Docker Compose for running services.

```bash
# Install dependencies (runs npm ci in both app/ and api/)
task setup

# Start development environment (Docker Compose with hot reload)
task dev:start

# Start production environment
task prod:start

# Other container commands
task stop           # Stop containers
task remove         # Remove containers
task logs           # View logs
task ps             # List running containers
```

For working directly on subprojects without Docker:

```bash
# Frontend (app/)
cd app && npm run dev        # Vite dev server
cd app && npm run build      # Type-check + production build

# Backend (api/)
cd api && npm run dev        # ts-node-dev with hot reload
cd api && npm run build      # TypeScript compilation
```

No test suites exist yet in either subproject.

## Architecture

Monorepo with three Docker services behind an Nginx reverse proxy:

- **app/** — Vue 3 SPA (Vite, TypeScript, Vue Router). No centralized state store; components use Composition API with local state. API calls go through `app/src/utils/api.ts` (`apiFetch` wrapper).
- **api/** — Express server (TypeScript, TypeORM, SQLite). All routes defined in `api/src/server.ts`. Three entities: `CalendarEntry` (keyed by date string), `Message`, `ContactInfo` in `api/src/models/`.
- **nginx/** — Reverse proxy with HTTP basic auth. Routes `/` to the frontend, `/api` to Express.

The SQLite database lives at `db/database.sqlite`. TypeORM config is in `api/src/data-source.ts`; app configuration merges defaults → optional JSON file → environment variables (`api/src/configuration.ts`).

## Environment Variables

Defined in `.env` (see `.env.example`). Key variables:

- `BANDCAL_PORT` — Nginx exposed port (default 8080)
- `VITE_API_BASE_PATH` — API path used by frontend (default `/api`)
- `VITE_APP_TITLE` — Header title
- `VITE_APP_COLOR_SCHEME` — `default` or `alt` theme

Frontend env vars must be prefixed with `VITE_` to be available in the Vue app.

## API Endpoints

All routes are in `api/src/server.ts`:

- `GET/POST/DELETE /calendar` — Calendar entries (date range queries, upsert by date)
- `GET/POST/DELETE /messages` — Message board (cursor-based pagination)
- `GET/POST/DELETE /contacts` — Contact list
- `GET /ping` — Health check
