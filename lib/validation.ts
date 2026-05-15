/**
 * Data validation utilities
 */

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates phone number (basic check)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phone.length >= 10 && phoneRegex.test(phone);
};

/**
 * Checks if a string is empty or contains only whitespace
 */
export const isEmpty = (str: string): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Validates required fields in an object
 */
export const validateRequired = (
  obj: Record<string, unknown>,
  requiredFields: string[],
): { valid: boolean; missingFields: string[] } => {
  const missingFields = requiredFields.filter(
    (field) =>
      !obj[field] ||
      (typeof obj[field] === "string" && isEmpty(obj[field] as string)),
  );

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
};

/**
 * Validates object against a schema
 */
export const validateSchema = <T extends Record<string, unknown>>(
  obj: unknown,
  schema: Record<string, (value: unknown) => boolean>,
): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!obj || typeof obj !== "object") {
    return { valid: false, errors: { _root: "Object is required" } };
  }

  const objRecord = obj as Record<string, unknown>;

  for (const [key, validator] of Object.entries(schema)) {
    if (!validator(objRecord[key])) {
      errors[key] = `Validation failed for ${key}`;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Safely parses JSON with fallback
 */
export const safeJsonParse = <T = unknown>(
  json: string,
  fallback?: T,
): T | null => {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback ?? null;
  }
};

/**
 * Validates array of objects have all required fields
 */
export const validateObjectArray = (
  items: unknown[],
  requiredFields: string[],
): { valid: boolean; invalidItems: number[] } => {
  const invalidItems: number[] = [];

  if (!Array.isArray(items)) {
    return { valid: false, invalidItems: [0] };
  }

  items.forEach((item, index) => {
    const { valid } = validateRequired(
      item as Record<string, unknown>,
      requiredFields,
    );
    if (!valid) {
      invalidItems.push(index);
    }
  });

  return {
    valid: invalidItems.length === 0,
    invalidItems,
  };
};

/**
 * Checks if a value is between min and max
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Validates proficiency is between 0-100
 */
export const isValidProficiency = (proficiency: number): boolean => {
  return isInRange(proficiency, 0, 100);
};
