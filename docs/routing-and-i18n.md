# Routing, navigation and translations

## Route definitions

Two files, two jobs:

- **[`src/router/routes.ts`](../src/router/routes.ts)** — the single source of
  truth for **paths**: slug constants (`APP_ROUTE`, `MATCH_OVERVIEW_ROUTE`,
  `LOGIN_ROUTE`, …), parameterised builders (`getCallRoute(userId)`,
  `getSurveyRoute(slug)`, `getAppRoute(slug)`), plus route helpers
  (`isActiveRoute`, `sanitizeNext`, `hideCookieBanner`,
  `passAuthenticationBoundary`).
- **[`src/router/router.jsx`](../src/router/router.jsx)** — the route tree,
  guards and layouts, and the two router instances:

| Runtime         | Factory              | basename |
| --------------- | -------------------- | -------- |
| Web             | `createBrowserRouter`| `'/'`    |
| Native webview  | `createHashRouter`   | `''`     |

Both share the same route objects; `getNativeRouter()` returns the hash router.

### Never inline a path

```tsx
// ❌ breaks silently when a slug changes
navigate('/app/match-overview/123');

// ✅
import { getMatchOverviewRoute } from '../../router/routes';
navigate(getMatchOverviewRoute(id));
```

Use the constants in `<Route path={…}>` too, so the router and the links can
never disagree.

### Adding a page

1. Create `src/components/views/<Name>/<Name>.tsx` (+ local sub-components).
2. Add the slug to `src/router/routes.ts` (and a builder if it has params).
3. Register it in **both** route trees in `src/router/router.jsx` — the web one
   (`createBrowserRouter`) and the native one (`createHashRouter`) — wrapping it
   in the same `RouteGuard`/layout as its siblings.
4. Link to it with a design-system link + `getAppLinkProps()` (see
   [design-system.md#links](design-system.md#links)).
5. Add translations for all new strings.

## Guards

- `src/guards/RouteGuard.tsx` — decides whether the route renders, redirects to
  login, or passes through to the `Layout`; `authRequired` defaults to `true`.
- `src/guards/AuthGuard.tsx` — broader auth wrapper used for app sections.

If a new page must be public, pass `authRequired={false}` explicitly.

## Navigation

- Use `useNavigate()` / `<Link to>` (through the DS link + `getAppLinkProps`).
- Never `window.location.href = …` — in the native webview that is a full page
  load and loses the app state.
- `ScrollRestoration` is wired in the root layout; do not fight it.

## Translations (i18n)

`src/i18n.js` initialises `i18next` with:

- resources from `src/locale/de.json` and `src/locale/en.json`;
- **`keySeparator: '::'`** and **`nsSeparator: ':::'`** — the backend also uses
  `.` inside translation keys, so the default separators are overridden;
- language detection (cookie/local storage) with **German as fallback**.

Usage in components:

```tsx
const { t } = useTranslation();

return <h1>{t('pages::matches::title')}</h1>;
```

Rules:

- Add every key to **both** `de.json` and `en.json` in the same PR.
- Keys are nested by feature: `pages::<page>::<element>`.
- Never concatenate translated fragments to build a sentence; use interpolation
  (`t('key', { count })`).
- Translated content coming from the backend is merged in at runtime — if a key
  is missing locally, first check whether the backend provides it, then add a
  local fallback.
