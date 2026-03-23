import axios from "axios";

export async function fetchDVF(lat: number, lon: number) {
  const url = `https://api.data.gouv.fr/dvf?lat=${lat}&lon=${lon}`;

  const res = await axios.get(url);
  return res.data;
}
