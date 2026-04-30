import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CapsResult } from '../engine/capsLookup';
import { COLORS } from './theme';

interface Props {
  result: CapsResult;
}

const FACTOR_LABELS: Record<string, string> = {
  F:  'F — Distancia de campo',
  B:  'B — Energía de frenos',
  C:  'C — Gradiente (2° segmento)',
  OC: 'OC — Franqueamiento de obstáculos',
  S:  'S — Estructural',
  T:  'T — Velocidad de neumáticos',
  ST: 'ST — Estructural / Neumáticos',
};

function factorColor(factor: string): string {
  switch (factor) {
    case 'F':  return COLORS.ambar;
    case 'B':  return '#F97316';
    case 'C':  return COLORS.ambar;
    case 'OC': return '#A78BFA';
    case 'S':  return COLORS.rojo;
    case 'T':  return COLORS.rojo;
    case 'ST': return COLORS.rojo;
    default:   return COLORS.textSecondary;
  }
}

export function CapsResultCard({ result }: Props) {
  const isOk = result.status === 'OK';
  const isNoPermitido = result.status === 'NO PERMITIDO';

  const mainColor = isOk ? COLORS.verde : isNoPermitido ? COLORS.rojo : COLORS.textMuted;
  const mainBg = isOk ? COLORS.verdeSubtle : isNoPermitido ? COLORS.rojoSubtle : COLORS.card;

  return (
    <View style={styles.container}>
      {/* MTOW Final */}
      <View style={[styles.mainCard, { backgroundColor: mainBg, borderColor: mainColor }]}>
        <Text style={styles.mainLabel}>MTOW FINAL</Text>
        <View style={styles.mainRow}>
          {isOk && result.mtow !== null ? (
            <Text style={[styles.mainValue, { color: mainColor }]}>
              {result.mtow.toLocaleString('es-CO')} kg
            </Text>
          ) : (
            <Text style={[styles.mainValue, { color: mainColor, fontSize: 22 }]}>
              {isNoPermitido ? 'NO PERMITIDO' : 'SIN DATOS'}
            </Text>
          )}
          <View style={[styles.statusBadge, { backgroundColor: mainColor }]}>
            <Text style={styles.statusText}>{isOk ? 'OK' : isNoPermitido ? 'PROHIBIDO' : '—'}</Text>
          </View>
        </View>
      </View>

      {/* Factor limitante */}
      {isOk && result.factor && (
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>FACTOR LIMITANTE</Text>
            <View style={[styles.factorBadge, { borderColor: factorColor(result.factor) }]}>
              <Text style={[styles.factorCode, { color: factorColor(result.factor) }]}>
                {result.factor}
              </Text>
            </View>
          </View>
          <Text style={styles.detailDesc}>
            {FACTOR_LABELS[result.factor] ?? result.factor}
          </Text>
        </View>
      )}

      {/* V-speeds */}
      {isOk && result.v1 !== null && (
        <View style={styles.vCard}>
          <Text style={styles.vCardTitle}>VELOCIDADES DE DESPEGUE</Text>
          <View style={styles.vRow}>
            <VSpeed label="V1" value={result.v1} />
            <View style={styles.vDivider} />
            <VSpeed label="VR" value={result.vr} />
            <View style={styles.vDivider} />
            <VSpeed label="V2" value={result.v2} />
          </View>
          <Text style={styles.vUnit}>kt IAS</Text>
        </View>
      )}
    </View>
  );
}

function VSpeed({ label, value }: { label: string; value: number | null }) {
  return (
    <View style={styles.vItem}>
      <Text style={styles.vLabel}>{label}</Text>
      <Text style={styles.vValue}>{value ?? '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  mainCard: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 18,
    gap: 6,
  },
  mainLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  mainValue: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  vCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  vCardTitle: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  vRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  vDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  vLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  vValue: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  vUnit: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  detailCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  factorBadge: {
    borderWidth: 1.5,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  factorCode: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  detailDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
});
