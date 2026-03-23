"use client";

import { useState } from "react";
import axios from "axios";

export default function Estimation() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleEstimation = async () => {
    try {
      // 1. Géocodage
      const geo = await axios.get(
        `https://api-adresse.data.gouv.fr/search/?q=${address}`
      );

      const coords = geo.data.features[0].geometry.coordinates;
      const lon = coords[0];
      const lat = coords[1];

      // 2. Simulation DVF (à remplacer par vraie base plus tard)
      const prixM2 = 3500;

      const estimation = prixM2 * 70; // base temporaire

      setResult({
        lat,
        lon,
        estimation,
      });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Estimation par adresse</h1>

      <input
        placeholder="Adresse complète"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button onClick={handleEstimation}>
        Analyser le bien
      </button>

      {result && (
        <div>
          <p>Latitude : {result.lat}</p>
          <p>Longitude : {result.lon}</p>
          <h2>Estimation : {result.estimation} €</h2>
        </div>
      )}
    </div>
  );
}
