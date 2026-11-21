# Testing, quality gates and CI

## What you run locally

```bash
pnpm run lint          # eslint ./src --ext .js,.jsx,.ts,.tsx (Airbnb + TS rules)
pnpm run format:check  # prettier --check ./src (config: @a-little-world/little-world-prettier-config)
pnpm run format:fix    # apply prettier
pnpm test              # node --test 'src/**/*.test.ts'
pnpm run build         # clean + rollup bundle + tsc declarations + pnpm pack
```

If any of these fails locally, it will fail in CI — the workflows run exactly
these commands (`pnpm install --no-frozen-lockfile`, then the script).

## What CI runs

| Workflow        | Trigger                  | Command                          |
| --------------- | ------------------------ | -------------------------------- |
| `Lint Check`    | every pull request       | `pnpm lint`                      |
| `Format Check`  | every pull request       | `pnpm run format:check`          |
| `Unit Tests`    | every pull request       | `pnpm test`                      |
| `Release`       | PRs targeting `prod` only | version preview; publish/release steps gated on `github.ref == 'refs/heads/prod'` |
| `Notify native` | push to `main`           | pings the native repo            |

Node version comes from `.nvmrc` (24) for lint/format/test (`node-version-file`);
the release workflow pins `node-version: 22`. Use `nvm use` to match the lint/test
jobs locally.

## Writing tests

- Framework: the built-in **`node:test`** runner with `node:assert`, executed on
  the TypeScript sources via `node --test` (Node's type stripping). No Jest.
- Location: colocated — `src/helpers/links.ts` → `src/helpers/links.test.ts`.
- Scope: pure logic (helpers, formatters, validation, route builders, constants).
  React component rendering is **not** unit-tested here; UI changes are verified
  by review plus the e2e/simulation suites in the backend repo.
- Keep tests dependency-free: import the module under test, assert on the
  returned value.

```ts
// src/helpers/links.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { getAppLinkProps } from './links';

test('internal paths use the router', () => {
  assert.deepEqual(getAppLinkProps('/matches'), { to: '/matches' });
});
```

## Before you open a PR

- [ ] `pnpm run lint` — clean.
- [ ] `pnpm run format:check` — clean.
- [ ] `pnpm test` — green.
- [ ] `pnpm run build` — succeeds if you touched the library entry (`src/index.ts`)
      or added types.
- [ ] Manual smoke test of the changed screen in the **browser** (via the nginx
      proxy, so auth/cookies behave like production).
- [ ] If the change affects the native webview (router, links, native bridge),
      say so in the PR description so it gets a device test.

## When CI fails

1. Open the failing workflow, read the first error (later ones are usually
   noise).
2. `Lint`/`Format` failures are mechanical: run `pnpm run format:fix`, then
   `pnpm run lint-fix`, and commit the result.
3. `Unit Tests` failures: run `pnpm test` locally — same command, same Node
   major.
4. If `pnpm install` itself fails with an outdated lockfile, run
   `pnpm install` locally and commit `pnpm-lock.yaml`.
5. Push the fix to the same branch; do not open a second PR.

## Conventions (enforced by review, not CI)

- [Conventional Commits](https://www.conventionalcommits.org/):
  `<type>(<scope>): <subject>` — `feat(chat): show typing indicator`.
- PR title mirrors the commit convention; the description says *what* and *why*
  plus a screenshot for UI.
- One logical change per PR; separate docs/tooling fixes from behaviour changes.

## Release and publishing

The repo doubles as the npm package `littleplanet` (consumed by the native app)
and the web app entry (`src/main.js`).

- `.github/workflows/release.yml` triggers **only on `pull_request`** with
  `branches: [prod]`. On such a PR it builds the package and comments a
  version preview.
- Its publish/release steps are gated on `github.ref == 'refs/heads/prod'`. After
  a merge into `prod` there is no push-triggered run, and a PR run evaluates
  `github.ref` as `refs/pull/<n>/merge`, so **the publish step does not run
  today**. Treat publishing as a manual step (`pnpm run build`, then publish via
  the registry credentials) until that gate or the trigger is fixed — this is a
  known workflow gap, not a rule to copy.
- Version bumps follow changesets: `pnpm changeset`, commit the generated
  markdown file in `.changeset/`, and let the release flow consume it.
- Never publish from a feature branch, and never hand-edit the version in
  `package.json` for a release.

Merging into `main` triggers `notify-native`, which pings the native repository
so it can bump its submodule pointer.
