"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { geocodeAddress } from "@/lib/geocode";
import { getDVFNearby, DVFProperty } from "@/lib/dvf";
import { analyseSecteur, analyseSecteurDetail } from "@/lib/secteur";
import { analyseMarche, Listing } from "@/lib/marche";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

/* SCORING */
function scoring(
  dvf: number | null,
  secteur: number | null,
  marche: number | null
) {
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
  const [secteurData, setSecteurData] = useState<any[]>([]);

  const handleEstimate = async () => {
    if (!address || surface <= 0) {
      alert("Merci de renseigner une adresse et une surface valide");
      return;
    }

    try {
      /* 1️⃣ Géocodage */
      const { lat, lon } = await geocodeAddress(address);
      setCenter([lat, lon]);

      /* 2️⃣ DVF */
      const dvf: DVFProperty[] = await getDVFNearby(lat, lon, type);

      /* 3️⃣ Markers carte */
      const mapMarkers = dvf.map((p) => ({
        lat: p.lat,
        lon: p.lon,
        price: p.prix,
        surface: p.surface,
      }));
      setMarkers(mapMarkers);

      /* 4️⃣ Analyse secteur */
      const secteur = analyseSecteur(dvf, surface);
      const secteurDetail = analyseSecteurDetail(dvf);
      setSecteurData(secteurDetail);

      /* 5️⃣ Marché actuel */
      const listings: Listing[] = [
        { prix: 250000, surface: 70, date_pub: "2026-03-01" },
        { prix: 270000, surface: 70, date_pub: "2026-03-10" },
      ];
      const marche = analyseMarche(listings, surface);

      /* 6️⃣ DVF prix réel */
      let dvfPrix: number | null = null;

      if (dvf.length) {
        const prixM2 = dvf.map((p) => p.prix / p.surface);
        const moyenneM2 =
          prixM2.reduce((a, b) => a + b, 0) / prixM2.length;

        dvfPrix = moyenneM2 * surface;
      }

      /* 7️⃣ Estimation finale */
      const estimation =
        (dvfPrix ?? 0) * 0.5 +
        (secteur ?? 0) * 0.3 +
        (marche ?? 0) * 0.2;

      setResult(Math.round(estimation / 1000) * 1000);

      /* 8️⃣ Score */
      setScore(scoring(dvfPrix, secteur, marche));

    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'estimation");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto" }}>
      <h1>Estimation immobilière</h1>

      {/* FORMULAIRE */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Adresse complète"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="number"
          placeholder="Surface (m²)"
          value={surface}
          onChange={(e) => setSurface(Number(e.target.value))}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        >
          <option value="appartement">Appartement</option>
          <option value="maison">Maison</option>
        </select>

        <button
          onClick={handleEstimate}
          style={{
            width: "100%",
            padding: "12px",
            background: "#2ecc71",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Estimer le bien
        </button>
      </div>

      {/* RESULTAT */}
      {result && (
        <>
          <h2>{result.toLocaleString()} €</h2>

          <p>
            {score === 0 && "Opportunité 📉"}
            {score === 1 && "Marché équilibré ⚖️"}
            {score === 2 && "Marché vendeur 📈"}
          </p>

          {/* ANALYSE SECTEUR */}
          {secteurData.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h3>Analyse du secteur</h3>

              {secteurData.map((s, i) => (
                <div key={i}>
                  <strong>{s.type}</strong> : {s.percentage}% —{" "}
                  {s.avgSurface} m² moyen
                </div>
              ))}
            </div>
          )}

          {/* CARTE */}
          {center && (
            <>
              <h3>Biens vendus autour</h3>
              <Map center={center} markers={markers} />
            </>
          )}
        </>
      )}
    </div>
  );
}
