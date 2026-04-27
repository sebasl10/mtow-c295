import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MtowResult, OperationalStatus, LimitingFactor } from '../engine/mtow';
import { COLORS } from './theme';

interface Props {
  result: MtowResult;
}

const STATUS_LABEL: Record<OperationalStatus, string> = {
  VERDE: 'SIN LIMITACIÓN',
  ÁMBAR: 'CON LIMITACIÓN',
  ROJO: 'DOBLE LIMITACIÓN',
};

const FACTOR_LABEL: Record<LimitingFactor, string> = {
  NINGUNO: 'Sin factor limitante',
  PISTA: 'Limita por pista',
  GRADIENTE: 'Limita por gradiente',
  'PISTA Y GRADIENTE': 'Limita por pista y gradiente',
};

function fmt(n: number, decimals = 0): string {
  return n.toLocaleString('es-CO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function statusColors(s: OperationalStatus) {
  switch (s) {
    case 'VERDE': return { accent: COLORS.verde, bg: COLORS.verdeSubtle };
    case 'ÁMBAR': return { accent: COLORS.ambar, bg: COLORS.ambarSubtle };
    case 'ROJO':  return { accent: COLORS.rojo,  bg: COLORS.rojoSubtle };
  }
}

export function ResultCard({ result }: Props) {
  const { accent, bg } = statusColors(result.status);

  return (
    <View style={styles.container}>
      {/* MTOW Final */}
      <View style={[styles.mainCard, { backgroundColor: bg, borderColor: accent }]}>
        <Text style={styles.mainLabel}>MTOW FINAL</Text>
        <View style={styles.mainRow}>
          <Text style={[styles.mainValue, { color: accent }]}>
            {fmt(result.mtowFinal)} kg
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: accent }]}>
            <Text style={styles.statusText}>{result.status}</Text>
          </View>
        </View>
        <Text style={styles.factorText}>{FACTOR_LABEL[result.factorLimitante]}</Text>
      </View>

      {/* Detail rows */}
      <View style={styles.detailGrid}>
        <DetailRow label="MTOW por Gradiente" value={`${fmt(result.mtowGradiente)} kg`} />
        <DetailRow label="MTOW CFL" value={`${fmt(result.mtowCfl)} kg`} />
        <DetailRow label="MTOW Tabla" value={`${fmt(result.mtowTabla)} kg`} />
        <View style={styles.divider} />
        <DetailRow
          label="Pista Requerida"
          value={`${fmt(result.pistaRequerida)} ft`}
          sub={result.pistaEfectiva !== result.pistaRequerida
            ? `(+ ${fmt(result.pistaEfectiva - result.pistaRequerida)} ft húmeda → ${fmt(result.pistaEfectiva)} ft)`
            : undefined}
        />
        <DetailRow
          label="Gradiente Mín. Interpolado"
          value={`${result.gradienteMin.toFixed(2)} %`}
        />
        <DetailRow
          label="Gradiente Disponible"
          value={`${result.gradienteDisponible.toFixed(2)} %`}
          highlight={result.gradienteOk ? 'verde' : 'rojo'}
          sub={result.gradienteOk ? 'OK — cumple 2.4%' : 'LIMITA — no cumple 2.4%'}
        />
      </View>
    </View>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  sub?: string;
  highlight?: 'verde' | 'rojo';
}

function DetailRow({ label, value, sub, highlight }: DetailRowProps) {
  const valueColor =
    highlight === 'verde'
      ? COLORS.verde
      : highlight === 'rojo'
      ? COLORS.rojo
      : COLORS.textPrimary;

  return (
    <View style={detailStyles.row}>
      <View style={detailStyles.left}>
        <Text style={detailStyles.label}>{label}</Text>
        {sub ? <Text style={detailStyles.sub}>{sub}</Text> : null}
      </View>
      <Text style={[detailStyles.value, { color: valueColor }]}>{value}</Text>
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
  factorText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  detailGrid: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
});

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 11,
    gap: 12,
  },
  left: {
    flex: 1,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  sub: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
});
