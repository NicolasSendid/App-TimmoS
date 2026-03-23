"use client";

import { useState } from "react";

export default function Estimation() {
  const [surface, setSurface] = useState("");
  const [pieces, setPieces] = useState("");
  const [type, setType] = useState("appartement");
  const [result, setResult] = useState<number | null>(null);

  const handleEstimation = () => {
    let prixM2 = 3500;

    if (type === "maison") prixM2 = 3200;

    const estimation = Number(surface) * prixM2;

    setResult(estimation);
  };

  return (
    <div>
      <h1>Estimation du bien</h1>

      <select onChange={(e) => setType(e.target.value)}>
        <option value="appartement">Appartement</option>
        <option value="maison">Maison</option>
      </select>

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
        Lancer estimation
      </button>

      {result && (
        <div>
          <h2>Résultat :</h2>
          <p>{result.toLocaleString()} €</p>
        </div>
      )}
    </div>
  );
}
