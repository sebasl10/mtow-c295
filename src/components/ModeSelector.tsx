import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from './theme';
import { TakeoffMode } from '../engine/mtow';

interface ModeSelectorProps {
  value: TakeoffMode;
  onChange: (mode: TakeoffMode) => void;
}

const MODES: { key: TakeoffMode; label: string; sub: string }[] = [
  { key: 'caps', label: 'CAPS 2017', sub: 'Tabla técnica' },
  { key: 'normal', label: 'NORMAL', sub: 'V2=1.23Vsr' },
  { key: 'corta', label: 'PISTA CORTA', sub: 'V2=1.05Vsr' },
];

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <View style={styles.container}>
      {MODES.map(m => (
        <TouchableOpacity
          key={m.key}
          style={[styles.btn, value === m.key && styles.btnActive]}
          onPress={() => onChange(m.key)}
          activeOpacity={0.8}
        >
          <Text style={[styles.btnText, value === m.key && styles.btnTextActive]}>
            {m.label}
          </Text>
          <Text style={[styles.btnSub, value === m.key && styles.btnSubActive]}>
            {m.sub}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  btnActive: {
    backgroundColor: COLORS.accent,
  },
  btnText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  btnTextActive: {
    color: '#FFFFFF',
  },
  btnSub: {
    color: COLORS.textMuted,
    fontSize: 9,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  btnSubActive: {
    color: 'rgba(255,255,255,0.75)',
  },
});
