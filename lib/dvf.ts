export interface DVFProperty {
  prix: number;
  surface: number;
  type_local: string;
  lat: number;
  lon: number;
  pieces: number;
}

export async function getDVFNearby(lat: number, lon: number, type: string) {
  // Simulation réaliste autour du point
  return Array.from({ length: 12 }).map(() => {
    const surface = Math.floor(Math.random() * 60) + 40;
    const prixM2 = 3000 + Math.random() * 1500;

    return {
      prix: Math.round(surface * prixM2),
      surface,
      type_local: type,
      lat: lat + (Math.random() - 0.5) / 100,
      lon: lon + (Math.random() - 0.5) / 100,
      pieces: Math.floor(surface / 20),
    };
  });
}
