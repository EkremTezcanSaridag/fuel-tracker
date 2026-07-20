import AsyncStorage from '@react-native-async-storage/async-storage'

const storageKey = '@yakit-radar/vehicle-profile'

export const defaultVehicleProfile = {
  city: 'İstanbul',
  fuelKey: 'benzin95',
  spentAmount: '500',
  distanceKm: '300',
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
