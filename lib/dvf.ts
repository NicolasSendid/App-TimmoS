export interface DVFProperty {
  prix: number;
  surface: number;
  type_local: string;
  date_mutation: string;
  lat: number;
  lon: number;
}

export async function getDVFNearby(lat: number, lon: number, type: string): Promise<DVFProperty[]> {
  // Simulation propre (évite crash)
  return [
    { prix: 250000, surface: 70, type_local: type, date_mutation: "2024-01-01", lat, lon },
    { prix: 270000, surface: 75, type_local: type, date_mutation: "2023-12-01", lat, lon },
    { prix: 260000, surface: 72, type_local: type, date_mutation: "2023-10-01", lat, lon }
  ];
}
