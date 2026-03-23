"use client";

import { useState } from "react";

export default function AnnoncesPage() {
  const [annonces, setAnnonces] = useState<any[]>([]);

  const fetchAnnonces = async () => {
    // Simulation (à remplacer par scraping/API)
    setAnnonces([
      { prix: 250000, surface: 60, ville: "Corbeil-Essonnes" },
      { prix: 320000, surface: 80, ville: "Évry" },
    ]);
  };

  return (
    <div>
      <h1>Annonces marché</h1>

      <button onClick={fetchAnnonces}>
        Charger les annonces
      </button>

      {annonces.map((a, i) => (
        <div key={i}>
          {a.prix} € - {a.surface} m² - {a.ville}
        </div>
      ))}
    </div>
  );
}
