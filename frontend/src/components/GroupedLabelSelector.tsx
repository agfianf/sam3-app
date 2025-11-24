import { ChevronDown, ChevronRight, Eye, EyeOff, Folder, Tag } from 'lucide-react'
import type { Label, LabelGroup } from '@/types/annotations'

interface GroupedLabelSelectorProps {
  labels: Label[]
  groups: LabelGroup[]
  selectedLabelId: string | null
  onSelectLabel: (labelId: string) => void
  onToggleLabelVisibility: (labelId: string) => void
  onToggleGroupVisibility: (groupId: string) => void
  onToggleGroupExpanded: (groupId: string) => void
  expandedGroups: Record<string, boolean>
}

export function GroupedLabelSelector({
  labels,
  groups,
  selectedLabelId,
  onSelectLabel,
  onToggleLabelVisibility,
  onToggleGroupVisibility,
  onToggleGroupExpanded,
  expandedGroups,
}: GroupedLabelSelectorProps) {
  // Group labels by groupId
  const groupedLabels: Record<string, Label[]> = {}
  labels.forEach(label => {
    const groupId = label.groupId || 'ungrouped'
    if (!groupedLabels[groupId]) {
      groupedLabels[groupId] = []
    }
    groupedLabels[groupId].push(label)
  })

  // Sort labels within each group by sortOrder
  Object.values(groupedLabels).forEach(labelList => {
    labelList.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
  })

  // Sort groups by sortOrder
  const sortedGroups = [...groups].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

  const renderLabel = (label: Label, isInGroup: boolean) => {
    const isSelected = selectedLabelId === label.id
    const isVisible = label.isVisible ?? true

    return (
      <div
        key={label.id}
        className={`flex items-center gap-2 py-2 px-3 rounded cursor-pointer transition-colors ${
          isInGroup ? 'ml-6' : ''
        } ${
          isSelected
            ? 'bg-orange-500/20 border border-orange-500/40'
            : 'hover:bg-gray-700/50'
        }`}
      >
        {/* Label color swatch and name */}
        <div
          className="flex items-center gap-2 flex-1 min-w-0"
          onClick={() => onSelectLabel(label.id)}
        >
          <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div
            className="w-3 h-3 rounded-sm flex-shrink-0"
            style={{ backgroundColor: label.color }}
          />
          <span className="text-sm text-gray-200 truncate">{label.name}</span>
        </div>

        {/* Visibility toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleLabelVisibility(label.id)
          }}
          className="text-gray-400 hover:text-gray-200 transition-colors p-1"
          title={isVisible ? 'Hide label' : 'Show label'}
        >
          {isVisible ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </button>
      </div>
    )
  }

  const renderGroup = (group: LabelGroup) => {
    const groupLabels = groupedLabels[group.id] || []
    const isExpanded = expandedGroups[group.id] ?? true
    const isVisible = group.isVisible ?? true
    const count = groupLabels.length

    return (
      <div key={group.id} className="mb-2">
        {/* Group header */}
        <div className="flex items-center gap-2 py-2 px-2 rounded hover:bg-gray-700/30 transition-colors">
          {/* Expand/collapse button */}
          <button
            onClick={() => onToggleGroupExpanded(group.id)}
            className="text-gray-400 hover:text-gray-200 transition-colors p-1"
            title={isExpanded ? 'Collapse group' : 'Expand group'}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {/* Group icon and name with count */}
          <div
            className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
            onClick={() => onToggleGroupExpanded(group.id)}
          >
            <Folder className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-300 truncate">
              {group.name}
            </span>
            <span className="text-xs text-gray-500">({count})</span>
          </div>

          {/* Group visibility toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleGroupVisibility(group.id)
            }}
            className="text-gray-400 hover:text-gray-200 transition-colors p-1"
            title={isVisible ? 'Hide all labels in group' : 'Show all labels in group'}
          >
            {isVisible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Group labels (when expanded) */}
        {isExpanded && (
          <div className="mt-1 space-y-1">
            {groupLabels.map(label => renderLabel(label, true))}
          </div>
        )}
      </div>
    )
  }

  const ungroupedLabels = groupedLabels['ungrouped'] || []

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-gray-400 uppercase tracking-wide px-2">
        Labels
      </div>

      <div className="max-h-96 overflow-y-auto space-y-1">
        {/* Render all groups */}
        {sortedGroups.map(group => renderGroup(group))}

        {/* Render ungrouped labels */}
        {ungroupedLabels.length > 0 && (
          <div>
            {groups.length > 0 && (
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2 py-2 mt-2">
                Ungrouped ({ungroupedLabels.length})
              </div>
            )}
            <div className="space-y-1">
              {ungroupedLabels.map(label => renderLabel(label, false))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {labels.length === 0 && (
          <div className="text-sm text-gray-500 text-center py-4">
            No labels yet. Create labels to start annotating.
          </div>
        )}
      </div>
    </div>
  )
}
