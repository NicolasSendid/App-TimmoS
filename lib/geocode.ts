import axios from "axios";

export async function geocodeAddress(address: string) {
  const res = await axios.get(
    `https://api-adresse.data.gouv.fr/search/?q=${address}`
  );

  return res.data.features[0].geometry.coordinates;
}
