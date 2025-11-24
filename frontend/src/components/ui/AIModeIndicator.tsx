import type { PromptMode } from '@/types/annotations'
import { Activity, Loader2 } from 'lucide-react'

interface AIModeIndicatorProps {
  mode: PromptMode
  isActive: boolean // true when text-prompt or bbox-prompt panel is open
  textPrompt?: string // The current text prompt being used
  isProcessing?: boolean // true when AI is currently processing
}

export function AIModeIndicator({ mode, isActive, textPrompt = '', isProcessing = false }: AIModeIndicatorProps) {
  if (!isActive) return null

  const getModeLabel = () => {
    switch (mode) {
      case 'single':
        return 'Single'
      case 'auto-apply':
        return 'Auto-Apply'
      case 'batch':
        return 'Batch'
      default:
        return 'AI'
    }
  }

  const getStatusLabel = () => {
    if (isProcessing) return 'Processing...'
    if (mode === 'auto-apply') return 'Ready'
    return ''
  }

  const isAutoApply = mode === 'auto-apply'

  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-orange-600/20 border border-orange-600/50 rounded">
      {isProcessing ? (
        <Loader2 className="w-3 h-3 text-orange-500 animate-spin" />
      ) : (
        <Activity
          className={`w-3 h-3 text-orange-500 ${isAutoApply ? 'animate-pulse' : ''}`}
          style={isAutoApply ? { animation: 'heartbeat 1.5s ease-in-out infinite' } : undefined}
        />
      )}
      <span className="text-xs font-medium text-orange-400">
        AI: {getModeLabel()}
        {textPrompt && <span className="text-orange-300"> | "{textPrompt}"</span>}
        {getStatusLabel() && <span className="text-orange-300"> | {getStatusLabel()}</span>}
      </span>
      <style jsx>{`
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          10% {
            transform: scale(1.2);
          }
          20% {
            transform: scale(1);
          }
          30% {
            transform: scale(1.2);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
