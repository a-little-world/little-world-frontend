# Design system & links

## Packages

We do not build UI primitives in this repo. They come from the design system
repository [a-little-world/little-world-design-system](https://github.com/a-little-world/little-world-design-system):

| Package                                            | Use here                                                     |
| -------------------------------------------------- | ------------------------------------------------------------ |
| `@a-little-world/little-world-design-system`        | Web components (`Button`, `Link`, `Modal`, …), tokens, theme. |
| `@a-little-world/little-world-design-system-core`   | Framework-agnostic tokens/utilities shared web ↔ native.      |
| `@a-little-world/little-world-design-system-native` | Native-only components (used by the mobile app, not here).   |

Components are imported straight from the package:

```tsx
import { Button, Link, tokens } from '@a-little-world/little-world-design-system';
```

Run Storybook locally (`localhost:6006` in the design-system repo) to see the
full component list and their props before you build something from scratch.

## Styling rules

- Use `styled-components`; keep styles next to the component that owns them.
- Read colours, spacing, radii, font sizes and breakpoints from the design-system
  **tokens** — no raw `#hex`, `px` magic numbers or local theme forks.
- Compose design-system components instead of re-implementing them. If a
  primitive is missing, add it in the design-system repo and bump the dependency
  here; do not fork it locally.
- Prefer the existing `src/components/atoms` wrapper when one already wraps the
  primitive with our layout/auth conventions.

## Links

Links are the one thing that most often gets done wrong, because this code base
runs in **two routers**:

- **web**: `createBrowserRouter` (real URLs, e.g. `/matches`);
- **native webview**: `createHashRouter` (URLs inside a hash, no real navigation).

A plain `<a href="/matches">` therefore breaks in the native app (full page load
in a webview, no history, no SWR cache), and a bare `<Link to="/matches">` throws
outside a router (for example in standalone info cards on the landing page).

### The rule

**Render every link with a design-system link component and spread
[`getAppLinkProps()`](../src/helpers/links.ts) onto it.**

```tsx
import { Link } from '@a-little-world/little-world-design-system';
import { getAppLinkProps } from '../../helpers/links';

// internal route → SPA navigation (react-router `to`)
<Link {...getAppLinkProps('/about-us/support')}>Support us</Link>;

// external URL → new tab
<Link {...getAppLinkProps('https://example.org')}>Example</Link>;
```

`getAppLinkProps(href, inRouter = true)` does exactly one thing:

| Input                                     | Result                        |
| ----------------------------------------- | ----------------------------- |
| not an internal path (`https://…`, `mailto:…`, `//cdn…`) | `{ href, target: '_blank' }`  |
| internal path (`/matches`), `inRouter` true  | `{ to: href }`               |
| internal path, `inRouter` false              | `{ href, target: '_self' }`  |

`isInternalLink(href)` is exported too, if you only need the classification.
Both are unit-tested in [`src/helpers/links.test.ts`](../src/helpers/links.test.ts).

### When must I pass `inRouter={false}`?

Only when the component is rendered **outside** a router — e.g. a card that is
also used by a standalone HTML shell or a test without `RouterProvider`. In that
case use `<Link {...getAppLinkProps(href, inRouter)}>` with an `inRouter` prop
threaded from the call site, exactly like
[`MessageCard.jsx`](../src/components/blocks/Cards/MessageCard.jsx) does. In
normal pages leave the default.

### Real examples

- Internal + external in one component:
  [`AboutUs/SupportUs.tsx`](../src/components/views/AboutUs/SupportUs.tsx)
  wraps the DS `Link` in `styled(Link)` and spreads `getAppLinkProps()`.
- External-only lists may skip the helper and hard-code
  `href`/`target="_blank"` (see
  [`AboutUs/Materials.tsx`](../src/components/views/AboutUs/Materials.tsx)) —
  but if there is any chance the target becomes an in-app route, use the helper.

### Other "link-ish" things

- **Buttons that navigate**: still use the DS button, but trigger
  `useNavigate()` — not an `<a>` wrapped around a button.
- **Route paths**: never inline `'/matches'`; import the slug/helper from
  [`src/router/routes.ts`](../src/router/routes.ts) (see
  [routing-and-i18n.md](routing-and-i18n.md)).
- **Native deep links / messages from the app**: go through
  `src/features/stores/receiveHandler.ts` and `src/webview/*`, not through `<a>`.

## Checklist for a new UI piece

- [ ] Component built from design-system primitives + tokens.
- [ ] Styled with `styled-components`, no hard-coded design values.
- [ ] Internal links use `getAppLinkProps()`; external links open in a new tab.
- [ ] Works in both web and native webview (browser router vs. hash router).
- [ ] Strings come from translations (see [routing-and-i18n.md](routing-and-i18n.md)).
- [ ] Screenshot in the PR.
