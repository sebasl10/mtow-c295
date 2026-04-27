// Values are in ×10 kg. Columns: [10000, 8000, 6000, 4000, 2000, 1000, 0] ft
// oat_index: position in CG_OAT_VALUES (0=0°C … 13=44°C)
// alt_index: position in CG_ALT_VALUES  (0=10000ft … 6=0ft)

export const CG_OAT_VALUES = [0, 5, 10, 15, 20, 25, 30, 32, 34, 36, 38, 40, 42, 44];
export const CG_ALT_VALUES = [10000, 8000, 6000, 4000, 2000, 1000, 0];

// Source: MTOW_%CG — gradient 2.4%, V2=1.23Vsr
// Note: original OAT=0, alt=0 was 23200 (data entry error) → corrected to 2318
export const CG_TABLE: (number | null)[][] = [
  // OAT = 0°C
  [1912, 2078, 2216, 2282, 2320, 2320, 2320],
  // OAT = 5°C
  [1860, 2024, 2186, 2266, 2320, 2320, 2320],
  // OAT = 10°C
  [1808, 1970, 2136, 2250, 2316, 2320, 2320],
  // OAT = 15°C
  [1756, 1912, 2080, 2234, 2300, 2320, 2320],
  // OAT = 20°C
  [1696, 1852, 2016, 2188, 2284, 2316, 2320],
  // OAT = 25°C
  [1634, 1788, 1948, 2120, 2254, 2300, 2320],
  // OAT = 30°C
  [1574, 1722, 1880, 2048, 2218, 2282, 2318],
  // OAT = 32°C
  [1550, 1696, 1852, 2020, 2196, 2276, 2312],
  // OAT = 34°C
  [1526, 1670, 1824, 1990, 2164, 2256, 2306],
  // OAT = 36°C
  [1502, 1644, 1796, 1960, 2132, 2222, 2290],
  // OAT = 38°C
  [1500, 1616, 1766, 1930, 2100, 2188, 2260],
  // OAT = 40°C
  [1409, 1590, 1738, 1898, 2068, 2156, 2232],
  // OAT = 42°C
  [1408, 1550, 1708, 1868, 2034, 2122, 2202],
  // OAT = 44°C
  [1406, 1550, 1680, 1836, 2000, 2086, 2172],
];

// Source: MTOW_%CG_CORTA — gradient 1.7%, V2=1.05Vsr
// null = condition outside aircraft operating envelope
export const CG_TABLE_CORTA: (number | null)[][] = [
  // OAT = 0°C  [10000, 8000, 6000, 4000, 2000, 1000, 0]
  [1844, 2004, 2154, 2234, 2300, 2320, 2320],
  // OAT = 5°C
  [1796, 1954, 2120, 2216, 2284, 2316, 2320],
  // OAT = 10°C
  [1748, 1902, 2066, 2196, 2268, 2300, 2320],
  // OAT = 15°C
  [1700, 1848, 2010, 2170, 2252, 2284, 2316],
  // OAT = 20°C
  [1642, 1792, 1950, 2120, 2236, 2267, 2302],
  // OAT = 25°C
  [1586, 1732, 1886, 2054, 2196, 2248, 2286],
  // OAT = 30°C
  [1528, 1672, 1822, 1984, 2150, 2218, 2268],
  // OAT = 32°C
  [1506, 1646, 1796, 1958, 2128, 2206, 2260],
  // OAT = 34°C
  [1484, 1622, 1770, 1930, 2098, 2186, 2254],
  // OAT = 36°C
  [1461, 1598, 1744, 1902, 2068, 2154, 2236],
  // OAT = 38°C
  [1460, 1572, 1716, 1874, 2038, 2124, 2204],
  // OAT = 40°C
  [1459, 1548, 1690, 1844, 2008, 2093, 2176],
  // OAT = 42°C
  [1458, 1547, 1662, 1814, 1978, 2062, 2144],
  // OAT = 44°C
  [1457, 1546, 1636, 1786, 1944, 2028, 2114],
];

function lookupCell(
  table: (number | null)[][],
  oat: number,
  altFt: number,
): number | null {
  const oatIdx = CG_OAT_VALUES.indexOf(oat);
  const altIdx = CG_ALT_VALUES.indexOf(altFt);
  if (oatIdx === -1 || altIdx === -1) return null;
  return table[oatIdx][altIdx];
}

// When a corner is null, expand outward to find the nearest non-null value
// at the same altitude column (scanning adjacent OAT rows).
function lookupCellSafe(
  table: (number | null)[][],
  oat: number,
  altFt: number,
): number {
  const direct = lookupCell(table, oat, altFt);
  if (direct !== null) return direct;

  const altIdx = CG_ALT_VALUES.indexOf(altFt);
  if (altIdx === -1) return 0;

  const oatIdx = CG_OAT_VALUES.indexOf(oat);
  // Scan outward from oatIdx in both directions
  for (let delta = 1; delta < CG_OAT_VALUES.length; delta++) {
    const idxUp = oatIdx - delta;
    const idxDn = oatIdx + delta;
    if (idxUp >= 0 && table[idxUp][altIdx] !== null) return table[idxUp][altIdx]!;
    if (idxDn < CG_OAT_VALUES.length && table[idxDn][altIdx] !== null) return table[idxDn][altIdx]!;
  }
  return 0;
}

export function cgTableLookup(oat: number, altFt: number): number {
  return lookupCellSafe(CG_TABLE, oat, altFt);
}

export function cgTableLookupCorta(oat: number, altFt: number): number {
  return lookupCellSafe(CG_TABLE_CORTA, oat, altFt);
}
