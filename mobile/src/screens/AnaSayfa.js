import { StatusBar } from 'expo-status-bar'
import { View, Text, StyleSheet } from 'react-native'

const lira = '\u20ba'

const fuels = [
  { name: 'Benzin 95', price: `64.12 ${lira}`, change: `-0.45 ${lira}`, tone: 'good' },
  { name: 'Motorin', price: `66.45 ${lira}`, change: `+0.12 ${lira}`, tone: 'bad' },
  { name: 'LPG', price: `36.20 ${lira}`, change: `0.00 ${lira}`, tone: 'flat' },
]

export default function AnaSayfa() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.logo}>PompaMetre</Text>
        <Text style={styles.headerIcon}>i</Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>5 Temmuz 2026 Pazar</Text>
        <Text style={styles.meta}>Son G\u00fcncelleme: 10:45</Text>
      </View>

      {fuels.map((fuel) => (
        <View key={fuel.name} style={styles.card}>
          <View>
            <Text style={styles.badge}>{fuel.name}</Text>
            <Text style={styles.price}>{fuel.price}</Text>
          </View>
          <Text style={[styles.change, styles[fuel.tone]]}>{fuel.change}</Text>
        </View>
      ))}

      <View style={styles.chartCard}>
        <Text style={styles.sectionTitle}>7 G\u00fcnl\u00fck De\u011fi\u015fim</Text>
        <View style={styles.chartArea}>
          <View style={[styles.chartBar, { height: 34 }]} />
          <View style={[styles.chartBar, { height: 24 }]} />
          <View style={[styles.chartBar, { height: 30 }]} />
          <View style={[styles.chartBar, { height: 46 }]} />
          <View style={[styles.chartBar, { height: 20 }]} />
          <View style={[styles.chartBar, { height: 14 }]} />
        </View>
        <Text style={styles.chartHint}>Trend alan\u0131 Faz 2'de ger\u00e7ek veriye haz\u0131rlanacak.</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#071426', paddingHorizontal: 16, paddingTop: 54 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginBottom: 28 },
  logo: { color: '#19E6B1', fontSize: 22, fontWeight: 'bold' },
  headerIcon: { color: '#19E6B1', fontSize: 20, fontWeight: '900', position: 'absolute', right: 0 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  meta: { color: '#D7E4F5', fontSize: 11, fontWeight: '700' },
  card: {
    alignItems: 'center',
    backgroundColor: '#17243A',
    borderColor: '#243A5A',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    minHeight: 82,
    padding: 14,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#486B92',
    borderRadius: 4,
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  price: { color: '#DDEBFF', fontSize: 30, fontWeight: '900' },
  change: {
    borderRadius: 7,
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  good: { backgroundColor: '#103F46', color: '#19E6B1' },
  bad: { backgroundColor: '#421B2A', color: '#FF4D6D' },
  flat: { backgroundColor: '#26364F', color: '#B8C7DA' },
  chartCard: {
    backgroundColor: '#17243A',
    borderColor: '#243A5A',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
    padding: 14,
  },
  sectionTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '900', marginBottom: 18 },
  chartArea: {
    alignItems: 'flex-end',
    borderBottomColor: '#FF7449',
    borderBottomWidth: 3,
    flexDirection: 'row',
    height: 76,
    justifyContent: 'space-between',
  },
  chartBar: { backgroundColor: '#FF405A', borderRadius: 4, width: 28 },
  chartHint: { color: '#8FA3B8', fontSize: 11, marginTop: 12 },
})
