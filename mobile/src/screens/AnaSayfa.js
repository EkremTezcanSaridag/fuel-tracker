import { useMemo } from 'react'
import { StatusBar } from 'expo-status-bar'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Pressable, RefreshControl, ScrollView, View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import { colors, shadows } from '../theme'
import { useFuelData } from '../hooks/useFuelData'

const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
const fuelSignalIcons = {
  Benzin: 'gas-station',
  Motorin: 'truck-outline',
  LPG: 'fire',
}

const chartHeight = 118
const chartDomain = { min: 20, max: 70 }

function buildPoints(values, chartWidth) {
  const horizontalPadding = 6
  const verticalPadding = 8
  const usableWidth = chartWidth - horizontalPadding * 2
  const usableHeight = chartHeight - verticalPadding * 2
  const step = usableWidth / (values.length - 1)

  return values.map((value, index) => ({
    x: horizontalPadding + index * step,
    y:
      verticalPadding +
      ((chartDomain.max - value) / (chartDomain.max - chartDomain.min)) * usableHeight,
  }))
}

function buildSegments(points, strokeWidth) {
  return points.slice(0, -1).map((point, index) => {
    const next = points[index + 1]
    const dx = next.x - point.x
    const dy = next.y - point.y
    const length = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)

    return {
      angle,
      left: point.x + dx / 2 - length / 2,
      top: point.y + dy / 2 - strokeWidth / 2,
      width: length,
    }
  })
}

