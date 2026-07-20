import { useEffect, useMemo, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { fuelTabs } from '../services/fuelData'
import { defaultVehicleProfile, loadVehicleProfile, saveVehicleProfile } from '../services/vehicleProfile'
import { useFuelData } from '../hooks/useFuelData'
import { colors, shadows } from '../theme'

function toNumber(value) {
  const parsed = Number.parseFloat(String(value).replace(',', '.'))
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

function formatCurrency(value) {
  return `${value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`
}

function formatNumber(value) {
  return value.toLocaleString('tr-TR', { maximumFractionDigits: 0 })
}

function Metric({ icon, label, value }) {
  return (
    <View style={styles.metric}>
      <View style={styles.metricIcon}><MaterialCommunityIcons name={icon} size={18} color={colors.accent} /></View>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue} numberOfLines={1}>{value}</Text>
    </View>
  )
}

export default function Aracim() {
  const { data, refresh, refreshing } = useFuelData()
  const [profile, setProfile] = useState(defaultVehicleProfile)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [saved, setSaved] = useState(false)
  const [cityPickerOpen, setCityPickerOpen] = useState(false)
  const [cityQuery, setCityQuery] = useState('')

  useEffect(() => {
    let mounted = true
    loadVehicleProfile().then((storedProfile) => {
      if (mounted) {
        setProfile(storedProfile)
        setLoadingProfile(false)
      }
    })
    return () => { mounted = false }
  }, [])

  const selectedFuel = fuelTabs.find((fuel) => fuel.key === profile.fuelKey) ?? fuelTabs[0]
  const selectedCity = data.prices.find((item) => item.city === profile.city) ?? data.prices[0]
  const price = Number(selectedCity?.[profile.fuelKey]) || 0
  const spentAmount = toNumber(profile.spentAmount)
  const distanceKm = toNumber(profile.distanceKm)
  const calculations = useMemo(() => {
    const costPerKm = distanceKm > 0 ? spentAmount / distanceKm : 0
    const purchasedLiters = price > 0 ? spentAmount / price : 0
    return {
      costPerKm,
      costPer100Km: costPerKm * 100,
      purchasedLiters,
      estimatedConsumption: distanceKm > 0 ? (purchasedLiters / distanceKm) * 100 : 0,
    }
  }, [distanceKm, price, spentAmount])
  const filteredCities = useMemo(() => {
    const query = cityQuery.trim().toLocaleLowerCase('tr-TR')
    return query ? data.prices.filter((item) => item.city.toLocaleLowerCase('tr-TR').includes(query)) : data.prices
  }, [cityQuery, data.prices])

  function updateProfile(field, value) {
    setSaved(false)
    setProfile((current) => ({ ...current, [field]: value }))
  }

  async function handleSave() {
    await saveVehicleProfile(profile)
    setSaved(true)
  }

  function selectCity(city) {
    updateProfile('city', city)
    setCityPickerOpen(false)
    setCityQuery('')
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerMark}><MaterialCommunityIcons name="car-outline" size={21} color={colors.accent} /></View>
          <View style={styles.headerText}>
            <Text style={styles.brand}>Aracım</Text>
            <Text style={styles.subtitle}>Yakıt maliyetini canlı fiyatlarla hesapla</Text>
          </View>
          <Pressable accessibilityLabel="Fiyatları yenile" onPress={refresh} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
            <MaterialCommunityIcons name="refresh" size={19} color={refreshing ? colors.muted : colors.accent} />
          </Pressable>
        </View>

        <View style={styles.priceStrip}>
          <View style={styles.priceStripIcon}><MaterialCommunityIcons name={selectedFuel.icon} size={17} color={colors.accent} /></View>
          <View style={styles.priceStripText}>
            <Text style={styles.priceStripLabel}>{selectedCity?.city ?? profile.city} · {selectedFuel.title}</Text>
            <Text style={styles.priceStripValue}>{formatCurrency(price)} / L</Text>
          </View>
          <Text style={styles.liveLabel}>{refreshing ? 'YENİLENİYOR' : 'CANLI'}</Text>
        </View>

        <Text style={styles.sectionTitle}>Sürüş hesabı</Text>
        <View style={styles.formCard}>
          <Text style={styles.fieldLabel}>Yakıt türü</Text>
          <View style={styles.fuelSelector}>
            {fuelTabs.map((fuel) => {
              const selected = fuel.key === profile.fuelKey
              return (
                <Pressable key={fuel.key} onPress={() => updateProfile('fuelKey', fuel.key)} style={({ pressed }) => [styles.fuelOption, selected && styles.fuelOptionActive, pressed && styles.pressed]}>
                  <MaterialCommunityIcons name={fuel.icon} size={17} color={selected ? colors.bg : colors.mutedSoft} />
                  <Text style={[styles.fuelOptionText, selected && styles.fuelOptionTextActive]}>{fuel.label}</Text>
                </Pressable>
              )
            })}
          </View>
          <Text style={styles.fieldLabel}>Şehir</Text>
          <Pressable accessibilityLabel="Şehir seç" onPress={() => setCityPickerOpen(true)} style={({ pressed }) => [styles.cityButton, pressed && styles.pressed]}>
            <View style={styles.cityButtonStart}>
              <MaterialCommunityIcons name="map-marker-outline" size={19} color={colors.accent} />
              <Text style={styles.cityButtonText}>{selectedCity?.city ?? profile.city}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={21} color={colors.muted} />
          </Pressable>
          <Text style={styles.fieldLabel}>Harcanan tutar</Text>
          <View style={styles.inputShell}>
            <TextInput value={profile.spentAmount} onChangeText={(value) => updateProfile('spentAmount', value)} keyboardType="decimal-pad" placeholder="500" placeholderTextColor={colors.muted} style={styles.input} />
            <Text style={styles.unit}>TL</Text>
          </View>
          <Text style={styles.fieldLabel}>Gidilen mesafe</Text>
          <View style={styles.inputShell}>
            <TextInput value={profile.distanceKm} onChangeText={(value) => updateProfile('distanceKm', value)} keyboardType="decimal-pad" placeholder="300" placeholderTextColor={colors.muted} style={styles.input} />
            <Text style={styles.unit}>km</Text>
          </View>
        </View>
        <Pressable onPress={handleSave} style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}>
          <MaterialCommunityIcons name={saved ? 'check' : 'content-save-outline'} size={18} color={colors.bg} />
          <Text style={styles.saveButtonText}>{saved ? 'Kaydedildi' : 'Bilgileri kaydet'}</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Maliyet özeti</Text>
        {loadingProfile ? <View style={styles.loadingBox}><ActivityIndicator color={colors.accent} /></View> : (
          <View style={styles.metricsGrid}>
            <Metric icon="road-variant" label="Km başına maliyet" value={formatCurrency(calculations.costPerKm)} />
            <Metric icon="speedometer" label="100 km maliyeti" value={formatCurrency(calculations.costPer100Km)} />
            <Metric icon="gas-station" label="Alınan yakıt" value={`${formatNumber(calculations.purchasedLiters)} L`} />
            <Metric icon="chart-line" label="Hesaplanan tüketim" value={`${formatNumber(calculations.estimatedConsumption)} L / 100 km`} />
          </View>
        )}
      </ScrollView>

      <Modal animationType="slide" visible={cityPickerOpen} transparent onRequestClose={() => setCityPickerOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setCityPickerOpen(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Şehir seç</Text>
              <Pressable accessibilityLabel="Şehir seçiciyi kapat" onPress={() => setCityPickerOpen(false)} style={styles.closeButton}><MaterialCommunityIcons name="close" size={20} color={colors.text} /></Pressable>
            </View>
            <View style={styles.searchShell}>
              <MaterialCommunityIcons name="magnify" size={19} color={colors.muted} />
              <TextInput autoFocus value={cityQuery} onChangeText={setCityQuery} placeholder="İl ara" placeholderTextColor={colors.muted} style={styles.searchInput} />
            </View>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              {filteredCities.map((city) => (
                <Pressable key={city.city} onPress={() => selectCity(city.city)} style={styles.cityOption}>
                  <Text style={styles.cityOptionName}>{city.city}</Text>
                  <View style={styles.cityOptionEnd}>
                    <Text style={styles.cityOptionPrice}>{formatCurrency(Number(city[profile.fuelKey]) || 0)}</Text>
                    {city.city === profile.city ? <MaterialCommunityIcons name="check" size={18} color={colors.accent} /> : null}
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 28 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  headerMark: { width: 38, height: 38, borderRadius: 8, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1, marginLeft: 10 }, brand: { color: colors.text, fontSize: 20, fontWeight: '800' }, subtitle: { color: colors.muted, fontSize: 12, marginTop: 2 },
  iconButton: { width: 38, height: 38, borderRadius: 8, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' }, pressed: { opacity: 0.72 },
  priceStrip: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border, borderRadius: 8, minHeight: 64, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', ...shadows.soft },
  priceStripIcon: { width: 34, height: 34, borderRadius: 8, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }, priceStripText: { flex: 1, marginLeft: 10 }, priceStripLabel: { color: colors.mutedSoft, fontSize: 12, fontWeight: '700' }, priceStripValue: { color: colors.text, fontSize: 16, fontWeight: '800', marginTop: 3 }, liveLabel: { color: colors.accent, fontSize: 10, fontWeight: '800' },
  sectionTitle: { color: colors.text, fontSize: 15, fontWeight: '800', marginTop: 24, marginBottom: 10 }, formCard: { backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.border, padding: 14, ...shadows.card }, fieldLabel: { color: colors.mutedSoft, fontSize: 12, fontWeight: '700', marginBottom: 7 },
  fuelSelector: { flexDirection: 'row', gap: 7, marginBottom: 17 }, fuelOption: { flex: 1, minHeight: 40, borderRadius: 7, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 5 }, fuelOptionActive: { borderColor: colors.accent, backgroundColor: colors.accent }, fuelOptionText: { color: colors.mutedSoft, fontSize: 12, fontWeight: '800' }, fuelOptionTextActive: { color: colors.bg },
  cityButton: { height: 48, backgroundColor: colors.bgSoft, borderRadius: 7, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 17 }, cityButtonStart: { flexDirection: 'row', alignItems: 'center', gap: 8 }, cityButtonText: { color: colors.text, fontSize: 14, fontWeight: '700' },
  inputRow: { flexDirection: 'row', gap: 10 }, inputGroup: { flex: 1 }, inputShell: { minHeight: 47, borderRadius: 7, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgSoft, paddingLeft: 11, paddingRight: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 17 }, input: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '700', paddingVertical: 9 }, unit: { color: colors.muted, fontSize: 11, fontWeight: '700', textAlign: 'right' },
  saveButton: { minHeight: 46, borderRadius: 8, marginTop: 12, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }, saveButtonText: { color: colors.bg, fontSize: 14, fontWeight: '800' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, metric: { width: '48.5%', minHeight: 120, backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.border, padding: 12, justifyContent: 'space-between', ...shadows.soft }, metricIcon: { width: 31, height: 31, borderRadius: 7, backgroundColor: colors.accentSoft, justifyContent: 'center', alignItems: 'center' }, metricLabel: { color: colors.muted, fontSize: 11, fontWeight: '700', marginTop: 10 }, metricValue: { color: colors.text, fontSize: 15, fontWeight: '800', marginTop: 4 }, loadingBox: { minHeight: 110, justifyContent: 'center', alignItems: 'center' },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000099' }, modalSheet: { height: '76%', backgroundColor: colors.bg, borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingHorizontal: 18, paddingTop: 14, paddingBottom: 22 }, modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }, modalTitle: { color: colors.text, fontSize: 18, fontWeight: '800' }, closeButton: { width: 36, height: 36, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }, searchShell: { height: 46, borderRadius: 7, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 8 }, searchInput: { flex: 1, color: colors.text, fontSize: 14, marginLeft: 8, paddingVertical: 8 }, cityOption: { minHeight: 53, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, cityOptionName: { color: colors.text, fontSize: 14, fontWeight: '700' }, cityOptionEnd: { flexDirection: 'row', alignItems: 'center', gap: 8 }, cityOptionPrice: { color: colors.mutedSoft, fontSize: 12, fontWeight: '700' },
})
