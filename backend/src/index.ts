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
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
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
}

// 通常モード: Google Maps API直接呼び出し（AI判断なし）
app.post('/api/route', async (req, res) => {
  const { origin, destination } = req.body as RouteRequest

  if (!origin || !destination) {
    res.status(400).json({ error: '出発地と目的地は必須です' })
    return
  }

  try {
    const result = await searchRoute({ origin, destination })
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
}

app.post('/api/navigate', async (req, res) => {
  const { origin, destination, message } = req.body as NavigateRequest

  if (!origin || !destination) {
    res.status(400).json({ error: '出発地と目的地は必須です' })
    return
  }

  const userMessage = `
出発地: ${origin}
目的地: ${destination}
${message ? `条件: ${message}` : ''}

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
    const response = await claudeService.sendMessage(userMessage)

    let parsedRoute = null
    let reasoning = ''

    try {
      const jsonMatch = response.message.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        parsedRoute = parsed.route || parsed.selectedRoute
        reasoning = parsed.reasoning || ''
      }
    } catch {
      console.log('JSON parse failed, using raw response')
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
