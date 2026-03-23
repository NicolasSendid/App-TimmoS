"use client";

import { useState } from "react";

export default function Estimation() {
  const [surface, setSurface] = useState("");
  const [pieces, setPieces] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const handleEstimation = () => {
    // Simulation simple (remplacé plus tard par DVF)
    const prixM2 = 3500;
    const estimation = Number(surface) * prixM2;

    setResult(estimation);
  };

  return (
    <div>
      <h1>Estimation</h1>

      <input
        placeholder="Surface (m²)"
        value={surface}
        onChange={(e) => setSurface(e.target.value)}
      />

      <input
        placeholder="Nombre de pièces"
        value={pieces}
        onChange={(e) => setPieces(e.target.value)}
      />

      <button onClick={handleEstimation}>
        Estimer
      </button>

      {result && (
        <h2>Estimation : {result} €</h2>
      )}
    </div>
  );
}
