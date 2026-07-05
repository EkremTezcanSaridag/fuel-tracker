import { useMemo } from 'react'
import { StatusBar } from 'expo-status-bar'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import { colors, shadows } from '../theme'

const trendSeries = [
  {
    key: 'Benzin',
    color: colors.accent,
    values: [39.9, 39.7, 39.8, 40.2, 40.8, 40.4, 41.1],
    strokeWidth: 4,
  },
  {
    key: 'Motorin',
    color: colors.info,
    values: [41.2, 41.0, 40.8, 41.4, 41.7, 40.9, 42.0],
    strokeWidth: 3,
  },
  {
    key: 'LPG',
    color: colors.warning,
    values: [20.8, 20.9, 20.9, 21.0, 21.0, 21.1, 21.2],
    strokeWidth: 3,
  },
]

const chartLabels = ['13 Şub', '28 Şub', '15 Mar']
const chartHeight = 146
const chartDomain = { min: 20, max: 43 }

const metrics = [
  { label: 'En Ucuz Gün', value: '12 Mart', icon: 'calendar-month', tone: 'accent' },
  { label: 'Ortalama Benzin', value: '40.56 ₺', icon: 'gas-station', tone: 'info' },
]

const recentChanges = [
  {
    date: '15 Mart Cuma',
    tag: 'Benzin',
    value: '+1.53 TL',
    desc: 'Gece yarısından itibaren geçerli.',
    tone: 'up',
  },
  {
    date: '12 Mart Salı',
    tag: 'Motorin',
    value: '-1.20 TL',
    desc: 'İndirim pompa fiyatlarına yansıdı.',
    tone: 'down',
  },
  {
    date: '05 Mart Salı',
    tag: 'LPG',
    value: '+0.85 TL',
    desc: 'Otogaz fiyatı güncellendi.',
    tone: 'up',
  },
]

function buildPoints(values, chartWidth) {
  const horizontalPadding = 8
  const verticalPadding = 12
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

export default function Gecmis() {
  const { width } = useWindowDimensions()
  const chartWidth = Math.max(218, Math.min(width - 92, 330))

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
    [chartWidth],
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerMark}>
            <MaterialCommunityIcons name="chart-line" size={18} color={colors.accent} />
          </View>
          <Text style={styles.brand}>PompaMetre</Text>
          <MaterialCommunityIcons name="account-circle-outline" size={21} color={colors.accent} />
        </View>

        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <Text style={styles.title}>Fiyat Geçmişi</Text>
            <Text style={styles.subtitle}>Son 30 günlük akaryakıt değişim trendleri.</Text>
          </View>
          <View style={styles.periodBadge}>
            <Text style={styles.periodBadgeText}>30 Gün</Text>
          </View>
        </View>

        <View style={styles.trendCard}>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.sectionLabel}>Aylık Trend</Text>
              <View style={styles.legendRow}>
                {trendSeries.map((item) => (
                  <View key={item.key} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.key}</Text>
                  </View>
                ))}
              </View>
            </View>
            <MaterialCommunityIcons name="chart-timeline-variant" size={20} color={colors.mutedSoft} />
          </View>

          <View style={styles.chartBox}>
            <View style={[styles.chartPlot, { width: chartWidth, height: chartHeight }]}>
              <View style={[styles.gridLine, { top: 28 }]} />
              <View style={[styles.gridLine, { top: 72 }]} />
              <View style={[styles.gridLine, { top: 116 }]} />

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
                          backgroundColor: series.key === 'Benzin' ? series.color : colors.bg,
                          borderColor: series.color,
                          left: point.x - 3,
                          top: point.y - 3,
                        },
                      ]}
                    />
                  ))}
                </View>
              ))}
            </View>

            <View style={[styles.chartLabels, { width: chartWidth }]}>
              {chartLabels.map((label) => (
                <Text key={label} style={styles.chartLabel}>
                  {label}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.metricsRow}>
          {metrics.map((metric) => (
            <View key={metric.label} style={styles.metricCard}>
              <View style={[styles.metricIcon, metric.tone === 'info' && styles.metricIconInfo]}>
                <MaterialCommunityIcons
                  name={metric.icon}
                  size={17}
                  color={metric.tone === 'info' ? colors.info : colors.accent}
                />
              </View>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricValue}>{metric.value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.changesTitle}>Son Değişiklikler</Text>

        <View style={styles.changesCard}>
          {recentChanges.map((change, index) => (
            <View key={change.date} style={[styles.changeRow, index !== recentChanges.length - 1 && styles.changeDivider]}>
              <View style={styles.changeDotWrap}>
                <MaterialCommunityIcons
                  name={change.tone === 'up' ? 'arrow-up-bold' : 'arrow-down-bold'}
                  size={14}
                  color={change.tone === 'up' ? colors.warning : colors.accent}
                />
              </View>
              <View style={styles.changeCopy}>
                <View style={styles.changeTitleRow}>
                  <Text style={styles.changeDate} numberOfLines={1}>
                    {change.date}
                  </Text>
                  <View style={styles.changeTag}>
                    <Text style={styles.changeTagText}>{change.tag}</Text>
                  </View>
                </View>
                <Text style={styles.changeDesc}>{change.desc}</Text>
              </View>
              <Text style={[styles.changeValue, change.tone === 'up' ? styles.changeUp : styles.changeDown]}>
                {change.value}
              </Text>
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
  periodBadge: {
    backgroundColor: colors.bgSoft,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  periodBadgeText: {
    color: colors.mutedSoft,
    fontSize: 11,
    fontWeight: '900',
  },
  trendCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
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
    color: colors.mutedSoft,
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
    marginBottom: 6,
  },
  legendDot: {
    borderRadius: 999,
    height: 7,
    marginRight: 6,
    width: 7,
  },
  legendText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  chartBox: {
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
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chartLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    width: 58,
  },
  metricsRow: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginTop: 12,
  },
  metricCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    ...shadows.soft,
  },
  metricIcon: {
    alignItems: 'center',
    backgroundColor: colors.accentDark,
    borderRadius: 8,
    height: 34,
    justifyContent: 'center',
    marginBottom: 10,
    width: 34,
  },
  metricIconInfo: {
    backgroundColor: '#172C4A',
  },
  metricLabel: {
    color: colors.mutedSoft,
    fontSize: 11,
    fontWeight: '800',
  },
  metricValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 4,
  },
  changesTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 22,
    marginBottom: 10,
  },
  changesCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    ...shadows.card,
  },
  changeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 74,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  changeDivider: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  changeDotWrap: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderRadius: 999,
    height: 30,
    justifyContent: 'center',
    marginRight: 10,
    width: 30,
  },
  changeCopy: {
    flex: 1,
    paddingRight: 10,
  },
  changeTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  changeDate: {
    color: colors.text,
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '900',
    marginRight: 8,
  },
  changeDesc: {
    color: colors.mutedSoft,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 5,
  },
  changeTag: {
    backgroundColor: colors.bgSoft,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  changeTagText: {
    color: colors.mutedSoft,
    fontSize: 10,
    fontWeight: '900',
  },
  changeValue: {
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'right',
    width: 74,
  },
  changeUp: {
    color: colors.danger,
  },
  changeDown: {
    color: colors.accent,
  },
})
