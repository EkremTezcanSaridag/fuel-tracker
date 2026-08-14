import { Linking } from 'react-native'

export const stationBrands = [
  { id: 'all', name: 'Tümü', icon: 'gas-station' },
  { id: 'shell', name: 'Shell', color: '#FFD700', icon: 'shell' },
  { id: 'opet', name: 'Opet', color: '#00529B', icon: 'alpha-o-circle' },
  { id: 'po', name: 'Petrol Ofisi', color: '#E30613', icon: 'alpha-p-circle' },
  { id: 'aytemiz', name: 'Aytemiz', color: '#ED1C24', icon: 'alpha-a-circle' },
  { id: 'total', name: 'TotalEnergies', color: '#003399', icon: 'alpha-t-circle' },
  { id: 'tp', name: 'Türkiye Petrolleri', color: '#E30613', icon: 'alpha-t-box' },
]

export const mockStations = [
  {
    id: 'st-1',
    name: 'Opet Kadıköy Rıhtım',
    brand: 'Opet',
    brandId: 'opet',
    city: 'İstanbul',
    district: 'Kadıköy',
    address: 'Caferağa Mah. Rıhtım Cad. No: 42, Kadıköy / İstanbul',
    latitude: 40.9912,
    longitude: 29.0254,
    distanceKm: 0.8,
    isOpen247: true,
    benzin95: 71.31,
    motorin: 79.80,
    lpg: 36.20,
    services: ['Market', 'Oto Yıkama', 'Mescit', 'Hızlı Şarj'],
    rating: 4.8,
  },
  {
    id: 'st-2',
    name: 'Shell Ataşehir Barbaros',
    brand: 'Shell',
    brandId: 'shell',
    city: 'İstanbul',
    district: 'Ataşehir',
    address: 'Barbaros Mah. Halk Cad. No: 18, Ataşehir / İstanbul',
    latitude: 40.9856,
    longitude: 29.1082,
    distanceKm: 1.4,
    isOpen247: true,
    benzin95: 71.25,
    motorin: 79.75,
    lpg: 36.15,
    services: ['Shell Select Market', 'Oto Yıkama', 'WC', 'Kahve'],
    rating: 4.9,
  },
  {
    id: 'st-3',
    name: 'Petrol Ofisi Üsküdar Sahil',
    brand: 'Petrol Ofisi',
    brandId: 'po',
    city: 'İstanbul',
    district: 'Üsküdar',
    address: 'Mimar Sinan Mah. Paşalimanı Cad. No: 5, Üsküdar / İstanbul',
    latitude: 41.0267,
    longitude: 29.0158,
    distanceKm: 2.1,
    isOpen247: true,
    benzin95: 71.18,
    motorin: 79.68,
    lpg: 36.10,
    services: ['PO Market', 'Oto Yıkama', 'Hava/Su'],
    rating: 4.7,
  },
  {
    id: 'st-4',
    name: 'Aytemiz Maltepe E-5',
    brand: 'Aytemiz',
    brandId: 'aytemiz',
    city: 'İstanbul',
    district: 'Maltepe',
    address: 'Zümrütevler Mah. E-5 Yanyol No: 110, Maltepe / İstanbul',
    latitude: 40.9389,
    longitude: 29.1412,
    distanceKm: 3.5,
    isOpen247: true,
    benzin95: 70.95,
    motorin: 79.45,
    lpg: 35.95,
    services: ['ON/OFF Market', 'Yıkama', 'Mescit'],
    rating: 4.6,
  },
  {
    id: 'st-5',
    name: 'TotalEnergies Beşiktaş Meydan',
    brand: 'TotalEnergies',
    brandId: 'total',
    city: 'İstanbul',
    district: 'Beşiktaş',
    address: 'Sinanpaşa Mah. Barbaros Bulvarı No: 14, Beşiktaş / İstanbul',
    latitude: 41.0422,
    longitude: 29.0083,
    distanceKm: 4.2,
    isOpen247: true,
    benzin95: 71.35,
    motorin: 79.85,
    lpg: 36.25,
    services: ['Bonjour Market', 'Kahve', 'Elektrikli Şarj'],
    rating: 4.8,
  },
  {
    id: 'st-6',
    name: 'TP Petrolleri Çankaya Eskişehir Yolu',
    brand: 'Türkiye Petrolleri',
    brandId: 'tp',
    city: 'Ankara',
    district: 'Çankaya',
    address: 'Mustafa Kemal Mah. Dumlupınar Bulvarı No: 150, Çankaya / Ankara',
    latitude: 39.9082,
    longitude: 32.7845,
    distanceKm: 1.9,
    isOpen247: true,
    benzin95: 71.10,
    motorin: 79.60,
    lpg: 36.05,
    services: ['TP Market', 'Oto Yıkama', 'Mescit'],
    rating: 4.7,
  },
]

export function getNearbyStations({ brandId = 'all', sortBy = 'distance', search = '' } = {}) {
  let filtered = [...mockStations]

  if (brandId && brandId !== 'all') {
    filtered = filtered.filter((s) => s.brandId === brandId)
  }

  if (search.trim()) {
    const query = search.toLowerCase().trim()
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.district.toLowerCase().includes(query) ||
        s.city.toLowerCase().includes(query) ||
        s.brand.toLowerCase().includes(query),
    )
  }

  if (sortBy === 'price') {
    filtered.sort((a, b) => a.benzin95 - b.benzin95)
  } else {
    filtered.sort((a, b) => a.distanceKm - b.distanceKm)
  }

  return filtered
}

export function openStationDirections(station) {
  const query = encodeURIComponent(`${station.name}, ${station.address}`)
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`
  Linking.openURL(url).catch(() => {
    alert('Harita uygulaması açılamadı.')
  })
}
