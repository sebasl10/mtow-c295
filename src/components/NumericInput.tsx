import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from './theme';

interface Props {
  label: string;
  unit?: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  editable?: boolean;
  hint?: string;
}

export function NumericInput({
  label,
  unit,
  value,
  onChangeText,
  placeholder = '0',
  editable = true,
  hint,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      <View style={[styles.inputWrapper, !editable && styles.inputWrapperDisabled]}>
        <TextInput
          style={[styles.input, !editable && styles.inputDisabled]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          keyboardType="decimal-pad"
          editable={editable}
          selectTextOnFocus
        />
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  hint: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 50,
  },
  inputWrapperDisabled: {
    opacity: 0.6,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '500',
  },
  inputDisabled: {
    color: COLORS.textSecondary,
  },
  unit: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
});
