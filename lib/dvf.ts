// lib/dvf.ts
import axios from "axios";

export interface DVFProperty {
  prix: number;
  surface: number;
  type_local: string;
  date_mutation: string;
  lat: number;
  lon: number;
}

export async function getDVFNearby(lat: number, lon: number, type: string, radius: number = 500): Promise<DVFProperty[]> {
  // Remplacer par API DVF filtrée réelle
  const res = await axios.get(`https://api-dvf.example.com/nearby?lat=${lat}&lon=${lon}&type=${type}&radius=${radius}`);
  return res.data.properties;
}
