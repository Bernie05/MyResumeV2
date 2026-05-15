/**
 * Composable component utilities for creating reusable UI sections
 * Enables building flexible, composable resume sections
 */

import React, { ReactNode, ComponentType } from 'react'
import { Box, BoxProps, SxProps, Theme, Typography, TypographyProps } from '@mui/material'

/**
 * Props for composable section components
 */
export interface ComposableSectionProps extends BoxProps {
  title?: string
  titleVariant?: TypographyProps['variant']
  subtitle?: string
  icon?: ReactNode
  actions?: ReactNode
  header?: ReactNode
  footer?: ReactNode
  isEmpty?: boolean
  emptyMessage?: string
  isLoading?: boolean
  error?: string | null
  children: ReactNode
}

/**
 * Props for composable list items
 */
export interface ComposableListItemProps extends BoxProps {
  label?: string
  value?: ReactNode
  icon?: ReactNode
  actions?: ReactNode
  badge?: string | number
  onClick?: () => void
}

/**
 * Props for composable card components
 */
export interface ComposableCardProps extends BoxProps {
  title?: string
  subtitle?: string
  image?: string
  icon?: ReactNode
  actions?: ReactNode
  footer?: ReactNode
  selected?: boolean
  disabled?: boolean
}

/**
 * Create a flexible section component
 */
export const createSection = (
  Component: ComponentType<any> = Box,
  defaultSx?: SxProps<Theme>,
) => {
  return React.forwardRef<HTMLDivElement, ComposableSectionProps>(
    (
      {
        title,
        titleVariant = 'h6',
        subtitle,
        icon,
        actions,
        header,
        footer,
        isEmpty,
        emptyMessage,
        isLoading,
        error,
        sx = {},
        children,
        ...props
      },
      ref,
    ) => {
      return (
        <Component
          ref={ref}
          sx={{
            ...defaultSx,
            ...(typeof sx === 'object' && sx),
          }}
          {...props}
        >
          {/* Header section */}
          {header ? (
            header
          ) : (title || actions) ? (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {icon && <Box sx={{ display: 'flex', alignItems: 'center' }}>{icon}</Box>}
                <Box>
                  {title && <Typography variant={titleVariant}>{title}</Typography>}
                  {subtitle && <Typography variant="caption">{subtitle}</Typography>}
                </Box>
              </Box>
              {actions && <Box>{actions}</Box>}
            </Box>
          ) : null}

          {/* Loading state */}
          {isLoading && <Typography>Loading...</Typography>}

          {/* Error state */}
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          {/* Empty state */}
          {isEmpty && !isLoading && (
            <Typography color="textSecondary" variant="body2">
              {emptyMessage || 'No data available'}
            </Typography>
          )}

          {/* Content */}
          {!isLoading && !isEmpty && children}

          {/* Footer */}
          {footer && <Box sx={{ mt: 2 }}>{footer}</Box>}
        </Component>
      )
    },
  )
}

/**
 * Create a flexible list item component
 */
export const createListItem = (
  Component: ComponentType<any> = Box,
  defaultSx?: SxProps<Theme>,
) => {
  return React.forwardRef<HTMLDivElement, ComposableListItemProps>(
    ({ label, value, icon, actions, badge, onClick, sx = {}, ...props }, ref) => {
      return (
        <Component
          ref={ref}
          onClick={onClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1.5,
            cursor: onClick ? 'pointer' : 'default',
            '&:hover': onClick ? { bgcolor: 'action.hover' } : {},
            ...defaultSx,
            ...(typeof sx === 'object' && sx),
          }}
          {...props}
        >
          {icon && <Box sx={{ display: 'flex', alignItems: 'center' }}>{icon}</Box>}

          <Box sx={{ flex: 1 }}>
            {label && <Typography variant="subtitle2">{label}</Typography>}
            {value && <Typography variant="body2">{value}</Typography>}
          </Box>

          {badge && (
            <Box
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: '50%',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
              }}
            >
              {badge}
            </Box>
          )}

          {actions && <Box>{actions}</Box>}
        </Component>
      )
    },
  )
}

/**
 * Create a flexible card component
 */
export const createCard = (
  Component: ComponentType<any> = Box,
  defaultSx?: SxProps<Theme>,
) => {
  return React.forwardRef<HTMLDivElement, ComposableCardProps>(
    (
      {
        title,
        subtitle,
        image,
        icon,
        actions,
        footer,
        selected,
        disabled,
        sx = {},
        children,
        ...props
      },
      ref,
    ) => {
      return (
        <Component
          ref={ref}
          sx={{
            border: selected ? '2px solid' : '1px solid',
            borderColor: selected ? 'primary.main' : 'divider',
            borderRadius: 1,
            overflow: 'hidden',
            opacity: disabled ? 0.6 : 1,
            pointerEvents: disabled ? 'none' : 'auto',
            ...defaultSx,
            ...(typeof sx === 'object' && sx),
          }}
          {...props}
        >
          {image && <Box component="img" src={image} sx={{ width: '100%', height: 200, objectFit: 'cover' }} />}

          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {icon && <Box>{icon}</Box>}
                <Box>
                  {title && <Typography variant="h6">{title}</Typography>}
                  {subtitle && <Typography variant="caption">{subtitle}</Typography>}
                </Box>
              </Box>
              {actions && <Box>{actions}</Box>}
            </Box>

            {children && <Box sx={{ my: 1 }}>{children}</Box>}
          </Box>

          {footer && <Box sx={{ p: 2, bgcolor: 'action.hover' }}>{footer}</Box>}
        </Component>
      )
    },
  )
}

