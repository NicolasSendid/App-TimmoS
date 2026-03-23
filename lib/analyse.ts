import axios from "axios";

export async function getDVFNearby(lat: number, lon: number) {
  const res = await axios.get(
    `https://api-adresse.data.gouv.fr/search/?q=${lat},${lon}`
  );

  return res.data;
}
