import { useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, View, Text, StyleSheet, Switch } from 'react-native'
import { colors, shadows } from '../theme'
import { useFuelData } from '../hooks/useFuelData'

const fuelChips = ['Benzin', 'Motorin', 'LPG']

export default function Bildirimler() {
  const { data } = useFuelData()
  const [dailyAlerts, setDailyAlerts] = useState(true)
  const [cityAlerts, setCityAlerts] = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(false)
  const [quietHours, setQuietHours] = useState(true)
  const cityChips = data.cities.slice(0, 3).map((city) => city.name)

  const notificationRows = [
    {
      icon: 'bell-ring-outline',
      title: 'Günlük fiyat uyarıları',
      desc: 'Önemli değişikliklerde anlık bildirim gönder.',
      value: dailyAlerts,
      onValueChange: setDailyAlerts,
    },
    {
      icon: 'map-marker-radius-outline',
      title: 'İl bazlı uyarılar',
      desc: 'Seçili şehirler için ayrı fiyat bildirimi al.',
      value: cityAlerts,
      onValueChange: setCityAlerts,
    },
    {
      icon: 'email-newsletter',
      title: 'Haftalık özet',
      desc: 'Pazar akşamı kısa fiyat özeti gönder.',
      value: weeklySummary,
      onValueChange: setWeeklySummary,
    },
  ]

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerMark}>
            <MaterialCommunityIcons name="bell-outline" size={18} color={colors.accent} />
          </View>
          <Text style={styles.brand}>PompaMetre</Text>
          <MaterialCommunityIcons name="account-circle-outline" size={21} color={colors.accent} />
        </View>

        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <Text style={styles.title}>Bildirimler</Text>
            <Text style={styles.subtitle}>Fiyat değişimlerini ve özet raporları yönetin.</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusBadgeText}>Aktif</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <MaterialCommunityIcons name="shield-check" size={22} color={colors.accent} />
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>3 uyarı kanalı hazır</Text>
            <Text style={styles.summaryDesc}>Günlük fiyat, il bazlı takip ve haftalık özet ayarları.</Text>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Uyarı Ayarları</Text>

          {notificationRows.map((row, index) => (
            <View key={row.title} style={[styles.row, index === 0 && styles.rowFirst]}>
              <View style={styles.rowIcon}>
                <MaterialCommunityIcons name={row.icon} size={18} color={colors.accent} />
              </View>
              <View style={styles.rowCopy}>
                <Text style={styles.rowTitle}>{row.title}</Text>
                <Text style={styles.rowDesc}>{row.desc}</Text>
              </View>
              <Switch
                value={row.value}
                onValueChange={row.onValueChange}
                trackColor={{ false: '#25364F', true: colors.accentDark }}
                thumbColor={row.value ? colors.accent : '#D6DEE9'}
              />
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <View style={styles.panelTop}>
            <View>
              <Text style={styles.panelTitle}>Sessiz Saatler</Text>
              <Text style={styles.panelSubtitle}>Kritik olmayan bildirimleri duraklat.</Text>
            </View>
            <Switch
              value={quietHours}
              onValueChange={setQuietHours}
              trackColor={{ false: '#25364F', true: colors.accentDark }}
              thumbColor={quietHours ? colors.accent : '#D6DEE9'}
            />
          </View>

          <View style={styles.timeRow}>
            <View style={styles.timeChip}>
              <MaterialCommunityIcons name="weather-night" size={15} color={colors.accent} />
              <Text style={styles.timeText}>22:00</Text>
            </View>
            <View style={styles.timeLine} />
            <View style={styles.timeChip}>
              <MaterialCommunityIcons name="white-balance-sunny" size={15} color={colors.warning} />
              <Text style={styles.timeText}>08:00</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Takip Edilenler</Text>

          <Text style={styles.groupLabel}>Yakıt türleri</Text>
          <View style={styles.chipRow}>
            {fuelChips.map((item) => (
              <View key={item} style={styles.chip}>
                <Text style={styles.chipText}>{item}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.groupLabel}>Öne çıkan iller</Text>
          <View style={styles.chipRow}>
            {cityChips.map((item) => (
              <View key={item} style={styles.chipMuted}>
                <MaterialCommunityIcons name="map-marker" size={12} color={colors.mutedSoft} />
                <Text style={styles.chipMutedText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="information-outline" size={18} color={colors.accent} />
          <Text style={styles.infoText}>
            Bildirim izinleri kapalıysa uyarılar yalnızca uygulama içinde gösterilir.
          </Text>
        </View>
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
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleCopy: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 5,
  },
  statusBadge: {
    alignItems: 'center',
    backgroundColor: colors.accentDark,
    borderColor: colors.accent,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  statusDot: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    height: 7,
    marginRight: 6,
    width: 7,
  },
  statusBadgeText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 14,
    ...shadows.card,
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
  summaryText: {
    flex: 1,
  },
  summaryTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  summaryDesc: {
    color: colors.mutedSoft,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    padding: 14,
    ...shadows.soft,
  },
  panelTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  panelTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
  panelSubtitle: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  row: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingTop: 13,
    paddingBottom: 13,
  },
  rowFirst: {
    marginTop: 8,
  },
  rowIcon: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    marginRight: 10,
    width: 36,
  },
  rowCopy: {
    flex: 1,
    paddingRight: 12,
  },
  rowTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  rowDesc: {
    color: colors.mutedSoft,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  timeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 16,
  },
  timeChip: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  timeText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 6,
  },
  timeLine: {
    backgroundColor: colors.border,
    flex: 1,
    height: 1,
    marginHorizontal: 10,
  },
  groupLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 14,
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    backgroundColor: colors.accentDark,
    borderColor: colors.accent,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chipText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
  },
  chipMuted: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginRight: 8,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chipMutedText: {
    color: colors.mutedSoft,
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 5,
  },
  infoCard: {
    alignItems: 'flex-start',
    backgroundColor: colors.bgSoft,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 12,
    padding: 12,
  },
  infoText: {
    color: colors.mutedSoft,
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 10,
  },
})
