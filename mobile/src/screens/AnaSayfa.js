import { StatusBar } from 'expo-status-bar'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { colors, shadows } from '../theme'

const fuels = [
  { name: 'Benzin 95', price: '64.12 ₺', change: '-0.45 ₺', tone: 'good', icon: 'fuel' },
  { name: 'Motorin', price: '66.45 ₺', change: '+0.12 ₺', tone: 'bad', icon: 'fuel' },
  { name: 'LPG', price: '36.20 ₺', change: '0.00 ₺', tone: 'flat', icon: 'fuel' },
]

const trendLegend = [
  { label: 'Benzin', color: colors.accent },
  { label: 'Motorin', color: '#FF6B81' },
  { label: 'LPG', color: colors.warning },
]

const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

const trendData = {
  Benzin: [28, 24, 27, 33, 42, 31, 26],
  Motorin: [16, 17, 18, 20, 22, 18, 17],
  LPG: [8, 9, 10, 11, 12, 13, 14],
}

export default function AnaSayfa() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerMark}>
            <MaterialCommunityIcons name="fuel" size={18} color={colors.accent} />
          </View>
          <Text style={styles.brand}>PompaMetre</Text>
          <MaterialCommunityIcons name="account-circle-outline" size={20} color={colors.accent} />
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>5 Temmuz 2026 Pazar</Text>
          <View style={styles.updatePill}>
            <MaterialCommunityIcons name="clock-outline" size={12} color={colors.accent} />
            <Text style={styles.updateText}>Son Güncelleme: 10:45</Text>
          </View>
        </View>

        {fuels.map((fuel) => (
          <View key={fuel.name} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{fuel.name}</Text>
              </View>
              <MaterialCommunityIcons name="information-outline" size={16} color={colors.muted} />
            </View>

            <View style={styles.cardBody}>
              <View>
                <Text style={styles.price}>{fuel.price}</Text>
              </View>
              <View style={[styles.changePill, styles[fuel.tone]]}>
                <MaterialCommunityIcons
                  name={fuel.tone === 'bad' ? 'arrow-up-bold' : fuel.tone === 'good' ? 'arrow-down-bold' : 'minus'}
                  size={12}
                  color={fuel.tone === 'flat' ? colors.mutedSoft : colors.white}
                />
                <Text style={[styles.changeText, styles[`${fuel.tone}Text`]]}>{fuel.change}</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.chartCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>7 Günlük Değişim</Text>
            <MaterialCommunityIcons name="chart-line" size={16} color={colors.muted} />
          </View>

          <View style={styles.chartArea}>
            <View style={styles.chartAxes} />
            <View style={styles.chartGrid} />
            <View style={styles.chartBlock}>
              {Object.entries(trendData).map(([name, values]) => (
                <View key={name} style={styles.series}>
                  {values.map((value, index) => (
                    <View key={`${name}-${days[index]}`} style={[styles.bar, { height: value, backgroundColor: trendLegend.find((item) => item.label === name)?.color ?? colors.accent }]} />
                  ))}
                </View>
              ))}
            </View>

            <View style={styles.dayRow}>
              {days.map((day) => (
                <Text key={day} style={styles.dayLabel}>
                  {day}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.legendRow}>
            {trendLegend.map((item) => (
              <View key={item.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.label}</Text>
              </View>
            ))}
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
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    alignItems: 'center',
  },
  metaText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '800',
  },
  updatePill: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  updateText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 6,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
    ...shadows.card,
  },
  cardTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
  cardBody: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
  },
  changePill: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  good: {
    backgroundColor: colors.accentDark,
  },
  bad: {
    backgroundColor: colors.dangerDark,
  },
  flat: {
    backgroundColor: '#26364F',
  },
  changeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 4,
  },
  goodText: {
    color: colors.accent,
  },
  badText: {
    color: colors.danger,
  },
  flatText: {
    color: colors.mutedSoft,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
    padding: 14,
    ...shadows.soft,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
  chartArea: {
    backgroundColor: colors.bg,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  chartAxes: {
    borderBottomColor: colors.warning,
    borderBottomWidth: 2,
    opacity: 0.8,
  },
  chartGrid: {
    height: 1,
    backgroundColor: '#2C3C57',
    marginTop: 18,
    marginBottom: 18,
    opacity: 0.8,
  },
  chartBlock: {
    height: 92,
    justifyContent: 'space-between',
  },
  series: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bar: {
    borderRadius: 999,
    width: 8,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dayLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
    width: 30,
    textAlign: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 10,
  },
  legendDot: {
    borderRadius: 999,
    height: 8,
    marginRight: 6,
    width: 8,
  },
  legendText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
  },
})
