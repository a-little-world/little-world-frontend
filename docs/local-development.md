# Local development

## Prerequisites

- **Node 24** — pinned in `.nvmrc` (`nvm use`); CI runs the same major.
- **pnpm 10** — `corepack enable` then pnpm is provisioned from `package.json`
  (`packageManager: pnpm@10.22.0`). `npm`/`yarn` are not used.
- **Docker** (only for the nginx proxy below)
- Access to the GitHub Package Registry (`@a-little-world` scope) if you need the
  design-system packages from the registry; a classic PAT with `read:packages`
  in `~/.npmrc` is enough.

## Install and run

```bash
pnpm install
pnpm exec webpack serve --config webpack.config.js --mode development
# dev server on http://localhost:3000
```

> **Known issue:** the `pnpm run dev` script currently reads
> `webpack serveviews/index.js …` and fails (`serveviews` is not a command, and
> there is no `views/` directory). Until that is fixed in `package.json`, use the
> `pnpm exec webpack serve …` line above.

The dev server (`webpack.config.js`, devServer port **3000**,
`historyApiFallback: true`) serves `public/index.html` and rebuilds on change. It
talks to the backend configured in `src/environment.ts` / the effective backend
URL helpers — by default the staging API.

## Why the nginx proxy exists (`schrodingers-nginx.sh`)

The backend authenticates with **cookies + CSRF tokens** scoped to one origin.
If the frontend runs on `localhost:3000` and the API on another host, cookies,
`SameSite` rules, CSRF checks and the websocket upgrade all break.

`./schrodingers-nginx.sh` starts a Docker nginx container (`nginx-frontend-proxy`,
port **3333**) that puts both on one origin:

```
http://localhost:3333/        → host.docker.internal:3000   (webpack dev server)
http://localhost:3333/api/    → stage.little-world.com      (staging API)
http://localhost:3333/media/  → stage.little-world.com
```

Open <http://localhost:3333> instead of `:3000` when you need login, chat or
video calls.

**Against a local backend**: edit the `SERVER` variable in the script to
`host.docker.internal:8000` (see the comments in the script) and restart it.

## Video calls & E2EE worker

Calls use LiveKit. The E2EE worker is generated once into `prebuild/`:

```bash
pnpm run generate:e2ee-worker
```

The web build loads the worker **same-origin** from the backend
(`${backendUrl}${E2EE_WORKER_ENDPOINT}`) because production serves the JS bundle
from a different host and browsers reject cross-origin workers. For local call
testing you need LiveKit credentials and a webhook URL reachable from the
LiveKit server (the original README used `ngrok` for this) — ask a maintainer for
the current staging keys rather than inventing your own.

## Native webview development

The native app (`little-world-native`) consumes the published package. To test
unreleased changes inside the app you either

1. build the package (`pnpm run build`) and point the app at the local tarball,
   or
2. run the web app and open it in the app's webview debug screen.

Keyboard/console bridging lives in `src/webview/` (`useConsoleBridge`,
`useErrorDebugBridge`) — use it instead of `alert()` when debugging in the
webview.

## Common problems

| Symptom                                        | Cause / fix                                                                |
| ---------------------------------------------- | -------------------------------------------------------------------------- |
| Login "works" but every request is 403          | You are on `:3000`. Use the proxy on `:3333`.                              |
| Websocket/chat never connects                   | Same origin/proxy issue; check the ws upgrade in the nginx container logs. |
| `ERR_PNPM_OUTDATED_LOCKFILE` in CI             | Run `pnpm install` locally and commit `pnpm-lock.yaml`.                    |
| Video call joins then immediately drops        | E2EE worker missing — run `pnpm run generate:e2ee-worker`.                |
