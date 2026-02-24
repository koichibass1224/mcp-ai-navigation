import { useState, FormEvent } from 'react'
import { NavigateRequest, TravelMode, RouteType } from '../types'
import { SearchMode } from './ModeToggle'

interface InputFormProps {
  mode: SearchMode
  onSubmit: (data: NavigateRequest) => void
  isLoading: boolean
}

const travelModeOptions: { value: TravelMode; label: string; icon: string }[] = [
  { value: 'driving', label: '車', icon: '🚗' },
  { value: 'walking', label: '徒歩', icon: '🚶' },
  { value: 'bicycling', label: '自転車', icon: '🚴' },
]

const routeTypeOptions: { value: RouteType; label: string }[] = [
  { value: 'default', label: '最適' },
  { value: 'avoid_highways', label: '下道優先' },
  { value: 'avoid_tolls', label: '無料道路' },
]

export function InputForm({ mode, onSubmit, isLoading }: InputFormProps) {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [message, setMessage] = useState('')
  const [travelMode, setTravelMode] = useState<TravelMode>('driving')
  const [routeType, setRouteType] = useState<RouteType>('default')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!origin.trim() || !destination.trim()) return
    onSubmit({
      origin,
      destination,
      message: mode === 'ai' ? message : '',
      travelMode,
      routeType,
    })
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

      {/* 移動手段 */}
      <div className="space-y-2">
        <label className="text-sm text-white/60">移動手段</label>
        <div className="flex gap-2">
          {travelModeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={isLoading}
              onClick={() => setTravelMode(option.value)}
              className={`
                flex-1 py-2 px-3 rounded-lg text-sm font-medium
                transition-all flex items-center justify-center gap-1.5
                ${travelMode === option.value
                  ? 'bg-apple-blue text-white'
                  : 'bg-elevated text-white/60 hover:text-white border border-separator'
                }
                disabled:opacity-50
              `}
            >
              <span>{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 道路タイプ（車のときのみ表示） */}
      {travelMode === 'driving' && (
        <div className="space-y-2">
          <label className="text-sm text-white/60">道路タイプ</label>
          <div className="flex gap-2">
            {routeTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={isLoading}
                onClick={() => setRouteType(option.value)}
                className={`
                  flex-1 py-2 px-3 rounded-lg text-sm font-medium
                  transition-all
                  ${routeType === option.value
                    ? 'bg-apple-cyan text-black'
                    : 'bg-elevated text-white/60 hover:text-white border border-separator'
                  }
                  disabled:opacity-50
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 自然文条件（AIモードのみ） */}
      <div className="space-y-1">
        <label className={`text-sm ${isAiMode ? 'text-apple-purple' : 'text-white/30'}`}>
          追加条件（自然文）
          {!isAiMode && <span className="ml-2 text-xs">※AIモードで有効</span>}
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isAiMode ? '例: 景色の良いルートで' : 'AIモードで条件を指定できます'}
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
