import Anthropic from '@anthropic-ai/sdk'
import { mcpServer, McpTool } from '../mcp/server.js'

const SYSTEM_PROMPT = `あなたはAIナビゲーションアシスタントです。

## 重要ルール
- **必ずroute_searchツールを実行**（alternatives=trueで複数取得推奨）
- 質問や確認で返さず、必ずルート検索を実行
- 複数ルートから条件に最も合うものを選択し、**選択理由を必ず説明**

## 判断ガイドライン
- 「渋滞を避けて」→ departure_time="now"
- 「高速使わない」「下道で」→ avoid=["highways"]
- 「有料道路なし」→ avoid=["tolls"]
- 「景色」「海沿い」→ alternatives=true で取得し、ルート名から判断

## 応答フォーマット
**選択したルート: [ルート名/サマリー]**

**選択理由:** [なぜこのルートを選んだか、ユーザーの条件とどう合致するか]`

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

  private getModelId(model?: 'sonnet' | 'haiku'): string {
    const models = {
      sonnet: 'claude-sonnet-4-20250514',
      haiku: 'claude-haiku-4-5-20251001',
    }
    return models[model ?? 'haiku']
  }

  async sendMessage(
    userMessage: string,
    conversationHistory: Anthropic.MessageParam[] = [],
    model?: 'sonnet' | 'haiku'
  ): Promise<ClaudeResponse> {
    const client = this.getClient()
    const tools = this.convertToolsToAnthropicFormat()
    const toolsUsed: ToolCall[] = []
    const collectedToolResults: ToolResult[] = []
    const modelId = this.getModelId(model)

    const messages: Anthropic.MessageParam[] = [
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ]

    try {
      let response = await client.messages.create({
        model: modelId,
        max_tokens: 2048,
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
          model: modelId,
          max_tokens: 2048,
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
