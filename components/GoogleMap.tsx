'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

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
export default function GoogleMap() {
  const position: LatLngExpression = [44.4147996, 26.1229999]

  return (
    <MapContainer
      center={position}
      zoom={16}
      style={{ height: '350px', borderRadius: '10px' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position} icon={customIcon}>
        <Popup>Strada Foișorului 119, București</Popup>
      </Marker>
    </MapContainer>
  )
}
