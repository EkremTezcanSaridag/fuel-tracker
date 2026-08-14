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

export const userLocations = [
  { id: 'loc-ist', label: 'İstanbul - Kadıköy', lat: 40.9912, lng: 29.0254, city: 'İstanbul' },
  { id: 'loc-ank', label: 'Ankara - Çankaya', lat: 39.9082, lng: 32.7845, city: 'Ankara' },
  { id: 'loc-izm', label: 'İzmir - Konak/Alsancak', lat: 38.4382, lng: 27.1419, city: 'İzmir' },
  { id: 'loc-brs', label: 'Bursa - Nilüfer', lat: 40.2014, lng: 28.9812, city: 'Bursa' },
  { id: 'loc-ant', label: 'Antalya - Muratpaşa', lat: 36.8864, lng: 30.6821, city: 'Antalya' },
  { id: 'loc-adn', label: 'Adana - Seyhan', lat: 37.0000, lng: 35.3213, city: 'Adana' },
]

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
    isOpen247: true,
    benzin95: 71.25,
    motorin: 79.75,
    lpg: 36.15,
    services: ['Shell Select', 'Oto Yıkama', 'WC', 'Kahve'],
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
    isOpen247: true,
    benzin95: 70.95,
    motorin: 79.45,
    lpg: 35.95,
    services: ['ON/OFF Market', 'Yıkama', 'Mescit'],
    rating: 4.6,
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
    isOpen247: true,
    benzin95: 71.12,
    motorin: 79.62,
    lpg: 36.08,
    services: ['PO Market', 'Oto Yıkama', 'Hava/Su'],
    rating: 4.7,
  },

  // İzmir
  {
    id: 'st-izm-1',
    name: 'Opet Alsancak Liman',
    brand: 'Opet',
    brandId: 'opet',
    city: 'İzmir',
    district: 'Konak',
    address: 'Alsancak Mah. Liman Cad. No: 12, Konak / İzmir',
    latitude: 38.4382,
    longitude: 27.1419,
    isOpen247: true,
    benzin95: 71.22,
    motorin: 79.72,
    lpg: 36.18,
    services: ['Opet Market', 'Oto Yıkama', 'WC'],
    rating: 4.8,
  },
  {
    id: 'st-izm-2',
    name: 'Shell Bornova Ege Üniversitesi',
    brand: 'Shell',
    brandId: 'shell',
    city: 'İzmir',
    district: 'Bornova',
    address: 'Kazımdirik Mah. Ankara Cad. No: 145, Bornova / İzmir',
    latitude: 38.4601,
    longitude: 27.2154,
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
    isOpen247: true,
    benzin95: 71.24,
    motorin: 79.74,
    lpg: 36.16,
    services: ['Shell Select', 'Oto Yıkama', 'WC'],
    rating: 4.8,
  },
]

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Number((R * c).toFixed(1))
}

export function getNearbyStations({ userLocationId = 'loc-ist', brandId = 'all', sortBy = 'distance', search = '' } = {}) {
  const activeLoc = userLocations.find((l) => l.id === userLocationId) ?? userLocations[0]

  let mapped = mockStations.map((st) => {
    const dist = calculateDistanceKm(activeLoc.lat, activeLoc.lng, st.latitude, st.longitude)
    return {
      ...st,
      distanceKm: dist,
      isSameCity: st.city.toLowerCase() === activeLoc.city.toLowerCase(),
    }
  })

  // If user searched text, match against name, district, city, brand
  if (search.trim()) {
    const q = search.toLowerCase().trim()
    mapped = mapped.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.brand.toLowerCase().includes(q),
    )
  }

  // Filter brand
  if (brandId && brandId !== 'all') {
    mapped = mapped.filter((s) => s.brandId === brandId)
  }

  // Sort
  if (sortBy === 'price') {
    mapped.sort((a, b) => a.benzin95 - b.benzin95)
  } else {
    // Distance sort: prioritize same city first, then closest km!
    mapped.sort((a, b) => {
      if (a.isSameCity !== b.isSameCity) {
        return a.isSameCity ? -1 : 1
      }
      return a.distanceKm - b.distanceKm
    })
  }

  return mapped
}

export function openStationDirections(station) {
  const query = encodeURIComponent(`${station.name}, ${station.address}`)
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`
  Linking.openURL(url).catch(() => {
    alert('Harita uygulaması açılamadı.')
  })
}
