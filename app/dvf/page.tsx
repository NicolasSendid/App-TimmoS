"use client";

import { useState } from "react";
import { fetchDVF } from "@/lib/dvf";

export default function DVFPage() {
  const [data, setData] = useState<any[]>([]);

  const loadData = async () => {
    const res = await fetchDVF(48.6, 2.45);
    setData(res.slice(0, 10)); // limiter affichage
  };

  return (
    <div>
      <h1>Transactions DVF</h1>

      <button onClick={loadData}>
        Charger les ventes
      </button>

      {data.map((item, i) => (
        <div key={i} className="border p-2 my-2">
          <p>Prix : {item.valeur_fonciere} €</p>
          <p>Surface : {item.surface_reelle_bati} m²</p>
        </div>
      ))}
    </div>
  );
}
