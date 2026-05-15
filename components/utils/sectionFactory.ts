/**
 * Resume section factory and builders
 * Creates reusable, configurable resume sections
 */

import React, { ComponentType, ReactNode } from 'react'
import { Box, SxProps, Theme, Typography } from '@mui/material'

/**
 * Configuration for a resume section
 */
export interface ResumeSectionConfig<T> {
  title: string
  icon?: ReactNode
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  onAdd?: () => void
  onEdit?: (item: T) => void
  onDelete?: (id: any) => void
  isEmpty?: boolean
  emptyMessage?: string
  sx?: SxProps<Theme>
  actions?: ReactNode
  header?: ReactNode
  footer?: ReactNode
}

/**
 * Create a reusable resume section component
 */
export const createResumeSection = <T extends { id?: any }>(
  config: ResumeSectionConfig<T>,
) => {
  return (
    <Box
      sx={{
        mb: 3,
        ...config.sx,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          borderBottom: '2px solid',
          borderColor: 'primary.main',
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {config.icon && <Box>{config.icon}</Box>}
          <Typography variant="h6">{config.title}</Typography>
        </Box>
        {config.actions && <Box>{config.actions}</Box>}
      </Box>

      {/* Custom header */}
      {config.header && <Box sx={{ mb: 2 }}>{config.header}</Box>}

      {/* Items */}
      <Box>
        {config.isEmpty ? (
          <Typography color="textSecondary">{config.emptyMessage || 'No items'}</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {config.items.map((item, index) => (
              <Box key={item.id || index}>{config.renderItem(item, index)}</Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Custom footer */}
      {config.footer && <Box sx={{ mt: 2 }}>{config.footer}</Box>}
    </Box>
  )
}

/**
 * Builder pattern for creating sections
 */
export class ResumeSectionBuilder<T extends { id?: any }> {
  private config: ResumeSectionConfig<T> = {
    title: '',
    items: [],
    renderItem: () => null,
  }

  withTitle(title: string) {
    this.config.title = title
    return this
  }

  withIcon(icon: ReactNode) {
    this.config.icon = icon
    return this
  }

  withItems(items: T[]) {
    this.config.items = items
    return this
  }

  withItemRenderer(renderItem: (item: T, index: number) => ReactNode) {
    this.config.renderItem = renderItem
    return this
  }

  withAddButton(onAdd: () => void) {
    this.config.onAdd = onAdd
    return this
  }

  withEditHandler(onEdit: (item: T) => void) {
    this.config.onEdit = onEdit
    return this
  }

  withDeleteHandler(onDelete: (id: any) => void) {
    this.config.onDelete = onDelete
    return this
  }

  withEmptyState(isEmpty: boolean, message?: string) {
    this.config.isEmpty = isEmpty
    this.config.emptyMessage = message
    return this
  }

  withActions(actions: ReactNode) {
    this.config.actions = actions
    return this
  }

  withHeader(header: ReactNode) {
    this.config.header = header
    return this
  }

  withFooter(footer: ReactNode) {
    this.config.footer = footer
    return this
  }

  withSx(sx: SxProps<Theme>) {
    this.config.sx = sx
    return this
  }

  build() {
    return createResumeSection(this.config)
  }
}

/**
 * Preset section builders for common resume sections
 */
export const resumeSectionPresets = {
  /**
   * Create an experience section
   */
  experience: <T extends any>(config: Partial<ResumeSectionConfig<T>> & { renderItem: (item: T, index: number) => ReactNode }) => {
    return new ResumeSectionBuilder<T>()
      .withTitle('Experience')
      .withItems(config.items || [])
      .withItemRenderer(config.renderItem)
      .withEmptyState(!config.items || config.items.length === 0, 'No experience added')
  },

  /**
   * Create an education section
   */
  education: <T extends any>(config: Partial<ResumeSectionConfig<T>> & { renderItem: (item: T, index: number) => ReactNode }) => {
    return new ResumeSectionBuilder<T>()
      .withTitle('Education')
      .withItems(config.items || [])
      .withItemRenderer(config.renderItem)
      .withEmptyState(!config.items || config.items.length === 0, 'No education added')
  },

  /**
   * Create a skills section
   */
  skills: <T extends any>(config: Partial<ResumeSectionConfig<T>> & { renderItem: (item: T, index: number) => ReactNode }) => {
    return new ResumeSectionBuilder<T>()
      .withTitle('Skills')
      .withItems(config.items || [])
      .withItemRenderer(config.renderItem)
      .withEmptyState(!config.items || config.items.length === 0, 'No skills added')
  },

  /**
   * Create a certifications section
   */
  certifications: <T extends any>(config: Partial<ResumeSectionConfig<T>> & { renderItem: (item: T, index: number) => ReactNode }) => {
    return new ResumeSectionBuilder<T>()
      .withTitle('Certifications')
      .withItems(config.items || [])
      .withItemRenderer(config.renderItem)
      .withEmptyState(!config.items || config.items.length === 0, 'No certifications added')
  },

  /**
   * Create a projects section
   */
  projects: <T extends any>(config: Partial<ResumeSectionConfig<T>> & { renderItem: (item: T, index: number) => ReactNode }) => {
    return new ResumeSectionBuilder<T>()
      .withTitle('Projects')
      .withItems(config.items || [])
      .withItemRenderer(config.renderItem)
      .withEmptyState(!config.items || config.items.length === 0, 'No projects added')
  },

  /**
   * Create a portfolio section
   */
  portfolio: <T extends any>(config: Partial<ResumeSectionConfig<T>> & { renderItem: (item: T, index: number) => ReactNode }) => {
    return new ResumeSectionBuilder<T>()
      .withTitle('Portfolio')
      .withItems(config.items || [])
      .withItemRenderer(config.renderItem)
      .withEmptyState(!config.items || config.items.length === 0, 'No portfolio items')
  },
}

/**
 * Generic item renderer factory
 */
export const createItemRenderer = <T extends any>(
  renderFn: (item: T) => ReactNode,
) => {
  return (item: T, index: number) => {
    return (
      <Box key={item.id || index} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {renderFn(item)}
      </Box>
    )
  }
}

/**
 * Create a collapsible section
 */
export const createCollapsibleSection = <T extends { id?: any }>(
  config: ResumeSectionConfig<T> & { defaultExpanded?: boolean },
) => {
  const [expanded, setExpanded] = React.useState(config.defaultExpanded ?? true)

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          p: 1.5,
          bgcolor: 'action.hover',
          borderRadius: 1,
          '&:hover': {
            bgcolor: 'action.selected',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {config.icon && <Box>{config.icon}</Box>}
          <Typography variant="h6">{config.title}</Typography>
        </Box>
        <Typography>{expanded ? '▼' : '▶'}</Typography>
      </Box>

      {expanded && (
        <Box sx={{ mt: 2 }}>
          {config.isEmpty ? (
            <Typography color="textSecondary">{config.emptyMessage || 'No items'}</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {config.items.map((item, index) => (
                <Box key={item.id || index}>{config.renderItem(item, index)}</Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

/**
 * Create a tabbed section
 */
export const createTabbedSection = <T extends { id?: any }>(
  tabs: Array<{
    label: string
    items: T[]
    renderItem: (item: T, index: number) => ReactNode
  }>,
) => {
  const [activeTab, setActiveTab] = React.useState(0)

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        {tabs.map((tab, idx) => (
          <Box
            key={idx}
            onClick={() => setActiveTab(idx)}
            sx={{
              p: 1,
              cursor: 'pointer',
              borderBottom: activeTab === idx ? '2px solid' : 'none',
              borderColor: activeTab === idx ? 'primary.main' : 'transparent',
              fontWeight: activeTab === idx ? 'bold' : 'normal',
            }}
          >
            {tab.label}
          </Box>
        ))}
      </Box>

      <Box>
        {tabs[activeTab].items.map((item, index) => (
          <Box key={item.id || index}>{tabs[activeTab].renderItem(item, index)}</Box>
        ))}
      </Box>
    </Box>
  )
}

/**
 * Create an accordion section
 */
export const createAccordionSection = <T extends { id?: any }>(
  config: ResumeSectionConfig<T>,
) => {
  const [expanded, setExpanded] = React.useState<Set<any>>(new Set())

  const toggleItem = (id: any) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpanded(newExpanded)
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {config.title}
      </Typography>

      <Box>
        {config.items.map((item, index) => {
          const itemId = item.id || index
          const isExpanded = expanded.has(itemId)

          return (
            <Box key={itemId} sx={{ mb: 1 }}>
              <Box
                onClick={() => toggleItem(itemId)}
                sx={{
                  p: 1.5,
                  bgcolor: isExpanded ? 'action.selected' : 'action.hover',
                  borderRadius: 1,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography>{isExpanded ? '▼' : '▶'}</Typography>
                <Typography flex={1}>{(item as any).title || `Item ${index + 1}`}</Typography>
              </Box>

              {isExpanded && (
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  {config.renderItem(item, index)}
                </Box>
              )}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
