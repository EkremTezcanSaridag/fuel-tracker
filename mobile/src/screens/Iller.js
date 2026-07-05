import { StatusBar } from 'expo-status-bar'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { colors, shadows } from '../theme'
import { useFuelData } from '../hooks/useFuelData'
import { fuelTabs } from '../services/fuelData'

export default function Iller() {
  const { data } = useFuelData()
  const cities = data.cities
  const bestCity = data.bestCity

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerMark}>
            <MaterialCommunityIcons name="map-marker" size={18} color={colors.accent} />
          </View>
          <Text style={styles.brand}>PompaMetre</Text>
          <MaterialCommunityIcons name="account-circle-outline" size={21} color={colors.accent} />
        </View>

        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={18} color={colors.accent} />
          <Text style={styles.searchText}>İl ara...</Text>
        </View>

        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <Text style={styles.title}>Şehir Bazlı Fiyatlar</Text>
            <Text style={styles.subtitle}>Benzin için günlük ortalama fiyatlar.</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{cities.length} İl</Text>
          </View>
        </View>

        <View style={styles.segmentRow}>
          {fuelTabs.map((item, index) => (
            <View key={item.label} style={[styles.segment, index === 0 && styles.segmentActive]}>
              <MaterialCommunityIcons
                name={item.icon}
                size={14}
                color={index === 0 ? colors.accent : colors.mutedSoft}
              />
              <Text style={[styles.segmentText, index === 0 && styles.segmentTextActive]}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <MaterialCommunityIcons name="trending-down" size={20} color={colors.accent} />
          </View>
          <View style={styles.insightCopy}>
            <Text style={styles.insightTitle}>En uygun şehir {bestCity?.name ?? 'Adana'}</Text>
            <Text style={styles.insightDesc}>Bugünkü listede en düşük benzin ortalaması.</Text>
          </View>
          <Text style={styles.insightPrice}>{bestCity?.price ?? '63.95 ₺'}</Text>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Şehir Listesi</Text>
          <Text style={styles.listMeta}>Benzin 95</Text>
        </View>

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
  searchText: {
    color: colors.mutedSoft,
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 10,
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
