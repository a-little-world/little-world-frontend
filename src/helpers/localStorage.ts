/**
 * Generic localStorage helper functions
 * Handles errors gracefully for SSR and private browsing scenarios
 */

/**
 * Safely get an item from localStorage
 * @param key - The localStorage key
 * @returns The stored value or null if not found/error
 */
export const getLocalStorageItem = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch (_error) {
    return null;
  }
};

/**
 * Safely set an item in localStorage
 * @param key - The localStorage key
 * @param value - The value to store
 * @returns true if successful, false if failed
 */
export const setLocalStorageItem = (key: string, value: string): boolean => {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (_error) {
    return false;
  }
};

/**
 * Safely remove an item from localStorage
 * @param key - The localStorage key
 * @returns true if successful, false if failed
 */
export const removeLocalStorageItem = (key: string): boolean => {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (_error) {
    return false;
  }
};

/**
 * Safely get and parse JSON from localStorage
 * @param key - The localStorage key
 * @returns The parsed object or null if not found/error
 */
export const getLocalStorageJSON = <T = any>(key: string): T | null => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (_error) {
    return null;
  }
};

/**
 * Safely set JSON in localStorage
 * @param key - The localStorage key
 * @param value - The object to store
 * @returns true if successful, false if failed
 */
export const setLocalStorageJSON = (key: string, value: any): boolean => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (_error) {
    return false;
  }
};
