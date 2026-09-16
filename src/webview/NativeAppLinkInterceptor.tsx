import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { isInternalAppHref } from '../helpers/appLinks';

/**
 * Some internal app links are still rendered as plain root-relative anchors
 * (`/app/...`), e.g. HTML injected from translations. In the native app the
 * frontend runs behind a hash router, so clicking one triggers a document load
 * that the packaged WebView cannot resolve (`net::ERR_FILE_NOT_FOUND`). Route
 * those clicks through react-router instead. Links rendered with the DS `Link`
 * + `to` already produce hash hrefs and are untouched.
 */
function NativeAppLinkInterceptor() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest('a');
      const href = anchor?.getAttribute('href');
      if (!anchor || !isInternalAppHref(href)) return;

      event.preventDefault();
      navigate(href);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [navigate]);

  return null;
}

export default NativeAppLinkInterceptor;
