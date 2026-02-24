import { useState, FormEvent } from 'react'
import { NavigateRequest } from '../types'
import { SearchMode } from './ModeToggle'

interface InputFormProps {
  mode: SearchMode
  onSubmit: (data: NavigateRequest) => void
  isLoading: boolean
}

export function InputForm({ mode, onSubmit, isLoading }: InputFormProps) {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!origin.trim() || !destination.trim()) return
    onSubmit({ origin, destination, message: mode === 'ai' ? message : '' })
  }

  const isAiMode = mode === 'ai'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm text-white/60">出発地</label>
        <input
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="例: 東京駅"
          disabled={isLoading}
          className="
            w-full py-3 px-4
            bg-elevated border border-separator rounded-xl
            text-white placeholder-white/30
            focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue
            transition-colors
            disabled:opacity-50
          "
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-white/60">目的地</label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="例: 渋谷駅"
          disabled={isLoading}
          className="
            w-full py-3 px-4
            bg-elevated border border-separator rounded-xl
            text-white placeholder-white/30
            focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue
            transition-colors
            disabled:opacity-50
          "
        />
      </div>

      <div className="space-y-1">
        <label className={`text-sm ${isAiMode ? 'text-apple-purple' : 'text-white/30'}`}>
          ナビ条件（自然文）
          {!isAiMode && <span className="ml-2 text-xs">※AIモードで有効</span>}
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isAiMode ? '例: 渋滞を避けて最短で' : 'AIモードで条件を指定できます'}
          disabled={isLoading || !isAiMode}
          rows={2}
          className={`
            w-full py-3 px-4
            bg-elevated border rounded-xl
            text-white placeholder-white/30
            focus:outline-none
            transition-colors
            resize-none
            ${isAiMode
              ? 'border-apple-purple/50 focus:border-apple-purple focus:ring-1 focus:ring-apple-purple'
              : 'border-separator opacity-50 cursor-not-allowed'
            }
            disabled:opacity-50
          `}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !origin.trim() || !destination.trim()}
        className={`
          w-full py-3 px-4
          font-semibold rounded-xl
          transition-all
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isAiMode
            ? 'bg-apple-purple hover:bg-apple-purple/90 text-white shadow-glow-purple'
            : 'bg-apple-blue hover:bg-apple-blue/90 text-white'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⟳</span>
            検索中...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {isAiMode && <span>✦</span>}
            ルート検索
          </span>
        )}
      </button>
    </form>
  )
}
