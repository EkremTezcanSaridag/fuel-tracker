import { StatusBar } from 'expo-status-bar'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { colors, shadows } from '../theme'

const trendLegend = [
  { label: 'Benzin', color: colors.accent },
  { label: 'Motorin', color: '#7E9FCF' },
  { label: 'LPG', color: colors.warning },
]

const chartLines = [
  { color: colors.accent, width: 260, top: 32 },
  { color: '#7E9FCF', width: 200, top: 68 },
  { color: colors.warning, width: 120, top: 100 },
]

const recentChanges = [
  { date: '15 Mart Cuma', tag: 'Benzin', value: '+1.53 TL', tone: 'up' },
  { date: '12 Mart Salı', tag: 'Motorin', value: '-1.20 TL', tone: 'down' },
  { date: '05 Mart Salı', tag: 'LPG', value: '+0.85 TL', tone: 'up' },
]

export default function Gecmis() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerMark}>
            <MaterialCommunityIcons name="chart-line" size={18} color={colors.accent} />
          </View>
          <Text style={styles.brand}>PompaMetre</Text>
          <MaterialCommunityIcons name="account-circle-outline" size={20} color={colors.accent} />
        </View>

        <Text style={styles.title}>Fiyat Geçmişi</Text>
        <Text style={styles.subtitle}>Son 30 günlük akaryakıt değişim trendleri.</Text>

        <View style={styles.trendCard}>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.sectionLabel}>Aylık Trend</Text>
              <View style={styles.legendRow}>
                {trendLegend.map((item) => (
                  <View key={item.label} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.smallBadge}>
              <Text style={styles.smallBadgeText}>30g</Text>
            </View>
          </View>

          <View style={styles.chartBox}>
            <View style={styles.chartGlow} />
            <View style={styles.gridLine} />
            {chartLines.map((line) => (
              <View
                key={`${line.color}-${line.width}`}
                style={[styles.lineFill, { backgroundColor: line.color, width: line.width, top: line.top }]}
              />
            ))}
            <View style={styles.chartLabels}>
              <Text style={styles.chartLabel}>13 Şub</Text>
              <Text style={styles.chartLabel}>28 Şub</Text>
              <Text style={styles.chartLabel}>15 Mar</Text>
            </View>
          </View>
        </View>

        <View style={styles.lowestCard}>
          <View style={styles.lowestIcon}>
            <MaterialCommunityIcons name="calendar-month" size={18} color={colors.accent} />
          </View>
          <View style={styles.lowestInfo}>
            <Text style={styles.lowestLabel}>En Ucuz Gün</Text>
            <Text style={styles.lowestDate}>12 Mart</Text>
          </View>
          <View style={styles.lowestValue}>
            <Text style={styles.lowestLabel}>Benzin (Ort.)</Text>
            <Text style={styles.lowestPrice}>39.45 TL</Text>
          </View>
        </View>

        <Text style={styles.changesTitle}>Son Değişiklikler</Text>

        <View style={styles.changesCard}>
          {recentChanges.map((change, index) => (
            <View key={change.date} style={[styles.changeRow, index !== recentChanges.length - 1 && styles.changeDivider]}>
              <View style={styles.changeLeft}>
                <View style={styles.changeDotWrap}>
                  <MaterialCommunityIcons
                    name={change.tone === 'up' ? 'arrow-up-bold' : 'arrow-down-bold'}
                    size={14}
                    color={change.tone === 'up' ? colors.warning : colors.accent}
                  />
                </View>
                <View style={styles.changeCopy}>
                  <Text style={styles.changeDate}>{change.date}</Text>
                  <Text style={styles.changeDesc}>Gün içi değişim kaydı</Text>
                </View>
              </View>
              <View style={styles.changeRight}>
                <View style={styles.changeTag}>
                  <Text style={styles.changeTagText}>{change.tag}</Text>
                </View>
                <Text style={[styles.changeValue, change.tone === 'up' ? styles.changeUp : styles.changeDown]}>
                  {change.value}
                </Text>
              </View>
            </View>
          ))}
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
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: colors.bg,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.bg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -16,
    marginTop: -8,
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
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 18,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 18,
  },
  trendCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 14,
    ...shadows.card,
  },
  cardTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionLabel: {
    color: colors.paperMuted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 12,
    marginBottom: 8,
  },
  legendDot: {
    borderRadius: 999,
    height: 8,
    marginRight: 6,
    width: 8,
  },
  legendText: {
    color: colors.paperMuted,
    fontSize: 11,
    fontWeight: '800',
  },
  smallBadge: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  smallBadgeText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '900',
  },
  chartBox: {
    backgroundColor: colors.bg,
    borderRadius: 8,
    height: 170,
    position: 'relative',
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
  },
  chartGlow: {
    backgroundColor: 'rgba(25, 230, 177, 0.08)',
    height: 100,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  gridLine: {
    backgroundColor: '#20324D',
    height: 1,
    marginTop: 52,
    opacity: 0.8,
  },
  lineFill: {
    borderRadius: 999,
    height: 5,
    position: 'absolute',
    left: 0,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  chartLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
    width: 48,
    textAlign: 'left',
  },
  lowestCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    padding: 14,
    ...shadows.soft,
  },
  lowestIcon: {
    alignItems: 'center',
    backgroundColor: colors.accentDark,
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  lowestInfo: {
    flex: 1,
    marginLeft: 12,
  },
  lowestValue: {
    alignItems: 'flex-end',
  },
  lowestLabel: {
    color: colors.mutedSoft,
    fontSize: 11,
    fontWeight: '800',
  },
  lowestDate: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 3,
  },
  lowestPrice: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 3,
  },
  changesTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 24,
    marginBottom: 10,
  },
  changesCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    ...shadows.card,
  },
  changeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  changeDivider: {
    borderBottomColor: '#E6EDF5',
    borderBottomWidth: 1,
  },
  changeLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    paddingRight: 10,
  },
  changeDotWrap: {
    alignItems: 'center',
    backgroundColor: '#F1F6FC',
    borderRadius: 999,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  changeCopy: {
    flex: 1,
    marginLeft: 10,
  },
  changeRight: {
    alignItems: 'flex-end',
  },
  changeDate: {
    color: colors.paperText,
    fontSize: 13,
    fontWeight: '800',
  },
  changeDesc: {
    color: colors.paperMuted,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  changeTag: {
    backgroundColor: '#F1F6FC',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  changeTagText: {
    color: colors.paperText,
    fontSize: 10,
    fontWeight: '800',
  },
  changeValue: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 8,
  },
  changeUp: {
    color: colors.danger,
  },
  changeDown: {
    color: colors.accent,
  },
})
