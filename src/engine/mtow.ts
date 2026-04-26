import { PERF_TABLE, PERF_ALTITUDES } from '../data/performanceTable';
import { CG_OAT_VALUES, CG_ALT_VALUES, cgTableLookup } from '../data/cgTable';

export type LimitingFactor = 'NINGUNO' | 'PISTA' | 'GRADIENTE' | 'PISTA Y GRADIENTE';
export type OperationalStatus = 'VERDE' | 'ÁMBAR' | 'ROJO';

export interface MtowInput {
  oat: number;           // °C
  pressureAlt: number;   // ft (from aerodrome elevation)
  availableRunway: number; // ft (aerodrome runway - 35)
  wetRunway: boolean;
}

export interface MtowResult {
  mtowFinal: number;       // kg — B19 = MIN(B10, B11)
  mtowTabla: number;       // kg — B8 (from PERF_TABLE at OAT=0, interpolated altitude)
  mtowCfl: number;         // kg — B11 (runway-limited MTOW)
  mtowGradiente: number;   // kg — B10 (CG/gradient-limited from MTOW_%CG)
  pistaRequerida: number;  // ft — B9 (OAT-interpolated, before wet adjustment)
  pistaEfectiva: number;   // ft — B16 (after +800 ft if wet)
  gradienteMin: number;    // % — B12
  gradienteDisponible: number; // % — B13
  gradienteOk: boolean;    // B14
  factorLimitante: LimitingFactor; // B17
  status: OperationalStatus;       // B18
}

// ─── Altitude bounds (B20, B21) ─────────────────────────────────────────────

function getAltLow(pressureAlt: number): number {
  const valid = PERF_ALTITUDES.filter(a => a <= pressureAlt);
  return valid.length ? Math.max(...valid) : PERF_ALTITUDES[0];
}

function getAltHigh(pressureAlt: number): number {
  const valid = PERF_ALTITUDES.filter(a => a >= pressureAlt);
  return valid.length ? Math.min(...valid) : PERF_ALTITUDES[PERF_ALTITUDES.length - 1];
}

// ─── Per-altitude lookups ────────────────────────────────────────────────────

// B22/B23: first (min) OAT in table for given altitude → MTOW×10
function getMtowAtAlt(altFt: number): number {
  const rows = PERF_TABLE
    .filter(r => r.altitudeFt === altFt)
    .sort((a, b) => a.oat - b.oat);
  if (!rows.length) return 0;
  return rows[0].mtow10kg * 10;
}

// B24/B25, B26/B27: interpolate between first OAT ≤ input (= min OAT = 0)
// and first OAT > input, for runway or gradient.
function getInterpAtAlt(
  altFt: number,
  inputOat: number,
  field: 'runwayFt' | 'gradient',
): number {
  const rows = PERF_TABLE
    .filter(r => r.altitudeFt === altFt)
    .sort((a, b) => a.oat - b.oat);
  if (!rows.length) return 0;

  const loRow = rows[0]; // first (min OAT) — same as MATCH ascending
  const hiRow = rows.find(r => r.oat > inputOat);

  if (!hiRow) {
    // OAT beyond table max: extrapolate from last two rows
    const last = rows[rows.length - 1];
    const prev = rows[rows.length - 2] ?? last;
    if (prev === last) return last[field];
    const t = (inputOat - prev.oat) / (last.oat - prev.oat);
    return prev[field] + t * (last[field] - prev[field]);
  }

  const t = (inputOat - loRow.oat) / (hiRow.oat - loRow.oat);
  return loRow[field] + t * (hiRow[field] - loRow[field]);
}

// ─── Linear altitude interpolation ──────────────────────────────────────────

function altInterp(
  altLow: number,
  altHigh: number,
  pressureAlt: number,
  valLow: number,
  valHigh: number,
): number {
  if (altLow === altHigh) return valLow;
  return valLow + ((pressureAlt - altLow) * (valHigh - valLow)) / (altHigh - altLow);
}

// ─── CG table bilinear interpolation (MTOW_%CG sheet) ───────────────────────

