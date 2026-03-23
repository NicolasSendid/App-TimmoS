"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { geocodeAddress } from "@/lib/geocode";
import { getDVFNearby, DVFProperty } from "@/lib/dvf";
import { analyseSecteur } from "@/lib/secteur";
import { analyseMarche, Listing } from "@/lib/marche";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

/* SCORING */
function scoring(dvf: number | null, secteur: number | null, marche: number | null) {
  if (!dvf) return null;

  let score = 0;
  if (secteur && dvf > secteur) score++;
  if (marche && dvf > marche) score++;

  return score;
}

export default function EstimationPage() {
  const [address, setAddress] = useState("");
  const [surface, setSurface] = useState(70);
  const [type, setType] = useState("appartement");

  const [result, setResult] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [center, setCenter] = useState<[number, number] | null>(null);

  const handleEstimate = async () => {
    try {
      const { lat, lon } = await geocodeAddress(address);
      setCenter([lat, lon]);

      const dvf: DVFProperty[] = await getDVFNearby(lat, lon, type);

      /* markers carte */
      const mapMarkers = dvf.map((p) => ({
        lat: p.lat,
        lon: p.lon,
        price: p.prix,
        surface: p.surface,
      }));
      setMarkers(mapMarkers);

      /* secteur */
      const secteur = analyseSecteur(dvf, surface);

      /* marché */
      const listings: Listing[] = [
        { prix: 250000, surface: 70, date_pub: "2026-03-01" },
        { prix: 270000, surface: 70, date_pub: "2026-03-10" },
      ];
      const marche = analyseMarche(listings, surface);

      /* DVF calcul */
      let dvfPrix: number | null = null;

      if (dvf.length) {
        const prixM2 = dvf.map((p) => p.prix / p.surface);
        const moyenneM2 =
          prixM2.reduce((a, b) => a + b, 0) / prixM2.length;

        dvfPrix = moyenneM2 * surface;
      }

      /* estimation */
      const estimation =
        (dvfPrix ?? 0) * 0.5 +
        (secteur ?? 0) * 0.3 +
        (marche ?? 0) * 0.2;

      setResult(Math.round(estimation / 1000) * 1000);
      setScore(scoring(dvfPrix, secteur, marche));

    } catch (e) {
      alert("Erreur lors de l'estimation");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto" }}>
      <h1>Estimation immobilière</h1>

      <input
        placeholder="Adresse"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <input
        type="number"
        value={surface}
        onChange={(e) => setSurface(Number(e.target.value))}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="appartement">Appartement</option>
        <option value="maison">Maison</option>
      </select>

      <button onClick={handleEstimate}>Estimer</button>

      {result && (
        <>
          <h2>{result.toLocaleString()} €</h2>

          <p>
            {score === 0 && "Opportunité 📉"}
            {score === 1 && "Marché équilibré ⚖️"}
            {score === 2 && "Marché vendeur 📈"}
          </p>

          {/* CARTE */}
          {center && (
            <Map center={center} markers={markers} />
          )}
        </>
      )}
    </div>
  );
}
