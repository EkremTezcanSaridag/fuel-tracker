import { useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, View, Text, StyleSheet, Switch } from 'react-native'
import { colors, shadows } from '../theme'

export default function Bildirimler() {
  const [dailyAlerts, setDailyAlerts] = useState(true)
  const [cityAlerts, setCityAlerts] = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(false)

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerMark}>
            <MaterialCommunityIcons name="bell-outline" size={18} color={colors.accent} />
          </View>
          <Text style={styles.brand}>PompaMetre</Text>
          <MaterialCommunityIcons name="account-circle-outline" size={20} color={colors.accent} />
        </View>

        <Text style={styles.title}>Bildirimler</Text>
        <Text style={styles.subtitle}>
          Fiyat değişimlerini ve özet raporları buradan yönetebilirsiniz.
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <MaterialCommunityIcons name="shield-check" size={22} color={colors.accent} />
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>Sessiz saatler açık</Text>
            <Text style={styles.summaryDesc}>22:00 - 08:00 arasında yalnızca kritik uyarılar gelir.</Text>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Uyarı Ayarları</Text>

          <View style={styles.row}>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>Günlük fiyat uyarıları</Text>
              <Text style={styles.rowDesc}>Önemli değişikliklerde anlık bildirim gönder.</Text>
            </View>
            <Switch
              value={dailyAlerts}
              onValueChange={setDailyAlerts}
              trackColor={{ false: '#25364F', true: colors.accentDark }}
              thumbColor={dailyAlerts ? colors.accent : '#D6DEE9'}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>İl bazlı uyarılar</Text>
              <Text style={styles.rowDesc}>Seçili şehirler için ayrı bildirimler al.</Text>
            </View>
            <Switch
              value={cityAlerts}
              onValueChange={setCityAlerts}
              trackColor={{ false: '#25364F', true: colors.accentDark }}
              thumbColor={cityAlerts ? colors.accent : '#D6DEE9'}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>Haftalık özet</Text>
              <Text style={styles.rowDesc}>Pazar akşamı kısa fiyat özeti gönder.</Text>
            </View>
            <Switch
              value={weeklySummary}
              onValueChange={setWeeklySummary}
              trackColor={{ false: '#25364F', true: colors.accentDark }}
              thumbColor={weeklySummary ? colors.accent : '#D6DEE9'}
            />
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Bildirim Saati</Text>
          <View style={styles.timeRow}>
            <View style={styles.timeChip}>
              <MaterialCommunityIcons name="clock-outline" size={14} color={colors.accent} />
              <Text style={styles.timeText}>22:00</Text>
            </View>
            <Text style={styles.timeDash}>-</Text>
            <View style={styles.timeChip}>
              <MaterialCommunityIcons name="clock-outline" size={14} color={colors.accent} />
              <Text style={styles.timeText}>08:00</Text>
            </View>
          </View>

          <View style={styles.rowCompact}>
            <MaterialCommunityIcons name="bell-ring-outline" size={18} color={colors.accent} />
            <Text style={styles.rowCompactText}>
              Uygulama açıkken önemli değişiklikler için titreşim kullanılır.
            </Text>
          </View>

          <View style={styles.rowCompact}>
            <MaterialCommunityIcons name="information-outline" size={18} color={colors.accent} />
            <Text style={styles.rowCompactText}>
              Bildirim izinleri kapalıysa sadece uygulama içi uyarılar görünür.
            </Text>
          </View>
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
    paddingHorizontal: 16,
    paddingTop: 10,
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
    letterSpacing: 0,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 8,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 16,
  },
  summaryCard: {
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
    fontWeight: '800',
  },
  summaryDesc: {
    color: colors.mutedSoft,
    fontSize: 12,
    fontWeight: '600',
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
  panelTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 8,
  },
  row: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 12,
  },
  rowCopy: {
    flex: 1,
    paddingRight: 12,
  },
  rowTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  rowDesc: {
    color: colors.mutedSoft,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  timeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 12,
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
    fontWeight: '800',
    marginLeft: 6,
  },
  timeDash: {
    color: colors.muted,
    fontSize: 18,
    fontWeight: '900',
    marginHorizontal: 12,
  },
  rowCompact: {
    alignItems: 'flex-start',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 12,
  },
  rowCompactText: {
    color: colors.mutedSoft,
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 10,
  },
})
