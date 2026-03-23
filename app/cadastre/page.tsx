"use client";

import dynamic from "next/dynamic";

/* IMPORTANT : éviter SSR avec Leaflet */
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

export default function CadastrePage() {
  /* Centre par défaut (Paris par exemple) */
  const defaultCenter: [number, number] = [48.8566, 2.3522];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Carte cadastrale</h1>

      <Map center={defaultCenter} />
    </div>
  );
}
