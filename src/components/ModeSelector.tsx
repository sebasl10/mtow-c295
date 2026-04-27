import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from './theme';
import { TakeoffMode } from '../engine/mtow';

interface ModeSelectorProps {
  value: TakeoffMode;
  onChange: (mode: TakeoffMode) => void;
}

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, value === 'normal' && styles.btnActive]}
        onPress={() => onChange('normal')}
        activeOpacity={0.8}
      >
        <Text style={[styles.btnText, value === 'normal' && styles.btnTextActive]}>
          NORMAL
        </Text>
        <Text style={[styles.btnSub, value === 'normal' && styles.btnSubActive]}>
          V2=1.23Vsr
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, value === 'corta' && styles.btnActive]}
        onPress={() => onChange('corta')}
        activeOpacity={0.8}
      >
        <Text style={[styles.btnText, value === 'corta' && styles.btnTextActive]}>
          PISTA CORTA
        </Text>
        <Text style={[styles.btnSub, value === 'corta' && styles.btnSubActive]}>
          V2=1.05Vsr
        </Text>
      </TouchableOpacity>
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
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  btnTextActive: {
    color: '#FFFFFF',
  },
  btnSub: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  btnSubActive: {
    color: 'rgba(255,255,255,0.75)',
  },
});
