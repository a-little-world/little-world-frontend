# Developer documentation

These docs describe **how we work in this repository**: where code goes, which
patterns we use, and what has to be true before a PR can be merged.

If you are brand new, read them in this order:

1. [local-development.md](local-development.md) — get the app running.
2. [project-structure.md](project-structure.md) — where to put your code.
3. [design-system.md](design-system.md) — styling, components, **links**.
4. [data-and-state.md](data-and-state.md) — API calls, caching, global state.
5. [routing-and-i18n.md](routing-and-i18n.md) — new pages, routes, translations.
6. [testing-and-ci.md](testing-and-ci.md) — what you must verify.

## Conventions at a glance

The short version, so you can recognise a wrong code review comment quickly:

| Topic            | Rule                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------- |
| New component    | `src/components/atoms`, `blocks` or `views` depending on size/scope.                           |
| New API call     | Add a function to `src/api/`, call it through `apiFetch`. Never a bare `fetch`.                |
| Reading API data | `useSWR` with a key from the same module; mutate with the SWR helpers, not `location.reload`.  |
| Global state     | zustand store in `src/features/stores`. Local `useState` if only one component cares.          |
| Styling          | `styled-components` + design-system tokens/components. No hard-coded colours/spacing.          |
| Internal link    | Design-system link + `getAppLinkProps(href)`. Never a raw `<a href>` for an in-app route.       |
| Route path       | Route slug constants/helpers from `src/router/routes.ts`. Never a hand-written `'/matches'`.     |
| Strings          | Translation keys in `src/locale/*.json`. No inline user-facing text.                            |
| Tests            | Colocated `*.test.ts` for logic (helpers, reducers, validation). UI can rely on review + e2e.    |
| Commits          | [Conventional Commits](https://www.conventionalcommits.org/).                                  |

## Why "process approaches" live here

Historically everything was in the README, which made it long and easy to skip.
Each topic now has its own page so a reviewer can link to the exact rule
("see docs/design-system.md#links") instead of repeating it in every PR.

When you introduce a new cross-cutting pattern, add a short section to the
relevant page in the same PR. A pattern that only exists in a PR comment is a
pattern that will be re-invented next month.
