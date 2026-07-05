import { View, Text, StyleSheet } from 'react-native'

const lira = '\u20ba'

const cities = [
  { name: '\u0130stanbul', price: `64.12 ${lira}`, change: `+0.05 ${lira}` },
  { name: 'Ankara', price: `64.10 ${lira}`, change: `+0.03 ${lira}` },
  { name: '\u0130zmir', price: `64.08 ${lira}`, change: `+0.01 ${lira}` },
  { name: 'Antalya', price: `64.02 ${lira}`, change: `-0.05 ${lira}` },
  { name: 'Adana', price: `63.95 ${lira}`, change: `-0.12 ${lira}` },
]

export default function Iller() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>PompaMetre</Text>
        <Text style={styles.headerIcon}>i</Text>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchText}>{'\u0130l ara...'}</Text>
      </View>

      <Text style={styles.title}>{'\u015eehir Bazl\u0131 Fiyatlar (Benzin)'}</Text>

      {cities.map((city) => (
        <View key={city.name} style={styles.cityCard}>
          <View style={styles.cityIcon}>
            <Text style={styles.cityIconText}>B</Text>
          </View>
          <View style={styles.cityInfo}>
            <Text style={styles.cityName}>{city.name}</Text>
            <Text style={styles.cityChange}>{city.change} ort. fiyattan</Text>
          </View>
          <Text style={styles.price}>{city.price}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#071426', paddingHorizontal: 16, paddingTop: 54 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginBottom: 22 },
  logo: { color: '#19E6B1', fontSize: 22, fontWeight: 'bold' },
  headerIcon: { color: '#19E6B1', fontSize: 20, fontWeight: '900', position: 'absolute', right: 0 },
  searchBox: {
    backgroundColor: '#0D1F34',
    borderColor: '#17324F',
    borderRadius: 8,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  searchText: { color: '#B9C9DC', fontSize: 14, fontWeight: '700' },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', marginBottom: 14 },
  cityCard: {
    alignItems: 'center',
    backgroundColor: '#17243A',
    borderColor: '#243A5A',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    minHeight: 72,
    padding: 12,
  },
  cityIcon: {
    alignItems: 'center',
    backgroundColor: '#0D1F34',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    marginRight: 12,
    width: 36,
  },
  cityIconText: { color: '#9ADFD2', fontSize: 13, fontWeight: '900' },
  cityInfo: { flex: 1 },
  cityName: { color: '#DDEBFF', fontSize: 16, fontWeight: '900' },
  cityChange: { color: '#9BEAC8', fontSize: 11, fontWeight: '700', marginTop: 4 },
  price: { color: '#DDEBFF', fontSize: 20, fontWeight: '900' },
})
