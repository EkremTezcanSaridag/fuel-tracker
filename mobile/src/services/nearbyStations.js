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

// Türkiye Geneli Gizli Akaryakıt İstasyonları Veritabanı
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
    isOpen247: true,
    benzin95: 71.35,
    motorin: 79.85,
    lpg: 36.25,
    services: ['Bonjour Market', 'Kahve', 'Elektrikli Şarj'],
    rating: 4.8,
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

  // --- İZMİR ---
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

  // --- BURSA ---
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

  // --- ANTALYA ---
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

  // --- KOCAELİ ---
  {
    id: 'st-koc-1',
    name: 'Opet İzmit D-100',
    brand: 'Opet',
    brandId: 'opet',
    city: 'Kocaeli',
    district: 'İzmit',
    address: 'Yahya Kaptan Mah. D-100 Karayolu No: 40, İzmit / Kocaeli',
    latitude: 40.7650,
    longitude: 29.9400,
    isOpen247: true,
    benzin95: 71.22,
    motorin: 79.72,
    lpg: 36.12,
    services: ['Opet Market', 'Yıkama', 'Mescit'],
    rating: 4.7,
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

export function fetchRealDeviceGpsLocation() {
  return new Promise((resolve, reject) => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          })
        },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 10000 },
      )
    } else {
      reject(new Error('GPS cihazınız tarafından desteklenmiyor.'))
    }
  })
}

export function getNearbyStations({ userCoords = null, brandId = 'all', sortBy = 'distance', search = '' } = {}) {
  // 1. If no GPS coords and no search text, return empty list (waiting for GPS trigger)
  if (!userCoords && !search.trim()) {
    return []
  }

  let mapped = turkeyStationDatabase.map((st) => {
    let dist = 999
    if (userCoords && userCoords.lat && userCoords.lng) {
      dist = calculateDistanceKm(userCoords.lat, userCoords.lng, st.latitude, st.longitude)
    }
    return {
      ...st,
      distanceKm: dist,
    }
  })

  // 2. Search query filter (if user typed text like "Eskişehir", "Kadıköy", "Shell")
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

  // 3. Brand filter
  if (brandId && brandId !== 'all') {
    mapped = mapped.filter((s) => s.brandId === brandId)
  }

  // 4. GPS Vicinity Filter: If GPS is active and no explicit search, show ONLY stations within user's region (< 50 km)
  if (userCoords && !search.trim()) {
    mapped = mapped.filter((s) => s.distanceKm <= 50)
  }

  // 5. Sort closest first or cheapest price
  if (sortBy === 'price') {
    mapped.sort((a, b) => a.benzin95 - b.benzin95)
  } else {
    mapped.sort((a, b) => a.distanceKm - b.distanceKm)
  }

  return mapped
}

export function openStationDirections(station) {
  const destination = `${station.latitude},${station.longitude}`
  const query = encodeURIComponent(`${station.name}, ${station.address}`)
  const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&destination_place_id=${query}`
  Linking.openURL(url).catch(() => {
    alert('Harita uygulaması açılamadı.')
  })
}
