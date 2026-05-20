/**
 * Essential component utilities for composition and memoization
 * Focused on practical, frequently-used patterns
 */

import React, { ComponentType } from "react";

/**
 * HOC to memoize component with custom comparison
 */
export const withMemoization = <P extends object>(
  Component: ComponentType<P>,
  compare?: (prev: P, next: P) => boolean,
) => {
  return React.memo(Component, compare);
};

/**
 * Compose multiple HOCs into a single HOC
 * Usage: compose(withMemoization, withCustom)(Component)
 */
export const compose =
  <P extends object>(
    ...hocs: ((Component: ComponentType<P>) => ComponentType<P>)[]
  ) =>
  (Component: ComponentType<P>): ComponentType<P> => {
    return hocs.reduceRight((Comp, hoc) => hoc(Comp), Component);
  };
