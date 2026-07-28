import AsyncStorage from '@react-native-async-storage/async-storage'

const storageKey = '@yakit-radar/vehicle-profile'
const expenseHistoryStorageKey = '@yakit-radar/vehicle-expense-history'
const maxExpenseHistoryRecords = 200

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

export async function loadVehicleExpenseHistory() {
  try {
    const storedHistory = await AsyncStorage.getItem(expenseHistoryStorageKey)
    const parsedHistory = storedHistory ? JSON.parse(storedHistory) : []
    return Array.isArray(parsedHistory) ? parsedHistory : []
  } catch {
    return []
  }
}

export async function addVehicleExpenseRecord(record) {
  const history = await loadVehicleExpenseHistory()
  const nextRecord = {
    ...record,
    createdAt: new Date().toISOString(),
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  }
  const nextHistory = [nextRecord, ...history].slice(0, maxExpenseHistoryRecords)

  await AsyncStorage.setItem(expenseHistoryStorageKey, JSON.stringify(nextHistory))
  return nextHistory
}
