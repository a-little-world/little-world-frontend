# API access, data fetching and global state

## Three layers

| Layer            | Location                    | Job                                                                |
| ---------------- | --------------------------- | ------------------------------------------------------------------ |
| `apiFetch`       | `src/api/helpers.ts`        | One fetch chokepoint: backend URL, cookies, errors, native bridge.  |
| Endpoint modules | `src/api/*.ts`              | Typed functions per resource (`getMatches`, `postChatMessage`, …).  |
| SWR              | `src/features/swr/`         | Caching, revalidation, websocket-driven cache updates.              |

**Rule: components never call `fetch`.** They call a function from `src/api/`,
usually through `useSWR`.

## `apiFetch`

```ts
import { apiFetch } from '../api/helpers';

const data = await apiFetch<MatchOverview>(`/matches/${id}/`, { method: 'GET' });
```

`apiFetch` picks the transport at runtime:

- **web** → `apiFetchWeb` (cookies via `credentials: 'include'`, CSRF header,
  `formatApiError` on failure);
- **native webview** → `apiFetchNative` from `nativeStore`, which routes the
  request through the app bridge.

Because both go through the same function, code that works in the browser works
in the app. Also from `api/helpers.ts`:

| Export                        | Purpose                                                       |
| ----------------------------- | ------------------------------------------------------------- |
| `formatApiError(error)`       | Normalises DRF errors into a message you can show.             |
| `getEffectiveBackendUrl()` / `useEffectiveBackendUrl()` | The backend origin to use (web vs. native). |
| `clearSwrCache()`, `navigateToLogin()` | Post-401/403 cleanup helpers.                        |

Errors that mean "session expired" are handled centrally — do not implement your
own redirect-to-login per component.

## Endpoint modules

```ts
// src/api/matches.ts
import { apiFetch } from './helpers';
import type { MatchOverview } from './types';

export const getMatchOverview = (id: string) =>
  apiFetch<MatchOverview>(`/matches/${id}/`);
```

- One file per backend resource; types in `src/api/types.ts`.
- Return the parsed body; throw on error (SWR surfaces it as `error`).
- Keep URLs relative (`/matches/…`); `apiFetch` adds the origin.

## Reading data with SWR

```tsx
import useSWR from 'swr';
import { getMatchOverview } from '../../api/matches';
import { swrConfig } from '../../features/swr';

const { data, error, isLoading } = useSWR(['match-overview', id], () => getMatchOverview(id), swrConfig);
```

- The SWR config (`swrConfig`, `fetcher`) lives in `src/features/swr/index.ts`
  and is provided globally by `<App />`; import the helpers rather than
  hand-rolling options.
- Keys are arrays with a stable string prefix, so related queries can be
  revalidated together.
- After a write, `mutate` the affected key(s) — never `location.reload()`.

## Websocket-driven updates

Chat and call events arrive over the websocket. `src/features/swr/wsBridgeMutations.ts`
maps those events onto SWR mutations, so a received message updates the cache
that the UI renders. When you add a realtime feature, extend that bridge instead
of opening a second websocket.

## Global state (zustand)

`src/features/stores/` holds the client state that is **not** server state:

| Store                 | Holds                                                     |
| --------------------- | --------------------------------------------------------- |
| `nativeStore`         | Native bridge functions, `isNative`, native API transport. |
| `callSetup`, `callTracks`, `connectedCall` | LiveKit call state.                    |
| `chatInput`           | Draft state of the chat composer.                          |
| `modalManager`        | Open modals.                                               |
| `navigation`          | Native/web navigation requests.                            |
| `developmentFeatures` | Dev-only feature toggles (`window.enableDevFeatures`).     |
| `debugStore`          | Debug overlay state.                                       |
| `receiveHandler`      | Messages coming from the native app.                       |

Conventions:

- Use zustand (`create`), export the hook **and** the raw store when the store is
  needed outside React (`useNativeStore.getState()`).
- Server data does **not** belong in a zustand store — put it in SWR.
- Component-local state stays `useState`; only lift it into a store when a second,
  unrelated component needs it.
