"use client";

import { useState } from "react";

export default function DPEPage() {
  const [result, setResult] = useState<any>(null);

  const fetchDPE = () => {
    setResult({
      classe: "C",
      conso: 140,
    });
  };

  return (
    <div>
      <h1>DPE</h1>

      <button onClick={fetchDPE}>
        Charger DPE
      </button>

      {result && (
        <div>
          <p>Classe : {result.classe}</p>
          <p>Consommation : {result.conso}</p>
        </div>
      )}
    </div>
  );
}
