import { View, Text, StyleSheet } from 'react-native'

export default function Gecmis() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>PompaMetre</Text>
        <Text style={styles.headerIcon}>i</Text>
      </View>

      <Text style={styles.title}>Fiyat Ge\u00e7mi\u015fi</Text>
      <Text style={styles.subtitle}>Son 30 g\u00fcnl\u00fck akaryak\u0131t de\u011fi\u015fim trendleri.</Text>

      <View style={styles.trendCard}>
        <Text style={styles.sectionLabel}>Ayl\u0131k Trend</Text>
        <View style={styles.legendRow}>
          <Text style={[styles.legendGreen, styles.legendItem]}>Benzin</Text>
          <Text style={[styles.legendBlue, styles.legendItem]}>Motorin</Text>
          <Text style={styles.legendOrange}>LPG</Text>
        </View>
        <View style={styles.chartBox}>
          <View style={styles.lineRow}>
            <View style={[styles.line, styles.greenLine, { width: 240 }]} />
          </View>
          <View style={styles.lineRow}>
            <View style={[styles.line, styles.blueLine, { width: 170 }]} />
          </View>
          <View style={styles.lineRow}>
            <View style={[styles.line, styles.orangeLine, { width: 110 }]} />
          </View>
        </View>
      </View>

      <View style={styles.lowestCard}>
        <View style={styles.lowestIcon}>
          <Text style={styles.lowestIconText}>T</Text>
        </View>
        <View style={styles.lowestInfo}>
          <Text style={styles.lowestLabel}>En Ucuz G\u00fcn</Text>
          <Text style={styles.lowestDate}>12 Mart</Text>
        </View>
        <View>
          <Text style={styles.lowestLabel}>Benzin (Ort.)</Text>
          <Text style={styles.lowestPrice}>39.45 TL</Text>
        </View>
      </View>

      <Text style={styles.changesTitle}>Son De\u011fi\u015fiklikler</Text>
      <View style={styles.changeRow}>
        <Text style={styles.changeDate}>15 Mart Cuma</Text>
        <Text style={styles.changeUp}>+1.53 TL</Text>
      </View>
      <View style={styles.changeRow}>
        <Text style={styles.changeDate}>12 Mart Sal\u0131</Text>
        <Text style={styles.changeDown}>-1.20 TL</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFF', paddingHorizontal: 16, paddingTop: 54 },
  header: {
    alignItems: 'center',
    backgroundColor: '#071426',
    flexDirection: 'row',
    height: 54,
    justifyContent: 'center',
    marginHorizontal: -16,
    marginTop: -54,
    paddingHorizontal: 16,
  },
  logo: { color: '#19E6B1', fontSize: 20, fontWeight: 'bold' },
  headerIcon: { color: '#19E6B1', fontSize: 20, fontWeight: '900', position: 'absolute', right: 16 },
  title: { color: '#DDE6F6', fontSize: 24, fontWeight: '900', marginTop: 24 },
  subtitle: { color: '#AAB8C8', fontSize: 13, fontWeight: '700', marginBottom: 20, marginTop: 4 },
  trendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 4,
    padding: 14,
    shadowColor: '#0A1A2F',
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  sectionLabel: { color: '#AAB8C8', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  legendRow: { flexDirection: 'row', marginBottom: 12, marginTop: 8 },
  legendItem: { marginRight: 12 },
  legendGreen: { color: '#19C9A1', fontSize: 11, fontWeight: '800' },
  legendBlue: { color: '#85A8D6', fontSize: 11, fontWeight: '800' },
  legendOrange: { color: '#FF8A4B', fontSize: 11, fontWeight: '800' },
  chartBox: {
    backgroundColor: '#071426',
    borderRadius: 7,
    height: 150,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 20,
  },
  lineRow: {
    marginVertical: 10,
  },
  line: {
    borderRadius: 999,
    height: 5,
  },
  greenLine: { backgroundColor: '#19E6B1' },
  blueLine: { backgroundColor: '#7E9FCF' },
  orangeLine: { backgroundColor: '#FF8A4B' },
  lowestCard: {
    alignItems: 'center',
    backgroundColor: '#17243A',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    padding: 14,
  },
  lowestIcon: {
    alignItems: 'center',
    backgroundColor: '#19C9A1',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  lowestIconText: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
  lowestInfo: { flex: 1, marginLeft: 12 },
  lowestLabel: { color: '#B8C7DA', fontSize: 11, fontWeight: '800' },
  lowestDate: { color: '#19E6B1', fontSize: 16, fontWeight: '900', marginTop: 3 },
  lowestPrice: { color: '#FFFFFF', fontSize: 15, fontWeight: '900', marginTop: 3, textAlign: 'right' },
  changesTitle: { color: '#DDE6F6', fontSize: 20, fontWeight: '900', marginTop: 26 },
  changeRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14 },
  changeDate: { color: '#AAB8C8', fontSize: 13, fontWeight: '800' },
  changeUp: { color: '#FF8F8F', fontSize: 16, fontWeight: '900' },
  changeDown: { color: '#19C9A1', fontSize: 16, fontWeight: '900' },
})
