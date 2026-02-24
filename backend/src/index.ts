import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { mcpServer } from './mcp/server.js'
import { routeSearchTool } from './mcp/tools/routeSearch.js'
import { claudeService } from './services/claude.js'
import { searchRoute } from './services/googleMaps.js'

dotenv.config()

mcpServer.registerTool(routeSearchTool)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    process.env.CORS_ORIGIN,
    /\.vercel\.app$/,
  ].filter(Boolean) as (string | RegExp)[],
}))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    services: {
      mcp: mcpServer.isRunning ? 'running' : 'stopped',
      tools: mcpServer.getTools().map(t => t.name),
    },
  })
})

interface RouteRequest {
  origin: string
  destination: string
  travelMode?: 'driving' | 'walking' | 'bicycling'
  routeType?: 'default' | 'avoid_highways' | 'avoid_tolls'
}

// 通常モード: Google Maps API直接呼び出し（AI判断なし）
app.post('/api/route', async (req, res) => {
  const { origin, destination, travelMode, routeType } = req.body as RouteRequest

  if (!origin || !destination) {
    res.status(400).json({ error: '出発地と目的地は必須です' })
    return
  }

  const avoid: ('tolls' | 'highways')[] = []
  if (routeType === 'avoid_highways') avoid.push('highways')
  if (routeType === 'avoid_tolls') avoid.push('tolls')

  try {
    const result = await searchRoute({
      origin,
      destination,
      mode: travelMode,
      avoid: avoid.length > 0 ? avoid : undefined,
    })
    const route = result.routes[0]

    if (!route) {
      res.status(404).json({ error: 'ルートが見つかりませんでした' })
      return
    }

    res.json({
      mode: 'normal',
      route: {
        summary: route.summary,
        distance: route.distance,
        duration: route.duration,
        polyline: route.polyline,
      },
      aiResponse: null,
      reasoning: null,
      toolCalls: [],
    })
  } catch (error) {
    console.error('Route search error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: `ルート検索に失敗しました: ${errorMessage}` })
  }
})

interface NavigateRequest {
  origin: string
  destination: string
  message: string
  travelMode?: 'driving' | 'walking' | 'bicycling'
  routeType?: 'default' | 'avoid_highways' | 'avoid_tolls'
  model?: 'sonnet' | 'haiku'
}

const travelModeLabels: Record<string, string> = {
  'driving': '車',
  'walking': '徒歩',
  'bicycling': '自転車',
}

const routeTypeLabels: Record<string, string> = {
  'default': '最適ルート',
  'avoid_highways': '下道優先（高速回避）',
  'avoid_tolls': '無料道路優先（有料回避）',
}

app.post('/api/navigate', async (req, res) => {
  const { origin, destination, message, travelMode, routeType, model } = req.body as NavigateRequest

  if (!origin || !destination) {
    res.status(400).json({ error: '出発地と目的地は必須です' })
    return
  }

  const userMessage = `
出発地: ${origin}
目的地: ${destination}
移動手段: ${travelModeLabels[travelMode ?? 'driving']}
道路タイプ: ${routeTypeLabels[routeType ?? 'default']}
${message ? `追加条件: ${message}` : ''}

上記の条件でルート検索を行い、最適なルートを1つ選んでください。
結果は以下のJSON形式で返してください:
{
  "route": {
    "summary": "ルート概要",
    "distance": { "text": "距離", "value": 数値(メートル) },
    "duration": { "text": "所要時間", "value": 数値(秒) },
    "polyline": "エンコード済みpolyline文字列"
  },
  "reasoning": "このルートを選んだ理由"
}
`.trim()

  try {
    const response = await claudeService.sendMessage(userMessage, [], model)

    let parsedRoute = null
    let reasoning = ''

    // ツール結果からルート候補を取得
    const routeSearchResult = response.toolResults.find(t => t.name === 'route_search')
    const routeResult = routeSearchResult?.result as { routes?: Array<{ summary: string; distance: unknown; duration: unknown; polyline: string }> } | undefined
    const availableRoutes = routeResult?.routes || []

    // AIの応答からreasoning抽出
    // コードブロック以外のテキスト部分を全て取得
    const messageWithoutCodeBlock = response.message
      .replace(/```[\s\S]*?```/g, '')  // コードブロック除去
      .trim()

    // 選択理由のキーワード以降を取得、なければ全文を使用
    const reasoningMatch = messageWithoutCodeBlock.match(/(?:選択理由|理由)[：:]\s*([\s\S]*)/i)
    if (reasoningMatch) {
      reasoning = reasoningMatch[1].trim()
    } else {
      // キーワードがなければ、コードブロック除去後の全文を使用
      reasoning = messageWithoutCodeBlock
    }

    // AIが選択したルートを特定
    if (availableRoutes.length > 0) {
      // デフォルトは最初のルート
      parsedRoute = availableRoutes[0]

      // AIの応答からルート番号やサマリーを探す
      const routeNumberMatch = response.message.match(/(\d+)番目|ルート(\d+)|Route\s*(\d+)/i)
      if (routeNumberMatch) {
        const num = parseInt(routeNumberMatch[1] || routeNumberMatch[2] || routeNumberMatch[3]) - 1
        if (num >= 0 && num < availableRoutes.length) {
          parsedRoute = availableRoutes[num]
        }
      } else {
        // サマリー名でマッチング
        for (const route of availableRoutes) {
          if (response.message.includes(route.summary)) {
            parsedRoute = route
            break
          }
        }
      }
    }

    // JSONブロックからも抽出を試みる（補完用）
    try {
      const codeBlockMatch = response.message.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (codeBlockMatch) {
        const parsed = JSON.parse(codeBlockMatch[1].trim())
        if (!reasoning && parsed.reasoning) {
          reasoning = parsed.reasoning
        }
      }
    } catch {
      // パース失敗しても続行
    }

    res.json({
      route: parsedRoute,
      aiResponse: response.message,
      reasoning,
      toolCalls: response.toolsUsed.map(t => ({
        name: t.name,
        input: t.params,
      })),
    })
  } catch (error) {
    console.error('Navigate error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: `ルート検索に失敗しました: ${errorMessage}` })
  }
})

async function startServer(): Promise<void> {
  await mcpServer.start()

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

startServer().catch(console.error)
