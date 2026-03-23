"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { geocodeAddress } from "@/lib/geocode";
import { getDVFNearby, DVFProperty } from "@/lib/dvf";
import { analyseSecteur } from "@/lib/secteur";
import { analyseMarche, Listing } from "@/lib/marche";

/* -------------------- SCORING -------------------- */
function scoring(
  dvf: number | null,
  secteur: number | null,
  marche: number | null
) {
  if (!dvf) return null;

  let score = 0;

  if (secteur && dvf > secteur) score += 1;
  if (marche && dvf > marche) score += 1;

  return score;
}

/* -------------------- PAGE -------------------- */
export default function EstimationPage() {
  const [address, setAddress] = useState("");
  const [type, setType] = useState("appartement");
  const [surface, setSurface] = useState(70);

  const [result, setResult] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  /* -------------------- CALCUL FINAL -------------------- */
  const calculEstimation = (
    dvf: number | null,
    secteur: number | null,
    marche: number | null
  ) => {
    const valeurs = [dvf ?? 0, secteur ?? 0, marche ?? 0];
    const poids = [0.5, 0.3, 0.2];

    const estimation = valeurs.reduce((acc, v, i) => acc + v * poids[i], 0);

    return Math.round(estimation / 1000) * 1000;
  };

  /* -------------------- ESTIMATION -------------------- */
  const handleEstimate = async () => {
    if (!address) {
      alert("Veuillez saisir une adresse");
      return;
    }

    setLoading(true);

    try {
      /* 1️⃣ Géocodage */
      const { lat, lon } = await geocodeAddress(address);

      /* 2️⃣ DVF */
      const dvf: DVFProperty[] = await getDVFNearby(lat, lon, type);

      /* 3️⃣ Analyse secteur */
      const secteur = analyseSecteur(dvf, surface);

      /* 4️⃣ Marché actuel */
      const listings: Listing[] = [
        { prix: 250000, surface: 70, date_pub: "2026-03-01" },
        { prix: 270000, surface: 70, date_pub: "2026-03-10" },
      ];

      const marche = analyseMarche(listings, surface);

      /* 5️⃣ Calcul DVF moyen */
      let dvfPrix: number | null = null;

      if (dvf.length) {
        const prixM2 = dvf.map((p) => p.prix / p.surface);
        const moyenneM2 =
          prixM2.reduce((a, b) => a + b, 0) / prixM2.length;

        dvfPrix = moyenneM2 * surface;
      }

      /* 6️⃣ Estimation finale */
      const estimation = calculEstimation(dvfPrix, secteur, marche);

      /* 7️⃣ Score */
      const s = scoring(dvfPrix, secteur, marche);

      setResult(estimation);
      setScore(s);

    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'estimation");
    }

    setLoading(false);
  };

  /* -------------------- UI -------------------- */
  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem" }}>
      <h1>Estimation immobilière intelligente</h1>

      <input
        type="text"
        placeholder="Adresse complète"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input
        type="number"
        placeholder="Surface (m²)"
        value={surface}
        onChange={(e) => setSurface(Number(e.target.value))}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      >
        <option value="appartement">Appartement</option>
        <option value="maison">Maison</option>
      </select>

      <button
        onClick={handleEstimate}
        style={{
          width: "100%",
          padding: "10px",
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Analyse en cours..." : "Estimer le bien"}
      </button>

      {/* -------------------- RESULTATS -------------------- */}
      {result && (
        <div style={{ marginTop: "20px", padding: "15px", background: "#f5f5f5" }}>
          <h2>Estimation</h2>
          <h3>{result.toLocaleString()} €</h3>

          <p>
            {result > 300000
              ? "Marché tendu 📈"
              : "Marché favorable à l'achat 📉"}
          </p>

          {/* SCORE */}
          <p>
            Score de marché :{" "}
            {score === 0 && "Opportunité d'achat 📉"}
            {score === 1 && "Marché équilibré ⚖️"}
            {score === 2 && "Marché vendeur 📈"}
          </p>
        </div>
      )}
    </div>
  );
}
