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

function scoring(dvf: number | null, secteur: number | null, marche: number | null) {
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

  const handleZipChange = async (value: string) => {
    setZip(value);
    if (value.length === 5) {
      const result = await getCitiesFromZip(value);
      setCities(result);
    }
  };

  const handleEstimate = async () => {
    try {
      const fullAddress = `${address}, ${zip} ${city}`;

      const { lat, lon } = await geocodeAddress(fullAddress);
      setCenter([lat, lon]);

      const dvf: DVFProperty[] = await getDVFNearby(lat, lon, type);

      let dvfPrix: number | null = null;

      if (dvf.length) {
        const prixM2 = dvf.map((p) => p.prix / p.surface);
        const moyenneM2 =
          prixM2.reduce((a, b) => a + b, 0) / prixM2.length;

        dvfPrix = moyenneM2 * surface;
      }

      const moyenne = dvfPrix || 1;

      setMarkers(
        dvf.map((p) => ({
          lat: p.lat,
          lon: p.lon,
          price: p.prix,
          surface: p.surface,
          avg: moyenne,
        }))
      );

      const secteur = analyseSecteur(dvf, surface);
      setSecteurData(analyseSecteurDetail(dvf));

      const listings: Listing[] = [
        { prix: 250000, surface: 70, date_pub: "2026-03-01" },
      ];

      const marche = analyseMarche(listings, surface);

      const estimation =
        (dvfPrix ?? 0) * 0.5 +
        (secteur ?? 0) * 0.3 +
        (marche ?? 0) * 0.2;

      setResult(Math.round(estimation / 1000) * 1000);
      setScore(scoring(dvfPrix, secteur, marche));

      /* CADASTRE */
      const cadastre = await getCadastre(lat, lon);
      setParcelles(cadastre);

    } catch (e) {
      alert("Erreur estimation");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto" }}>
      <h1>Estimation immobilière</h1>

      <input placeholder="Adresse" value={address} onChange={(e) => setAddress(e.target.value)} />
      <input placeholder="Code postal" value={zip} onChange={(e) => handleZipChange(e.target.value)} />

      <select value={city} onChange={(e) => setCity(e.target.value)}>
        <option>Ville</option>
        {cities.map((c, i) => (
          <option key={i}>{c}</option>
        ))}
      </select>

      <input type="number" value={surface} onChange={(e) => setSurface(Number(e.target.value))} />

      <button onClick={handleEstimate}>Estimer</button>

      {result && (
        <>
          <h2>{result.toLocaleString()} €</h2>

          <Map center={center!} markers={markers} parcelles={parcelles} />
        </>
      )}
    </div>
  );
}
