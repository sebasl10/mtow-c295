import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CapsScenario, CAPS_SCENARIOS } from '../data/capsData';
import { COLORS } from './theme';

interface Props {
  selected: CapsScenario | null;
  onSelect: (scenario: CapsScenario) => void;
}

type Step = 'airport' | 'runway' | 'operation' | 'qnh';

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

// Compute runways available for a given airport
function runwaysFor(apt: string) {
  return unique(CAPS_SCENARIOS.filter(s => s.airportName === apt).map(s => s.runway)).sort();
}
// Compute operations available for airport+runway
function operationsFor(apt: string, rwy: string) {
  return unique(
    CAPS_SCENARIOS.filter(s => s.airportName === apt && s.runway === rwy).map(s => s.operation),
  ).sort();
}
// Compute QNH scenarios for airport+runway+op
function qnhFor(apt: string, rwy: string, op: string) {
  return CAPS_SCENARIOS.filter(
    s => s.airportName === apt && s.runway === rwy && s.operation === op,
  );
}

function icaoFor(airportName: string) {
  return CAPS_SCENARIOS.find(s => s.airportName === airportName)?.icao ?? '';
}

function isSFFor(airportName: string) {
  return CAPS_SCENARIOS.some(s => s.airportName === airportName && s.isSF);
}

function cascadeFrom(
  apt: string, rwy: string | null, op: string | null,
): { rwy: string | null; op: string | null; scenario: CapsScenario | null } {
  const rwys = runwaysFor(apt);
  const resolvedRwy = rwy ?? (rwys.length === 1 ? rwys[0] : null);

  if (!resolvedRwy) return { rwy: null, op: null, scenario: null };

  const ops = operationsFor(apt, resolvedRwy);
  const resolvedOp = op ?? (ops.length === 1 ? ops[0] : null);

  if (!resolvedOp) return { rwy: resolvedRwy, op: null, scenario: null };

  const qnhs = qnhFor(apt, resolvedRwy, resolvedOp);
  const resolvedScenario = qnhs.length === 1 ? qnhs[0] : null;

  return { rwy: resolvedRwy, op: resolvedOp, scenario: resolvedScenario };
}

