import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

export interface McpTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  handler: (args: Record<string, unknown>) => Promise<unknown>
}

class McpServer {
  private server: Server
  private tools: Map<string, McpTool> = new Map()
  private _isRunning = false

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-map-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    )

    this.setupHandlers()
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = Array.from(this.tools.values()).map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      }))
      return { tools }
    })

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params
      const tool = this.tools.get(name)

      if (!tool) {
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        }
      }

      try {
        const result = await tool.handler(args ?? {})
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return {
          content: [
            {
              type: 'text',
              text: `Error executing tool ${name}: ${errorMessage}`,
            },
          ],
          isError: true,
        }
      }
    })
  }

  registerTool(tool: McpTool): void {
    this.tools.set(tool.name, tool)
    console.log(`MCP Tool registered: ${tool.name}`)
  }

  getTools(): McpTool[] {
    return Array.from(this.tools.values())
  }

  async start(): Promise<void> {
    this._isRunning = true
    console.log('MCP Server started')
  }

  get isRunning(): boolean {
    return this._isRunning
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    const tool = this.tools.get(name)
    if (!tool) {
      throw new Error(`Unknown tool: ${name}`)
    }
    return tool.handler(args)
  }
}

export const mcpServer = new McpServer()
