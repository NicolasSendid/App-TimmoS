import { DVFProperty } from "./dvf";

/* ✅ Analyse prix moyen secteur */
export function analyseSecteur(dvfList: DVFProperty[], surface: number) {
  if (!dvfList.length) return null;

  const prixM2 = dvfList.map((p) => p.prix / p.surface);
  const moyenne =
    prixM2.reduce((a, b) => a + b, 0) / prixM2.length;

  return moyenne * surface;
}

/* ✅ Analyse détaillée (T1, T2...) */
export function analyseSecteurDetail(dvfList: DVFProperty[]) {
  if (!dvfList.length) return [];

  const types: any = {};

  dvfList.forEach((bien) => {
    const pieces = bien.pieces || 1;
    const key = pieces >= 7 ? "T7+" : `T${pieces}`;

    if (!types[key]) {
      types[key] = {
        count: 0,
        totalSurface: 0,
      };
    }

    types[key].count++;
    types[key].totalSurface += bien.surface;
  });

  const total = dvfList.length;

  return Object.entries(types).map(([type, data]: any) => ({
    type,
    percentage: Math.round((data.count / total) * 100),
    avgSurface: Math.round(data.totalSurface / data.count),
  }));
}
