"use client";

import { useState } from "react";

export default function DPEPage() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<any>(null);

  const fetchDPE = async () => {
    // Simulation (à brancher sur API ADEME plus tard)
    setResult({
      classe: "D",
      conso: 180,
    });
  };

  return (
    <div>
      <h1>DPE</h1>

      <input
        placeholder="Adresse"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button onClick={fetchDPE}>Rechercher</button>

      {result && (
        <div>
          <p>Classe énergétique : {result.classe}</p>
          <p>Consommation : {result.conso} kWh/m²</p>
        </div>
      )}
    </div>
  );
}
