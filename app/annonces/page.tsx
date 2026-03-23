"use client";

import { useState } from "react";

export default function AnnoncesPage() {
  const [annonces, setAnnonces] = useState<any[]>([]);

  const fetchData = () => {
    setAnnonces([
      { prix: 240000, surface: 60 },
      { prix: 310000, surface: 80 },
    ]);
  };

  return (
    <div>
      <h1>Marché actuel</h1>

      <button onClick={fetchData}>
        Charger annonces
      </button>

      {annonces.map((a, i) => (
        <div key={i}>
          {a.prix} € - {a.surface} m²
        </div>
      ))}
    </div>
  );
}
