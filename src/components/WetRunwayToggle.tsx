import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from './theme';

interface Props {
  value: boolean;
  onChange: (v: boolean) => void;
}

export function WetRunwayToggle({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>PISTA HÚMEDA</Text>
      <View style={styles.toggleGroup}>
        <TouchableOpacity
          style={[styles.option, !value && styles.optionActive]}
          onPress={() => onChange(false)}
          activeOpacity={0.7}
        >
          <Text style={[styles.optionText, !value && styles.optionTextActive]}>NO</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.option, value && styles.optionActiveWet]}
          onPress={() => onChange(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.optionText, value && styles.optionTextActive]}>SÍ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  option: {
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  optionActive: {
    backgroundColor: COLORS.accent,
  },
  optionActiveWet: {
    backgroundColor: COLORS.ambar,
  },
  optionText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
});
