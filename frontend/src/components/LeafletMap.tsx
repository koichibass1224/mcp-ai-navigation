import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LatLng } from '../types'

const TOKYO_STATION = {
  lat: 35.6812,
  lng: 139.7671,
}

const DEFAULT_ZOOM = 13

const originIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="width: 24px; height: 24px; background: #4ade80; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

const destinationIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="width: 24px; height: 24px; background: #f87171; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

interface MapUpdaterProps {
  route: LatLng[] | null
}

function MapUpdater({ route }: MapUpdaterProps) {
  const map = useMap()

  useEffect(() => {
    if (route && route.length > 0) {
      const bounds = L.latLngBounds(route.map(p => [p.lat, p.lng]))
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [route, map])

  return null
}

interface LeafletMapProps {
  route?: LatLng[] | null
}

export function LeafletMap({ route }: LeafletMapProps) {
  const routePositions = useMemo(() => {
    if (!route || route.length === 0) return null
    return route.map(p => [p.lat, p.lng] as [number, number])
  }, [route])

  const origin = route && route.length > 0 ? route[0] : null
  const destination = route && route.length > 1 ? route[route.length - 1] : null

  return (
    <MapContainer
      center={[TOKYO_STATION.lat, TOKYO_STATION.lng]}
      zoom={DEFAULT_ZOOM}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapUpdater route={route ?? null} />
      {routePositions && (
        <Polyline
          positions={routePositions}
          pathOptions={{
            color: '#00d4ff',
            weight: 5,
            opacity: 0.8,
          }}
        />
      )}
      {origin && (
        <Marker position={[origin.lat, origin.lng]} icon={originIcon} />
      )}
      {destination && (
        <Marker position={[destination.lat, destination.lng]} icon={destinationIcon} />
      )}
    </MapContainer>
  )
}
