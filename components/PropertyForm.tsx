"use client";

import { useState } from "react";

type Props = {
  onSubmit: (data: any) => void;
};

export default function PropertyForm({ onSubmit }: Props) {
  const [form, setForm] = useState<any>({
    type: "Appartement",
    surface: 0,
    pieces: 0,
    chambres: 0,
    sdb: 0,
    exposition: "",
    chauffage: "",
    vitrage: "",
    etat: "",
  });

  const update = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <div style={{ padding: 20, background: "#f5f5f5", borderRadius: 10 }}>
      <h2>Détail du bien</h2>

      <select onChange={(e) => update("type", e.target.value)}>
        <option>Appartement</option>
        <option>Maison</option>
        <option>Immeuble</option>
        <option>Terrain</option>
        <option>Hotel Particulier</option>
      </select>

      <input
        type="number"
        placeholder="Surface"
        onChange={(e) => update("surface", Number(e.target.value))}
      />

      <input
        type="number"
        placeholder="Nombre de pièces"
        onChange={(e) => update("pieces", Number(e.target.value))}
      />

      <input
        type="number"
        placeholder="Chambres"
        onChange={(e) => update("chambres", Number(e.target.value))}
      />

      <input
        type="number"
        placeholder="Salles de bain / douche"
        onChange={(e) => update("sdb", Number(e.target.value))}
      />

      <select onChange={(e) => update("etat", e.target.value)}>
        <option>Neuf</option>
        <option>Très bon état</option>
        <option>Bon état</option>
        <option>À rafraîchir</option>
        <option>À rénover</option>
      </select>

      <select onChange={(e) => update("exposition", e.target.value)}>
        <option>Sud</option>
        <option>Sud-Ouest</option>
        <option>Sud-Est</option>
        <option>Nord</option>
        <option>Est</option>
        <option>Ouest</option>
      </select>

      <select onChange={(e) => update("chauffage", e.target.value)}>
        <option>Individuel</option>
        <option>Collectif</option>
        <option>Électrique</option>
        <option>Gaz</option>
        <option>Pompe à chaleur</option>
      </select>

      <select onChange={(e) => update("vitrage", e.target.value)}>
        <option>Simple vitrage</option>
        <option>Double vitrage</option>
        <option>Triple vitrage</option>
      </select>

      <button onClick={() => onSubmit(form)}>
        Valider le bien
      </button>
    </div>
  );
}