function cgMtowKg(oat: number, altFt: number): number {
  // OAT bounds
  const oatBelow = CG_OAT_VALUES.filter(o => o <= oat);
  const oatAbove = CG_OAT_VALUES.filter(o => o >= oat);
  const oatLo = oatBelow.length ? Math.max(...oatBelow) : CG_OAT_VALUES[0];
  const oatHi = oatAbove.length ? Math.min(...oatAbove) : CG_OAT_VALUES[CG_OAT_VALUES.length - 1];

  // Altitude bounds
  const altBelow = CG_ALT_VALUES.filter(a => a <= altFt);
  const altAbove = CG_ALT_VALUES.filter(a => a >= altFt);
  const altLo = altBelow.length ? Math.max(...altBelow) : 0;
  const altHi = altAbove.length ? Math.min(...altAbove) : CG_ALT_VALUES[0];

  // Interpolation weights
  // H = weight toward lower altitude (G21 in Excel)
  const H = altHi === altLo ? 0 : (altFt - altHi) / (altLo - altHi);
  // I = weight toward lower OAT (E21 in Excel)
  const I = oatHi === oatLo ? 0 : (oat - oatHi) / (oatLo - oatHi);

  const J = cgTableLookup(oatHi, altHi); // upper OAT, upper alt
  const K = cgTableLookup(oatHi, altLo); // upper OAT, lower alt
  const L = cgTableLookup(oatLo, altHi); // lower OAT, upper alt
  const M = cgTableLookup(oatLo, altLo); // lower OAT, lower alt

  const mtow10kg =
    J * (1 - H) * (1 - I) +
    K * H * (1 - I) +
    L * (1 - H) * I +
    M * H * I;

  return mtow10kg * 10;
}

// ─── Main calculation (replicates MTOW_CFL sheet) ───────────────────────────

export function calculateMtow(input: MtowInput): MtowResult {
  const { oat, pressureAlt, availableRunway, wetRunway } = input;

  // B20, B21
  const altLow = getAltLow(pressureAlt);
  const altHigh = getAltHigh(pressureAlt);

  // B22, B23 — MTOW from performance table (OAT=0 floor lookup, altitude interpolated)
  const mtowLow = getMtowAtAlt(altLow);
  const mtowHigh = getMtowAtAlt(altHigh);

  // B24, B25 — required runway (OAT-interpolated)
  const runwayLow = getInterpAtAlt(altLow, oat, 'runwayFt');
  const runwayHigh = getInterpAtAlt(altHigh, oat, 'runwayFt');

  // B26, B27 — gradient (OAT-interpolated)
  const gradLow = getInterpAtAlt(altLow, oat, 'gradient');
  const gradHigh = getInterpAtAlt(altHigh, oat, 'gradient');

  // B8 — MTOW tabla (altitude-interpolated)
  const mtowTabla = altInterp(altLow, altHigh, pressureAlt, mtowLow, mtowHigh);

  // B9 — required runway (altitude-interpolated)
  const pistaRequerida = altInterp(altLow, altHigh, pressureAlt, runwayLow, runwayHigh);

  // B12 — minimum gradient (altitude-interpolated)
  const gradienteMin = altInterp(altLow, altHigh, pressureAlt, gradLow, gradHigh);

  // B10 — CG/gradient MTOW from MTOW_%CG table
  const mtowGradiente = cgMtowKg(oat, pressureAlt);

  // B16 — effective required runway (wet +800 ft)
  const pistaEfectiva = wetRunway ? pistaRequerida + 800 : pistaRequerida;

  // B11 — runway-limited MTOW (CFL)
  let mtowCfl: number;
  if (pistaEfectiva <= availableRunway) {
    mtowCfl = mtowTabla;
  } else {
    const steps = Math.min(10, Math.ceil((pistaEfectiva - availableRunway) / 80));
    mtowCfl = mtowTabla - steps * 200;
  }

  // B13 — available gradient with found weight
  const gradienteDisponible = gradienteMin + ((mtowTabla - mtowCfl) / 200) * 0.11;

  // B14
  const gradienteOk = gradienteDisponible >= 2.4;

  // B17 — limiting factor
  const limitadoPorPista = mtowCfl < mtowTabla;
  let factorLimitante: LimitingFactor;
  if (limitadoPorPista && !gradienteOk) {
    factorLimitante = 'PISTA Y GRADIENTE';
  } else if (limitadoPorPista) {
    factorLimitante = 'PISTA';
  } else if (!gradienteOk) {
    factorLimitante = 'GRADIENTE';
  } else {
    factorLimitante = 'NINGUNO';
  }

  // B18 — operational status
  let status: OperationalStatus;
  if (factorLimitante === 'NINGUNO') {
    status = 'VERDE';
  } else if (factorLimitante === 'PISTA Y GRADIENTE') {
    status = 'ROJO';
  } else {
    status = 'ÁMBAR';
  }

  // B19 — final MTOW
  const mtowFinal = Math.min(mtowGradiente, mtowCfl);

  return {
    mtowFinal,
    mtowTabla,
    mtowCfl,
    mtowGradiente,
    pistaRequerida,
    pistaEfectiva,
    gradienteMin,
    gradienteDisponible,
    gradienteOk,
    factorLimitante,
    status,
  };
}
