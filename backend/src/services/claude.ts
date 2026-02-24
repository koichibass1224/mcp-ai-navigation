import Anthropic from '@anthropic-ai/sdk'
import { mcpServer, McpTool } from '../mcp/server.js'

const SYSTEM_PROMPT = `あなたはAIナビゲーションアシスタントです。

## 重要ルール
- **必ずroute_searchツールを実行してください**。質問や確認で返さないこと。
- 条件が曖昧でも、推測してルート検索を実行する。
- 出発地・目的地が指定されていれば、必ずルートを返す。

## 判断ガイドライン
- 「渋滞を避けて」→ departure_time="now"
- 「高速使わない」「下道で」→ avoid=["highways"]
- 「有料道路なし」→ avoid=["tolls"]
- 「迂回」「遠回り」→ alternatives=true で複数取得
- 条件不明 → デフォルトでルート検索を実行

## 応答フォーマット
ツール実行後、以下のJSON形式で応答:
{
  "route": { summary, distance, duration, polyline },
  "reasoning": "選択理由"
}`

export interface ToolCall {
  name: string
  params: Record<string, unknown>
  reason: string
}

export interface ToolResult {
  name: string
  result: unknown
}

export interface ClaudeResponse {
  message: string
  toolsUsed: ToolCall[]
  toolResults: ToolResult[]
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
    const collectedToolResults: ToolResult[] = []

    const messages: Anthropic.MessageParam[] = [
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ]

    try {
      let response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
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
            collectedToolResults.push({
              name: toolUse.name,
              result,
            })
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
          model: 'claude-haiku-4-5-20251001',
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
        toolResults: collectedToolResults,
        rawResponse: response,
      }
    } catch (error) {
      console.error('Claude API error:', error)
      throw error
    }
  }
}

export const claudeService = new ClaudeService()
