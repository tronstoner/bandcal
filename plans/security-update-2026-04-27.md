# Security Update Plan — 2026-04-27

## Current State

20 open Dependabot alerts across `app/` and `api/`. The repo is currently in a dirty state from a failed upgrade attempt that needs to be reverted first (`git checkout -- . && git clean -fd`).

## Step 1: Revert to clean state

```
git checkout -- .
git clean -fd
```

Then reinstall both projects:
```
cd app && task npm:ci
cd api && task npm:ci
```

## Step 2: Safe version bumps (app/)

These are direct dependency updates with no architectural impact:

| Package | Current | Target | Alerts fixed |
|---------|---------|--------|-------------|
| `lodash` | ^4.17.21 | ^4.18.1 | #68, #69 (Code Injection), #66, #67 (Prototype Pollution) |
| `vite` | ^6.0.1 | ^6.4.2+ | #70 (Path Traversal), #64 (WebSocket file read) |

Commands:
```
cd app
task npm -- install lodash@latest
task npm -- install vite@latest @vitejs/plugin-vue@latest
```

Note: `vite@latest` is currently 8.x. If that causes issues, pin to `vite@^6.4.2` as the minimum safe version within the v6 range.

After installing, run `task npm -- audit fix` to pick up transitive fixes (flatted, minimatch, brace-expansion, js-yaml, picomatch, rollup).

Verify: `task npm -- audit` should show 0 vulnerabilities.
Verify: `cd app && task npm:build` should succeed.

## Step 3: Safe version bumps (api/)

| Package | Current | Target | Alerts fixed |
|---------|---------|--------|-------------|
| `lodash` | ^4.17.21 | ^4.18.1 | #68, #69 (Code Injection), #66, #67 (Prototype Pollution) |

Command:
```
cd api
task npm -- install lodash@latest
task npm -- audit fix
```

Verify: `task npm -- audit` — check remaining count.

## Step 4: Remaining api/ vulnerabilities (requires discussion)

After steps 2-3, the api/ will still have vulnerabilities in the `sqlite3@5.x` dependency chain. These **cannot** be fixed with simple version bumps because `typeorm@0.3.x` pins `peerOptional sqlite3@"^5.0.3"`.

### Affected alerts

| Package | Severity | Root cause |
|---------|----------|-----------|
| `tar` (6 alerts) | high | `sqlite3` → `node-gyp` → `tar@<=7.5.10` |
| `@tootallnate/once` | low | `sqlite3` → `node-gyp` → `make-fetch-happen` → `http-proxy-agent` → `@tootallnate/once` |
| `path-to-regexp` | high | transitive via express or similar |
| `uuid` | moderate | `typeorm` depends on `uuid@<14.0.0` |

### Options to discuss

**Option A: Switch sqlite3 driver to better-sqlite3**
- TypeORM officially supports `better-sqlite3@^8-12` as a peer dependency
- Eliminates the entire `node-gyp` → `tar` chain
- Requires: change `type: "sqlite"` to `type: "better-sqlite3"` in `data-source.ts`
- Requires: replace `sqlite3` with `better-sqlite3` in `package.json`
- Risk: different runtime behavior (synchronous vs async), could remove python/build-base from Dockerfiles
- Impact: moderate — driver swap + Dockerfile cleanup

**Option B: Wait for typeorm to support sqlite3@6**
- `typeorm@0.3.28` currently pins `peerOptional sqlite3@"^5.0.3"`
- sqlite3@6 is available but typeorm hasn't updated the peer dep yet
- Risk: unknown timeline
- Impact: none now, revisit later

**Option C: npm overrides for transitive deps only**
- Add `overrides` in `package.json` to force safe versions of `tar`, `uuid`, etc.
- Keeps `sqlite3@5.x` as-is
- Risk: overridden versions may break sqlite3's build process; the `tar` vuln is only relevant during `npm install` (not runtime)
- Impact: low code change, but overrides can be fragile

**Option D: Dismiss non-runtime alerts**
- The `tar`, `@tootallnate/once`, and `node-gyp` vulnerabilities are in the **install-time** dependency chain, not runtime code
- They only matter during `npm ci` inside Docker builds (controlled environment)
- `uuid` is runtime but the actual CVE (buffer bounds check on v3/v5/v6) may not apply if typeorm only uses v4
- Impact: none — just document the risk acceptance

### Recommendation

Discuss Options A and D. Option A is the cleanest long-term fix but is a refactor. Option D is pragmatic if the install-time-only risk is acceptable.

## Step 5: Verify Docker builds

After any changes, verify:
```
task dev:build
```

All three images (api, vue-app, nginx) must build successfully.

## Step 6: Commit

Commit the safe bumps (Steps 2-3) as one commit. Any architectural changes from Step 4 should be a separate commit after discussion.
