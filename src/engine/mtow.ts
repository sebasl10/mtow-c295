import { PERF_TABLE, PERF_TABLE_CORTA, PERF_ALTITUDES, PerfRow } from '../data/performanceTable';
import { CG_OAT_VALUES, CG_ALT_VALUES, cgTableLookup, cgTableLookupCorta } from '../data/cgTable';

export type TakeoffMode = 'normal' | 'corta';
export type LimitingFactor = 'NINGUNO' | 'PISTA' | 'GRADIENTE' | 'PISTA Y GRADIENTE';
export type OperationalStatus = 'VERDE' | 'ÁMBAR' | 'ROJO';

export interface MtowInput {
  oat: number;
  pressureAlt: number;
  availableRunway: number;
  wetRunway: boolean;
  mode: TakeoffMode;
}

export interface MtowResult {
  mtowFinal: number;
  mtowTabla: number;
  mtowCfl: number;
  mtowGradiente: number;
  pistaRequerida: number;
  pistaEfectiva: number;
  gradienteMin: number;
  gradienteDisponible: number;
  gradienteOk: boolean;
  factorLimitante: LimitingFactor;
  status: OperationalStatus;
}

// Mode-specific constants
const MODE_CONFIG = {
  normal: { gradientThreshold: 2.4, wetPenalty: 800, cgLookup: cgTableLookup,    perfTable: PERF_TABLE },
  corta:  { gradientThreshold: 1.7, wetPenalty: 500, cgLookup: cgTableLookupCorta, perfTable: PERF_TABLE_CORTA },
} as const;

// ─── Altitude bounds ─────────────────────────────────────────────────────────

function getAltLow(pressureAlt: number): number {
  const valid = PERF_ALTITUDES.filter(a => a <= pressureAlt);
  return valid.length ? Math.max(...valid) : PERF_ALTITUDES[0];
}

function getAltHigh(pressureAlt: number): number {
  const valid = PERF_ALTITUDES.filter(a => a >= pressureAlt);
  return valid.length ? Math.min(...valid) : PERF_ALTITUDES[PERF_ALTITUDES.length - 1];
}

// ─── Per-altitude lookups ────────────────────────────────────────────────────

// First (min) OAT in table → MTOW (floor OAT lookup, same as Excel MATCH ascending)
function getMtowAtAlt(table: PerfRow[], altFt: number): number {
  const rows = table.filter(r => r.altitudeFt === altFt).sort((a, b) => a.oat - b.oat);
  return rows.length ? rows[0].mtow10kg * 10 : 0;
}

// Interpolate field between first OAT (= min = 0) and first OAT > inputOat
function getInterpAtAlt(
  table: PerfRow[],
  altFt: number,
  inputOat: number,
  field: 'runwayFt' | 'gradient',
): number {
  const rows = table.filter(r => r.altitudeFt === altFt).sort((a, b) => a.oat - b.oat);
  if (!rows.length) return 0;

  const loRow = rows[0];
  const hiRow = rows.find(r => r.oat > inputOat);

  if (!hiRow) {
    const last = rows[rows.length - 1];
    const prev = rows[rows.length - 2] ?? last;
    if (prev === last) return last[field];
    const t = (inputOat - prev.oat) / (last.oat - prev.oat);
    return prev[field] + t * (last[field] - prev[field]);
  }

  const t = (inputOat - loRow.oat) / (hiRow.oat - loRow.oat);
  return loRow[field] + t * (hiRow[field] - loRow[field]);
}

// ─── Altitude interpolation ──────────────────────────────────────────────────

function altInterp(altLow: number, altHigh: number, pressureAlt: number, vLow: number, vHigh: number): number {
  if (altLow === altHigh) return vLow;
  return vLow + ((pressureAlt - altLow) * (vHigh - vLow)) / (altHigh - altLow);
}

// ─── CG table bilinear interpolation ─────────────────────────────────────────

