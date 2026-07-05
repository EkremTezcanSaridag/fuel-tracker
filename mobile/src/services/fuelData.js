import { colors } from '../theme'
import { supabase } from '../supabase'

export const fuelTabs = [
  { label: 'Benzin', icon: 'gas-station' },
  { label: 'Motorin', icon: 'truck-outline' },
  { label: 'LPG', icon: 'fire' },
]

export const provinceNames = [
  'Adana',
  'Adıyaman',
  'Afyonkarahisar',
  'Ağrı',
  'Amasya',
  'Ankara',
  'Antalya',
  'Artvin',
  'Aydın',
  'Balıkesir',
  'Bilecik',
  'Bingöl',
  'Bitlis',
  'Bolu',
  'Burdur',
  'Bursa',
  'Çanakkale',
  'Çankırı',
  'Çorum',
  'Denizli',
  'Diyarbakır',
  'Edirne',
  'Elazığ',
  'Erzincan',
  'Erzurum',
  'Eskişehir',
  'Gaziantep',
  'Giresun',
  'Gümüşhane',
  'Hakkari',
  'Hatay',
  'Isparta',
  'Mersin',
  'İstanbul',
  'İzmir',
  'Kars',
  'Kastamonu',
  'Kayseri',
  'Kırklareli',
  'Kırşehir',
  'Kocaeli',
  'Konya',
  'Kütahya',
  'Malatya',
  'Manisa',
  'Kahramanmaraş',
  'Mardin',
  'Muğla',
  'Muş',
  'Nevşehir',
  'Niğde',
  'Ordu',
  'Rize',
  'Sakarya',
  'Samsun',
  'Siirt',
  'Sinop',
  'Sivas',
  'Tekirdağ',
  'Tokat',
  'Trabzon',
  'Tunceli',
  'Şanlıurfa',
  'Uşak',
  'Van',
  'Yozgat',
  'Zonguldak',
  'Aksaray',
  'Bayburt',
  'Karaman',
  'Kırıkkale',
  'Batman',
  'Şırnak',
  'Bartın',
  'Ardahan',
  'Iğdır',
  'Yalova',
  'Karabük',
  'Kilis',
  'Osmaniye',
  'Düzce',
]

const highlightedCities = {
  Adana: { benzin95: 63.95, motorin: 66.24, lpg: 36.08, change: -0.12, stations: 386 },
  Ankara: { benzin95: 64.1, motorin: 66.41, lpg: 36.22, change: 0.03, stations: 842 },
  Antalya: { benzin95: 64.02, motorin: 66.38, lpg: 36.18, change: -0.05, stations: 438 },
  İstanbul: { benzin95: 64.12, motorin: 66.45, lpg: 36.2, change: 0.05, stations: 1248 },
  İzmir: { benzin95: 64.08, motorin: 66.39, lpg: 36.25, change: 0.01, stations: 716 },
}

const fallbackHistory = [
  { date: '2026-02-13', benzin95: 63.66, motorin: 66.2, lpg: 36.04, benzinChange: -0.18, motorinChange: 0.02, lpgChange: 0 },
  { date: '2026-02-18', benzin95: 63.92, motorin: 66.04, lpg: 36.09, benzinChange: 0.26, motorinChange: -0.16, lpgChange: 0.05 },
  { date: '2026-02-23', benzin95: 64.04, motorin: 66.22, lpg: 36.12, benzinChange: 0.12, motorinChange: 0.18, lpgChange: 0.03 },
  { date: '2026-02-28', benzin95: 64.01, motorin: 66.31, lpg: 36.14, benzinChange: -0.03, motorinChange: 0.09, lpgChange: 0.02 },
  { date: '2026-03-05', benzin95: 64.11, motorin: 66.55, lpg: 36.99, benzinChange: 0.1, motorinChange: 0.24, lpgChange: 0.85 },
  { date: '2026-03-12', benzin95: 64, motorin: 65.35, lpg: 36.18, benzinChange: -0.11, motorinChange: -1.2, lpgChange: -0.81 },
  { date: '2026-03-15', benzin95: 65.53, motorin: 66.46, lpg: 36.23, benzinChange: 1.53, motorinChange: 1.11, lpgChange: 0.05 },
]

