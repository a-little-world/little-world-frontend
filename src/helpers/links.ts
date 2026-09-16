import { environment } from '../environment';

export const isInternalLink = (href?: string) =>
  !!href && href.startsWith('/') && !href.startsWith('//');

export const getAppLinkProps = (href: string) =>
  environment.isNative && isInternalLink(href)
    ? { to: href }
    : { href, target: '_blank' as const };
