export interface PerfRow {
  altitudeFt: number;
  oat: number;
  mtow10kg: number;
  gradient: number;
  runwayFt: number;
}

// Source: TABLA_C2 sheet — C295 FAR-25 normal takeoff, flaps 10°, V2=1.23Vsr, bleeds OFF
export const PERF_TABLE: PerfRow[] = [
  // Altitude 0 ft
  { altitudeFt: 0,     oat: 0,  mtow10kg: 2211, gradient: 3.6, runwayFt: 5400 },
  { altitudeFt: 0,     oat: 10, mtow10kg: 2172, gradient: 3.7, runwayFt: 5500 },
  { altitudeFt: 0,     oat: 20, mtow10kg: 2136, gradient: 3.7, runwayFt: 5500 },
  { altitudeFt: 0,     oat: 25, mtow10kg: 2118, gradient: 3.7, runwayFt: 5600 },
  { altitudeFt: 0,     oat: 30, mtow10kg: 2100, gradient: 3.8, runwayFt: 5600 },
  { altitudeFt: 0,     oat: 35, mtow10kg: 2082, gradient: 3.8, runwayFt: 5600 },
  { altitudeFt: 0,     oat: 40, mtow10kg: 2058, gradient: 3.5, runwayFt: 5800 },
  { altitudeFt: 0,     oat: 45, mtow10kg: 2035, gradient: 3.2, runwayFt: 6000 },
  // Altitude 1000 ft
  { altitudeFt: 1000,  oat: 0,  mtow10kg: 2172, gradient: 3.7, runwayFt: 5500 },
  { altitudeFt: 1000,  oat: 10, mtow10kg: 2134, gradient: 3.7, runwayFt: 5500 },
  { altitudeFt: 1000,  oat: 20, mtow10kg: 2097, gradient: 3.8, runwayFt: 5600 },
  { altitudeFt: 1000,  oat: 25, mtow10kg: 2078, gradient: 3.8, runwayFt: 5600 },
  { altitudeFt: 1000,  oat: 30, mtow10kg: 2061, gradient: 3.8, runwayFt: 5700 },
  { altitudeFt: 1000,  oat: 35, mtow10kg: 2041, gradient: 3.6, runwayFt: 5800 },
  { altitudeFt: 1000,  oat: 40, mtow10kg: 2015, gradient: 3.3, runwayFt: 6000 },
  { altitudeFt: 1000,  oat: 45, mtow10kg: 1993, gradient: 2.9, runwayFt: 6300 },
  // Altitude 2000 ft
  { altitudeFt: 2000,  oat: 0,  mtow10kg: 2133, gradient: 3.7, runwayFt: 5500 },
  { altitudeFt: 2000,  oat: 10, mtow10kg: 2095, gradient: 3.8, runwayFt: 5600 },
  { altitudeFt: 2000,  oat: 20, mtow10kg: 2059, gradient: 3.8, runwayFt: 5600 },
  { altitudeFt: 2000,  oat: 25, mtow10kg: 2040, gradient: 3.8, runwayFt: 5700 },
  { altitudeFt: 2000,  oat: 30, mtow10kg: 2021, gradient: 3.7, runwayFt: 5900 },
  { altitudeFt: 2000,  oat: 35, mtow10kg: 1997, gradient: 3.4, runwayFt: 6100 },
  { altitudeFt: 2000,  oat: 40, mtow10kg: 1975, gradient: 3.0, runwayFt: 6300 },
  { altitudeFt: 2000,  oat: 45, mtow10kg: 1951, gradient: 2.6, runwayFt: 6600 },
  // Altitude 4000 ft
  { altitudeFt: 4000,  oat: 0,  mtow10kg: 2055, gradient: 3.9, runwayFt: 5700 },
  { altitudeFt: 4000,  oat: 10, mtow10kg: 2020, gradient: 3.9, runwayFt: 5700 },
  { altitudeFt: 4000,  oat: 20, mtow10kg: 1981, gradient: 3.7, runwayFt: 5900 },
  { altitudeFt: 4000,  oat: 25, mtow10kg: 1958, gradient: 3.5, runwayFt: 6100 },
  { altitudeFt: 4000,  oat: 30, mtow10kg: 1935, gradient: 3.2, runwayFt: 6300 },
  { altitudeFt: 4000,  oat: 35, mtow10kg: 1914, gradient: 2.8, runwayFt: 6600 },
  { altitudeFt: 4000,  oat: 40, mtow10kg: 1892, gradient: 2.5, runwayFt: 6800 },
  { altitudeFt: 4000,  oat: 45, mtow10kg: 1873, gradient: 2.1, runwayFt: 7100 },
  // Altitude 6000 ft
  { altitudeFt: 6000,  oat: 0,  mtow10kg: 1980, gradient: 3.9, runwayFt: 5800 },
  { altitudeFt: 6000,  oat: 10, mtow10kg: 1940, gradient: 3.7, runwayFt: 6100 },
  { altitudeFt: 6000,  oat: 20, mtow10kg: 1895, gradient: 3.2, runwayFt: 6400 },
  { altitudeFt: 6000,  oat: 25, mtow10kg: 1875, gradient: 2.9, runwayFt: 6700 },
  { altitudeFt: 6000,  oat: 30, mtow10kg: 1854, gradient: 2.6, runwayFt: 6900 },
  { altitudeFt: 6000,  oat: 35, mtow10kg: 1835, gradient: 2.2, runwayFt: 7200 },
  { altitudeFt: 6000,  oat: 40, mtow10kg: 1810, gradient: 1.9, runwayFt: 7400 },
  { altitudeFt: 6000,  oat: 45, mtow10kg: 1735, gradient: 1.9, runwayFt: 7200 },
  // Altitude 8000 ft
  { altitudeFt: 8000,  oat: 0,  mtow10kg: 1890, gradient: 3.7, runwayFt: 6300 },
  { altitudeFt: 8000,  oat: 10, mtow10kg: 1847, gradient: 3.2, runwayFt: 6600 },
  { altitudeFt: 8000,  oat: 20, mtow10kg: 1808, gradient: 2.7, runwayFt: 7000 },
  { altitudeFt: 8000,  oat: 25, mtow10kg: 1788, gradient: 2.4, runwayFt: 7300 },
  { altitudeFt: 8000,  oat: 30, mtow10kg: 1770, gradient: 2.1, runwayFt: 7600 },
  { altitudeFt: 8000,  oat: 35, mtow10kg: 1726, gradient: 1.9, runwayFt: 7600 },
  // Altitude 10000 ft
  { altitudeFt: 10000, oat: 0,  mtow10kg: 1807, gradient: 3.1, runwayFt: 7100 },
  { altitudeFt: 10000, oat: 10, mtow10kg: 1769, gradient: 2.7, runwayFt: 7500 },
  { altitudeFt: 10000, oat: 20, mtow10kg: 1732, gradient: 2.1, runwayFt: 8000 },
  { altitudeFt: 10000, oat: 25, mtow10kg: 1703, gradient: 1.9, runwayFt: 8100 },
  { altitudeFt: 10000, oat: 30, mtow10kg: 1641, gradient: 1.9, runwayFt: 8000 },
  { altitudeFt: 10000, oat: 35, mtow10kg: 1577, gradient: 1.9, runwayFt: 7800 },
];

