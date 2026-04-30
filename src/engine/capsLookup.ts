import { CAPS_LOOKUP, CapsLookupEntry } from '../data/capsData';

export interface CapsResult {
  status: 'OK' | 'NO_MATCH' | 'NO PERMITIDO';
  mtow: number | null;
  factor: string;
  v1: number | null;
  vr: number | null;
  v2: number | null;
}

export function lookupCaps(refCode: string, temp: number, wind: number): CapsResult {
  const key = `${refCode}|${temp}|${wind}`;
  const entry: CapsLookupEntry | undefined = CAPS_LOOKUP[key];

  if (!entry) return { status: 'NO_MATCH', mtow: null, factor: '', v1: null, vr: null, v2: null };

  let v1: number | null = null;
  let vr: number | null = null;
  let v2: number | null = null;

  if (entry.vspeeds) {
    const parts = entry.vspeeds.split('-').map(Number);
    if (parts.length === 3) {
      [v1, vr, v2] = parts;
    }
  }

  return {
    status: entry.status as CapsResult['status'],
    mtow: entry.mtow,
    factor: entry.factor,
    v1,
    vr,
    v2,
  };
}