export function CapsCascadePicker({ selected, onSelect }: Props) {
  const [openStep, setOpenStep] = useState<Step | null>(null);

  const [airport, setAirport] = useState<string | null>(selected?.airportName ?? null);
  const [runway,  setRunway]  = useState<string | null>(selected?.runway      ?? null);
  const [opType,  setOpType]  = useState<string | null>(selected?.operation   ?? null);

  // ── Derived option lists ──────────────────────────────────────────────────

  const airports = useMemo(
    () => unique(CAPS_SCENARIOS.map(s => s.airportName)).sort(),
    [],
  );

  const runways    = useMemo(() => airport ? runwaysFor(airport) : [], [airport]);
  const operations = useMemo(() => airport && runway ? operationsFor(airport, runway) : [], [airport, runway]);
  const qnhOptions = useMemo(() => airport && runway && opType ? qnhFor(airport, runway, opType) : [], [airport, runway, opType]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const pickAirport = useCallback((v: string) => {
    const { rwy, op, scenario } = cascadeFrom(v, null, null);
    setAirport(v);
    setRunway(rwy);
    setOpType(op);
    setOpenStep(null);
    if (scenario) onSelect(scenario);
  }, [onSelect]);

  const pickRunway = useCallback((v: string) => {
    if (!airport) return;
    const { op, scenario } = cascadeFrom(airport, v, null);
    setRunway(v);
    setOpType(op);
    setOpenStep(null);
    if (scenario) onSelect(scenario);
  }, [airport, onSelect]);

  const pickOp = useCallback((v: string) => {
    if (!airport || !runway) return;
    setOpType(v);
    setOpenStep(null);
    const qnhs = qnhFor(airport, runway, v);
    if (qnhs.length === 1) onSelect(qnhs[0]);
  }, [airport, runway, onSelect]);

  const pickQnh = useCallback((scenario: CapsScenario) => {
    onSelect(scenario);
    setOpenStep(null);
  }, [onSelect]);

  const handleStepPress = useCallback((step: Step) => {
    // Don't open modal if there's only one option (auto-selected)
    if (step === 'runway'    && runways.length    === 1) return;
    if (step === 'operation' && operations.length === 1) return;
    if (step === 'qnh'       && qnhOptions.length === 1) return;
    // Clear downstream when re-opening an upstream step
    if (step === 'airport') { setRunway(null); setOpType(null); }
    if (step === 'runway')  { setOpType(null); }
    setOpenStep(step);
  }, [runways.length, operations.length, qnhOptions.length]);

  const selectedQnh = selected?.airportName === airport &&
    selected?.runway === runway &&
    selected?.operation === opType
    ? selected.qnh
    : null;

  return (
    <View style={styles.container}>
      {/* Step 1 — Aeródromo */}
      <StepRow
        label="AERÓDROMO"
        value={airport ? `${icaoFor(airport)}  ${airport}` : undefined}
        placeholder="Seleccionar aeródromo..."
        onPress={() => handleStepPress('airport')}
        active
        isAuto={false}
      />

      {/* Step 2 — Pista */}
      <StepRow
        label="PISTA"
        value={runway ? `RWY ${runway}` : undefined}
        placeholder="Seleccionar pista..."
        onPress={() => handleStepPress('runway')}
        active={airport !== null}
        isAuto={runway !== null && runways.length === 1}
      />

      {/* Step 3 — Tipo */}
      <StepRow
        label="TIPO"
        value={opType ?? undefined}
        placeholder="FAR-25 o MIL-OPS..."
        onPress={() => handleStepPress('operation')}
        active={runway !== null}
        isAuto={opType !== null && operations.length === 1}
      />

      {/* Step 4 — QNH */}
      <StepRow
        label="QNH"
        value={selectedQnh ?? undefined}
        placeholder="Seleccionar rango QNH..."
        onPress={() => handleStepPress('qnh')}
        active={opType !== null}
        isAuto={selectedQnh !== null && qnhOptions.length === 1}
        isLast
      />

      {/* ── Modals ── */}

      <PickerModal
        visible={openStep === 'airport'}
        title="Aeródromo"
        onClose={() => setOpenStep(null)}
        data={airports}
        renderItem={(item) => (
          <View style={itemStyles.row}>
            <View style={itemStyles.left}>
              <Text style={itemStyles.badge}>{icaoFor(item)}</Text>
              {isSFFor(item) && <View style={itemStyles.sfBadge}><Text style={itemStyles.sfText}>SF</Text></View>}
            </View>
            <Text style={itemStyles.main}>{item}</Text>
          </View>
        )}
        onSelect={pickAirport}
        keyFor={(item) => item}
        isSelected={(item) => item === airport}
      />

      <PickerModal
        visible={openStep === 'runway'}
        title="Pista"
        subtitle={airport ?? ''}
        onClose={() => setOpenStep(null)}
        data={runways}
        renderItem={(item) => (
          <View style={itemStyles.row}>
            <Text style={itemStyles.rwyBadge}>RWY</Text>
            <Text style={itemStyles.main}>{item}</Text>
          </View>
        )}
        onSelect={pickRunway}
        keyFor={(item) => item}
        isSelected={(item) => item === runway}
      />

      <PickerModal
        visible={openStep === 'operation'}
        title="Tipo de operación"
        subtitle={runway ? `RWY ${runway}` : ''}
        onClose={() => setOpenStep(null)}
        data={operations}
        renderItem={(item) => (
          <View style={itemStyles.row}>
            <View style={[itemStyles.opBadge, item === 'FAR-25' ? itemStyles.opFar : itemStyles.opMil]}>
              <Text style={itemStyles.opText}>{item}</Text>
            </View>
          </View>
        )}
        onSelect={pickOp}
        keyFor={(item) => item}
        isSelected={(item) => item === opType}
      />

      <PickerModal
        visible={openStep === 'qnh'}
        title="QNH"
        subtitle={opType ?? ''}
        onClose={() => setOpenStep(null)}
        data={qnhOptions}
        renderItem={(item) => (
          <View style={itemStyles.col}>
            <Text style={itemStyles.qnhMain}>{item.qnh}</Text>
            <Text style={itemStyles.qnhSub}>
              {item.date}  ·  {item.availableTemps[0]}°C – {item.availableTemps[item.availableTemps.length - 1]}°C
            </Text>
          </View>
        )}
        onSelect={pickQnh}
        keyFor={(item, i) => `${item.refCode}-${i}`}
        isSelected={(item) => item.displayName === selected?.displayName}
      />
    </View>
  );
}

// ── StepRow ───────────────────────────────────────────────────────────────────

interface StepRowProps {
  label: string;
  value?: string;
  placeholder: string;
  onPress: () => void;
  active: boolean;
  isAuto: boolean;
  isLast?: boolean;
}

function StepRow({ label, value, placeholder, onPress, active, isAuto, isLast }: StepRowProps) {
  const pressable = active && !isAuto;
  return (
    <View style={[stepStyles.wrapper, isLast && stepStyles.wrapperLast]}>
      <View style={stepStyles.labelRow}>
        <View style={[stepStyles.dot, active ? stepStyles.dotActive : stepStyles.dotInactive]} />
        <Text style={[stepStyles.label, !active && stepStyles.labelInactive]}>{label}</Text>
      </View>
      <TouchableOpacity
        style={[stepStyles.btn, !active && stepStyles.btnDisabled, isAuto && stepStyles.btnAuto]}
        onPress={pressable ? onPress : undefined}
        activeOpacity={pressable ? 0.7 : 1}
      >
        <Text style={value ? stepStyles.value : stepStyles.placeholder} numberOfLines={2}>
          {value ?? placeholder}
        </Text>
        {!isAuto && <Text style={stepStyles.chevron}>›</Text>}
      </TouchableOpacity>
    </View>
  );
}

// ── Generic PickerModal ───────────────────────────────────────────────────────

interface PickerModalProps<T> {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  onSelect: (item: T) => void;
  keyFor: (item: T, index: number) => string;
  isSelected: (item: T) => boolean;
}

function PickerModal<T>({
  visible, title, subtitle, onClose, data, renderItem, onSelect, keyFor, isSelected,
}: PickerModalProps<T>) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={modalStyles.root}>
        <StatusBar barStyle="light-content" />
        <View style={modalStyles.header}>
          <View>
            <Text style={modalStyles.title}>{title}</Text>
            {subtitle ? <Text style={modalStyles.subtitle}>{subtitle}</Text> : null}
          </View>
          <TouchableOpacity onPress={onClose} style={modalStyles.closeBtn}>
            <Text style={modalStyles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={data}
          keyExtractor={keyFor}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[modalStyles.row, isSelected(item) && modalStyles.rowSelected]}
              onPress={() => onSelect(item)}
              activeOpacity={0.7}
            >
              {renderItem(item)}
              {isSelected(item) && <Text style={modalStyles.checkmark}>✓</Text>}
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={modalStyles.separator} />}
        />
      </SafeAreaView>
    </Modal>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

