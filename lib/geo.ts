export async function getCitiesFromZip(zip: string) {
  if (zip.length < 5) return [];

  const res = await fetch(
    `https://geo.api.gouv.fr/communes?codePostal=${zip}`
  );

  const data = await res.json();

  return data.map((c: any) => c.nom);
}
