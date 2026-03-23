export async function getCadastre(lat: number, lon: number) {
  const res = await fetch(
    `https://apicarto.ign.fr/api/cadastre/parcelle?geom=${lon},${lat}&source=PCI`
  );

  const data = await res.json();

  return data.features?.map((f: any) => ({
    id: f.properties.idu,
    surface: f.properties.contenance,
  })) || [];
}
