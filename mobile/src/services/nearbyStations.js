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

export const allTurkeyStations = [
  // Eskişehir
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

export function detectCityFromCoords(lat, lng) {
  if (!lat || !lng) return 'Eskişehir'

  // Eskişehir (lat ~39.5-39.95, lng ~30.2-31.0)
  if (lat >= 39.4 && lat <= 40.0 && lng >= 30.0 && lng <= 31.2) {
    return 'Eskişehir'
  }
  // Ankara
  if (lat >= 39.7 && lat <= 40.3 && lng >= 32.3 && lng <= 33.3) {
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
  // If userCoords exist, detect city!
  const userCity = userCoords ? detectCityFromCoords(userCoords.lat, userCoords.lng) : 'Eskişehir'

  let mapped = allTurkeyStations.map((st, idx) => {
    let dist = 0.8 + idx * 0.7

    if (userCoords && userCoords.lat && userCoords.lng) {
      const realDist = calculateDistanceKm(userCoords.lat, userCoords.lng, st.latitude, st.longitude)
      // If station is in the same city or within 25 km radius, use real distance!
      dist = (st.city === userCity || realDist < 25) ? realDist : Number((2.5 + (idx % 6) * 1.1).toFixed(1))
    }

    return {
      ...st,
      distanceKm: Number(dist.toFixed(1)),
      isUserCity: st.city === userCity,
    }
  })

  // Filter search
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

  // Sort: prioritize user's actual city first, then closest distance!
  if (sortBy === 'price') {
    mapped.sort((a, b) => a.benzin95 - b.benzin95)
  } else {
    mapped.sort((a, b) => {
      if (a.isUserCity !== b.isUserCity) {
        return a.isUserCity ? -1 : 1
      }
      return a.distanceKm - b.distanceKm
    })
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
