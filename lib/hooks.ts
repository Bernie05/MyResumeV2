/**
 * Custom hooks for common component patterns
 * Enables reusable component logic
 */

import { useState, useCallback, useEffect } from "react";

/**
 * Hook for managing form field state
 */
export const useField = <T = string>(
  initialValue: T,
  onValidate?: (value: T) => boolean,
) => {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(
    (v: T) => {
      if (onValidate && !onValidate(v)) {
        setError("Invalid value");
        return false;
      }
      setError(null);
      return true;
    },
    [onValidate],
  );

  return {
    value,
    setValue,
    error,
    setError,
    validate,
    reset: () => {
      setValue(initialValue);
      setError(null);
    },
  };
};

/**
 * Hook for managing async data loading
 */
export const useAsync = <T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true,
) => {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus("pending");
    setValue(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setValue(response);
      setStatus("success");
      return response;
    } catch (error) {
      setError(error as E);
      setStatus("error");
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
};

/**
 * Hook for managing list state with common operations
 */
export const useList = <T extends { id?: any }>(initialList: T[] = []) => {
  const [list, setList] = useState<T[]>(initialList);

  const add = useCallback((item: T) => {
    setList((prev) => [...prev, item]);
  }, []);

  const remove = useCallback((id: any) => {
    setList((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const update = useCallback((id: any, updates: Partial<T>) => {
    setList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  }, []);

  const reset = useCallback(() => {
    setList(initialList);
  }, [initialList]);

  const clear = useCallback(() => {
    setList([]);
  }, []);

  return {
    list,
    add,
    remove,
    update,
    reset,
    clear,
    length: list.length,
  };
};

/**
 * Hook for managing toggle/checkbox state
 */
export const useToggle = (initialValue: boolean = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return { value, toggle, setTrue, setFalse, setValue };
};

/**
 * Hook for managing modal/dialog state
 */
export const useModal = (initialOpen: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((v) => !v);
  }, []);

  return { isOpen, open, close, toggle };
};

/**
 * Hook for managing controlled input
 */
export const useInput = (initialValue: string = "") => {
  const [value, setValue] = useState(initialValue);

  const bind = {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue(e.target.value),
  };

  const reset = () => setValue(initialValue);

  return { value, setValue, bind, reset };
};

/**
 * Hook for managing local storage
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item =
        typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue];
};
