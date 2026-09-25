export const isInternalLink = (href?: string) =>
  !!href && href.startsWith('/') && !href.startsWith('//');

export const getAppLinkProps = (href: string, inRouter = true) => {
  if (!isInternalLink(href)) return { href, target: '_blank' as const };
  // Internal routes go through react-router so the web and native hash router
  // navigate in-SPA. Outside a router (standalone info cards, e.g. landing page)
  //  that throws, so fall back to a same-tab document load.
  return inRouter ? { to: href } : { href, target: '_self' as const };
};
