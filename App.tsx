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
import { Analytics } from '@vercel/analytics/react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { AerodromeSelector } from './src/components/AerodromeSelector';
import { CapsCascadePicker } from './src/components/CapsCascadePicker';
import { NumericInput } from './src/components/NumericInput';
import { WetRunwayToggle } from './src/components/WetRunwayToggle';
import { ModeSelector } from './src/components/ModeSelector';
import { ResultCard } from './src/components/ResultCard';
import { CapsResultCard } from './src/components/CapsResultCard';
import { COLORS } from './src/components/theme';
import { Airport } from './src/data/airports';
import { CapsScenario } from './src/data/capsData';
import { calculateMtow, MtowResult, TakeoffMode } from './src/engine/mtow';
import { lookupCaps, CapsResult } from './src/engine/capsLookup';

const WIND_OPTIONS = [-5, 0, 5, 10];

export default function App() {
  const [mode, setMode] = useState<TakeoffMode>('caps');

  // Normal / Corta state
  const [aerodrome, setAerodrome] = useState<Airport | null>(null);
  const [oat, setOat] = useState('');
  const [pressureAlt, setPressureAlt] = useState('');
  const [runway, setRunway] = useState('');
  const [wetRunway, setWetRunway] = useState(false);
  const [result, setResult] = useState<MtowResult | null>(null);

  // CAPS state
  const [capsScenario, setCapsScenario] = useState<CapsScenario | null>(null);
  const [capsTemp, setCapsTemp] = useState('');
  const [capsWind, setCapsWind] = useState<number | null>(null);
  const [capsResult, setCapsResult] = useState<CapsResult | null>(null);

  const handleModeChange = useCallback((m: TakeoffMode) => {
    setMode(m);
    setResult(null);
    setCapsResult(null);
  }, []);

  const handleAerodromeSelect = useCallback((airport: Airport) => {
    setAerodrome(airport);
    setPressureAlt(String(airport.elevationFt));
    setRunway((airport.runwayFt - 35).toFixed(1));
    setResult(null);
  }, []);

  const handleCapsScenarioSelect = useCallback((scenario: CapsScenario) => {
    setCapsScenario(scenario);
    setCapsTemp('');
    setCapsWind(null);
    setCapsResult(null);
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

  // Normal/Corta validation
  const oatNum = parseFloat(oat);
  const altNum = parseFloat(pressureAlt);
  const runwayNum = parseFloat(runway);
  const isValidNormal =
    aerodrome !== null &&
    !isNaN(oatNum) &&
    !isNaN(altNum) &&
    !isNaN(runwayNum) &&
    runwayNum > 0;

  // CAPS validation
  const capsTempNum = parseFloat(capsTemp);
  const isCapsValid =
    capsScenario !== null &&
    !isNaN(capsTempNum) &&
    capsScenario.availableTemps.includes(capsTempNum) &&
    capsWind !== null;

  const handleCalculate = useCallback(() => {
    if (mode === 'caps') {
      if (!isCapsValid || capsScenario === null || capsWind === null) return;
      const r = lookupCaps(capsScenario.refCode, capsTempNum, capsWind);
      setCapsResult(r);
    } else {
      if (!isValidNormal) return;
      const r = calculateMtow({
        oat: oatNum,
        pressureAlt: altNum,
        availableRunway: runwayNum,
        wetRunway,
        mode,
      });
      setResult(r);
    }
  }, [mode, isCapsValid, capsScenario, capsWind, capsTempNum, isValidNormal, oatNum, altNum, runwayNum, wetRunway]);

  const isValid = mode === 'caps' ? isCapsValid : isValidNormal;

  const headerSubtitle =
    mode === 'caps'
      ? 'CAPS 2017 · Tabla técnica · Sin interpolación'
      : mode === 'normal'
      ? 'Despegue Normal · Flaps 10° · V2=1.23Vsr'
      : 'Pista Corta · Flaps T/O 10° · V2=1.05Vsr';

  const footerLabel =
    mode === 'caps'
      ? 'CAPS 2017 · TABLA TÉCNICA · C-295 · FAC'
      : mode === 'normal'
      ? 'FAR-25 · DESPEGUE NORMAL · C-295 · FAC'
      : 'FAR-25 · PISTA CORTA · C-295 · FAC';

  return (
    <SafeAreaProvider>
      {Platform.OS === 'web' && <Analytics />}
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
                <Text style={styles.headerSubtitle}>{headerSubtitle}</Text>
              </View>
            </View>

            <View style={styles.sectionDivider} />

            {/* Input Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PARÁMETROS DE ENTRADA</Text>

              <View style={styles.inputGroup}>
                {/* Mode selector */}
                <View style={styles.fieldBlock}>
                  <Text style={styles.fieldLabel}>MODO DE DESPEGUE</Text>
                  <ModeSelector value={mode} onChange={handleModeChange} />
                </View>

                {mode === 'caps' ? (
                  /* ── CAPS 2017 inputs ── */
                  <>
                    <View style={styles.fieldBlock}>
                      <Text style={styles.fieldLabel}>AERÓDROMO / CARTA TÉCNICA</Text>
                      <CapsCascadePicker
                        selected={capsScenario}
                        onSelect={handleCapsScenarioSelect}
                      />
                    </View>

                    <NumericInput
                      label="TEMPERATURA"
                      unit="°C"
                      value={capsTemp}
                      onChangeText={v => { setCapsTemp(v); setCapsResult(null); }}
                      placeholder={
                        capsScenario
                          ? `${capsScenario.availableTemps[0]}–${capsScenario.availableTemps[capsScenario.availableTemps.length - 1]}`
                          : 'p.ej. 12'
                      }
                      hint={
                        capsScenario && capsTemp !== '' && !isNaN(capsTempNum) && !capsScenario.availableTemps.includes(capsTempNum)
                          ? '⚠ No está en la tabla'
                          : undefined
                      }
                    />

                    <View style={styles.fieldBlock}>
                      <Text style={styles.fieldLabel}>COMPONENTE DE VIENTO</Text>
                      <View style={styles.windSelector}>
                        {WIND_OPTIONS.map(w => (
                          <TouchableOpacity
                            key={w}
                            style={[styles.windBtn, capsWind === w && styles.windBtnActive]}
                            onPress={() => { setCapsWind(w); setCapsResult(null); }}
                            activeOpacity={0.8}
                          >
                            <Text style={[styles.windBtnText, capsWind === w && styles.windBtnTextActive]}>
                              {w > 0 ? `+${w}` : String(w)}
                            </Text>
                            <Text style={[styles.windBtnUnit, capsWind === w && styles.windBtnUnitActive]}>
                              kt
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </>
                ) : (
                  /* ── Normal / Corta inputs ── */
                  <>
                    <View style={styles.fieldBlock}>
                      <Text style={styles.fieldLabel}>AERÓDROMO</Text>
                      <AerodromeSelector
                        selected={aerodrome}
                        onSelect={handleAerodromeSelect}
                      />
                    </View>

                    <NumericInput
                      label="OAT"
                      unit="°C"
                      value={oat}
                      onChangeText={handleFieldChange(setOat)}
                      placeholder="p.ej. 33"
                    />

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

                    <WetRunwayToggle value={wetRunway} onChange={handleWetChange} />
                  </>
                )}
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
            {mode === 'caps' && capsResult && (
              <>
                <View style={[styles.sectionDivider, { marginTop: 24 }]} />
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>RESULTADO</Text>
                  <CapsResultCard result={capsResult} />
                </View>
              </>
            )}
            {mode !== 'caps' && result && (
              <>
                <View style={[styles.sectionDivider, { marginTop: 24 }]} />
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>RESULTADO</Text>
                  <ResultCard result={result} />
                </View>
              </>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>{footerLabel}</Text>
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

  windSelector: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  windBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },
  windBtnActive: {
    backgroundColor: COLORS.accent,
  },
  windBtnText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  windBtnTextActive: {
    color: '#FFFFFF',
  },
  windBtnUnit: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  windBtnUnitActive: {
    color: 'rgba(255,255,255,0.7)',
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
