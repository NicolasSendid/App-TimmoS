"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

export default function CadastrePage() {
  return (
    <div>
      <h1>Cadastre</h1>

      <Map center={[48.606, 2.45]} />
    </div>
  );
}
