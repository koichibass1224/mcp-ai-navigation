import { useEffect, useState, useMemo } from 'react'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { MainLayout } from './components/MainLayout'
import { LeafletMap } from './components/LeafletMap'
import { InputForm } from './components/InputForm'
import { ModeToggle, SearchMode } from './components/ModeToggle'
import { ResultPanel } from './components/ResultPanel'
import { checkHealth, navigate, searchRouteNormal, HealthResponse, NavigateResponse } from './utils/api'
import { decodePolyline } from './utils/polyline'
import { NavigateRequest } from './types'

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<NavigateResponse | null>(null)
  const [mode, setMode] = useState<SearchMode>('normal')

  const decodedRoute = useMemo(() => {
    if (!result?.route?.polyline) return null
    return decodePolyline(result.route.polyline)
  }, [result])

  useEffect(() => {
    checkHealth()
      .then((data) => {
        console.log('API Health:', data.status)
        setHealth(data)
      })
      .catch((err) => {
        console.error('Health check failed:', err)
        setError('バックエンドに接続できません')
      })
  }, [])

  const handleModeChange = (newMode: SearchMode) => {
    setMode(newMode)
    setResult(null)
    setError(null)
  }

  const handleNavigate = async (data: NavigateRequest) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      let response: NavigateResponse

      if (mode === 'normal') {
        response = await searchRouteNormal({
          origin: data.origin,
          destination: data.destination,
        })
      } else {
        response = await navigate(data)
      }

      console.log('Response:', response)
      setResult(response)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <Header />
      <MainLayout
        mapArea={<LeafletMap route={decodedRoute} />}
        sidePanel={
          <div className="p-4 space-y-4">
            {/* モード切り替え */}
            <div className="flex justify-center">
              <ModeToggle
                mode={mode}
                onChange={handleModeChange}
                disabled={isLoading}
              />
            </div>

            {/* モード説明 */}
            <div className={`
              p-3 rounded-xl text-sm
              ${mode === 'ai'
                ? 'bg-apple-purple/10 border border-apple-purple/30 text-apple-purple'
                : 'bg-elevated border border-separator text-white/60'
              }
            `}>
              {mode === 'ai' ? (
                <p>✦ AIが自然文を解釈し、最適なルートを判断します</p>
              ) : (
                <p>● Google Maps APIで直接ルートを検索します（条件は無視）</p>
              )}
            </div>

            {/* 入力フォーム */}
            <InputForm
              mode={mode}
              onSubmit={handleNavigate}
              isLoading={isLoading}
            />

            {/* エラー表示 */}
            {error && (
              <div className="p-4 bg-apple-red/10 border border-apple-red/30 rounded-xl">
                <p className="text-apple-red text-sm">{error}</p>
              </div>
            )}

            {/* 結果表示 */}
            <ResultPanel mode={mode} result={result} />

            {/* ステータス */}
            <div className="pt-4 border-t border-separator">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">API Status</span>
                {health ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-apple-green rounded-full"></span>
                    <span className="text-white/60">{health.services.mcp}</span>
                  </span>
                ) : (
                  <span className="text-white/40">Connecting...</span>
                )}
              </div>
              {health && health.services.tools.length > 0 && (
                <div className="mt-2 text-xs text-white/40">
                  Tools: {health.services.tools.join(', ')}
                </div>
              )}
            </div>
          </div>
        }
      />
      <Footer />
    </div>
  )
}

export default App
