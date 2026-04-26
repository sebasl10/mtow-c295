import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Airport, AIRPORTS } from '../data/airports';
import { COLORS } from './theme';

interface Props {
  selected: Airport | null;
  onSelect: (airport: Airport) => void;
}

export function AerodromeSelector({ selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.toUpperCase().trim();
    if (!q) return AIRPORTS;
    return AIRPORTS.filter(
      a =>
        a.icao.includes(q) ||
        a.iata.includes(q) ||
        a.city.includes(q) ||
        a.name.includes(q),
    );
  }, [query]);

  const handleSelect = useCallback(
    (airport: Airport) => {
      onSelect(airport);
      setOpen(false);
      setQuery('');
    },
    [onSelect],
  );

  return (
    <>
      <TouchableOpacity style={styles.selector} onPress={() => setOpen(true)} activeOpacity={0.7}>
        {selected ? (
          <View style={styles.selectedContent}>
            <Text style={styles.icaoText}>{selected.icao}</Text>
            <Text style={styles.nameText} numberOfLines={1}>
              {selected.city} — {selected.name}
            </Text>
          </View>
        ) : (
          <Text style={styles.placeholder}>Seleccionar aeródromo...</Text>
        )}
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <StatusBar barStyle="light-content" />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccionar Aeródromo</Text>
            <TouchableOpacity onPress={() => { setOpen(false); setQuery(''); }} style={styles.closeBtn}>
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por OACI, IATA, ciudad o nombre..."
              placeholderTextColor={COLORS.textMuted}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="characters"
              autoCorrect={false}
              autoFocus
            />
          </View>

          <FlatList
            data={filtered}
            keyExtractor={item => item.icao}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.row,
                  selected?.icao === item.icao && styles.rowSelected,
                ]}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
              >
                <View style={styles.rowLeft}>
                  <Text style={styles.rowIcao}>{item.icao}</Text>
                  <Text style={styles.rowIata}>{item.iata}</Text>
                </View>
                <View style={styles.rowRight}>
                  <Text style={styles.rowCity}>{item.city}</Text>
                  <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    minHeight: 50,
  },
  selectedContent: {
    flex: 1,
    gap: 2,
  },
  icaoText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  nameText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  placeholder: {
    flex: 1,
    color: COLORS.textMuted,
    fontSize: 15,
  },
  chevron: {
    color: COLORS.textMuted,
    fontSize: 22,
    marginLeft: 8,
    lineHeight: 24,
  },
  modal: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  closeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  closeText: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInput: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  rowSelected: {
    backgroundColor: COLORS.accentSubtle,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 110,
  },
  rowIcao: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    width: 52,
  },
  rowIata: {
    color: COLORS.textMuted,
    fontSize: 12,
    width: 36,
  },
  rowRight: {
    flex: 1,
  },
  rowCity: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  rowName: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginLeft: 16,
  },
});
