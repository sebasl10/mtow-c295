// Source: MTOW_%CG sheet — MTOW limited by gradient 2.4% monomotor, V2=1.23Vsr
// Values are in ×10 kg (multiply by 10 to get kg)
// Columns: [10000, 8000, 6000, 4000, 2000, 1000, 0] ft pressure altitude
// Note: original OAT=0, alt=0 value was 23200 (data entry error) → corrected to 2318

export const CG_OAT_VALUES = [0, 5, 10, 15, 20, 25, 30, 32, 34, 36, 38, 40, 42, 44];
export const CG_ALT_VALUES = [10000, 8000, 6000, 4000, 2000, 1000, 0];

// Indexed as CG_DATA[oat_index][alt_index]
// oat_index: position in CG_OAT_VALUES (0=0°C, ..., 13=44°C)
// alt_index: position in CG_ALT_VALUES (0=10000ft, ..., 6=0ft)
export const CG_TABLE: number[][] = [
  // OAT = 0°C
  [1912, 2078, 2216, 2282, 2316, 2316, 2318],
  // OAT = 5°C
  [1860, 2024, 2186, 2266, 2316, 2316, 2318],
  // OAT = 10°C
  [1808, 1970, 2136, 2250, 2316, 2316, 2318],
  // OAT = 15°C
  [1756, 1912, 2080, 2234, 2300, 2316, 2318],
  // OAT = 20°C
  [1696, 1852, 2016, 2188, 2284, 2316, 2318],
  // OAT = 25°C
  [1634, 1788, 1948, 2120, 2254, 2300, 2318],
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

export function cgTableLookup(oat: number, altFt: number): number {
  const oatIdx = CG_OAT_VALUES.indexOf(oat);
  const altIdx = CG_ALT_VALUES.indexOf(altFt);
  if (oatIdx === -1 || altIdx === -1) return 0;
  return CG_TABLE[oatIdx][altIdx];
}