const fallbackUpdatedAt = '2026-07-05 10:45'
const monthNames = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
]
const shortMonthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
const weekDayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']

function parseFuelValue(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value !== 'string') {
    return null
  }

  const parsed = Number.parseFloat(
    value
      .replace('₺', '')
      .replace('TL', '')
      .replace(/\s/g, '')
      .replace(',', '.'),
  )

  return Number.isFinite(parsed) ? parsed : null
}

function formatCurrency(value) {
  return `${value.toFixed(2)} ₺`
}

function formatChange(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)} ₺`
}

function formatStationCount(value) {
  return `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} istasyon`
}

function formatShortDate(dateValue) {
  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return dateValue
  }

  return `${String(date.getDate()).padStart(2, '0')} ${shortMonthNames[date.getMonth()]}`
}

function formatLongDate(dateValue) {
  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return dateValue
  }

  return `${String(date.getDate()).padStart(2, '0')} ${monthNames[date.getMonth()]} ${weekDayNames[date.getDay()]}`
}

function formatTodayLabel() {
  const date = new Date()

  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()} ${weekDayNames[date.getDay()]}`
}

function formatUpdatedLabel(value) {
  if (!value) {
    return '10:45'
  }

  const date = new Date(String(value).replace(' ', 'T'))

  if (!Number.isNaN(date.getTime())) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  const timeMatch = String(value).match(/\d{1,2}:\d{2}/)
  return timeMatch?.[0] ?? '10:45'
}

function getFallbackCity(name, index) {
  const known = highlightedCities[name]

  if (known) {
    return known
  }

  const safeIndex = index >= 0 ? index : 0
  const base = 64 + ((safeIndex * 7) % 37) / 100

  return {
    benzin95: base,
    motorin: base + 2.28 + ((safeIndex % 5) - 2) / 100,
    lpg: 36.05 + ((safeIndex * 3) % 26) / 100,
    change: ((safeIndex % 9) - 4) / 100,
    stations: 96 + ((safeIndex * 37) % 420),
  }
}

function createFallbackPrices() {
  return provinceNames.map((city, index) => {
    const fallback = getFallbackCity(city, index)

    return {
      city,
      benzin95: fallback.benzin95,
      motorin: fallback.motorin,
      lpg: fallback.lpg,
      change: fallback.change,
      stations: fallback.stations,
      updatedAt: fallbackUpdatedAt,
    }
  })
}

function normalizePriceRecord(record, index) {
  const city = record.il ?? record.city ?? record.name ?? provinceNames[index]
  const fallback = getFallbackCity(city, provinceNames.indexOf(city))

  return {
    city,
    benzin95: parseFuelValue(record.benzin_95 ?? record.benzin95) ?? fallback.benzin95,
    motorin: parseFuelValue(record.motorin) ?? fallback.motorin,
    lpg: parseFuelValue(record.lpg) ?? fallback.lpg,
    change: parseFuelValue(record.degisim ?? record.change) ?? fallback.change,
    stations: Number(record.istasyon ?? record.stations) || fallback.stations,
    updatedAt: record.guncelleme ?? record.updated_at ?? fallbackUpdatedAt,
  }
}

function normalizeHistoryRecord(record) {
  return {
    date: record.tarih ?? record.date,
    benzin95: parseFuelValue(record.benzin_95 ?? record.benzin95) ?? 0,
    motorin: parseFuelValue(record.motorin) ?? 0,
    lpg: parseFuelValue(record.lpg) ?? 0,
    benzinChange: parseFuelValue(record.benzin_degisim ?? record.benzinChange) ?? 0,
    motorinChange: parseFuelValue(record.motorin_degisim ?? record.motorinChange) ?? 0,
    lpgChange: parseFuelValue(record.lpg_degisim ?? record.lpgChange) ?? 0,
  }
}

