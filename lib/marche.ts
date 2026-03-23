export interface Listing {
  prix: number;
  surface: number;
  date_pub: string;
}

export function analyseMarche(listings: Listing[], surface: number) {
  if (!listings.length) return null;

  const prixM2 = listings.map(l => l.prix / l.surface);
  const moyenne = prixM2.reduce((a, b) => a + b, 0) / prixM2.length;

  return moyenne * surface;
}
