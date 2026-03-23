"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  center: [number, number];
  markers?: { lat: number; lon: number; price: number }[];
};

export default function Map({ center, markers = [] }: Props) {
  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: "400px", width: "100%", marginTop: "20px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Marker principal (le bien) */}
      <Marker position={center}>
        <Popup>Bien estimé</Popup>
      </Marker>

      {/* Comparables */}
      {markers.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lon]}>
          <Popup>Vente : {m.price.toLocaleString()} €</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
