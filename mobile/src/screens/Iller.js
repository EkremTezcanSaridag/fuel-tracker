import { useMemo, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Pressable, RefreshControl, ScrollView, Text, TextInput, View, StyleSheet } from 'react-native'
import { colors, shadows } from '../theme'
import { useFuelData } from '../hooks/useFuelData'
import { fuelTabs } from '../services/fuelData'

function formatCurrency(value) {
  return `${value.toFixed(2)} ₺`
}

function formatChange(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)} ₺`
}

function formatStationCount(value) {
  return `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} istasyon`
}

function normalizeSearch(value) {
  return value
    .toLocaleLowerCase('tr-TR')
    .replace(/[çÇ]/g, 'c')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[ıIİi]/g, 'i')
    .replace(/[öÖ]/g, 'o')
    .replace(/[şŞ]/g, 's')
    .replace(/[üÜ]/g, 'u')
}

export default function Iller() {
  const { data, refresh, refreshing } = useFuelData()
  const [selectedFuel, setSelectedFuel] = useState(fuelTabs[0])
  const [searchQuery, setSearchQuery] = useState('')
  const selectedFuelKey = selectedFuel.key
  const selectedFuelTitle = selectedFuel.title

  const cities = useMemo(
    () => {
      const normalizedQuery = normalizeSearch(searchQuery.trim())

      return [...data.prices]
        .filter((city) => !normalizedQuery || normalizeSearch(city.city).includes(normalizedQuery))
        .sort((first, second) => first[selectedFuelKey] - second[selectedFuelKey])
        .map((city) => ({
          name: city.city,
          price: formatCurrency(city[selectedFuelKey]),
          change: formatChange(city.change),
          stations: formatStationCount(city.stations),
        }))
    },
    [data.prices, searchQuery, selectedFuelKey],
  )

  const bestCity = cities[0]
  const hasSearchQuery = searchQuery.trim().length > 0

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            colors={[colors.accent]}
            onRefresh={refresh}
            progressBackgroundColor={colors.surface}
            refreshing={refreshing}
            tintColor={colors.accent}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerMark}>
            <MaterialCommunityIcons name="map-marker" size={18} color={colors.accent} />
          </View>
          <Text style={styles.brand}>Yakıt Radar</Text>
          <MaterialCommunityIcons name="account-circle-outline" size={21} color={colors.accent} />
        </View>

        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={18} color={colors.accent} />
          <TextInput
            autoCapitalize="words"
            autoCorrect={false}
            onChangeText={setSearchQuery}
            placeholder="İl ara..."
            placeholderTextColor={colors.mutedSoft}
            returnKeyType="search"
            selectionColor={colors.accent}
            style={styles.searchInput}
            value={searchQuery}
          />
          {hasSearchQuery && (
            <Pressable
              accessibilityLabel="Aramayı temizle"
              onPress={() => setSearchQuery('')}
              style={({ pressed }) => [styles.clearSearchButton, pressed && styles.pressed]}
            >
              <MaterialCommunityIcons name="close" size={15} color={colors.mutedSoft} />
            </Pressable>
          )}
        </View>

        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <Text style={styles.title}>Şehir Bazlı Fiyatlar</Text>
            <Text style={styles.subtitle}>{selectedFuelTitle} için günlük ortalama fiyatlar.</Text>
          </View>
          <View style={styles.titleActions}>
            <Pressable
              accessibilityLabel="Fiyatları yenile"
              onPress={refresh}
              style={({ pressed }) => [styles.refreshButton, pressed && styles.pressed]}
            >
              <MaterialCommunityIcons
                name="refresh"
                size={17}
                color={refreshing ? colors.mutedSoft : colors.accent}
              />
            </Pressable>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{cities.length} İl</Text>
            </View>
          </View>
        </View>

        <View style={styles.segmentRow}>
          {fuelTabs.map((item) => {
            const selected = item.key === selectedFuel.key

            return (
              <Pressable
                key={item.key}
                onPress={() => setSelectedFuel(item)}
                style={({ pressed }) => [styles.segment, selected && styles.segmentActive, pressed && styles.pressed]}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={14}
                  color={selected ? colors.accent : colors.mutedSoft}
                />
                <Text style={[styles.segmentText, selected && styles.segmentTextActive]}>{item.label}</Text>
              </Pressable>
            )
          })}
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <MaterialCommunityIcons name="trending-down" size={20} color={colors.accent} />
          </View>
          <View style={styles.insightCopy}>
            <Text style={styles.insightTitle}>
              {bestCity ? `En uygun şehir ${bestCity.name}` : 'Sonuç bulunamadı'}
            </Text>
            <Text style={styles.insightDesc}>
              {bestCity
                ? `Bugünkü listede en düşük ${selectedFuelTitle} fiyatı.`
                : 'Aramayı temizleyip tekrar deneyebilirsiniz.'}
            </Text>
          </View>
          <Text style={styles.insightPrice}>{bestCity?.price ?? '--'}</Text>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Şehir Listesi</Text>
          <Text style={styles.listMeta}>{selectedFuelTitle}</Text>
        </View>

        {cities.length === 0 && (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons name="map-search-outline" size={28} color={colors.accent} />
            <Text style={styles.emptyTitle}>İl bulunamadı</Text>
            <Text style={styles.emptyText}>Arama metnini kısaltarak tekrar deneyin.</Text>
          </View>
        )}

        {cities.map((city, index) => {
          const trendUp = city.change.startsWith('+')

          return (
            <View key={city.name} style={styles.cityCard}>
              <View style={styles.rankBox}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>

              <View style={styles.cityInfo}>
                <Text style={styles.cityName}>{city.name}</Text>
                <View style={styles.cityMetaRow}>
                  <MaterialCommunityIcons name="storefront-outline" size={12} color={colors.muted} />
                  <Text style={styles.cityMeta}>{city.stations}</Text>
                </View>
                <View style={styles.cityChangeWrap}>
                  <MaterialCommunityIcons
                    name={trendUp ? 'arrow-up-bold' : 'arrow-down-bold'}
                    size={12}
                    color={trendUp ? colors.warning : colors.accent}
                  />
                  <Text style={[styles.cityChange, trendUp ? styles.cityChangeUp : styles.cityChangeDown]}>
                    {city.change} ort. fiyattan
                  </Text>
                </View>
              </View>

              <View style={styles.priceWrap}>
                <Text style={styles.price}>{city.price}</Text>
                <Text style={styles.priceUnit}>/ litre</Text>
              </View>
            </View>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    backgroundColor: colors.bg,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.bg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -16,
    marginTop: -8,
    marginBottom: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerMark: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  brand: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '900',
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 16,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  searchInput: {
    color: colors.mutedSoft,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 10,
    minHeight: 44,
    paddingVertical: 0,
  },
  clearSearchButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    marginLeft: 8,
    width: 28,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleCopy: {
    flex: 1,
    paddingRight: 12,
  },
  titleActions: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
  countBadge: {
    backgroundColor: colors.accentDark,
    borderColor: colors.accent,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  countBadgeText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
  },
  refreshButton: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    marginRight: 8,
    width: 34,
  },
  pressed: {
    opacity: 0.72,
  },
  segmentRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  segment: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginRight: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  segmentActive: {
    backgroundColor: colors.accentDark,
    borderColor: colors.accent,
  },
  segmentText: {
    color: colors.mutedSoft,
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 5,
  },
  segmentTextActive: {
    color: colors.accent,
  },
  insightCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 16,
    padding: 14,
    ...shadows.soft,
  },
  insightIcon: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    marginRight: 12,
    width: 42,
  },
  insightCopy: {
    flex: 1,
    paddingRight: 8,
  },
  insightTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  insightDesc: {
    color: colors.mutedSoft,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  insightPrice: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '900',
  },
  listHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  listTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  listMeta: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  cityCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
    minHeight: 82,
    paddingHorizontal: 12,
    paddingVertical: 11,
    ...shadows.soft,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 24,
    ...shadows.soft,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 10,
  },
  emptyText: {
    color: colors.mutedSoft,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 5,
    textAlign: 'center',
  },
  rankBox: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    marginRight: 12,
    width: 36,
  },
  rankText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '900',
  },
  cityInfo: {
    flex: 1,
    paddingRight: 10,
  },
  cityName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  cityMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 4,
  },
  cityMeta: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  cityChangeWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 4,
  },
  cityChange: {
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
  },
  cityChangeUp: {
    color: colors.warning,
  },
  cityChangeDown: {
    color: colors.accent,
  },
  priceWrap: {
    alignItems: 'flex-end',
  },
  price: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  priceUnit: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 3,
  },
})