export const PERF_ALTITUDES = [0, 1000, 2000, 4000, 6000, 8000, 10000];

// Source: TABLA_C2_CORTA — C295 FAR-25 short-field takeoff, flaps T/O 10°, V2=1.05Vsr, bleeds OFF
export const PERF_TABLE_CORTA: PerfRow[] = [
  // Altitude 0 ft
  { altitudeFt: 0,     oat: 0,  mtow10kg: 2320, gradient: 2.0, runwayFt: 3900 },
  { altitudeFt: 0,     oat: 10, mtow10kg: 2320, gradient: 1.8, runwayFt: 4100 },
  { altitudeFt: 0,     oat: 20, mtow10kg: 2302, gradient: 1.7, runwayFt: 4300 },
  { altitudeFt: 0,     oat: 25, mtow10kg: 2288, gradient: 1.7, runwayFt: 4300 },
  { altitudeFt: 0,     oat: 30, mtow10kg: 2270, gradient: 1.7, runwayFt: 4300 },
  { altitudeFt: 0,     oat: 35, mtow10kg: 2252, gradient: 1.7, runwayFt: 4400 },
  { altitudeFt: 0,     oat: 40, mtow10kg: 2177, gradient: 1.7, runwayFt: 4300 },
  { altitudeFt: 0,     oat: 45, mtow10kg: 2099, gradient: 1.7, runwayFt: 4200 },
  // Altitude 1000 ft
  { altitudeFt: 1000,  oat: 0,  mtow10kg: 2320, gradient: 1.8, runwayFt: 4100 },
  { altitudeFt: 1000,  oat: 10, mtow10kg: 2301, gradient: 1.7, runwayFt: 4300 },
  { altitudeFt: 1000,  oat: 20, mtow10kg: 2271, gradient: 1.7, runwayFt: 4400 },
  { altitudeFt: 1000,  oat: 25, mtow10kg: 2250, gradient: 1.7, runwayFt: 4400 },
  { altitudeFt: 1000,  oat: 30, mtow10kg: 2220, gradient: 1.7, runwayFt: 4400 },
  { altitudeFt: 1000,  oat: 35, mtow10kg: 2173, gradient: 1.7, runwayFt: 4400 },
  { altitudeFt: 1000,  oat: 40, mtow10kg: 2095, gradient: 1.7, runwayFt: 4200 },
  { altitudeFt: 1000,  oat: 45, mtow10kg: 2013, gradient: 1.7, runwayFt: 4100 },
  // Altitude 2000 ft
  { altitudeFt: 2000,  oat: 0,  mtow10kg: 2300, gradient: 1.7, runwayFt: 4300 },
  { altitudeFt: 2000,  oat: 10, mtow10kg: 2269, gradient: 1.7, runwayFt: 4400 },
  { altitudeFt: 2000,  oat: 20, mtow10kg: 2238, gradient: 1.7, runwayFt: 4400 },
  { altitudeFt: 2000,  oat: 25, mtow10kg: 2198, gradient: 1.7, runwayFt: 4400 },
  { altitudeFt: 2000,  oat: 30, mtow10kg: 2153, gradient: 1.7, runwayFt: 4400 },
  { altitudeFt: 2000,  oat: 35, mtow10kg: 2084, gradient: 1.7, runwayFt: 4300 },
  { altitudeFt: 2000,  oat: 40, mtow10kg: 2010, gradient: 1.7, runwayFt: 4200 },
  { altitudeFt: 2000,  oat: 45, mtow10kg: 1933, gradient: 1.7, runwayFt: 4100 },
  // Altitude 4000 ft
  { altitudeFt: 4000,  oat: 0,  mtow10kg: 2235, gradient: 1.7, runwayFt: 4400 },
  { altitudeFt: 4000,  oat: 10, mtow10kg: 2196, gradient: 1.7, runwayFt: 4500 },
  { altitudeFt: 4000,  oat: 20, mtow10kg: 2123, gradient: 1.7, runwayFt: 4500 },
  { altitudeFt: 4000,  oat: 25, mtow10kg: 2056, gradient: 1.7, runwayFt: 4400 },
  { altitudeFt: 4000,  oat: 30, mtow10kg: 1987, gradient: 1.7, runwayFt: 4300 },
  { altitudeFt: 4000,  oat: 35, mtow10kg: 1918, gradient: 1.7, runwayFt: 4200 },
  { altitudeFt: 4000,  oat: 40, mtow10kg: 1848, gradient: 1.7, runwayFt: 4200 },
  { altitudeFt: 4000,  oat: 45, mtow10kg: 1774, gradient: 1.7, runwayFt: 4000 },
  // Altitude 6000 ft
  { altitudeFt: 6000,  oat: 0,  mtow10kg: 2156, gradient: 1.7, runwayFt: 4600 },
  { altitudeFt: 6000,  oat: 10, mtow10kg: 2069, gradient: 1.7, runwayFt: 4600 },
  { altitudeFt: 6000,  oat: 20, mtow10kg: 1952, gradient: 1.7, runwayFt: 4400 },
  { altitudeFt: 6000,  oat: 25, mtow10kg: 1889, gradient: 1.7, runwayFt: 4400 },
  { altitudeFt: 6000,  oat: 30, mtow10kg: 1826, gradient: 1.7, runwayFt: 4300 },
  { altitudeFt: 6000,  oat: 35, mtow10kg: 1760, gradient: 1.7, runwayFt: 4200 },
  { altitudeFt: 6000,  oat: 40, mtow10kg: 1692, gradient: 1.7, runwayFt: 4100 },
  { altitudeFt: 6000,  oat: 45, mtow10kg: 1623, gradient: 1.7, runwayFt: 4000 },
  // Altitude 8000 ft
  { altitudeFt: 8000,  oat: 0,  mtow10kg: 2004, gradient: 1.7, runwayFt: 4600 },
  { altitudeFt: 8000,  oat: 10, mtow10kg: 1903, gradient: 1.7, runwayFt: 4500 },
  { altitudeFt: 8000,  oat: 20, mtow10kg: 1794, gradient: 1.7, runwayFt: 4400 },
  { altitudeFt: 8000,  oat: 25, mtow10kg: 1736, gradient: 1.7, runwayFt: 4300 },
  { altitudeFt: 8000,  oat: 30, mtow10kg: 1675, gradient: 1.7, runwayFt: 4200 },
  { altitudeFt: 8000,  oat: 35, mtow10kg: 1613, gradient: 1.7, runwayFt: 4100 },
  { altitudeFt: 8000,  oat: 40, mtow10kg: 1551, gradient: 1.7, runwayFt: 4000 },
  // Altitude 10000 ft
  { altitudeFt: 10000, oat: 0,  mtow10kg: 1847, gradient: 1.7, runwayFt: 4500 },
  { altitudeFt: 10000, oat: 10, mtow10kg: 1751, gradient: 1.7, runwayFt: 4500 },
  { altitudeFt: 10000, oat: 20, mtow10kg: 1647, gradient: 1.7, runwayFt: 4300 },
  { altitudeFt: 10000, oat: 25, mtow10kg: 1588, gradient: 1.7, runwayFt: 4300 },
  { altitudeFt: 10000, oat: 30, mtow10kg: 1533, gradient: 1.7, runwayFt: 4200 },
  { altitudeFt: 10000, oat: 35, mtow10kg: 1475, gradient: 1.7, runwayFt: 4100 },
];