function cgMtowKg(oat: number, altFt: number, lookup: (oat: number, altFt: number) => number): number {
  const oatBelow = CG_OAT_VALUES.filter(o => o <= oat);
  const oatAbove = CG_OAT_VALUES.filter(o => o >= oat);
  const oatLo = oatBelow.length ? Math.max(...oatBelow) : CG_OAT_VALUES[0];
  const oatHi = oatAbove.length ? Math.min(...oatAbove) : CG_OAT_VALUES[CG_OAT_VALUES.length - 1];

  const altBelow = CG_ALT_VALUES.filter(a => a <= altFt);
  const altAbove = CG_ALT_VALUES.filter(a => a >= altFt);
  const altLo = altBelow.length ? Math.max(...altBelow) : 0;
  const altHi = altAbove.length ? Math.min(...altAbove) : CG_ALT_VALUES[0];

  const H = altHi === altLo ? 0 : (altFt - altHi) / (altLo - altHi);
  const I = oatHi === oatLo ? 0 : (oat - oatHi) / (oatLo - oatHi);

  const J = lookup(oatHi, altHi);
  const K = lookup(oatHi, altLo);
  const L = lookup(oatLo, altHi);
  const M = lookup(oatLo, altLo);

  return (J * (1 - H) * (1 - I) + K * H * (1 - I) + L * (1 - H) * I + M * H * I) * 10;
}

// ─── Main calculation ─────────────────────────────────────────────────────────

export function calculateMtow(input: MtowInput): MtowResult {
  const { oat, pressureAlt, availableRunway, wetRunway, mode } = input;
  const { gradientThreshold, wetPenalty, cgLookup, perfTable } = MODE_CONFIG[mode];

  const altLow  = getAltLow(pressureAlt);
  const altHigh = getAltHigh(pressureAlt);

  // MTOW (floor OAT = first row = OAT_min)
  const mtowLow  = getMtowAtAlt(perfTable, altLow);
  const mtowHigh = getMtowAtAlt(perfTable, altHigh);

  // Required runway (OAT-interpolated)
  const runwayLow  = getInterpAtAlt(perfTable, altLow,  oat, 'runwayFt');
  const runwayHigh = getInterpAtAlt(perfTable, altHigh, oat, 'runwayFt');

  // Gradient (OAT-interpolated)
  const gradLow  = getInterpAtAlt(perfTable, altLow,  oat, 'gradient');
  const gradHigh = getInterpAtAlt(perfTable, altHigh, oat, 'gradient');

  // Altitude interpolations
  const mtowTabla      = altInterp(altLow, altHigh, pressureAlt, mtowLow,    mtowHigh);
  const pistaRequerida = altInterp(altLow, altHigh, pressureAlt, runwayLow,  runwayHigh);
  const gradienteMin   = altInterp(altLow, altHigh, pressureAlt, gradLow,    gradHigh);

  // CG/gradient MTOW from lookup table
  const mtowGradiente = cgMtowKg(oat, pressureAlt, cgLookup);

  // Effective required runway (wet penalty differs by mode)
  const pistaEfectiva = wetRunway ? pistaRequerida + wetPenalty : pistaRequerida;

  // Runway-limited MTOW (CFL)
  let mtowCfl: number;
  if (pistaEfectiva <= availableRunway) {
    mtowCfl = mtowTabla;
  } else {
    const steps = Math.min(10, Math.ceil((pistaEfectiva - availableRunway) / 80));
    mtowCfl = mtowTabla - steps * 200;
  }

  // Available gradient with found weight
  const gradienteDisponible = gradienteMin + ((mtowTabla - mtowCfl) / 200) * 0.11;
  const gradienteOk = gradienteDisponible >= gradientThreshold;

  // Limiting factor
  const limitadoPorPista = mtowCfl < mtowTabla;
  let factorLimitante: LimitingFactor;
  if (limitadoPorPista && !gradienteOk)   factorLimitante = 'PISTA Y GRADIENTE';
  else if (limitadoPorPista)              factorLimitante = 'PISTA';
  else if (!gradienteOk)                  factorLimitante = 'GRADIENTE';
  else                                    factorLimitante = 'NINGUNO';

  // Operational status
  let status: OperationalStatus;
  if (factorLimitante === 'NINGUNO')              status = 'VERDE';
  else if (factorLimitante === 'PISTA Y GRADIENTE') status = 'ROJO';
  else                                            status = 'ÁMBAR';

  const mtowFinal = Math.min(mtowGradiente, mtowCfl);

  return {
    mtowFinal, mtowTabla, mtowCfl, mtowGradiente,
    pistaRequerida, pistaEfectiva,
    gradienteMin, gradienteDisponible, gradienteOk,
    factorLimitante, status,
  };
}