const stepStyles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  wrapperLast: {
    borderBottomWidth: 0,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive:   { backgroundColor: COLORS.accent },
  dotInactive: { backgroundColor: COLORS.border },
  label: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  labelInactive: { color: COLORS.textMuted },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 42,
  },
  btnDisabled: { opacity: 0.4 },
  btnAuto: {
    opacity: 0.45,
  },
  value: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  placeholder: {
    flex: 1,
    color: COLORS.textMuted,
    fontSize: 14,
  },
  chevron: {
    color: COLORS.textMuted,
    fontSize: 20,
    marginLeft: 8,
    lineHeight: 22,
  },
});

const itemStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  col: {
    flex: 1,
    gap: 3,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 60,
  },
  badge: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    width: 44,
  },
  sfBadge: {
    backgroundColor: COLORS.ambar,
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  sfText: { color: '#000', fontSize: 9, fontWeight: '800' },
  main: { flex: 1, color: COLORS.textSecondary, fontSize: 14 },
  rwyBadge: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    width: 32,
  },
  opBadge: {
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  opFar: {
    backgroundColor: COLORS.accentSubtle,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  opMil: {
    backgroundColor: '#1C1505',
    borderWidth: 1,
    borderColor: COLORS.ambar,
  },
  opText: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700', letterSpacing: 0.5 },
  qnhMain: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '600' },
  qnhSub:  { color: COLORS.textMuted,   fontSize: 12 },
});

const modalStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title:    { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
  subtitle: { color: COLORS.textMuted,   fontSize: 12, marginTop: 2 },
  closeBtn: { paddingVertical: 6, paddingHorizontal: 4 },
  closeText: { color: COLORS.accent, fontSize: 16, fontWeight: '600' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  rowSelected: { backgroundColor: COLORS.accentSubtle },
  checkmark:   { color: COLORS.accent, fontSize: 16, fontWeight: '700', marginLeft: 8 },
  separator:   { height: 1, backgroundColor: COLORS.divider, marginLeft: 20 },
});
