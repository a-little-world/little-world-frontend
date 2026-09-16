export const isInternalLink = (href?: string) =>
  !!href && href.startsWith('/') && !href.startsWith('//');

export const getAppLinkProps = (href: string) =>
  isInternalLink(href)
    ? // Internal app routes must go through react-router so both the web and the
      // native hash router navigate in-SPA instead of opening a new tab / doing a
      // document load that fails with net::ERR_FILE_NOT_FOUND in the packaged app.
      { to: href }
    : { href, target: '_blank' as const };