function mergePricesWithFallback(records) {
  const incomingByCity = new Map(records.map((record) => [record.city, record]))

  return provinceNames.map((city, index) => {
    const incoming = incomingByCity.get(city)

    if (incoming) {
      return incoming
    }

    const fallback = getFallbackCity(city, index)

    return {
      city,
      benzin95: fallback.benzin95,
      motorin: fallback.motorin,
      lpg: fallback.lpg,
      change: fallback.change,
      stations: fallback.stations,
      updatedAt: fallbackUpdatedAt,
    }
  })
}

function average(values) {
  const validValues = values.filter((value) => Number.isFinite(value))

  if (!validValues.length) {
    return 0
  }

  return validValues.reduce((total, value) => total + value, 0) / validValues.length
}

function getTone(change) {
  if (change > 0) {
    return 'bad'
  }

  if (change < 0) {
    return 'good'
  }

  return 'flat'
}

function buildHomeFuels(prices, history) {
  const latestHistory = history[history.length - 1]
  const benzinChange = latestHistory?.benzinChange ?? -0.45
  const motorinChange = latestHistory?.motorinChange ?? 0.12
  const lpgChange = latestHistory?.lpgChange ?? 0

  return [
    {
      name: 'Benzin 95',
      price: formatCurrency(average(prices.map((item) => item.benzin95))),
      change: formatChange(benzinChange),
      tone: getTone(benzinChange),
      badgeColor: '#4B7FC8',
    },
    {
      name: 'Motorin',
      price: formatCurrency(average(prices.map((item) => item.motorin))),
      change: formatChange(motorinChange),
      tone: getTone(motorinChange),
      badgeColor: '#60758F',
    },
    {
      name: 'LPG',
      price: formatCurrency(average(prices.map((item) => item.lpg))),
      change: formatChange(lpgChange),
      tone: getTone(lpgChange),
      badgeColor: colors.warning,
    },
  ]
}

function buildCityRows(prices) {
  return [...prices]
    .sort((first, second) => first.benzin95 - second.benzin95)
    .map((item) => ({
      name: item.city,
      price: formatCurrency(item.benzin95),
      change: formatChange(item.change),
      stations: formatStationCount(item.stations),
    }))
}

function buildHomeTrendSeries(history) {
  const recent = history.slice(-7)

  return [
    {
      key: 'Benzin',
      color: colors.info,
      values: recent.map((item) => item.benzin95),
      strokeWidth: 2,
      opacity: 0.55,
    },
    {
      key: 'Motorin',
      color: colors.danger,
      values: recent.map((item) => item.motorin),
      strokeWidth: 4,
      opacity: 1,
    },
    {
      key: 'LPG',
      color: colors.warning,
      values: recent.map((item) => item.lpg),
      strokeWidth: 3,
      opacity: 0.82,
    },
  ]
}

function buildHistoryTrendSeries(history) {
  const recent = history.slice(-7)

  return [
    {
      key: 'Benzin',
      color: colors.accent,
      values: recent.map((item) => item.benzin95),
      strokeWidth: 4,
    },
    {
      key: 'Motorin',
      color: colors.info,
      values: recent.map((item) => item.motorin),
      strokeWidth: 3,
    },
    {
      key: 'LPG',
      color: colors.warning,
      values: recent.map((item) => item.lpg),
      strokeWidth: 3,
    },
  ]
}

function buildHistoryDomain(history) {
  const values = history.flatMap((item) => [item.benzin95, item.motorin, item.lpg])
  const min = Math.min(...values)
  const max = Math.max(...values)

  return {
    min: Math.max(0, Math.floor(min - 2)),
    max: Math.ceil(max + 2),
  }
}

