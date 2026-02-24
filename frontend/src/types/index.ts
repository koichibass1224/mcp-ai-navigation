export interface NavigateRequest {
  origin: string
  destination: string
  message: string
}

export interface LatLng {
  lat: number
  lng: number
}

export interface RouteResult {
  polyline: LatLng[]
  distance: {
    text: string
    value: number
  }
  duration: {
    text: string
    value: number
  }
  summary: string
}

export interface NavigateResponse {
  route: RouteResult
  aiResponse: string
  toolCalls: ToolCall[]
}

export interface ToolCall {
  name: string
  input: Record<string, unknown>
  result?: unknown
}
