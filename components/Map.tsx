'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

export default function GoogleMap() {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
  })

  const customIcon = new L.Icon({
    iconUrl: '/logo_negru_2.webp',
    iconSize: [60, 60],
    iconAnchor: [16, 32],
  })

  const position: LatLngExpression = [44.4149996, 26.1229909]

  return (
    <MapContainer
      center={position}
      zoom={16}
      style={{ height: '350px', borderRadius: '10px' }}
      scrollWheelZoom={false}
      className='z-0'
    >
      <TileLayer
        url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=HtntP1Hrm9tKcf76AWEe"
      />

      <Marker position={position} icon={customIcon}>
        <Popup>Strada Foișorului 119, București</Popup>
      </Marker>
    </MapContainer>
  )
}

