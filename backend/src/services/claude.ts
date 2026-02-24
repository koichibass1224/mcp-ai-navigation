import Anthropic from '@anthropic-ai/sdk'
import { mcpServer, McpTool } from '../mcp/server.js'

const SYSTEM_PROMPT = `あなたはAIナビゲーションアシスタントです。
ユーザーの自然文指示に基づいて、最適なルートを探索してください。

## あなたの役割
- ユーザーの意図を正確に理解する
- 利用可能なツールの中から最適なものを選択する
- 必要に応じて複数のツールを組み合わせる
- 結果をユーザーにわかりやすく説明する

## 利用可能なツール
- route_search: ルート検索（メイン）
- distance_compare: 距離・時間の比較
- geocode: 地名の座標変換

## 判断ガイドライン
- 「渋滞を避けて」→ departure_time="now" を指定
- 「高速使わない」→ avoid=["highways"]
- 「一番早い」→ alternatives=true で複数取得し最短を選択
- 「比較して」→ alternatives=true または distance_compare を使用
- 「右折少なめ」→ alternatives=true で取得後、stepsのmaneuverを解析

## 応答フォーマット
ツール実行後、以下のJSON形式で応答してください:
{
  "selectedRoute": { ... },
  "reasoning": "選択理由の説明"
}`

export interface ToolCall {
  name: string
  params: Record<string, unknown>
  reason: string
}

export interface ClaudeResponse {
  message: string
  toolsUsed: ToolCall[]
  rawResponse: unknown
}

class ClaudeService {
  private client: Anthropic | null = null

  private getClient(): Anthropic {
    if (!this.client) {
      const apiKey = process.env.ANTHROPIC_API_KEY
      if (!apiKey) {
        throw new Error('ANTHROPIC_API_KEY is not set')
      }
      this.client = new Anthropic({ apiKey })
    }
    return this.client
  }

  private convertToolsToAnthropicFormat(): Anthropic.Tool[] {
    return mcpServer.getTools().map((tool: McpTool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.inputSchema as Anthropic.Tool['input_schema'],
    }))
  }

  async sendMessage(
    userMessage: string,
    conversationHistory: Anthropic.MessageParam[] = []
  ): Promise<ClaudeResponse> {
    const client = this.getClient()
    const tools = this.convertToolsToAnthropicFormat()
    const toolsUsed: ToolCall[] = []

    const messages: Anthropic.MessageParam[] = [
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ]

    try {
      let response = await client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools: tools.length > 0 ? tools : undefined,
        messages,
      })

      while (response.stop_reason === 'tool_use') {
        const toolUseBlocks = response.content.filter(
          (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
        )

        const toolResults: Anthropic.ToolResultBlockParam[] = []

        for (const toolUse of toolUseBlocks) {
          console.log(`Executing tool: ${toolUse.name}`, toolUse.input)

          toolsUsed.push({
            name: toolUse.name,
            params: toolUse.input as Record<string, unknown>,
            reason: '',
          })

          try {
            const result = await mcpServer.callTool(
              toolUse.name,
              toolUse.input as Record<string, unknown>
            )
            toolResults.push({
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: JSON.stringify(result),
            })
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            toolResults.push({
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: `Error: ${errorMessage}`,
              is_error: true,
            })
          }
        }

        messages.push({ role: 'assistant', content: response.content })
        messages.push({ role: 'user', content: toolResults })

        response = await client.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          tools: tools.length > 0 ? tools : undefined,
          messages,
        })
      }

      const textBlocks = response.content.filter(
        (block): block is Anthropic.TextBlock => block.type === 'text'
      )
      const message = textBlocks.map((block) => block.text).join('\n')

      return {
        message,
        toolsUsed,
        rawResponse: response,
      }
    } catch (error) {
      console.error('Claude API error:', error)
      throw error
    }
  }
}

export const claudeService = new ClaudeService()
