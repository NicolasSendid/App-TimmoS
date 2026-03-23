"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle as LeafletCircle,
  Polygon,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* FIX ICONES */
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
};

type ParcelleType = {
  id: string;
  surface: number;
  coordinates: any;
};

type Props = {
  center: [number, number];
  markers?: MarkerType[];
  parcelles?: ParcelleType[];
  selectedParcelle?: ParcelleType | null;
  onSelectParcelle?: (p: ParcelleType) => void;
};

function formatCoordinates(coords: any) {
  return coords[0].map((c: any) => [c[1], c[0]]);
}

export default function Map({
  center,
  markers = [],
  parcelles = [],
  selectedParcelle,
  onSelectParcelle,
}: Props) {
  return (
    <MapContainer
      center={center}
      zoom={16}
      style={{
        height: "500px",
        width: "100%",
        marginTop: "20px",
        borderRadius: "10px",
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={center}>
        <Popup>Bien analysé</Popup>
      </Marker>

      {/* 🔥 FIX ICI : on force le typage du Circle */}
      <LeafletCircle
        {...({
          center,
          radius: 300,
          pathOptions: { color: "blue" },
        } as any)}
      />

      {markers.map((m, i) => (
        <LeafletCircle
          key={i}
          {...({
            center: [m.lat, m.lon],
            radius: 20,
            pathOptions: {
              color: "orange",
              fillColor: "orange",
              fillOpacity: 0.5,
            },
          } as any)}
        >
          <Popup>
            <strong>{m.price.toLocaleString()} €</strong>
            <br />
            {m.surface} m²
          </Popup>
        </LeafletCircle>
      ))}

      {parcelles.map((p, i) => {
        const isSelected = selectedParcelle?.id === p.id;

        return (
          <Polygon
            key={i}
            positions={formatCoordinates(p.coordinates)}
            pathOptions={{
              color: isSelected ? "gold" : "purple",
              fillColor: isSelected ? "gold" : "purple",
              fillOpacity: isSelected ? 0.5 : 0.2,
            }}
            eventHandlers={{
              click: () => onSelectParcelle && onSelectParcelle(p),
            }}
          >
            <Popup>
              <strong>Parcelle</strong>
              <br />
              ID : {p.id}
              <br />
              Surface : {p.surface} m²
            </Popup>
          </Polygon>
        );
      })}
    </MapContainer>
  );
}
