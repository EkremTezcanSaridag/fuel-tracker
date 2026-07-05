import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

const NOTIFICATION_SETTINGS_KEY = '@pompametre/notification-settings'
const NOTIFICATION_CHANNEL_ID = 'fuel-alerts'

export const defaultNotificationSettings = {
  cityAlerts: true,
  dailyAlerts: true,
  quietHours: true,
  weeklySummary: false,
}

export function configureNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  })
}

export function subscribeToNotificationEvents() {
  const receivedSubscription = Notifications.addNotificationReceivedListener(() => {})
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(() => {})

  return () => {
    receivedSubscription.remove()
    responseSubscription.remove()
  }
}

export async function setupNotificationChannels() {
  if (Platform.OS !== 'android') {
    return
  }

  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
    description: 'Akaryakıt fiyat değişimleri ve özetleri',
    importance: Notifications.AndroidImportance.HIGH,
    lightColor: '#19E6B1',
    name: 'PompaMetre fiyat uyarıları',
    vibrationPattern: [0, 250, 250, 250],
  })
}

function getProjectId() {
  return Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId
}

function normalizePermissionResponse(permission, expoPushToken = null, tokenError = null) {
  const granted = permission.granted || permission.status === 'granted'

  return {
    canAskAgain: permission.canAskAgain,
    expoPushToken,
    granted,
    status: permission.status,
    tokenError,
  }
}

export async function getNotificationPermissionStatus() {
  await setupNotificationChannels()

  const permission = await Notifications.getPermissionsAsync()

  return normalizePermissionResponse(permission)
}

export async function requestNotificationAccess() {
  await setupNotificationChannels()

  const currentPermission = await Notifications.getPermissionsAsync()
  const nextPermission =
    currentPermission.status === 'granted' || currentPermission.granted
      ? currentPermission
      : await Notifications.requestPermissionsAsync()

  if (!nextPermission.granted && nextPermission.status !== 'granted') {
    return normalizePermissionResponse(nextPermission)
  }

  try {
    const projectId = getProjectId()
    const tokenResult = projectId
      ? await Notifications.getExpoPushTokenAsync({ projectId })
      : await Notifications.getExpoPushTokenAsync()

    return normalizePermissionResponse(nextPermission, tokenResult.data)
  } catch (error) {
    return normalizePermissionResponse(nextPermission, null, error?.message ?? 'Push token alınamadı.')
  }
}

export async function sendTestNotification() {
  await setupNotificationChannels()

  return Notifications.scheduleNotificationAsync({
    content: {
      body: 'Bildirimler çalışıyor. Fiyat değişimlerinde buradan haber vereceğiz.',
      data: {
        screen: 'alerts',
      },
      sound: 'default',
      title: 'PompaMetre test bildirimi',
    },
    trigger: {
      channelId: NOTIFICATION_CHANNEL_ID,
      seconds: 2,
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    },
  })
}

export async function loadNotificationSettings() {
  try {
    const storedSettings = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY)

    if (!storedSettings) {
      return defaultNotificationSettings
    }

    return {
      ...defaultNotificationSettings,
      ...JSON.parse(storedSettings),
    }
  } catch {
    return defaultNotificationSettings
  }
}

export async function saveNotificationSettings(settings) {
  await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings))
}
