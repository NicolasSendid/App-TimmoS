"use client";

import { useState } from "react";
import { fetchDVF } from "@/lib/dvf";

export default function DVFPage() {
  const [data, setData] = useState<any[]>([]);

  const loadData = async () => {
    const res = await fetchDVF(48.6, 2.45);
    setData(res);
  };

  return (
    <div>
      <h1>DVF</h1>
      <button onClick={loadData}>Charger les ventes</button>

      {data.map((item, i) => (
        <div key={i}>
          {item.valeur_fonciere} €
        </div>
      ))}
    </div>
  );
}
