// Types for native imports of `@/frontend/src`: tsc prefers this file over the
// `src/` directory, so native typechecks against the built API (dist/esm) and
// never pulls frontend source into its program. Metro ignores .d.ts and keeps
// resolving `frontend/src` to the live source for bundling.
// Regenerate the declarations (in the native repo) after frontend type changes:
// pnpm --dir frontend build:types
export * from './dist/esm/index';
