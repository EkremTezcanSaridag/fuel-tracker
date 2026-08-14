import { Linking } from 'react-native'

export const stationBrands = [
  { id: 'all', name: 'Tüm Markalar', icon: 'gas-station' },
  { id: 'shell', name: 'Shell', color: '#FFD700', icon: 'gas-station-outline' },
  { id: 'opet', name: 'Opet', color: '#00529B', icon: 'alpha-o-circle' },
  { id: 'po', name: 'Petrol Ofisi', color: '#E30613', icon: 'alpha-p-circle' },
  { id: 'aytemiz', name: 'Aytemiz', color: '#ED1C24', icon: 'alpha-a-circle' },
  { id: 'total', name: 'TotalEnergies', color: '#003399', icon: 'alpha-t-circle' },
  { id: 'tp', name: 'Türkiye Petrolleri', color: '#E30613', icon: 'alpha-t-box' },
]

export function detectCityFromCoords(lat, lng) {
  if (!lat || !lng) return 'Eskişehir'

  // Eskişehir (lat ~39.4-40.1, lng ~30.0-31.3)
  if (lat >= 39.4 && lat <= 40.1 && lng >= 30.0 && lng <= 31.3) {
    return 'Eskişehir'
  }
  // Ankara
  if (lat >= 39.6 && lat <= 40.3 && lng >= 32.2 && lng <= 33.3) {
    return 'Ankara'
  }
  // İstanbul
  if (lat >= 40.7 && lat <= 41.4 && lng >= 28.4 && lng <= 29.6) {
    return 'İstanbul'
  }
  // İzmir
  if (lat >= 38.1 && lat <= 38.8 && lng >= 26.7 && lng <= 27.6) {
    return 'İzmir'
  }
  // Bursa
  if (lat >= 40.0 && lat <= 40.4 && lng >= 28.5 && lng <= 29.4) {
    return 'Bursa'
  }

  return 'Eskişehir'
}

export const turkeyStationDatabase = [
  // --- ESKİŞEHİR ---
  {
    id: 'st-esk-1',
    name: 'Opet İsmet İnönü Bulvarı',
    brand: 'Opet',
    brandId: 'opet',
    city: 'Eskişehir',
    district: 'Tepebaşı',
    address: 'Hoşnudiye Mah. İsmet İnönü 1 Cad. No: 45, Tepebaşı / Eskişehir',
    latitude: 39.7780,
    longitude: 30.5150,
    isOpen247: true,
    benzin95: 71.20,
    motorin: 79.70,
    lpg: 36.10,
    services: ['Market', 'Oto Yıkama', 'Mescit', 'Hızlı Şarj'],
    rating: 4.9,
  },
  {
    id: 'st-esk-2',
    name: 'Shell Odunpazarı Atatürk Bulvarı',
    brand: 'Shell',
    brandId: 'shell',
    city: 'Eskişehir',
    district: 'Odunpazarı',
    address: 'Akarbaşı Mah. Atatürk Bulvarı No: 110, Odunpazarı / Eskişehir',
    latitude: 39.7650,
    longitude: 30.5230,
    isOpen247: true,
    benzin95: 71.18,
    motorin: 79.68,
    lpg: 36.05,
    services: ['Shell Select', 'Oto Yıkama', 'WC', 'Kahve'],
    rating: 4.8,
  },
  {
    id: 'st-esk-3',
    name: 'Petrol Ofisi Tepebaşı Üniversite Cad.',
    brand: 'Petrol Ofisi',
    brandId: 'po',
    city: 'Eskişehir',
    district: 'Tepebaşı',
    address: 'Eskibağlar Mah. Üniversite Cad. No: 28, Tepebaşı / Eskişehir',
    latitude: 39.7840,
    longitude: 30.5090,
    isOpen247: true,
    benzin95: 71.15,
    motorin: 79.65,
    lpg: 36.00,
    services: ['PO Market', 'Oto Yıkama', 'Hava/Su'],
    rating: 4.7,
  },
  {
    id: 'st-esk-4',
    name: 'Aytemiz Çevre Yolu Bulvarı',
    brand: 'Aytemiz',
    brandId: 'aytemiz',
    city: 'Eskişehir',
    district: 'Tepebaşı',
    address: 'Çamlıca Mah. Ulusal Egemenlik Bulvarı No: 88, Tepebaşı / Eskişehir',
    latitude: 39.7920,
    longitude: 30.4910,
    isOpen247: true,
    benzin95: 70.95,
    motorin: 79.45,
    lpg: 35.90,
    services: ['ON/OFF Market', 'Yıkama', 'Mescit'],
    rating: 4.6,
  },
  {
    id: 'st-esk-5',
    name: 'TotalEnergies Osmangazi Kampüs',
    brand: 'TotalEnergies',
    brandId: 'total',
    city: 'Eskişehir',
    district: 'Odunpazarı',
    address: 'Büyükdere Mah. Gençlik Bulvarı No: 62, Odunpazarı / Eskişehir',
    latitude: 39.7520,
    longitude: 30.4850,
    isOpen247: true,
    benzin95: 71.25,
    motorin: 79.75,
    lpg: 36.15,
    services: ['Bonjour Market', 'Kahve', 'Elektrikli Şarj'],
    rating: 4.8,
  },

  // --- İSTANBUL ---
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

  // --- ANKARA ---
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
]

function safeDistanceKm(lat1, lon1, lat2, lon2) {
  try {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const res = R * c
    return isNaN(res) ? 1.5 : Number(res.toFixed(1))
  } catch (err) {
    return 1.5
  }
}

export async function fetchRealDeviceGpsLocation() {
  try {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = Number(pos?.coords?.latitude)
            const lng = Number(pos?.coords?.longitude)
            if (!isNaN(lat) && !isNaN(lng) && lat !== 0) {
              resolve({ lat, lng })
            } else {
              resolve({ lat: 39.778, lng: 30.515 })
            }
          },
          () => {
            resolve({ lat: 39.778, lng: 30.515 })
          },
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
        )
      })
    }
  } catch (e) {
    // catch all
  }
  return { lat: 39.778, lng: 30.515 }
}

export function getNearbyStations({ userCoords = null, brandId = 'all', sortBy = 'distance', search = '' } = {}) {
  // Safe default coordinates (Eskişehir fallback if no GPS)
  const activeLat = userCoords?.lat ?? 39.778
  const activeLng = userCoords?.lng ?? 30.515

  let mapped = turkeyStationDatabase.map((st) => {
    const dist = safeDistanceKm(activeLat, activeLng, st.latitude, st.longitude)
    return {
      ...st,
      distanceKm: dist,
    }
  })

  // Filter search
  if (search && search.trim()) {
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

  // Filter radius: If user GPS coords active and no text search, filter strictly for < 60 km radius
  if (userCoords && !search.trim()) {
    const nearby = mapped.filter((s) => s.distanceKm <= 60)
    mapped = nearby.length > 0 ? nearby : mapped
  }

  // Sort
  if (sortBy === 'price') {
    mapped.sort((a, b) => a.benzin95 - b.benzin95)
  } else {
    mapped.sort((a, b) => a.distanceKm - b.distanceKm)
  }

  return mapped
}

export function openStationDirections(station) {
  try {
    const destination = `${station.latitude},${station.longitude}`
    const query = encodeURIComponent(`${station.name}, ${station.address}`)
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=${query}`
    Linking.openURL(url).catch(() => {
      alert('Harita uygulaması açılamadı.')
    })
  } catch (e) {
    alert('Harita açılamadı.')
  }
}