export default function AnaSayfa() {
  const { width } = useWindowDimensions()
  const { data, refresh, refreshing } = useFuelData()
  const fuels = data.homeFuels
  const marketSignal = data.marketSignal
  const trendSeries = data.homeTrendSeries
  const chartWidth = Math.max(210, Math.min(width - 92, 330))

  const chartSeries = useMemo(
    () =>
      trendSeries.map((series) => {
        const points = buildPoints(series.values, chartWidth)

        return {
          ...series,
          points,
          segments: buildSegments(points, series.strokeWidth),
        }
      }),
    [chartWidth, trendSeries],
  )

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
            <MaterialCommunityIcons name="fuel" size={18} color={colors.accent} />
          </View>
          <Text style={styles.brand}>PompaMetre</Text>
          <View style={styles.headerActions}>
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
            <MaterialCommunityIcons name="account-circle-outline" size={21} color={colors.accent} />
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{data.currentDateLabel}</Text>
          <View style={styles.updatePill}>
            <MaterialCommunityIcons name="clock-outline" size={12} color={colors.accent} />
            <Text style={styles.updateText}>
              {refreshing ? 'Yenileniyor...' : `Son Güncelleme: ${data.lastUpdatedLabel}`}
            </Text>
          </View>
        </View>

        {fuels.map((fuel) => (
          <View key={fuel.name} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={[styles.badge, { backgroundColor: fuel.badgeColor }]}>
                <Text style={styles.badgeText}>{fuel.name}</Text>
              </View>
              <MaterialCommunityIcons name="information-outline" size={16} color={colors.mutedSoft} />
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.price} numberOfLines={1}>
                {fuel.price}
              </Text>
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

        <View style={styles.signalCard}>
          <View style={styles.signalHeader}>
            <View style={styles.signalTitleGroup}>
              <View style={[styles.signalIcon, { backgroundColor: marketSignal.softColor }]}>
                <MaterialCommunityIcons name={marketSignal.icon} size={18} color={marketSignal.color} />
              </View>
              <View style={styles.signalTitleText}>
                <Text style={styles.signalEyebrow}>Piyasa Sinyali</Text>
                <Text style={styles.signalTitle}>{marketSignal.title}</Text>
              </View>
            </View>

            <View style={[styles.signalPill, { borderColor: marketSignal.color }]}>
              <Text style={[styles.signalPillText, { color: marketSignal.color }]}>
                {marketSignal.confidenceLabel}
              </Text>
            </View>
          </View>

          <Text style={styles.signalSummary}>{marketSignal.summary}</Text>

          <View style={styles.signalMetricRow}>
            {marketSignal.metrics.map((metric) => (
              <View key={metric.label} style={styles.signalMetric}>
                <Text style={styles.signalMetricLabel}>{metric.label}</Text>
                <Text style={styles.signalMetricValue}>{metric.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.fuelSignalList}>
            {marketSignal.fuels.map((fuelSignal) => (
              <View key={fuelSignal.fuel} style={styles.fuelSignalRow}>
                <View style={styles.fuelSignalName}>
                  <MaterialCommunityIcons
                    name={fuelSignalIcons[fuelSignal.fuel] ?? 'fuel'}
                    size={15}
                    color={colors.mutedSoft}
                  />
                  <Text style={styles.fuelSignalFuel}>{fuelSignal.fuel}</Text>
                </View>
                <Text style={styles.fuelSignalValue} numberOfLines={1}>
                  {fuelSignal.label}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.signalDisclaimer}>
            Son hesaplama: {marketSignal.updatedAt} · Tahmini sinyaldir, kesin fiyat değişikliği değildir.
          </Text>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>7 Günlük Değişim</Text>
            <MaterialCommunityIcons name="chart-line" size={17} color={colors.mutedSoft} />
          </View>

          <View style={styles.chartArea}>
            <View style={[styles.chartPlot, { width: chartWidth, height: chartHeight }]}>
              <View style={[styles.gridLine, { top: 28 }]} />
              <View style={[styles.gridLine, { top: 58 }]} />
              <View style={[styles.gridLine, { top: 88 }]} />

              {chartSeries.map((series) => (
                <View key={series.key} style={styles.lineLayer}>
                  {series.segments.map((segment, index) => (
                    <View
                      key={`${series.key}-${index}`}
                      style={[
                        styles.lineSegment,
                        {
                          backgroundColor: series.color,
                          height: series.strokeWidth,
                          left: segment.left,
                          opacity: series.opacity,
                          top: segment.top,
                          transform: [{ rotate: `${segment.angle}deg` }],
                          width: segment.width,
                        },
                      ]}
                    />
                  ))}

                  {series.points.map((point, index) => (
                    <View
                      key={`${series.key}-point-${index}`}
                      style={[
                        styles.chartPoint,
                        {
                          backgroundColor: series.key === 'Motorin' ? series.color : colors.bg,
                          borderColor: series.color,
                          left: point.x - 3,
                          opacity: series.opacity,
                          top: point.y - 3,
                        },
                      ]}
                    />
                  ))}
                </View>
              ))}
            </View>

            <View style={[styles.dayRow, { width: chartWidth }]}>
              {days.map((day) => (
                <Text key={day} style={styles.dayLabel}>
                  {day}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.legendRow}>
            {trendSeries.map((item) => (
              <View key={item.key} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.key}</Text>
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
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  refreshButton: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    marginRight: 10,
    width: 34,
  },
  pressed: {
    opacity: 0.72,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  metaText: {
    color: colors.text,
    flex: 1,
    fontSize: 11,
    fontWeight: '900',
    paddingRight: 8,
  },
  updatePill: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  updateText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 5,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    minHeight: 88,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...shadows.card,
  },
  cardTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  cardBody: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: {
    color: colors.text,
    flex: 1,
    fontSize: 30,
    fontWeight: '900',
    paddingRight: 12,
  },
  changePill: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    minWidth: 76,
    justifyContent: 'center',
    paddingHorizontal: 9,
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
    fontSize: 11,
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
  signalCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
    marginBottom: 2,
    padding: 14,
    ...shadows.soft,
  },
  signalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  signalTitleGroup: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingRight: 10,
  },
  signalIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    marginRight: 10,
    width: 36,
  },
  signalTitleText: {
    flex: 1,
  },
  signalEyebrow: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  signalTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
  },
  signalPill: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minWidth: 66,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  signalPillText: {
    fontSize: 11,
    fontWeight: '900',
  },
  signalSummary: {
    color: colors.mutedSoft,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: 12,
  },
  signalMetricRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingVertical: 10,
  },
  signalMetric: {
    flex: 1,
  },
  signalMetricLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 4,
  },
  signalMetricValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  fuelSignalList: {
    marginTop: 10,
  },
  fuelSignalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 28,
  },
  fuelSignalName: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    paddingRight: 10,
  },
  fuelSignalFuel: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 7,
  },
  fuelSignalValue: {
    color: colors.mutedSoft,
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'right',
  },
  signalDisclaimer: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
    marginTop: 8,
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
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
  chartArea: {
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingTop: 14,
    paddingBottom: 10,
  },
  chartPlot: {
    position: 'relative',
  },
  gridLine: {
    backgroundColor: '#243653',
    height: 1,
    left: 0,
    opacity: 0.85,
    position: 'absolute',
    right: 0,
  },
  lineLayer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  lineSegment: {
    borderRadius: 999,
    position: 'absolute',
  },
  chartPoint: {
    borderRadius: 999,
    borderWidth: 2,
    height: 6,
    position: 'absolute',
    width: 6,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dayLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    width: 30,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 12,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 7,
  },
  legendDot: {
    borderRadius: 999,
    height: 7,
    marginRight: 6,
    width: 7,
  },
  legendText: {
    color: colors.mutedSoft,
    fontSize: 11,
    fontWeight: '800',
  },
})
