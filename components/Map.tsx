"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type MarkerType = {
  lat: number;
  lon: number;
  price: number;
  surface?: number;
};

type Props = {
  center?: [number, number];
  markers?: MarkerType[];
};

export default function Map({
  center = [48.606, 2.45],
  markers = [],
}: Props) {
  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: "400px", width: "100%", marginTop: "20px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Bien principal */}
      <Marker position={center}>
        <Popup>Bien analysé</Popup>
      </Marker>

      {/* Cercle rayon */}
      <Circle center={center} radius={500} />

      {/* Comparables */}
      {markers.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lon]}>
          <Popup>
            <div>
              <strong>{m.price.toLocaleString()} €</strong>
              <br />
              {m.surface && `${m.surface} m²`}
              <br />
              {Math.round(m.price / (m.surface || 1))} €/m²
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
