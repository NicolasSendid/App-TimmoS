"use client";

import { useState } from "react";
import { geocodeAddress } from "@/lib/geocode";
import { getDVFNearby, DVFProperty } from "@/lib/dvf";
import { analyseSecteur } from "@/lib/secteur";
import { analyseMarche, Listing } from "@/lib/marche";

export default function EstimationPage() {
  const [address, setAddress] = useState("");
  const [type, setType] = useState("appartement");
  const [surface, setSurface] = useState(70);
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Fonction qui combine les trois piliers pour calculer le prix final
  const calculEstimation = (dvf: number | null, secteur: number | null, marche: number | null) => {
    const valeurs = [dvf ?? 0, secteur ?? 0, marche ?? 0];
    const poids = [0.5, 0.3, 0.2];
    const estimation = valeurs.reduce((acc, v, i) => acc + v * poids[i], 0);
    return Math.round(estimation / 1000) * 1000; // arrondi au millier
  };

  const handleEstimate = async () => {
    if (!address) {
      alert("Veuillez saisir une adresse complète");
      return;
    }

    setLoading(true);
    try {
      // 1️⃣ Géocodage de l’adresse
      const { lat, lon } = await geocodeAddress(address);

      // 2️⃣ Comparables DVF autour du bien
      const dvf: DVFProperty[] = await getDVFNearby(lat, lon, type);

      // 3️⃣ Analyse secteur
      const secteur = analyseSecteur(dvf, surface);

      // 4️⃣ Analyse marché actuel (exemple fictif)
      const listings: Listing[] = [
        { prix: 250000, surface: 70, date_pub: "2026-03-01" },
        { prix: 270000, surface: 70, date_pub: "2026-03-10" },
      ];
      const marche = analyseMarche(listings, surface);

      // 5️⃣ Calcul estimation finale
      let dvfPrix: number | null = null;
      if (dvf.length) {
        dvfPrix = dvf.reduce((acc, p) => acc + p.prix, 0) / dvf.length; // moyenne DVF
      }

      const estimation = calculEstimation(dvfPrix, secteur, marche);

      setResult(estimation);

    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'estimation. Vérifiez l'adresse et réessayez.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem", background: "#fff", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>Estimation intelligente</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Adresse complète"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <input
          type="number"
          placeholder="Surface m²"
          value={surface}
          onChange={(e) => setSurface(Number(e.target.value))}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}>
          <option value="appartement">Appartement</option>
          <option value="maison">Maison</option>
        </select>
        <button onClick={handleEstimate} style={{ width: "100%", padding: "0.75rem", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          {loading ? "Analyse en cours..." : "Estimer le bien"}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: "1.5rem", textAlign: "center", padding: "1rem", background: "#f0f0f0", borderRadius: "4px" }}>
          <h2>Estimation : {result.toLocaleString()} €</h2>
          <p>Basée sur DVF, secteur et marché actuel</p>
        </div>
      )}
    </div>
  );
}
