import AsyncStorage from '@react-native-async-storage/async-storage'

const storageKey = '@yakit-radar/vehicle-profile'

export const defaultVehicleProfile = {
  city: 'İstanbul',
  fuelKey: 'benzin95',
  consumption: '7.5',
  tankCapacity: '50',
  monthlyKm: '1000',
}

export async function loadVehicleProfile() {
  try {
    const storedProfile = await AsyncStorage.getItem(storageKey)
    return storedProfile ? { ...defaultVehicleProfile, ...JSON.parse(storedProfile) } : defaultVehicleProfile
  } catch {
    return defaultVehicleProfile
  }
}

export function saveVehicleProfile(profile) {
  return AsyncStorage.setItem(storageKey, JSON.stringify(profile))
}