function buildHistoryLabels(history) {
  const recent = history.slice(-7)

  if (recent.length < 3) {
    return ['13 Şub', '28 Şub', '15 Mar']
  }

  return [recent[0], recent[Math.floor(recent.length / 2)], recent[recent.length - 1]].map((item) =>
    formatShortDate(item.date),
  )
}

function buildRecentChanges(history) {
  const latest = [...history].reverse().slice(0, 3)

  return latest.map((item) => {
    const changes = [
      { tag: 'Benzin', value: item.benzinChange },
      { tag: 'Motorin', value: item.motorinChange },
      { tag: 'LPG', value: item.lpgChange },
    ]
    const largest = changes.reduce((selected, change) =>
      Math.abs(change.value) > Math.abs(selected.value) ? change : selected,
    )

    return {
      date: formatLongDate(item.date),
      tag: largest.tag,
      value: `${largest.value >= 0 ? '+' : ''}${largest.value.toFixed(2)} TL`,
      desc:
        largest.value > 0
          ? 'Pompa fiyatı güncellendi.'
          : largest.value < 0
            ? 'İndirim pompa fiyatlarına yansıdı.'
            : 'Gün içi değişim kaydı.',
      tone: largest.value > 0 ? 'up' : 'down',
    }
  })
}

function buildFuelData({ prices, history, source, error }) {
  const cityRows = buildCityRows(prices)
  const latestUpdatedAt = prices.find((item) => item.updatedAt)?.updatedAt

  return {
    bestCity: cityRows[0],
    cities: cityRows,
    currentDateLabel: formatTodayLabel(),
    error,
    history,
    historyChartDomain: buildHistoryDomain(history),
    historyChartLabels: buildHistoryLabels(history),
    historyMetrics: [
      { label: 'En Ucuz Gün', value: '12 Mart', icon: 'calendar-month', tone: 'accent' },
      {
        label: 'Ortalama Benzin',
        value: formatCurrency(average(prices.map((item) => item.benzin95))),
        icon: 'gas-station',
        tone: 'info',
      },
    ],
    historyTrendSeries: buildHistoryTrendSeries(history),
    homeFuels: buildHomeFuels(prices, history),
    homeTrendSeries: buildHomeTrendSeries(history),
    lastUpdatedLabel: formatUpdatedLabel(latestUpdatedAt),
    prices,
    recentChanges: buildRecentChanges(history),
    source,
  }
}

async function fetchRemoteFuelData() {
  if (!supabase) {
    return null
  }

  const [pricesResult, historyResult] = await Promise.all([
    supabase.from('fiyatlar').select('il, benzin_95, motorin, lpg, guncelleme'),
    supabase
      .from('gecmis')
      .select('tarih, benzin_95, motorin, lpg, benzin_degisim, motorin_degisim, lpg_degisim')
      .order('tarih', { ascending: true })
      .limit(30),
  ])

  if (pricesResult.error) {
    throw pricesResult.error
  }

  const remotePrices = pricesResult.data?.map(normalizePriceRecord) ?? []
  const remoteHistory = historyResult.error ? [] : historyResult.data?.map(normalizeHistoryRecord) ?? []

  if (!remotePrices.length) {
    return null
  }

  return {
    history: remoteHistory.length >= 2 ? remoteHistory : fallbackHistory,
    prices: mergePricesWithFallback(remotePrices),
    source: 'supabase',
  }
}

const fallbackFuelData = buildFuelData({
  history: fallbackHistory,
  prices: createFallbackPrices(),
  source: 'fallback',
})

let fuelDataCache = null

export async function loadFuelData({ refresh = false } = {}) {
  if (fuelDataCache && !refresh) {
    return fuelDataCache
  }

  try {
    const remoteFuelData = await fetchRemoteFuelData()

    fuelDataCache = remoteFuelData ? buildFuelData(remoteFuelData) : fallbackFuelData
  } catch (error) {
    fuelDataCache = {
      ...fallbackFuelData,
      error,
    }
  }

  return fuelDataCache
}

export { fallbackFuelData }
