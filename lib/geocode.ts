import axios from "axios";

export async function geocodeAddress(address: string) {
  const res = await axios.get(
    `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}`
  );

  if (!res.data.features || res.data.features.length === 0) {
    throw new Error("Adresse introuvable");
  }

  const [lon, lat] = res.data.features[0].geometry.coordinates;

  return { lat, lon };
}
