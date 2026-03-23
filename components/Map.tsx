"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";

export default function Map() {
  return (
    <MapContainer center={[48.8566, 2.3522]} zoom={13} className="h-[500px]">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[48.8566, 2.3522]} />
    </MapContainer>
  );
}
