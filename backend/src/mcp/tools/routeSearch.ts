import { McpTool } from '../server.js'
import { searchRoute, RouteSearchParams } from '../../services/googleMaps.js'

export const routeSearchTool: McpTool = {
  name: 'route_search',
  description: '指定された出発地と目的地のルートを検索します。渋滞回避、高速道路回避などの条件を指定できます。alternatives=trueで複数ルート候補を取得できます。',
  inputSchema: {
    type: 'object',
    properties: {
      origin: {
        type: 'string',
        description: '出発地（住所または地名）',
      },
      destination: {
        type: 'string',
        description: '目的地（住所または地名）',
      },
      avoid: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['tolls', 'highways', 'ferries'],
        },
        description: '回避する要素のリスト',
      },
      alternatives: {
        type: 'boolean',
        description: '代替ルートも取得するかどうか（trueで最大3ルート）',
        default: false,
      },
      departure_time: {
        type: 'string',
        description: "出発時刻。'now'で現在時刻。リアルタイム交通情報を考慮する場合に指定。",
        default: 'now',
      },
      traffic_model: {
        type: 'string',
        enum: ['best_guess', 'pessimistic', 'optimistic'],
        description: '交通予測モデル。departure_time指定時のみ有効。',
        default: 'best_guess',
      },
    },
    required: ['origin', 'destination'],
  },
  handler: async (args: Record<string, unknown>) => {
    const params: RouteSearchParams = {
      origin: args.origin as string,
      destination: args.destination as string,
      avoid: args.avoid as RouteSearchParams['avoid'],
      alternatives: args.alternatives as boolean | undefined,
      departure_time: args.departure_time as string | undefined,
      traffic_model: args.traffic_model as RouteSearchParams['traffic_model'],
    }

    return searchRoute(params)
  },
}
