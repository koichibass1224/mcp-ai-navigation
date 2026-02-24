const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

export interface ApiError {
  code: string
  message: string
  details?: string
}

export interface HealthResponse {
  status: string
  services: {
    mcp: string
    tools: string[]
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `HTTP error: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error)
    throw error
  }
}

export async function checkHealth(): Promise<HealthResponse> {
  return fetchApi<HealthResponse>('/api/health')
}

export interface NavigateRequest {
  origin: string
  destination: string
  message: string
  travelMode: 'driving' | 'walking' | 'bicycling'
  routeType: 'default' | 'avoid_highways' | 'avoid_tolls'
  model?: 'sonnet' | 'haiku'
}

export interface NavigateResponse {
  route: {
    summary: string
    distance: { text: string; value: number }
    duration: { text: string; value: number }
    polyline: string
  } | null
  aiResponse: string
  reasoning: string
  toolCalls: Array<{
    name: string
    input: Record<string, unknown>
  }>
}

export async function navigate(data: NavigateRequest): Promise<NavigateResponse> {
  return fetchApi<NavigateResponse>('/api/navigate', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// 通常モード: AI判断なしの直接ルート検索
export async function searchRouteNormal(data: NavigateRequest): Promise<NavigateResponse> {
  return fetchApi<NavigateResponse>('/api/route', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
