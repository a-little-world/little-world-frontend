import { useEffect, useState } from 'react';

import { useTheme } from 'styled-components';

/**
 * Returns true if the window width is below the given breakpoint.
 * Pass a theme breakpoint value so JS layout matches your CSS media queries, e.g.
 * `useIsBelowBreakpoint(theme.breakpoints.xlarge)`.
 *
 * Defaults to `theme.breakpoints.large` when omitted.
 */
function useIsBelowBreakpoint(breakpoint?: string): boolean {
  const theme = useTheme();
  const breakpointValue = breakpoint ?? theme.breakpoints.large;

  const [isBelowBreakpoint, setIsBelowBreakpoint] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(`(max-width: ${breakpointValue})`).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpointValue})`);

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsBelowBreakpoint(e.matches);
    };

    setIsBelowBreakpoint(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }

    mediaQuery.addListener(handleChange);
    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, [breakpointValue]);

  return isBelowBreakpoint;
}

export default useIsBelowBreakpoint;
