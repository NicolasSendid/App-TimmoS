"use client";

import { useState } from "react";

export default function Estimation() {
  const [surface, setSurface] = useState("");
  const [pieces, setPieces] = useState("");

  return (
    <div>
      <h1>Estimation</h1>

      <input
        placeholder="Surface"
        value={surface}
        onChange={(e) => setSurface(e.target.value)}
      />

      <input
        placeholder="Nombre de pièces"
        value={pieces}
        onChange={(e) => setPieces(e.target.value)}
      />

      <button>Estimer</button>
    </div>
  );
}
