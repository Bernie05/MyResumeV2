/**
 * Component factory functions and composition utilities
 * Enables building reusable, composable components
 */

import React, { ComponentType, ReactNode } from 'react'
import { SxProps, Theme } from '@mui/material'

/**
 * Component composition type definitions
 */
export interface ComposableProps {
  children?: ReactNode
  className?: string
  sx?: SxProps<Theme>
  [key: string]: any
}

export interface RenderProps<T> {
  data: T
  isLoading: boolean
  error: string | null
  [key: string]: any
}

/**
 * HOC to add data loading capability to components
 */
export const withDataLoading = <P extends ComposableProps, T = any>(
  Component: ComponentType<P>,
) => {
  return React.forwardRef<HTMLDivElement, P & { data?: T; isLoading?: boolean; error?: string | null }>(
    ({ data, isLoading, error, ...props }, ref) => {
      if (isLoading) {
        return <div ref={ref}>Loading...</div>
      }
      if (error) {
        return <div ref={ref}>Error: {error}</div>
      }
      return <Component {...(props as P)} ref={ref} />
    },
  )
}

/**
 * HOC to memoize component with custom comparison
 */
export const withMemoization = <P extends object>(
  Component: ComponentType<P>,
  compare?: (prev: P, next: P) => boolean,
) => {
  return React.memo(Component, compare)
}

/**
 * HOC for theme integration
 */
export const withTheme = <P extends ComposableProps>(Component: ComponentType<P>) => {
  return (props: P) => {
    return <Component {...props} />
  }
}

/**
 * Compose multiple HOCs
 */
export const compose =
  <P extends ComposableProps>(...hocs: ((Component: ComponentType<P>) => ComponentType<P>)[]) =>
  (Component: ComponentType<P>): ComponentType<P> => {
    return hocs.reduceRight((Comp, hoc) => hoc(Comp), Component)
  }

/**
 * Create a controlled component wrapper
 */
export const createControlledComponent = <T,>(
  Component: ComponentType<any>,
  getValue: (props: any) => T,
  onChange: (value: T) => void,
) => {
  return (props: any) => {
    const value = getValue(props)
    return <Component {...props} value={value} onChange={(e: any) => onChange(e.target.value)} />
  }
}

/**
 * Create uncontrolled component wrapper
 */
export const createUncontrolledComponent = <T,>(
  Component: ComponentType<any>,
  initialValue: T,
) => {
  return (props: any) => {
    const [value, setValue] = React.useState<T>(initialValue)
    return <Component {...props} value={value} onChange={(v: T) => setValue(v)} />
  }
}

/**
 * Variant mapper for creating component variants
 */
export const createVariant = <P extends object>(
  Component: ComponentType<P>,
  variantOverrides: Record<string, Partial<P>>,
) => {
  return ({ variant = 'default', ...props }: any) => {
    const merged = { ...props, ...variantOverrides[variant] }
    return <Component {...merged} />
  }
}

/**
 * Create a styled variant component
 */
export const createStyledVariant = <P extends ComposableProps>(
  Component: ComponentType<P>,
  styles: Record<string, SxProps<Theme>>,
) => {
  return ({ variant = 'default', sx = {}, ...props }: any) => {
    const variantSx = styles[variant] || {}
    return (
      <Component
        {...(props as P)}
        sx={{
          ...variantSx,
          ...(typeof sx === 'object' ? sx : {}),
        }}
      />
    )
  }
}

/**
 * Factory for creating section components with consistent props
 */
export const createSectionComponent = <T extends object>(
  Component: ComponentType<T & ComposableProps>,
  defaultProps: Partial<T> = {},
) => {
  const SectionComponent = (props: T & ComposableProps) => {
    return <Component {...defaultProps} {...props} />
  }
  SectionComponent.displayName = `Section(${Component.displayName || Component.name})`
  return SectionComponent
}

/**
 * Create a list component renderer
 */
export const createListRenderer = <T,>(
  itemComponent: ComponentType<{ item: T; index: number; onRemove?: (id: any) => void }>,
  keyExtractor: (item: T, index: number) => string | number,
) => {
  return ({
    items,
    onRemove,
    ...props
  }: {
    items: T[]
    onRemove?: (id: any) => void
  } & ComposableProps) => {
    return (
      <div {...props}>
        {items.map((item, index) => (
          <itemComponent.type
            key={keyExtractor(item, index)}
            item={item}
            index={index}
            onRemove={onRemove}
          />
        ))}
      </div>
    )
  }
}

/**
 * Create grid layout component
 */
export const createGridLayout = <T extends ComposableProps>(
  Component: ComponentType<T>,
  columns: number = 2,
) => {
  return (props: T & { items: any[] }) => {
    const { items, ...rest } = props
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '16px',
        }}
      >
        {items.map((item: any, index: number) => (
          <Component key={item.id || index} {...(rest as T)} {...item} />
        ))}
      </div>
    )
  }
}

/**
 * Lazy load component
 */
export const lazy = <P extends object>(loader: () => Promise<{ default: ComponentType<P> }>) => {
  return React.lazy(loader)
}

/**
 * Error boundary component
 */
export class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return <div>Error: {this.state.error?.message}</div>
    }
    return this.props.children
  }
}

/**
 * Higher-order component for form integration
 */
export const withForm = <P extends object>(Component: ComponentType<P>) => {
  return (props: P & { onSubmit?: (data: any) => void }) => {
    return <Component {...props} />
  }
}

/**
 * Higher-order component for data binding
 */
export const withDataBinding = <P extends object, T = any>(
  Component: ComponentType<P>,
  extractData: (props: P) => T,
) => {
  return (props: P) => {
    const data = extractData(props)
    return <Component {...props} data={data} />
  }
}
