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
    const url = `https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`;

    const geo = await axios.get(url);
    const city = geo.data.features[0]?.properties?.city;

    if (!city) return [];

    const dvfUrl = `https://public.opendatasoft.com/api/records/1.0/search/?dataset=valeursfoncieres-2020&rows=100&refine.nom_commune=${city}`;

    const res = await axios.get(dvfUrl);

    const records = res.data.records;

    return records
      .filter((r: any) => r.fields.valeur_fonciere && r.fields.surface_reelle_bati)
      .map((r: any) => ({
        lat: r.fields.latitude,
        lon: r.fields.longitude,
        prix: r.fields.valeur_fonciere,
        surface: r.fields.surface_reelle_bati,
        type: r.fields.type_local,
        date: r.fields.date_mutation,
      }))
      .filter((p: DVFProperty) => p.lat && p.lon);

  } catch (e) {
    console.error(e);
    return [];
  }
}
