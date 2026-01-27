import { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';

/**
 * Hook that returns true if the window width is below the medium breakpoint.
 * Useful for conditionally rendering Drawers (mobile) vs CallSidebar (desktop).
 * 
 * @returns {boolean} true if below medium breakpoint, false otherwise
 */
function useIsBelowBreakpoint(): boolean {
  const theme = useTheme();
  const [isBelowBreakpoint, setIsBelowBreakpoint] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    // Use matchMedia to check if we're below medium breakpoint
    const mediaQuery = window.matchMedia(`(max-width: ${theme.breakpoints.medium})`);
    return mediaQuery.matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${theme.breakpoints.medium})`);

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsBelowBreakpoint(e.matches);
    };

    // Set initial value
    setIsBelowBreakpoint(mediaQuery.matches);

    // Modern browsers support addEventListener on MediaQueryList
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    } 
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => {
        mediaQuery.removeListener(handleChange);
      };
    
  }, [theme.breakpoints.medium]);

  return isBelowBreakpoint;
}

export default useIsBelowBreakpoint;
