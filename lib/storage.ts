/**
 * Local storage utilities
 */

import { STORAGE_KEYS } from "./constants";

/**
 * Safely gets an item from localStorage
 */
export const getStorageItem = <T = unknown>(
  key: string,
  defaultValue?: T,
): T | null => {
  try {
    const item =
      typeof window !== "undefined" ? localStorage.getItem(key) : null;
    return item ? (JSON.parse(item) as T) : (defaultValue ?? null);
  } catch (error) {
    console.error(`Failed to get item from storage: ${key}`, error);
    return defaultValue ?? null;
  }
};

/**
 * Safely sets an item in localStorage
 */
export const setStorageItem = (key: string, value: unknown): boolean => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Failed to set item in storage: ${key}`, error);
    return false;
  }
};

/**
 * Removes an item from localStorage
 */
export const removeStorageItem = (key: string): boolean => {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Failed to remove item from storage: ${key}`, error);
    return false;
  }
};

/**
 * Clears all items from localStorage
 */
export const clearStorage = (): boolean => {
  try {
    if (typeof window !== "undefined") {
      localStorage.clear();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to clear storage", error);
    return false;
  }
};

/**
 * Gets all items from localStorage
 */
export const getAllStorageItems = (): Record<string, unknown> => {
  const items: Record<string, unknown> = {};
  try {
    if (typeof window !== "undefined") {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          items[key] = value ? JSON.parse(value) : null;
        }
      }
    }
  } catch (error) {
    console.error("Failed to get all items from storage", error);
  }
  return items;
};

/**
 * Storage manager for application themes
 */
export const themeStorage = {
  get: () => getStorageItem<string>(STORAGE_KEYS.THEME),
  set: (theme: string) => setStorageItem(STORAGE_KEYS.THEME, theme),
  remove: () => removeStorageItem(STORAGE_KEYS.THEME),
};

/**
 * Storage manager for user preferences
 */
export const preferencesStorage = {
  get: () =>
    getStorageItem<Record<string, unknown>>(STORAGE_KEYS.USER_PREFERENCES),
  set: (preferences: Record<string, unknown>) =>
    setStorageItem(STORAGE_KEYS.USER_PREFERENCES, preferences),
  update: (key: string, value: unknown) => {
    const current = preferencesStorage.get() || {};
    return preferencesStorage.set({ ...current, [key]: value });
  },
  remove: () => removeStorageItem(STORAGE_KEYS.USER_PREFERENCES),
};

/**
 * Storage manager for resume drafts
 */
export const resumeDraftStorage = {
  get: () => getStorageItem<any>(STORAGE_KEYS.RESUME_DRAFT),
  set: (draft: unknown) => setStorageItem(STORAGE_KEYS.RESUME_DRAFT, draft),
  remove: () => removeStorageItem(STORAGE_KEYS.RESUME_DRAFT),
  exists: () =>
    typeof window !== "undefined" &&
    !!localStorage.getItem(STORAGE_KEYS.RESUME_DRAFT),
};

/**
 * Storage manager for auth tokens
 */
export const authStorage = {
  getToken: () => getStorageItem<string>(STORAGE_KEYS.AUTH_TOKEN),
  setToken: (token: string) => setStorageItem(STORAGE_KEYS.AUTH_TOKEN, token),
  removeToken: () => removeStorageItem(STORAGE_KEYS.AUTH_TOKEN),
  hasToken: () =>
    typeof window !== "undefined" &&
    !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
};

/**
 * Storage manager for last saved timestamp
 */
export const lastSavedStorage = {
  get: () => getStorageItem<string>(STORAGE_KEYS.LAST_SAVED),
  set: (timestamp: string) =>
    setStorageItem(STORAGE_KEYS.LAST_SAVED, timestamp),
  setNow: () =>
    setStorageItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString()),
  remove: () => removeStorageItem(STORAGE_KEYS.LAST_SAVED),
};

/**
 * Checks if a storage key exists
 */
export const storageKeyExists = (key: string): boolean => {
  try {
    return typeof window !== "undefined" && localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
};

/**
 * Gets storage size in bytes
 */
export const getStorageSize = (): number => {
  let size = 0;
  try {
    if (typeof window !== "undefined") {
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          size += localStorage[key].length + key.length;
        }
      }
    }
  } catch (error) {
    console.error("Failed to calculate storage size", error);
  }
  return size;
};
