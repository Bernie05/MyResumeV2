/**
 * Array manipulation and utility functions
 */

/**
 * Finds an item in an array and returns its index
 */
export const findIndex = <T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
  value: unknown,
): number => {
  return arr.findIndex((item) => item[key] === value);
};

/**
 * Finds an item in an array
 */
export const findItem = <T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
  value: unknown,
): T | undefined => {
  return arr.find((item) => item[key] === value);
};

/**
 * Updates an item in an array
 */
export const updateItem = <T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
  value: unknown,
  updates: Partial<T>,
): T[] => {
  return arr.map((item) =>
    item[key] === value ? { ...item, ...updates } : item,
  );
};

/**
 * Removes an item from an array
 */
export const removeItem = <T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
  value: unknown,
): T[] => {
  return arr.filter((item) => item[key] !== value);
};

/**
 * Moves an item from one index to another
 */
export const moveItem = <T>(
  arr: T[],
  fromIndex: number,
  toIndex: number,
): T[] => {
  const newArr = [...arr];
  const item = newArr.splice(fromIndex, 1)[0];
  newArr.splice(toIndex, 0, item);
  return newArr;
};

/**
 * Groups array items by a key
 */
export const groupBy = <T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
): Record<string, T[]> => {
  return arr.reduce(
    (acc, item) => {
      const groupKey = String(item[key]);
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
};

/**
 * Removes duplicate items from an array
 */
export const unique = <T>(arr: T[], key?: keyof T): T[] => {
  if (!key) {
    return Array.from(new Set(arr));
  }

  const seen = new Set<unknown>();
  return arr.filter((item) => {
    const value = (item as Record<string, unknown>)[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Flattens a nested array
 */
export const flatten = <T>(arr: (T | T[])[]): T[] => {
  return arr.reduce((acc, item) => {
    if (Array.isArray(item)) {
      acc.push(...flatten(item as (T | T[])[]));
    } else {
      acc.push(item);
    }
    return acc;
  }, [] as T[]);
};

/**
 * Chunks an array into smaller arrays
 */
export const chunk = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Sorts array by a key
 */
export const sortBy = <T extends Record<string, unknown>>(
  arr: T[],
  key: keyof T,
  order: "asc" | "desc" = "asc",
): T[] => {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
};

/**
 * Filters array by multiple criteria
 */
export const filterByCriteria = <T extends Record<string, unknown>>(
  arr: T[],
  criteria: Partial<Record<keyof T, unknown>>,
): T[] => {
  return arr.filter((item) => {
    return Object.entries(criteria).every(
      ([key, value]) => item[key as keyof T] === value,
    );
  });
};

/**
 * Maps array to a specific key value
 */
export const pluck = <T extends Record<string, unknown>, K extends keyof T>(
  arr: T[],
  key: K,
): T[K][] => {
  return arr.map((item) => item[key]);
};

/**
 * Combines multiple arrays
 */
export const concat = <T>(...arrays: T[][]): T[] => {
  return arrays.reduce((acc, arr) => [...acc, ...arr], []);
};

/**
 * Removes falsy values from array
 */
export const compact = <T>(arr: (T | null | undefined | false)[]): T[] => {
  return arr.filter((item) => Boolean(item)) as T[];
};
