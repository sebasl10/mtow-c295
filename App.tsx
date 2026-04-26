import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { AerodromeSelector } from './src/components/AerodromeSelector';
import { NumericInput } from './src/components/NumericInput';
import { WetRunwayToggle } from './src/components/WetRunwayToggle';
import { ResultCard } from './src/components/ResultCard';
import { COLORS } from './src/components/theme';
import { Airport } from './src/data/airports';
import { calculateMtow, MtowResult } from './src/engine/mtow';

export default function App() {
  const [aerodrome, setAerodrome] = useState<Airport | null>(null);
  const [oat, setOat] = useState('');
  const [pressureAlt, setPressureAlt] = useState('');
  const [runway, setRunway] = useState('');
  const [wetRunway, setWetRunway] = useState(false);
  const [result, setResult] = useState<MtowResult | null>(null);

  const handleAerodromeSelect = useCallback((airport: Airport) => {
    setAerodrome(airport);
    setPressureAlt(String(airport.elevationFt));
    setRunway((airport.runwayFt - 35).toFixed(1));
    setResult(null);
  }, []);

  const handleFieldChange = useCallback(
    (setter: (v: string) => void) => (v: string) => {
      setter(v);
      setResult(null);
    },
    [],
  );

  const handleWetChange = useCallback((v: boolean) => {
    setWetRunway(v);
    setResult(null);
  }, []);

  const oatNum = parseFloat(oat);
  const altNum = parseFloat(pressureAlt);
  const runwayNum = parseFloat(runway);
  const isValid =
    aerodrome !== null &&
    !isNaN(oatNum) &&
    !isNaN(altNum) &&
    !isNaN(runwayNum) &&
    runwayNum > 0;

  const handleCalculate = useCallback(() => {
    if (!isValid) return;
    const r = calculateMtow({
      oat: oatNum,
      pressureAlt: altNum,
      availableRunway: runwayNum,
      wetRunway,
    });
    setResult(r);
  }, [isValid, oatNum, altNum, runwayNum, wetRunway]);

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>C-295</Text>
            </View>
            <View style={styles.headerTextBlock}>
              <Text style={styles.headerTitle}>Cálculo MTOW</Text>
              <Text style={styles.headerSubtitle}>
                Despegue Normal · Flaps 10° · V2=1.23Vsr
              </Text>
            </View>
          </View>

          <View style={styles.sectionDivider} />

          {/* Input Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PARÁMETROS DE ENTRADA</Text>

            <View style={styles.inputGroup}>
              {/* Aerodrome */}
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>AERÓDROMO</Text>
                <AerodromeSelector
                  selected={aerodrome}
                  onSelect={handleAerodromeSelect}
                />
              </View>

              {/* OAT */}
              <NumericInput
                label="OAT"
                unit="°C"
                value={oat}
                onChangeText={handleFieldChange(setOat)}
                placeholder="p.ej. 33"
              />

              {/* Altitude + Runway side by side */}
              <View style={styles.rowFields}>
                <View style={styles.halfField}>
                  <NumericInput
                    label="Alt. Presión"
                    unit="ft"
                    value={pressureAlt}
                    onChangeText={v => { setPressureAlt(v); setResult(null); }}
                    placeholder="ft"
                    hint={aerodrome ? 'auto' : undefined}
                  />
                </View>
                <View style={styles.halfField}>
                  <NumericInput
                    label="Pista Disponible"
                    unit="ft"
                    value={runway}
                    onChangeText={handleFieldChange(setRunway)}
                    placeholder="ft"
                    hint={aerodrome ? 'auto' : undefined}
                  />
                </View>
              </View>

              {/* Wet runway */}
              <WetRunwayToggle value={wetRunway} onChange={handleWetChange} />
            </View>
          </View>

          {/* Calculate button */}
          <TouchableOpacity
            style={[styles.calcButton, !isValid && styles.calcButtonDisabled]}
            onPress={handleCalculate}
            activeOpacity={0.8}
            disabled={!isValid}
          >
            <Text style={[styles.calcButtonText, !isValid && styles.calcButtonTextDisabled]}>
              CALCULAR MTOW
            </Text>
          </TouchableOpacity>

          {/* Result */}
          {result && (
            <>
              <View style={[styles.sectionDivider, { marginTop: 24 }]} />
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>RESULTADO</Text>
                <ResultCard result={result} />
              </View>
            </>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              FAR-25 · DESPEGUE NORMAL · C-295 · FAC
            </Text>
            <Text style={styles.footerCopyright}>
              © {new Date().getFullYear()} CT LAGUNA WILSON - LAKE
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 14,
  },
  headerBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
    letterSpacing: 0.2,
  },

  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginHorizontal: 20,
  },

  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  inputGroup: {
    gap: 14,
  },
  fieldBlock: {
    gap: 6,
  },
  fieldLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },

  calcButton: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  calcButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  calcButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  calcButtonTextDisabled: {
    color: COLORS.textMuted,
  },

  footer: {
    paddingTop: 28,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 10,
    letterSpacing: 1.5,
  },
  footerCopyright: {
    color: COLORS.textMuted,
    fontSize: 10,
    letterSpacing: 0.5,
    marginTop: 4,
  },
});
