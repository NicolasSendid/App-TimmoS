"use client";

import { useState } from "react";
import axios from "axios";

export default function DVFPage() {
  const [data, setData] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const res = await axios.get(
        "https://api-adresse.data.gouv.fr/search/?q=Corbeil"
      );

      setData(res.data.features.slice(0, 5));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <h1>Transactions DVF</h1>

      <button onClick={loadData}>
        Charger données
      </button>

      {data.map((item, i) => (
        <div key={i} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <p>{item.properties.label}</p>
        </div>
      ))}
    </div>
  );
}
