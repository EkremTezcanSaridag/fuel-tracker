import { Linking } from 'react-native'

export const stationBrands = [
  { id: 'all', name: 'Tüm Markalar', icon: 'gas-station' },
  { id: 'shell', name: 'Shell', color: '#FFD700', icon: 'shell' },
  { id: 'opet', name: 'Opet', color: '#00529B', icon: 'alpha-o-circle' },
  { id: 'po', name: 'Petrol Ofisi', color: '#E30613', icon: 'alpha-p-circle' },
  { id: 'aytemiz', name: 'Aytemiz', color: '#ED1C24', icon: 'alpha-a-circle' },
  { id: 'total', name: 'TotalEnergies', color: '#003399', icon: 'alpha-t-circle' },
  { id: 'tp', name: 'Türkiye Petrolleri', color: '#E30613', icon: 'alpha-t-box' },
]

export const stationCities = ['Tüm Şehirler', 'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Eskişehir', 'Gaziantep']

export const mockStations = [
  // İstanbul
  {
    id: 'st-ist-1',
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
    id: 'st-ist-2',
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
    id: 'st-ist-3',
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
    id: 'st-ist-4',
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
    id: 'st-ist-5',
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

  // Ankara
  {
    id: 'st-ank-1',
    name: 'Shell Çankaya Eskişehir Yolu',
    brand: 'Shell',
    brandId: 'shell',
    city: 'Ankara',
    district: 'Çankaya',
    address: 'Mustafa Kemal Mah. Dumlupınar Bulvarı No: 120, Çankaya / Ankara',
    latitude: 39.9082,
    longitude: 32.7845,
    distanceKm: 0.9,
    isOpen247: true,
    benzin95: 71.20,
    motorin: 79.70,
    lpg: 36.15,
    services: ['Shell Select', 'Oto Yıkama', 'WC', 'Kahve'],
    rating: 4.9,
  },
  {
    id: 'st-ank-2',
    name: 'Opet Kızılay Atatürk Bulvarı',
    brand: 'Opet',
    brandId: 'opet',
    city: 'Ankara',
    district: 'Çankaya',
    address: 'Kızılay Mah. Atatürk Bulvarı No: 85, Çankaya / Ankara',
    latitude: 39.9208,
    longitude: 32.8541,
    distanceKm: 1.5,
    isOpen247: true,
    benzin95: 71.28,
    motorin: 79.78,
    lpg: 36.22,
    services: ['Opet Market', 'Mescit', 'Hızlı Şarj'],
    rating: 4.8,
  },
  {
    id: 'st-ank-3',
    name: 'Petrol Ofisi Yenimahalle Emniyet',
    brand: 'Petrol Ofisi',
    brandId: 'po',
    city: 'Ankara',
    district: 'Yenimahalle',
    address: 'Emniyet Mah. Alparslan Türkeş Cad. No: 40, Yenimahalle / Ankara',
    latitude: 39.9385,
    longitude: 32.8122,
    distanceKm: 2.8,
    isOpen247: true,
    benzin95: 71.12,
    motorin: 79.62,
    lpg: 36.08,
    services: ['PO Market', 'Oto Yıkama', 'Hava/Su'],
    rating: 4.7,
  },

  // İzmir
  {
    id: 'st-izmas-1',
    name: 'Opet Alsancak Liman',
    brand: 'Opet',
    brandId: 'opet',
    city: 'İzmir',
    district: 'Konak',
    address: 'Alsancak Mah. Liman Cad. No: 12, Konak / İzmir',
    latitude: 38.4382,
    longitude: 27.1419,
    distanceKm: 1.1,
    isOpen247: true,
    benzin95: 71.22,
    motorin: 79.72,
    lpg: 36.18,
    services: ['Opet Market', 'Oto Yıkama', 'WC'],
    rating: 4.8,
  },
  {
    id: 'st-izmas-2',
    name: 'Shell Bornova Ege Üniversitesi',
    brand: 'Shell',
    brandId: 'shell',
    city: 'İzmir',
    district: 'Bornova',
    address: 'Kazımdirik Mah. Ankara Cad. No: 145, Bornova / İzmir',
    latitude: 38.4601,
    longitude: 27.2154,
    distanceKm: 2.3,
    isOpen247: true,
    benzin95: 71.19,
    motorin: 79.69,
    lpg: 36.12,
    services: ['Select Market', 'Kahve', 'Hızlı Şarj'],
    rating: 4.9,
  },

  // Bursa
  {
    id: 'st-brs-1',
    name: 'Petrol Ofisi Nilüfer İzmir Yolu',
    brand: 'Petrol Ofisi',
    brandId: 'po',
    city: 'Bursa',
    district: 'Nilüfer',
    address: 'Odunluk Mah. İzmir Yolu Cad. No: 80, Nilüfer / Bursa',
    latitude: 40.2014,
    longitude: 28.9812,
    distanceKm: 1.2,
    isOpen247: true,
    benzin95: 71.15,
    motorin: 79.65,
    lpg: 36.10,
    services: ['PO Market', 'Yıkama', 'Mescit'],
    rating: 4.7,
  },

  // Antalya
  {
    id: 'st-ant-1',
    name: 'Shell Muratpaşa 100. Yıl',
    brand: 'Shell',
    brandId: 'shell',
    city: 'Antalya',
    district: 'Muratpaşa',
    address: 'Meltem Mah. 100. Yıl Bulvarı No: 90, Muratpaşa / Antalya',
    latitude: 36.8864,
    longitude: 30.6821,
    distanceKm: 0.9,
    isOpen247: true,
    benzin95: 71.24,
    motorin: 79.74,
    lpg: 36.16,
    services: ['Shell Select', 'Oto Yıkama', 'WC'],
    rating: 4.8,
  },
]

export function getNearbyStations({ brandId = 'all', cityFilter = 'Tüm Şehirler', sortBy = 'distance', search = '' } = {}) {
  let filtered = [...mockStations]

  if (cityFilter && cityFilter !== 'Tüm Şehirler') {
    filtered = filtered.filter((s) => s.city.toLowerCase() === cityFilter.toLowerCase())
  }

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
