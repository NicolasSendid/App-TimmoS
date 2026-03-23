"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

export default function CadastrePage() {
  return (
    <div>
      <h1>Carte cadastrale</h1>

      <Map />
    </div>
  );
}
