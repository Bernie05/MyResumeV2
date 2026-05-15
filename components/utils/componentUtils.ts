/**
 * Component utilities for common rendering patterns and helpers
 */

import React from "react";
import { BoxProps } from "@mui/material";

/**
 * Safely handles inline field editing with event delegation
 */
export const createFieldClickHandler = (
  onInlineFieldClick: (
    sectionId: string,
    fieldId: string,
    element: HTMLElement,
  ) => void,
  sectionId: string,
  fieldId: string,
) => {
  return (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    onInlineFieldClick(sectionId, fieldId, event.currentTarget);
  };
};

/**
 * Generates styling for active/editable field states
 */
export const getEditableFieldStyles = (
  isActive: boolean,
  isEditable: boolean = false,
) => ({
  cursor: isEditable ? "pointer" : "inherit",
  outline: isActive
    ? "2px solid rgba(20, 184, 166, 0.9)"
    : "2px solid transparent",
  outlineOffset: 2,
  transition: "outline-color 160ms ease, box-shadow 160ms ease",
  ...(isEditable && {
    "&:hover": {
      outlineColor: "rgba(20, 184, 166, 0.55)",
      boxShadow: "0 0 0 4px rgba(20, 184, 166, 0.2)",
    },
  }),
});

/**
 * Merges custom sx with editable field styles
 */
export const mergeEditableStyles = (
  customSx: BoxProps["sx"] = {},
  isActive: boolean,
  isEditable: boolean = false,
) => {
  const editableStyles = getEditableFieldStyles(isActive, isEditable);
  return {
    ...editableStyles,
    ...(typeof customSx === "object" ? customSx : {}),
  };
};

/**
 * Creates a memoization comparison function for custom components
 */
export const createMemoComparison =
  (dependencyKeys: string[]) =>
  (prevProps: Record<string, unknown>, nextProps: Record<string, unknown>) => {
    return dependencyKeys.every((key) => prevProps[key] === nextProps[key]);
  };

/**
 * Safely extracts and validates nested object properties
 */
export const safeGet = <T = unknown>(
  obj: unknown,
  path: string,
  defaultValue?: T,
): T => {
  const keys = path.split(".");
  let current: any = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return defaultValue as T;
    }
    current = current[key];
  }

  return current ?? defaultValue;
};

/**
 * Debounce function for reducing update frequency
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for rate limiting
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Create a component with conditional rendering
 */
export const createConditional = <P extends object>(
  condition: boolean,
  Component: React.ComponentType<P>,
  fallback: React.ReactNode = null,
) => {
  return condition ? <Component /> : fallback;
};

/**
 * Memoize with custom comparison
 */
export const memo = <P extends object>(
  Component: React.ComponentType<P>,
  compare?: (prev: P, next: P) => boolean,
) => {
  return React.memo(Component, compare);
};

/**
 * Create a render props component
 */
export const createRenderProps = <T,>(
  renderFn: (value: T) => React.ReactNode,
  value: T,
) => {
  return renderFn(value);
};

/**
 * Compose multiple callbacks
 */
export const composeCallbacks = (...callbacks: Array<(...args: any[]) => void>) => {
  return (...args: any[]) => {
    callbacks.forEach((cb) => cb?.(...args));
  };
};

/**
 * Create a prop validator
 */
export const createPropValidator = <P extends object>(
  requiredProps: (keyof P)[],
) => {
  return (props: P) => {
    const missing = requiredProps.filter((prop) => !(prop in props));
    if (missing.length > 0) {
      console.warn(`Missing required props: ${missing.join(", ")}`);
      return false;
    }
    return true;
  };
};

/**
 * Create a prop filter
 */
export const createPropFilter = <P extends object>(
  includeProps: (keyof P)[],
) => {
  return (props: P): Partial<P> => {
    const filtered: any = {};
    includeProps.forEach((prop) => {
      if (prop in props) {
        filtered[prop] = props[prop];
      }
    });
    return filtered;
  };
};

/**
 * Create a prop transformer
 */
export const createPropTransformer = <P extends object, T extends object>(
  transformFn: (props: P) => T,
) => {
  return (props: P): T => transformFn(props);
};

/**
 * Create a style variant mapper
 */
export const createStyleVariant = (
  variants: Record<string, React.CSSProperties>,
) => {
  return (variant: string, customStyles?: React.CSSProperties) => ({
    ...variants[variant],
    ...customStyles,
  });
};

/**
 * Batch update state
 */
export const createBatchUpdate = <T extends Record<string, any>>(
  initialState: T,
) => {
  const [state, setState] = React.useState<T>(initialState);

  const update = React.useCallback((updates: Partial<T>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const reset = React.useCallback(() => {
    setState(initialState);
  }, [initialState]);

  return { state, update, reset };
};

/**
 * Create a component wrapper with props
 */
export const createWrapper = <P extends object>(
  Component: React.ComponentType<P>,
  defaultProps: Partial<P>,
) => {
  return (props: P) => <Component {...defaultProps} {...props} />;
};

/**
 * Create a styled component factory
 */
export const createStyledComponent = (
  Component: React.ComponentType<any>,
  baseStyles: React.CSSProperties,
) => {
  return React.forwardRef<HTMLDivElement, any>((props, ref) => (
    <Component
      ref={ref}
      style={{ ...baseStyles, ...props.style }}
      {...props}
    />
  ));
};

/**
 * Create an async component loader
 */
export const createAsyncComponent = <P extends object>(
  loader: () => Promise<{ default: React.ComponentType<P> }>,
) => {
  return React.lazy(loader);
};

/**
 * Create a ref forward component
 */
export const createForwardRef = <P extends object, R = HTMLDivElement>(
  Component: React.ComponentType<P>,
) => {
  return React.forwardRef<R, P>((props, ref) => (
    <Component {...props} ref={ref as any} />
  ));
};

/**
 * Merge multiple refs
 */
export const mergeRefs = <T,>(...refs: Array<React.Ref<T> | undefined | null>) => {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref && typeof ref === "object" && "current" in ref) {
        (ref as React.MutableRefObject<T>).current = value;
      }
    });
  };
};

/**
 * Create a display name for components
 */
export const setDisplayName = (Component: React.ComponentType<any>, name: string) => {
  Component.displayName = name;
  return Component;
};

/**
 * Create a factory for conditional rendering
 */
export const createIfElse = <P extends object>(
  condition: (props: P) => boolean,
  TrueComponent: React.ComponentType<P>,
  FalseComponent?: React.ComponentType<P>,
) => {
  return (props: P) =>
    condition(props) ? <TrueComponent {...props} /> : FalseComponent ? <FalseComponent {...props} /> : null;
};

/**
 * Create a switch/case component renderer
 */
export const createSwitch = <T, P extends object>(
  value: T,
  cases: Record<string | number, React.ComponentType<P>>,
  defaultComponent?: React.ComponentType<P>,
) => {
  const Component = cases[value as any] || defaultComponent;
  return Component ? <Component /> : null;
};

/**
 * Create a fallback component renderer
 */
export const createFallback = <P extends object>(
  Component: React.ComponentType<P> | null | undefined,
  FallbackComponent: React.ComponentType<P>,
  props: P,
) => {
  if (Component) {
    return <Component {...props} />;
  }
  return <FallbackComponent {...props} />;
};

/**
 * Create a suspense wrapper
 */
export const createSuspense = (
  Component: React.ComponentType<any>,
  fallback: React.ReactNode,
) => {
  return (props: any) => (
    <React.Suspense fallback={fallback}>
      <Component {...props} />
    </React.Suspense>
  );
};
