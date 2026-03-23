"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { geocodeAddress } from "@/lib/geocode";
import { getDVFNearby, DVFProperty } from "@/lib/dvf";
import { analyseSecteur, analyseSecteurDetail } from "@/lib/secteur";
import { analyseMarche, Listing } from "@/lib/marche";
import { getCitiesFromZip } from "@/lib/geo";
import { getCadastre } from "@/lib/cadastre";

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
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [cities, setCities] = useState<string[]>([]);

  const [surface, setSurface] = useState(70);
  const [type, setType] = useState("appartement");

  const [result, setResult] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [secteurData, setSecteurData] = useState<any[]>([]);
  const [parcelles, setParcelles] = useState<any[]>([]);

  /* ZIP → villes */
  const handleZipChange = async (value: string) => {
    setZip(value);

    if (value.length === 5) {
      const result = await getCitiesFromZip(value);
      setCities(result);
    }
  };

  const handleEstimate = async () => {
    if (!address || !zip || !city || surface <= 0) {
      alert("Merci de remplir tous les champs");
      return;
    }

    try {
      /* 1️⃣ Adresse complète */
      const fullAddress = `${address}, ${zip} ${city}`;

      /* 2️⃣ Géocodage */
      const { lat, lon } = await geocodeAddress(fullAddress);
      setCenter([lat, lon]);

      /* 3️⃣ DVF */
      const dvf: DVFProperty[] = await getDVFNearby(lat, lon, type);

      /* 4️⃣ Prix moyen */
      let dvfPrix: number | null = null;

      if (dvf.length) {
        const prixM2 = dvf.map((p) => p.prix / p.surface);
        const moyenneM2 =
          prixM2.reduce((a, b) => a + b, 0) / prixM2.length;

        dvfPrix = moyenneM2 * surface;
      }

      /* 5️⃣ Markers carte */
      const moyenne = dvfPrix || 1;

      const mapMarkers = dvf.map((p) => ({
        lat: p.lat,
        lon: p.lon,
        price: p.prix,
        surface: p.surface,
        avg: moyenne,
      }));

      setMarkers(mapMarkers);

      /* 6️⃣ Analyse secteur */
      const secteur = analyseSecteur(dvf, surface);
      const secteurDetail = analyseSecteurDetail(dvf);
      setSecteurData(secteurDetail);

      /* 7️⃣ Marché */
      const listings: Listing[] = [
        { prix: 250000, surface: 70, date_pub: "2026-03-01" },
        { prix: 270000, surface: 70, date_pub: "2026-03-10" },
      ];

      const marche = analyseMarche(listings, surface);

      /* 8️⃣ Estimation */
      const estimation =
        (dvfPrix ?? 0) * 0.5 +
        (secteur ?? 0) * 0.3 +
        (marche ?? 0) * 0.2;

      setResult(Math.round(estimation / 1000) * 1000);

      /* 9️⃣ Score */
      setScore(scoring(dvfPrix, secteur, marche));

      /* 🔟 Cadastre */
      const parcellesData = await getCadastre(lat, lon);
      setParcelles(parcellesData);

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
          placeholder="Adresse (ex: 10 rue Victor Hugo)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          placeholder="Code postal"
          value={zip}
          onChange={(e) => handleZipChange(e.target.value)}
        />

        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Choisir une ville</option>
          {cities.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Surface"
          value={surface}
          onChange={(e) => setSurface(Number(e.target.value))}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="appartement">Appartement</option>
          <option value="maison">Maison</option>
        </select>

        <button onClick={handleEstimate}>Estimer</button>
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
            <div>
              <h3>Analyse du secteur</h3>
              {secteurData.map((s, i) => (
                <div key={i}>
                  {s.type} : {s.percentage}% — {s.avgSurface} m²
                </div>
              ))}
            </div>
          )}

          {/* CADASTRE */}
          {parcelles.length > 0 && (
            <div>
              <h3>Parcelles cadastrales</h3>
              {parcelles.map((p, i) => (
                <div key={i}>
                  {p.id} — {p.surface} m²
                </div>
              ))}
            </div>
          )}

          {/* CARTE */}
          {center && <Map center={center} markers={markers} />}
        </>
      )}
    </div>
  );
}
