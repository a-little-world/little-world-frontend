import { useTheme } from 'styled-components';

import useMediaQuery from './useMediaQuery';

/**
 * Returns true if the window width is below the given breakpoint.
 * Pass a theme breakpoint value so JS layout matches your CSS media queries, e.g.
 * `useIsBelowBreakpoint(theme.breakpoints.xlarge)`.
 *
 * Defaults to `theme.breakpoints.large` when omitted.
 */
function useIsBelowBreakpoint(breakpoint?: string): boolean {
  const theme = useTheme();
  return useMediaQuery(`(max-width: ${breakpoint ?? theme.breakpoints.large})`);
}

export default useIsBelowBreakpoint;
