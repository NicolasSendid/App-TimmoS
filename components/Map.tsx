"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* 🔧 FIX ICÔNES LEAFLET */
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* TYPES */
type MarkerType = {
  lat: number;
  lon: number;
  price: number;
  surface?: number;
  avg?: number;
};

type Props = {
  center?: [number, number];
  markers?: MarkerType[];
};

/* 🎨 COULEUR SELON PRIX */
function getColor(price: number, avg: number) {
  const ratio = price / avg;

  if (ratio < 0.9) return "green";   // sous le marché
  if (ratio < 1.1) return "orange";  // dans le marché
  return "red";                      // au-dessus
}

export default function Map({
  center = [48.606, 2.45],
  markers = [],
}: Props) {
  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{
        height: "450px",
        width: "100%",
        marginTop: "20px",
        borderRadius: "10px",
      }}
    >
      {/* FOND DE CARTE */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* 📍 BIEN PRINCIPAL */}
      <Marker position={center}>
        <Popup>
          <strong>Bien analysé</strong>
        </Popup>
      </Marker>

      {/* 🔵 CERCLE DE RECHERCHE */}
      <Circle
        center={center}
        radius={500}
        pathOptions={{ color: "blue" }}
      />

      {/* 📊 COMPARABLES DVF */}
      {markers.map((m, i) => {
        const avg = m.avg || m.price;
        const color = getColor(m.price, avg);

        return (
          <Circle
            key={i}
            center={[m.lat, m.lon]}
            radius={25}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.6,
            }}
          >
            <Popup>
              <div>
                <strong>{m.price.toLocaleString()} €</strong>
                <br />
                {m.surface && `${m.surface} m²`}
                <br />
                {m.surface &&
                  `${Math.round(m.price / m.surface)} €/m²`}
                <br />
                <span style={{ color }}>
                  {color === "green" && "Sous le marché 📉"}
                  {color === "orange" && "Dans le marché ⚖️"}
                  {color === "red" && "Au-dessus du marché 📈"}
                </span>
              </div>
            </Popup>
          </Circle>
        );
      })}
    </MapContainer>
  );
}
