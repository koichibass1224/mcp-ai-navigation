import { Client, TravelMode, TrafficModel, TravelRestriction, Language } from '@googlemaps/google-maps-services-js'

const client = new Client({})

export type TravelModeType = 'driving' | 'walking' | 'bicycling'

export interface RouteSearchParams {
  origin: string
  destination: string
  mode?: TravelModeType
  avoid?: ('tolls' | 'highways' | 'ferries')[]
  alternatives?: boolean
  departure_time?: string
  traffic_model?: 'best_guess' | 'pessimistic' | 'optimistic'
}

export interface RouteStep {
  instruction: string
  distance: string
  duration: string
  maneuver?: string
}

export interface RouteResult {
  summary: string
  distance: { text: string; value: number }
  duration: { text: string; value: number }
  duration_in_traffic?: { text: string; value: number }
  polyline: string
  steps: RouteStep[]
  warnings: string[]
}

export interface DirectionsResult {
  routes: RouteResult[]
  geocoded_waypoints: Array<{
    place_id: string
    types: string[]
  }>
}

export async function searchRoute(params: RouteSearchParams): Promise<DirectionsResult> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    throw new Error('GOOGLE_MAPS_API_KEY is not set')
  }

  const departureTime = params.departure_time === 'now'
    ? 'now'
    : params.departure_time
      ? new Date(params.departure_time).getTime() / 1000
      : undefined

  const trafficModelMap: Record<string, TrafficModel> = {
    'best_guess': TrafficModel.best_guess,
    'pessimistic': TrafficModel.pessimistic,
    'optimistic': TrafficModel.optimistic,
  }

  const avoidMap: Record<string, TravelRestriction> = {
    'tolls': TravelRestriction.tolls,
    'highways': TravelRestriction.highways,
    'ferries': TravelRestriction.ferries,
  }

  const avoidRestrictions = params.avoid?.map((a) => avoidMap[a])

  const travelModeMap: Record<string, TravelMode> = {
    'driving': TravelMode.driving,
    'walking': TravelMode.walking,
    'bicycling': TravelMode.bicycling,
  }

  try {
    const response = await client.directions({
      params: {
        origin: params.origin,
        destination: params.destination,
        mode: travelModeMap[params.mode ?? 'driving'],
        avoid: avoidRestrictions,
        alternatives: params.alternatives ?? false,
        departure_time: departureTime,
        traffic_model: params.traffic_model
          ? trafficModelMap[params.traffic_model]
          : undefined,
        language: Language.ja,
        key: apiKey,
      },
    })

    if (response.data.status !== 'OK') {
      throw new Error(`Directions API error: ${response.data.status}`)
    }

    const routes: RouteResult[] = response.data.routes.map((route) => {
      const leg = route.legs[0]
      return {
        summary: route.summary,
        distance: {
          text: leg.distance?.text ?? '',
          value: leg.distance?.value ?? 0,
        },
        duration: {
          text: leg.duration?.text ?? '',
          value: leg.duration?.value ?? 0,
        },
        duration_in_traffic: leg.duration_in_traffic ? {
          text: leg.duration_in_traffic.text ?? '',
          value: leg.duration_in_traffic.value ?? 0,
        } : undefined,
        polyline: route.overview_polyline.points,
        steps: leg.steps.map((step) => ({
          instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
          distance: step.distance?.text ?? '',
          duration: step.duration?.text ?? '',
          maneuver: step.maneuver,
        })),
        warnings: route.warnings,
      }
    })

    const geocoded_waypoints = response.data.geocoded_waypoints?.map((wp) => ({
      place_id: wp.place_id ?? '',
      types: wp.types ?? [],
    })) ?? []

    return { routes, geocoded_waypoints }
  } catch (error) {
    console.error('Google Maps API error:', error)
    throw error
  }
}
