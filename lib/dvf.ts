import axios from "axios";

export type DVFProperty = {
  lat: number;
  lon: number;
  prix: number;
  surface: number;
  type: string;
  date: string;
};

export async function getDVFNearby(
  lat: number,
  lon: number,
  typeBien: string
): Promise<DVFProperty[]> {
  try {
    // 1. Récupération de la ville via coordonnées
    const geo = await axios.get(
      `https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`
    );

    const city = geo.data.features[0]?.properties?.city;

    if (!city) return [];

    // 2. Appel DVF
    const res = await axios.get(
      `https://public.opendatasoft.com/api/records/1.0/search/?dataset=valeursfoncieres-2020&rows=100&refine.nom_commune=${city}`
    );

    const records = res.data.records;

    // 3. Formatage propre
    return records
      .filter(
        (r: any) =>
          r.fields.valeur_fonciere &&
          r.fields.surface_reelle_bati &&
          r.fields.latitude &&
          r.fields.longitude
      )
      .map((r: any) => ({
        lat: r.fields.latitude,
        lon: r.fields.longitude,
        prix: r.fields.valeur_fonciere,
        surface: r.fields.surface_reelle_bati,
        type: r.fields.type_local,
        date: r.fields.date_mutation,
      }));

  } catch (error) {
    console.error("Erreur DVF :", error);
    return [];
  }
}