/**
 * Create a form group component
 */
export const createFormGroup = (
  Component: ComponentType<any> = Box,
  defaultSx?: SxProps<Theme>,
) => {
  return React.forwardRef<HTMLDivElement, any>(
    ({ label, error, helperText, required, children, sx = {}, ...props }, ref) => {
      return (
        <Component
          ref={ref}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            ...defaultSx,
            ...(typeof sx === 'object' && sx),
          }}
          {...props}
        >
          {label && (
            <Typography variant="subtitle2">
              {label}
              {required && <span style={{ color: 'red' }}> *</span>}
            </Typography>
          )}

          {children}

          {error && helperText && (
            <Typography variant="caption" color="error">
              {helperText}
            </Typography>
          )}
        </Component>
      )
    },
  )
}

/**
 * Create a table component
 */
export const createTable = (columns: Array<{ key: string; label: string; render?: (value: any) => ReactNode }>) => {
  return ({ data, onRowClick }: { data: any[]; onRowClick?: (row: any) => void }) => {
    return (
      <Box sx={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row.id || idx}
                onClick={() => onRowClick?.(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default', '&:hover': { bgcolor: 'action.hover' } }}
              >
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                    {col.render ? col.render(row[col.key]) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    )
  }
}

/**
 * Create a data grid with flexible rendering
 */
export const createDataGrid = <T extends Record<string, any>>(
  columns: Array<{
    key: keyof T
    label: string
    render?: (value: T[keyof T], row: T) => ReactNode
    sortable?: boolean
    width?: string
  }>,
) => {
  return ({
    data,
    onRowClick,
    sx = {},
  }: {
    data: T[]
    onRowClick?: (row: T) => void
    sx?: SxProps<Theme>
  }) => {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: columns.map((col) => col.width || '1fr').join(' '),
          gap: 1,
          ...sx,
        }}
      >
        {/* Header */}
        {columns.map((col) => (
          <Box key={String(col.key)} sx={{ fontWeight: 'bold', p: 1 }}>
            {col.label}
          </Box>
        ))}

        {/* Rows */}
        {data.flatMap((row, rowIdx) =>
          columns.map((col) => (
            <Box
              key={`${rowIdx}-${String(col.key)}`}
              onClick={() => onRowClick?.(row)}
              sx={{ p: 1, cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {col.render ? col.render(row[col.key], row) : String(row[col.key])}
            </Box>
          )),
        )}
      </Box>
    )
  }
}

/**
 * Create a stepper/timeline component
 */
export const createStepper = (
  steps: Array<{ label: string; description?: string }>,
  currentStep: number,
) => {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {steps.map((step, idx) => (
        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: idx <= currentStep ? 'primary.main' : 'action.disabled',
              color: idx <= currentStep ? 'white' : 'textSecondary',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
          >
            {idx + 1}
          </Box>
          <Box>
            <Typography variant="subtitle2">{step.label}</Typography>
            {step.description && <Typography variant="caption">{step.description}</Typography>}
          </Box>
          {idx < steps.length - 1 && (
            <Box
              sx={{
                flex: 1,
                height: 2,
                bgcolor: idx < currentStep ? 'primary.main' : 'action.disabled',
                mx: 1,
              }}
            />
          )}
        </Box>
      ))}
    </Box>
  )
}

/**
 * Create a breadcrumb component
 */
export const createBreadcrumb = (items: Array<{ label: string; onClick?: () => void }>) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {items.map((item, idx) => (
        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="body2"
            onClick={item.onClick}
            sx={{
              cursor: item.onClick ? 'pointer' : 'default',
              '&:hover': item.onClick ? { textDecoration: 'underline' } : {},
            }}
          >
            {item.label}
          </Typography>
          {idx < items.length - 1 && <Typography variant="body2">/</Typography>}
        </Box>
      ))}
    </Box>
  )
}

/**
 * Create a pagination component
 */
export const createPagination = (
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void,
) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{ padding: '4px 8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: '4px 8px',
            fontWeight: page === currentPage ? 'bold' : 'normal',
            cursor: 'pointer',
            border: page === currentPage ? '2px solid black' : '1px solid gray',
          }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{ padding: '4px 8px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
      >
        Next
      </button>
    </Box>
  )
}
