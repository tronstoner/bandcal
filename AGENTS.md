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

**IMPORTANT:** Never run `npm` directly on the host. Both `app/` and `api/` have their own `Taskfile.yaml` with an `npm` task that runs npm inside a Docker container (using the Node version from `.nvmrc`). Always use the task wrapper:

```bash
# Install a package in app/
cd app && task npm -- install <package>

# Update a package in app/
cd app && task npm -- update <package>

# Run npm ci in app/
cd app && task npm:ci

# Same pattern for api/
cd api && task npm -- install <package>
cd api && task npm:ci
```

Other sub-project tasks (also running in Docker):

```bash
cd app && task npm:dev       # Vite dev server
cd app && task npm:build     # Type-check + production build

cd api && task npm:dev       # ts-node-dev with hot reload
cd api && task npm:build     # TypeScript compilation
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
