import { StatusBar } from 'expo-status-bar'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { colors, shadows } from '../theme'

const cities = [
  { name: 'İstanbul', price: '64.12 ₺', change: '+0.05 ₺' },
  { name: 'Ankara', price: '64.10 ₺', change: '+0.03 ₺' },
  { name: 'İzmir', price: '64.08 ₺', change: '+0.01 ₺' },
  { name: 'Antalya', price: '64.02 ₺', change: '-0.05 ₺' },
  { name: 'Adana', price: '63.95 ₺', change: '-0.12 ₺' },
]

const fuelTabs = ['Benzin', 'Motorin', 'LPG']

export default function Iller() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerMark}>
            <MaterialCommunityIcons name="map-marker" size={18} color={colors.accent} />
          </View>
          <Text style={styles.brand}>PompaMetre</Text>
          <MaterialCommunityIcons name="account-circle-outline" size={20} color={colors.accent} />
        </View>

        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={18} color={colors.muted} />
          <Text style={styles.searchText}>İl ara...</Text>
        </View>

        <Text style={styles.title}>Şehir Bazlı Fiyatlar</Text>
        <Text style={styles.subtitle}>Günlük ortalama fiyatlara göre sıralanan şehir listesi.</Text>

        <View style={styles.segmentRow}>
          {fuelTabs.map((item, index) => (
            <View key={item} style={[styles.segment, index === 0 && styles.segmentActive]}>
              <Text style={[styles.segmentText, index === 0 && styles.segmentTextActive]}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <MaterialCommunityIcons name="office-building" size={20} color={colors.accent} />
          </View>
          <View style={styles.summaryCopy}>
            <Text style={styles.summaryTitle}>81 il güncel</Text>
            <Text style={styles.summaryDesc}>Benzin fiyatlarına göre son veriler aşağıda.</Text>
          </View>
        </View>

        {cities.map((city) => {
          const trendUp = city.change.startsWith('+')

          return (
            <View key={city.name} style={styles.cityCard}>
              <View style={styles.cityIcon}>
                <MaterialCommunityIcons name="city" size={18} color={colors.accent} />
              </View>
              <View style={styles.cityInfo}>
                <Text style={styles.cityName}>{city.name}</Text>
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
              <Text style={styles.price}>{city.price}</Text>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
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
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  searchText: {
    color: colors.mutedSoft,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 10,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
  segmentRow: {
    flexDirection: 'row',
    marginTop: 14,
    marginBottom: 12,
  },
  segment: {
    backgroundColor: colors.bgSoft,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  segmentActive: {
    backgroundColor: colors.accentDark,
    borderColor: colors.accent,
  },
  segmentText: {
    color: colors.mutedSoft,
    fontSize: 12,
    fontWeight: '800',
  },
  segmentTextActive: {
    color: colors.accent,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 14,
    ...shadows.soft,
  },
  summaryIcon: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    marginRight: 12,
    width: 42,
  },
  summaryCopy: {
    flex: 1,
  },
  summaryTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  summaryDesc: {
    color: colors.mutedSoft,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  cityCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 12,
    ...shadows.soft,
  },
  cityIcon: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    marginRight: 12,
    width: 38,
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  cityChangeWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 4,
  },
  cityChange: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  cityChangeUp: {
    color: colors.warning,
  },
  cityChangeDown: {
    color: colors.accent,
  },
  price: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
})
