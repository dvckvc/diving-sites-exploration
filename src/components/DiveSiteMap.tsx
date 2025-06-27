'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

interface DiveSiteMapProps {
  latitude: number
  longitude: number
  siteName: string
  location: string
  className?: string
}

export function DiveSiteMap({ 
  latitude, 
  longitude, 
  siteName, 
  location, 
  className = "" 
}: DiveSiteMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [L, setL] = useState<typeof import('leaflet') | null>(null)
  const [diveMarkerIcon, setDiveMarkerIcon] = useState<L.DivIcon | null>(null)

  useEffect(() => {
    setIsClient(true)
    // Dynamically import Leaflet on client-side only
    import('leaflet').then((leaflet) => {
      const L = leaflet.default
      
      // Fix for default markers in Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })
      
      // Create custom dive site marker icon
      const customIcon = L.divIcon({
        html: `<div style="
          background: linear-gradient(45deg, #0891b2, #06b6d4);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.4);
          position: relative;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background: #ffffff;
            border-radius: 50%;
          "></div>
        </div>`,
        className: 'dive-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      })
      
      setL(L)
      setDiveMarkerIcon(customIcon)
    })
  }, [])

  if (!isClient || !L) {
    return (
      <Card className={`bg-slate-800 border-slate-700 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <MapPin className="h-5 w-5 text-cyan-400" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-slate-700 rounded-lg flex items-center justify-center">
            <div className="text-slate-400">Loading map...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-slate-800 border-slate-700 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <MapPin className="h-5 w-5 text-cyan-400" />
          Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 rounded-lg overflow-hidden">
          <MapContainer
            center={[latitude, longitude]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="rounded-lg"
            attributionControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="map-tiles"
            />
            <Marker 
              position={[latitude, longitude]} 
              icon={diveMarkerIcon || undefined}
            >
              <Popup>
                <div className="p-2 max-w-xs">
                  <h3 className="font-semibold text-sm mb-1">{siteName}</h3>
                  <p className="text-xs text-gray-600 mb-2">{location}</p>
                  <div className="text-xs text-gray-500">
                    <div>Lat: {latitude.toFixed(6)}</div>
                    <div>Lng: {longitude.toFixed(6)}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
        
        {/* Coordinates display */}
        <div className="mt-3 text-sm text-slate-400">
          <div className="flex items-center justify-between">
            <span>Coordinates:</span>
            <span className="font-mono">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
