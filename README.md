# Little World Frontend

The Little World web app — and, when packaged, the webview of our React Native
app ([little-world-native](https://github.com/a-little-world/little-world-native)).

- **Web**: the website, built from this repo and deployed from the `prod` branch.
- **Native webview**: this repo is published as the npm package `littleplanet`
  (GitHub Package Registry, `pnpm publish --registry=https://npm.pkg.github.com`)
  and rendered inside the mobile app.

This README is the short version. The details live in [`docs/`](docs/README.md).

## Quick start

```bash
# prerequisites: Node 24 (see .nvmrc) and pnpm 10 (corepack enable)
pnpm install
pnpm exec webpack serve --mode development   # dev server on http://localhost:3000
./schrodingers-nginx.sh                      # optional: nginx proxy on http://localhost:3333
```

Open <http://localhost:3333> (proxy) or <http://localhost:3000> (dev server).
Note: `pnpm run dev` is currently broken (`webpack serveviews/index.js`) — see
[docs/local-development.md](docs/local-development.md#install-and-run).
The proxy exists because the backend sets cookies/CSRF tokens that only survive
when frontend and API share one origin — see
[docs/local-development.md](docs/local-development.md).

## Quality gates

Run these before you push; CI runs the same commands on every pull request.

```bash
pnpm run lint          # eslint ./src
pnpm run format:check  # prettier --check ./src  (fix with pnpm run format:fix)
pnpm test              # node --test 'src/**/*.test.ts'
pnpm run build         # rollup bundle + type declarations
```

Details, including what CI does and what to do when it fails:
[docs/testing-and-ci.md](docs/testing-and-ci.md).

## Documentation

| Document                                                 | What it answers                                                       |
| -------------------------------------------------------- | --------------------------------------------------------------------- |
| [docs/local-development.md](docs/local-development.md)    | How do I run this locally, and why is there an nginx proxy?            |
| [docs/project-structure.md](docs/project-structure.md)    | Where do I put a new component / hook / helper / store?                |
| [docs/design-system.md](docs/design-system.md)            | How do I use the design system, and how are **links** done?           |
| [docs/data-and-state.md](docs/data-and-state.md)          | How do I call the API and cache the response?                          |
| [docs/routing-and-i18n.md](docs/routing-and-i18n.md)      | How do I add a page, a route or a translation?                         |
| [docs/testing-and-ci.md](docs/testing-and-ci.md)          | What do I have to verify, and what does CI check?                      |

## Branching

| Branch                | Purpose                                                            |
| --------------------- | ------------------------------------------------------------------ |
| `main`                | Development branch. Everything lands here via PR.                   |
| `prod`                | Production. Merging here deploys the web app (and may release npm). |
| `feature/<name>`      | New features / larger changes.                                     |
| `fix/<issue>`         | Bug fixes.                                                         |
| `chore/<chore>`       | Dependencies, tooling, chores.                                     |

Work on a branch off `main`, open a PR **against `main`**, and only open a PR
**against `prod`** when you want to release.

## Release process

1. Feature/fix work merges to `main`.
2. A PR from `main` → `prod` is opened. The `Release` workflow runs on PRs
   targeting `prod` and comments a package-version preview on the PR.
3. The web app is deployed from `prod`.
4. The npm package only reaches the native app when `package.json`'s version
   changes. **Caveat:** the `Release` workflow only triggers on `pull_request`
   events, while its publish/release steps are gated on
   `github.ref == 'refs/heads/prod'` (which is `refs/pull/<n>/merge` for a PR).
   So today the publish step does not actually run from this workflow — see
   [docs/testing-and-ci.md](docs/testing-and-ci.md#release-and-publishing)
   before relying on it; publishing may need to be run manually.

Merging into `main` also notifies the native repo (`notify-native` workflow), so
the mobile app can bump its submodule reference and open its own PR.

Version bumps use [Changesets](https://github.com/changesets/changesets):

```bash
pnpm run changeset   # describe the change (patch/minor/major)
pnpm run version     # apply: bumps package.json, updates changelog
```

Bump the version **only** when the native app should receive the change — web
deployments do not need a version bump.

## Conventions

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) —
  `feat(MatchOverview): add nudges row`.
- **Code**: TypeScript for new files, function components + hooks, no `any`
  where a real type exists, Airbnb ESLint + Prettier (both enforced in CI).
- **Styling**: styled-components plus design-system tokens/components — never
  hard-coded colours or spacing.
- **Links**: always go through the design system plus
  [`getAppLinkProps()`](docs/design-system.md#links) — never a raw `<a>` for an
  in-app route.
- **API access**: `apiFetch` from `src/api/helpers.ts` — never a bare `fetch`.
- **Translations**: add the key to `src/locale/*.json`, never inline a user
  facing string.

## Pull request checklist

- [ ] `pnpm run lint`, `pnpm run format:check` and `pnpm test` pass locally.
- [ ] Tests added/updated for new logic (`.test.ts` next to the file).
- [ ] Screenshots or a short screen recording for UI changes.
- [ ] Docs updated when you introduce a new pattern or convention.
- [ ] Review requested from at least one team member.

## Code review

All contributions are reviewed by a maintainer; address feedback on the same
branch — the PR updates automatically.

---

Little World is a charitable project: contributions are extremely valuable to
us. If anything in these docs is wrong or missing, open an issue — making this
repository easier to work in is itself a welcome contribution.
