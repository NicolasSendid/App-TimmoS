type DVFProperty = {
  lat: number;
  lon: number;
  prix: number;
  surface: number;
};

function distance(a: any, b: any) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;

  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(lat1) *
      Math.cos(lat2);

  const d = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

  return R * d * 1000; // en mètres
}

export function estimatePrice(
  target: { lat: number; lon: number; surface: number },
  dvfList: DVFProperty[]
) {
  // 1. Filtre distance (500m)
  const nearby = dvfList.filter(
    (p) => distance(target, p) < 500
  );

  if (!nearby.length) return null;

  // 2. Prix au m²
  const prixM2 = nearby.map((p) => p.prix / p.surface);

  // 3. Suppression extrêmes (outliers)
  const sorted = prixM2.sort((a, b) => a - b);

  const trimmed = sorted.slice(
    Math.floor(sorted.length * 0.1),
    Math.ceil(sorted.length * 0.9)
  );

  // 4. Moyenne
  const avg =
    trimmed.reduce((a, b) => a + b, 0) / trimmed.length;

  // 5. Fourchette
  return {
    bas: Math.round(avg * 0.9 * target.surface),
    median: Math.round(avg * target.surface),
    haut: Math.round(avg * 1.1 * target.surface),
    prixM2: Math.round(avg),
    comparables: nearby.length,
  };
}
