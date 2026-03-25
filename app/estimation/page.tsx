"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import { geocodeAddress } from "@/lib/geocode";
import { getDVFNearby, DVFProperty } from "@/lib/dvf";
import { getCitiesFromZip } from "@/lib/geo";
import { getCadastre } from "@/lib/cadastre";
import PropertyForm from "@/components/PropertyForm";
import { generatePDF } from "@/lib/pdf";
import { estimatePrice } from "@/lib/estimation";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

export default function EstimationPage() {
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [cities, setCities] = useState<string[]>([]);

  const [surface, setSurface] = useState(70);
  const [type, setType] = useState("Appartement");

  const [result, setResult] = useState<number | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [parcelles, setParcelles] = useState<any[]>([]);
  const [selectedParcelle, setSelectedParcelle] = useState<any>(null);

  const [property, setProperty] = useState<any>(null);

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

    // 🔥 NOUVEAU MOTEUR
    const estimation = estimatePrice(
      { lat, lon, surface },
      dvf
    );

    if (!estimation) {
      alert("Pas assez de données");
      return;
    }

    setResult(estimation.median);

    setMarkers(
      dvf.map((p) => ({
        lat: p.lat,
        lon: p.lon,
        price: p.prix,
        surface: p.surface,
        type: p.type,
        date: p.date,
      }))
    );

    const cadastre = await getCadastre(lat, lon);
    setParcelles(cadastre);

  } catch {
    alert("Erreur estimation");
  }
};

  return (
    <div style={{ maxWidth: 900, margin: "auto" }}>
      <h1>Estimation immobilière</h1>

      <input
        placeholder="Adresse"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <input
        placeholder="Code postal"
        value={zip}
        onChange={(e) => handleZipChange(e.target.value)}
      />

      <select value={city} onChange={(e) => setCity(e.target.value)}>
        <option>Ville</option>
        {cities.map((c, i) => (
          <option key={i}>{c}</option>
        ))}
      </select>

      <PropertyForm onSubmit={setProperty} />

      <button onClick={handleEstimate}>
        Lancer estimation
      </button>

      {result && (
  <>
    <h2>Estimation</h2>

    <p>Bas : {Math.round(result * 0.9).toLocaleString()} €</p>
    <p>Médian : {result.toLocaleString()} €</p>
    <p>Haut : {Math.round(result * 1.1).toLocaleString()} €</p>
  </>
)}

          <button
            onClick={() =>
              generatePDF({
                title: "Estimation",
                price: result,
                address: `${address}, ${zip} ${city}`,
                surface,
                type,
                score: 2,
              })
            }
          >
            Générer PDF premium
          </button>
        </>
      )}

      {center && (
        <Map
          center={center}
          markers={markers}
          parcelles={parcelles}
          selectedParcelle={selectedParcelle}
          onSelectParcelle={setSelectedParcelle}
        />
      )}
    </div>
  );
}
