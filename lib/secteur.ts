import { DVFProperty } from "./dvf";

export function analyseSecteur(dvfList: DVFProperty[], surface: number) {
  if (!dvfList.length) return null;

  const prixM2 = dvfList.map(p => p.prix / p.surface);
  const moyenne = prixM2.reduce((a, b) => a + b, 0) / prixM2.length;

  return moyenne * surface;
}
