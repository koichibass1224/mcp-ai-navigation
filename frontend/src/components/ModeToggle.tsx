export type SearchMode = 'normal' | 'ai'

interface ModeToggleProps {
  mode: SearchMode
  onChange: (mode: SearchMode) => void
  disabled?: boolean
}

export function ModeToggle({ mode, onChange, disabled }: ModeToggleProps) {
  return (
    <div className="inline-flex p-1 bg-surface rounded-full">
      <button
        onClick={() => onChange('normal')}
        disabled={disabled}
        className={`
          py-2 px-4 rounded-full text-sm font-medium transition-all
          ${mode === 'normal'
            ? 'bg-elevated text-white shadow-dark-sm'
            : 'text-white/60 hover:text-white'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        通常モード
      </button>
      <button
        onClick={() => onChange('ai')}
        disabled={disabled}
        className={`
          py-2 px-4 rounded-full text-sm font-medium transition-all flex items-center gap-1
          ${mode === 'ai'
            ? 'bg-apple-purple text-white shadow-glow-purple'
            : 'text-white/60 hover:text-white'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <span>✦</span>
        <span>AIモード</span>
      </button>
    </div>
  )
}
