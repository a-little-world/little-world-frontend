import { useEffect } from 'react';

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

// Console logging bridge for React Native WebView
function useConsoleBridge(prefix = '[FRONTEND]') {
  useEffect(() => {
    // Check if we're in a WebView context
    const isWebView = window.ReactNativeWebView !== undefined;

    if (!isWebView) {
      return undefined; // Only set up bridge in WebView context
    }

    // Store original console methods
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug,
    };

    const sendToReactNative = (level: string, ...args: unknown[]) => {
      try {
        const message = {
          type: 'console',
          level,
          message: args
            .map(arg => {
              if (typeof arg === 'object') {
                return JSON.stringify(arg, null, 2);
              }
              return String(arg);
            })
            .join(' '),
          timestamp: new Date().toISOString(),
        };

        window.ReactNativeWebView?.postMessage(JSON.stringify(message));
      } catch (error) {
        // Fallback to original console if postMessage fails
        originalConsole.error(
          `${prefix} Failed to send console message to React Native:`,
          error,
        );
      }
    };

    const addPrefix = (...args: unknown[]) => {
      // If the first argument is already a string and starts with our prefix, don't add it again
      if (typeof args[0] === 'string' && args[0].startsWith(prefix)) {
        return args;
      }
      return [prefix, ...args];
    };

    // Override console methods
    console.log = (...args: unknown[]) => {
      const prefixedArgs = addPrefix(...args);
      originalConsole.log(...prefixedArgs);
      sendToReactNative('log', ...args);
    };

    console.warn = (...args: unknown[]) => {
      const prefixedArgs = addPrefix(...args);
      originalConsole.warn(...prefixedArgs);
      sendToReactNative('warn', ...args);
    };

    console.error = (...args: unknown[]) => {
      const prefixedArgs = addPrefix(...args);
      originalConsole.error(...prefixedArgs);
      sendToReactNative('error', ...args);
    };

    console.info = (...args: unknown[]) => {
      const prefixedArgs = addPrefix(...args);
      originalConsole.info(...prefixedArgs);
      sendToReactNative('info', ...args);
    };

    console.debug = (...args: unknown[]) => {
      const prefixedArgs = addPrefix(...args);
      originalConsole.debug(...prefixedArgs);
      sendToReactNative('debug', ...args);
    };

    return () => {
      console.log = originalConsole.log;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
      console.info = originalConsole.info;
      console.debug = originalConsole.debug;
    };
  }, [prefix]);
}

export default useConsoleBridge;
