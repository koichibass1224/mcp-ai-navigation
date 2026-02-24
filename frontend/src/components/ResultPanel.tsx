import { SearchMode } from './ModeToggle'
import { NavigateResponse } from '../utils/api'

interface ResultPanelProps {
  mode: SearchMode
  result: NavigateResponse | null
}

export function ResultPanel({ mode, result }: ResultPanelProps) {
  if (!result || !result.route) return null

  const isAiMode = mode === 'ai'

  return (
    <div className="space-y-3">
      {/* ルート結果カード */}
      <div className={`
        p-4 rounded-xl border
        ${isAiMode
          ? 'bg-elevated border-apple-purple/50 shadow-glow-purple'
          : 'bg-elevated border-separator'
        }
      `}>
        <div className="flex items-center gap-2 mb-2">
          {isAiMode ? (
            <>
              <span className="text-apple-purple">✦</span>
              <span className="text-sm text-apple-purple font-medium">AI推奨ルート</span>
            </>
          ) : (
            <>
              <span className="text-apple-cyan">●</span>
              <span className="text-sm text-white/60">ルート</span>
            </>
          )}
        </div>
        <p className="text-lg font-semibold text-white mb-1">
          {result.route.summary || '経路'}
        </p>
        <p className="text-apple-cyan text-lg">
          {result.route.distance.text} / {result.route.duration.text}
        </p>
      </div>

      {/* AI判断理由 */}
      {isAiMode && result.reasoning && (
        <div className="p-4 bg-apple-purple/10 rounded-xl border border-apple-purple/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-apple-purple">💭</span>
            <span className="text-sm font-medium text-apple-purple">AI判断理由</span>
          </div>
          <p className="text-sm text-white/80 leading-relaxed">
            {result.reasoning}
          </p>
        </div>
      )}

      {/* ツール呼び出しログ */}
      {isAiMode && result.toolCalls && result.toolCalls.length > 0 && (
        <div className="p-4 bg-elevated rounded-xl border border-separator">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-apple-orange">🔧</span>
            <span className="text-sm font-medium text-white/60">使用ツール</span>
          </div>
          <div className="space-y-2">
            {result.toolCalls.map((tool, i) => (
              <div key={i} className="text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-white/40">{i + 1}.</span>
                  <code className="text-apple-cyan">{tool.name}</code>
                </div>
                {tool.input && Object.keys(tool.input).length > 0 && (
                  <div className="ml-5 mt-1 text-xs text-white/40 font-mono">
                    {Object.entries(tool.input).map(([key, value]) => (
                      <div key={key}>
                        {key}: {JSON.stringify(value)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
