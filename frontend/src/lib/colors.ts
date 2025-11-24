/**
 * Preset color palette for label annotations
 * Colors are chosen for maximum visual distinction and good contrast on images
 */

export const PRESET_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#eab308', // Yellow
  '#84cc16', // Lime
  '#22c55e', // Green
  '#10b981', // Emerald
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#0ea5e9', // Sky Blue
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#a855f7', // Purple
  '#d946ef', // Fuchsia
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#64748b', // Slate
  '#78716c', // Stone
  '#a8a29e', // Warm Gray
] as const

export type PresetColor = typeof PRESET_COLORS[number]

export const DEFAULT_LABEL_COLOR = PRESET_COLORS[0] // Red
