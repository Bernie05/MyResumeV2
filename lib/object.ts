/**
 * Object manipulation utilities
 */

/**
 * Merges objects deeply
 */
export const deepMerge = <T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T => {
  if (!sources.length) return target;

  const source = sources.shift();
  if (!source) return target;

  const result = { ...target } as Record<string, any>;

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (
        sourceValue &&
        typeof sourceValue === "object" &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === "object" &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        result[key] = sourceValue;
      }
    }
  }

  return deepMerge(result as T, ...sources);
};

/**
 * Creates a deep copy of an object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) {
    const copy: any[] = [];
    for (let i = 0; i < obj.length; i++) {
      copy[i] = deepClone(obj[i]);
    }
    return copy as T;
  }
  if (obj instanceof Object) {
    const copy = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = deepClone(obj[key]);
      }
    }
    return copy;
  }
  return obj;
};

/**
 * Extracts specific keys from an object
 */
export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
};

/**
 * Omits specific keys from an object
 */
export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result as Omit<T, K>;
};

/**
 * Checks if two objects are equal
 */
export const isEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => {
    if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
      return isEqual(obj1[key], obj2[key]);
    }
    return obj1[key] === obj2[key];
  });
};

/**
 * Recursively finds all values matching a condition
 */
export const findValues = <T>(
  obj: any,
  condition: (value: any) => boolean,
): T[] => {
  const results: T[] = [];

  const traverse = (current: any) => {
    if (condition(current)) {
      results.push(current);
    }

    if (typeof current === "object" && current !== null) {
      if (Array.isArray(current)) {
        current.forEach(traverse);
      } else {
        Object.values(current).forEach(traverse);
      }
    }
  };

  traverse(obj);
  return results;
};

/**
 * Transforms object values
 */
export const mapValues = <T extends Record<string, any>, R>(
  obj: T,
  transform: (value: any, key: string) => R,
): Record<keyof T, R> => {
  const result = {} as Record<keyof T, R>;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key as keyof T] = transform(obj[key], key);
    }
  }
  return result;
};

/**
 * Gets a nested value from an object using dot notation
 */
export const getDeep = <T = any>(
  obj: any,
  path: string,
  defaultValue?: T,
): T => {
  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return defaultValue as T;
    }
    current = current[key];
  }

  return (current ?? defaultValue) as T;
};

/**
 * Sets a nested value in an object using dot notation
 */
export const setDeep = <T extends Record<string, any>>(
  obj: T,
  path: string,
  value: any,
): T => {
  const keys = path.split(".");
  const result = { ...obj } as Record<string, any>;
  let current: Record<string, any> = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return result as T;
};

/**
 * Filters object properties by condition
 */
export const filterObject = <T extends Record<string, any>>(
  obj: T,
  predicate: (key: string, value: any) => boolean,
): Partial<T> => {
  const result: Partial<T> = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && predicate(key, obj[key])) {
      result[key as keyof T] = obj[key];
    }
  }
  return result;
};

/**
 * Inverts object keys and values
 */
export const invert = <T extends Record<string, string>>(
  obj: T,
): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[obj[key]] = key;
    }
  }
  return result;
};
