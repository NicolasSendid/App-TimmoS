import { DVFProperty } from "./dvf";

export function analyseSecteurDetail(dvfList: DVFProperty[]) {
  if (!dvfList.length) return null;

  const types: any = {};

  dvfList.forEach((b) => {
    const key = b.pieces >= 7 ? "T7+" : `T${b.pieces}`;

    if (!types[key]) {
      types[key] = {
        count: 0,
        totalSurface: 0,
      };
    }

    types[key].count++;
    types[key].totalSurface += b.surface;
  });

  const total = dvfList.length;

  return Object.entries(types).map(([type, data]: any) => ({
    type,
    percentage: Math.round((data.count / total) * 100),
    avgSurface: Math.round(data.totalSurface / data.count),
  }));
}
