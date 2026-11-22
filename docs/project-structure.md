# Project structure — where do I add what?

```
src/
├── main.js            # web entry point: window.renderApp(), mounts <App />
├── index.ts           # library entry point used by the native app (webview)
├── App.jsx            # SWR config, router provider, endpoint prefetch
├── environment.ts     # runtime config (backend URL, ws path, native flag)
├── api/               # HTTP layer: endpoints + fetch helpers + types
├── components/
│   ├── atoms/         # smallest reusable pieces (wrappers around DS primitives)
│   ├── blocks/        # composed sections (cards, headers, lists)
│   └── views/         # one folder per page/route
├── constants/         # shared constants (route slugs live in router/routes.ts)
├── features/
│   ├── stores/        # zustand global stores
│   ├── swr/           # SWR config, cache helpers, websocket bridge mutations
│   └── integrityCheck/# runtime integrity/version checks
├── guards/            # AuthGuard, RouteGuard (route-level access control)
├── helpers/           # pure functions (links, dates, formatting, match logic)
├── hooks/             # reusable React hooks
├── locale/            # de.json, en.json translation resources
├── router/            # router.jsx (routes) + routes.ts (slugs/URL builders)
├── userForm/          # profile/user form building blocks
└── webview/           # bridges used only inside the native webview
```

## Decision table

| You are adding…                          | Goes to                                                          |
| ---------------------------------------- | ---------------------------------------------------------------- |
| A new page                               | `src/components/views/<Name>/` + a route in `src/router/router.jsx` |
| A section of a page used once            | `src/components/views/<Name>/` (local sub-component)              |
| A reusable section (header, card, list)  | `src/components/blocks/`                                          |
| A primitive wrapper (button variant, icon frame) | `src/components/atoms/`                                   |
| A pure function (formatting, maths)      | `src/helpers/<topic>.ts` + `<topic>.test.ts`                      |
| A React hook used by ≥2 components       | `src/hooks/use<Thing>.ts`                                         |
| A REST call                              | `src/api/<topic>.ts` (function) + types in `src/api/types.ts`      |
| Global client state                      | `src/features/stores/<thing>.ts` (zustand)                        |
| Cache/revalidation logic for API data    | `src/features/swr/`                                               |
| A route slug or URL builder              | `src/router/routes.ts`                                            |
| A user-facing string                     | `src/locale/de.json` **and** `src/locale/en.json`                  |
| A constant shared by >1 module           | `src/constants/`                                                  |
| Something only the native app needs      | `src/webview/` or `src/features/stores/nativeStore.ts`            |

## Component conventions

- Function components + hooks only, no class components.
- One component per file, file name = component name (`MatchCard.tsx`).
- Styles at the bottom of the file with `styled-components`.
- No `any`; if an API payload shape is unclear, type it in `src/api/types.ts`.
- Do not reach into another feature's store internals — export a selector/hook.

## Two entry points (important)

| Entry            | Used by                | Notes                                                    |
| ---------------- | ---------------------- | -------------------------------------------------------- |
| `src/main.js`    | the website            | `window.renderApp(user, translations, options)`.          |
| `src/index.ts`   | the native app webview | exports `LittleWorldWebNative` + types; hash router, no reloads. |

Anything you add must work in both. Practical consequences:

- no `window.location` navigation — use the router;
- no `document.write`, no `<a href>` for internal routes
  (see [design-system.md#links](design-system.md#links));
- no assumption that a page load resets state: the webview keeps the JS runtime
  alive between "screens".
