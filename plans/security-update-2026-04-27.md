# Upgrade Plan — 2026-04-27

20 open Dependabot alerts across `app/` and `api/`. Rather than chasing individual alerts, we upgrade all dependencies bottom-up: patch/minor first, then major, then re-assess what's left.

## Current versions

Node: 22 (`.nvmrc` = 22, Dockerfiles pin `node:22-alpine`)

### app/ — `npm outdated`

| Package | Current | Wanted | Latest | Bump |
|---------|---------|--------|--------|------|
| `@types/lodash` | 4.17.20 | 4.17.24 | 4.17.24 | patch |
| `@types/node` | 22.18.8 | 22.19.17 | 25.6.0 | patch / major |
| `@vitejs/plugin-vue` | 5.2.4 | 5.2.4 | 6.0.6 | major |
| `@vueuse/core` | 12.8.2 | 12.8.2 | 14.2.1 | major |
| `dayjs` | 1.11.18 | 1.11.20 | 1.11.20 | patch |
| `eslint` | 9.36.0 | 9.39.4 | 10.2.1 | minor / major |
| `lodash` | 4.17.21 | 4.18.1 | 4.18.1 | minor |
| `typescript` | 5.6.3 | 5.6.3 | 6.0.3 | major |
| `vite` | 6.3.6 | 6.4.2 | 8.0.10 | minor / major |
| `vue` | 3.5.22 | 3.5.33 | 3.5.33 | patch |
| `vue-router` | 4.5.1 | 4.6.4 | 5.0.6 | minor / major |
| `vue-tsc` | 2.2.12 | 2.2.12 | 3.2.7 | major |

### api/ — `npm outdated`

| Package | Current | Wanted | Latest | Bump |
|---------|---------|--------|--------|------|
| `@types/express` | 5.0.3 | 5.0.6 | 5.0.6 | patch |
| `@types/lodash` | 4.17.20 | 4.17.24 | 4.17.24 | patch |
| `body-parser` | 1.20.3 | 1.20.5 | 2.2.2 | patch / major |
| `cors` | 2.8.5 | 2.8.6 | 2.8.6 | patch |
| `express` | 4.21.2 | 4.22.1 | 5.2.1 | minor / major |
| `lodash` | 4.17.21 | 4.18.1 | 4.18.1 | minor |
| `sqlite3` | 5.1.7 | 5.1.7 | 6.0.1 | major |
| `typeorm` | 0.3.27 | 0.3.28 | 0.3.28 | patch |
| `typescript` | 5.9.3 | 5.9.3 | 6.0.3 | major |

---

## Step 1: Patch & minor updates (both projects)

Update everything within the semver range (`npm update`). Zero risk — these are already allowed by the `^` ranges in `package.json`.

```bash
cd app && task npm -- update
cd api && task npm -- update
```

Then run `task npm -- audit fix` in both to pick up transitive fixes.

Verify:
```bash
cd app && task npm:build
cd api && task npm:build
task dev:build
```

Commit if green.

## Step 2: Major updates — app/

Upgrade major versions one group at a time. Build after each to catch breakage early.

### 2a: vite 6 → 8 + @vitejs/plugin-vue 5 → 6

These are tightly coupled — upgrade together. vue-tsc stays on v2 — v3 introduces stricter template ref detection that flags `boardListRef` as unused (it's used via template `ref="boardListRef"` but vue-tsc 3 doesn't recognize it).

```bash
cd app && task npm -- install vite@latest @vitejs/plugin-vue@latest
```

### 2b: @vueuse/core 12 → 14

```bash
cd app && task npm -- install @vueuse/core@latest
```

Review changelog for removed/renamed composables used in the codebase.

### 2c: vue-router 4 → 5

```bash
cd app && task npm -- install vue-router@latest
```

### 2d: eslint 9 → 10

```bash
cd app && task npm -- install eslint@latest
```

### Skipped for now

- **typescript**: stay on 5.x — TS 6 is very recent, no security motivation.
- **vue-tsc**: stay on 2.x — v3 has stricter template ref detection that requires code changes.
- **@types/node**: stay on 22.x — matches our Node 22 runtime, no reason to go to 25.

## Step 3: Major updates — api/

### Skipped for now

- **express 4 → 5**: deferred to minimize code impact in this upgrade iteration. Express 5 changes path matching, middleware signatures, and may make `body-parser` redundant — tackle separately.
- **typescript**: stay on 5.x, same as app.

## Step 4: Migrate sqlite3 → better-sqlite3

The `sqlite3` package (both v5 and v6) depends on `node-gyp` → `tar` → `@tootallnate/once` for native compilation. These transitive deps carry the bulk of the remaining Dependabot alerts. The vulnerabilities are install-time only (inside Docker builds), not runtime — but they won't go away with version bumps since even sqlite3@6 still pulls vulnerable `tar`.

`better-sqlite3` avoids this entirely — it ships precompiled binaries without the `node-gyp`/`tar` chain. TypeORM officially supports it (`peerOptional better-sqlite3@"^8-12"`).

Changes required:
1. `api/package.json`: replace `sqlite3` with `better-sqlite3`
2. `api/src/data-source.ts`: change `type: "sqlite"` to `type: "better-sqlite3"`
3. `api/Dockerfile` + `api/Dockerfile_dev`: remove `python3`, `build-base`, `sqlite-dev` (only needed for sqlite3's native build), and remove `sqlite3 --version` check
4. Keep `sqlite` apk package if the CLI is still useful for debugging, otherwise remove too

```bash
cd api && task npm -- install better-sqlite3
cd api && task npm -- uninstall sqlite3
```

Verify:
```bash
cd api && task npm:build
task dev:build
# Start the app and verify database operations work
```

## Step 5: Re-assess Dependabot

After all upgrades, run:
```bash
cd app && task npm -- audit
cd api && task npm -- audit
```

Check which of the original 20 Dependabot alerts are resolved. Any remaining alerts at this point are genuinely stuck on upstream and can be evaluated individually (override, dismiss, or track).

## Step 6: Verify & commit

```bash
task dev:build
```

Commit strategy:
- Step 1 (patch/minor): one commit
- Step 2 (app majors): one commit
- Step 4 (better-sqlite3): one commit
