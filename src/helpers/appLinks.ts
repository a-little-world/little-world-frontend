import { environment } from '../environment.ts';

export const INTERNAL_APP_HREF_PREFIX = '/app';

/** Root-relative links that point at a route inside the SPA, e.g. `/app/our-world/materials`. */
export const isInternalAppHref = (href?: string | null): href is string =>
  typeof href === 'string' && href.startsWith(INTERNAL_APP_HREF_PREFIX);

export type AppLinkProps = { to: string } | { href: string; target: '_blank' };

/**
 * Internal app links must go through react-router. In the native app the frontend
 * runs behind a hash router, so a root-relative `href` triggers a document load
 * that the packaged WebView cannot resolve (`net::ERR_FILE_NOT_FOUND`). External
 * links and the web build keep the previous anchor/new-tab behaviour; on the web
 * the same path is served by the SPA router, so it works either way.
 */
export const getAppLinkProps = (href: string): AppLinkProps =>
  environment.isNative && isInternalAppHref(href)
    ? { to: href }
    : { href, target: '_blank' };
