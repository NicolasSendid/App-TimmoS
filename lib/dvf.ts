type DVFProperty = {
  surface: number;
};

function estimatePieces(surface: number): number {
  if (surface < 30) return 1;
  if (surface < 45) return 2;
  if (surface < 65) return 3;
  if (surface < 85) return 4;
  if (surface < 110) return 5;
  if (surface < 140) return 6;
  return 7;
}

export function analyseSecteur(dvfList: DVFProperty[]) {
  const types: any = {};

  dvfList.forEach((bien) => {
    const pieces = estimatePieces(bien.surface);
    const key = pieces >= 7 ? "T7+" : `T${pieces}`;

    if (!types[key]) {
      types[key] = {
        count: 0,
        totalSurface: 0,
      };
    }

    types[key].count += 1;
    types[key].totalSurface += bien.surface;
  });

  const result: any = {};

  Object.keys(types).forEach((key) => {
    result[key] = {
      pourcentage: Math.round(
        (types[key].count / dvfList.length) * 100
      ),
      surfaceMoyenne: Math.round(
        types[key].totalSurface / types[key].count
      ),
    };
  });

  return result;
}
