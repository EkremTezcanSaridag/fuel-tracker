import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants, { ExecutionEnvironment } from 'expo-constants'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { supabase } from '../supabase'

const INSTALLATION_ID_KEY = '@pompametre/installation-id'
const NOTIFICATION_SETTINGS_KEY = '@pompametre/notification-settings'
const NOTIFICATION_CHANNEL_ID = 'fuel-alerts'

export const defaultNotificationSettings = {
  cityAlerts: true,
  dailyAlerts: true,
  quietHours: true,
  trackedCities: [],
  trackedFuels: ['Benzin', 'Motorin', 'LPG'],
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
    description: 'Akaryakit fiyat degisimleri ve ozetleri',
    importance: Notifications.AndroidImportance.HIGH,
    lightColor: '#19E6B1',
    name: 'PompaMetre fiyat uyarilari',
    vibrationPattern: [0, 250, 250, 250],
  })
}

function createInstallationId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`
}

async function getInstallationId() {
  const storedId = await AsyncStorage.getItem(INSTALLATION_ID_KEY)

  if (storedId) {
    return storedId
  }

  const installationId = createInstallationId()

  await AsyncStorage.setItem(INSTALLATION_ID_KEY, installationId)

  return installationId
}

function getProjectId() {
  return Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId
}

function isAndroidExpoGo() {
  return Platform.OS === 'android' && Constants.executionEnvironment === ExecutionEnvironment.StoreClient
}

function getExpoGoPushError() {
  return 'Expo Go Android remote push desteklemiyor. Bildirim tokeni icin development build veya APK gerekir.'
}

async function getExpoPushToken() {
  if (isAndroidExpoGo()) {
    throw new Error(getExpoGoPushError())
  }

  const projectId = getProjectId()
  const tokenResult = projectId
    ? await Notifications.getExpoPushTokenAsync({ projectId })
    : await Notifications.getExpoPushTokenAsync()

  return tokenResult.data
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

function resolveTrackedCities(settings, metadata) {
  if (settings.trackedCities?.length) {
    return settings.trackedCities
  }

  return metadata.trackedCities ?? []
}

function resolveTrackedFuels(settings, metadata) {
  if (settings.trackedFuels?.length) {
    return settings.trackedFuels
  }

  return metadata.trackedFuels ?? defaultNotificationSettings.trackedFuels
}

export async function syncPushRegistration(expoPushToken, settings = defaultNotificationSettings, metadata = {}) {
  if (!supabase || !expoPushToken) {
    return {
      error: null,
      synced: false,
    }
  }

  try {
    const installationId = await getInstallationId()
    const now = new Date().toISOString()

    const { error } = await supabase.from('push_tokens').upsert(
      {
        app_version: Constants.expoConfig?.version ?? null,
        city_alerts: Boolean(settings.cityAlerts),
        daily_alerts: Boolean(settings.dailyAlerts),
        enabled: Boolean(settings.dailyAlerts || settings.cityAlerts || settings.weeklySummary),
        expo_push_token: expoPushToken,
        installation_id: installationId,
        last_seen_at: now,
        platform: Platform.OS,
        quiet_hours: Boolean(settings.quietHours),
        tracked_cities: resolveTrackedCities(settings, metadata),
        tracked_fuels: resolveTrackedFuels(settings, metadata),
        updated_at: now,
        weekly_summary: Boolean(settings.weeklySummary),
      },
      {
        onConflict: 'installation_id',
      },
    )

    if (error) {
      throw error
    }

    return {
      error: null,
      synced: true,
    }
  } catch (error) {
    return {
      error: error?.message ?? 'Push token Supabase tablosuna kaydedilemedi.',
      synced: false,
    }
  }
}

export async function getNotificationPermissionStatus(settings = defaultNotificationSettings, metadata = {}) {
  await setupNotificationChannels()

  const permission = await Notifications.getPermissionsAsync()

  if (!permission.granted && permission.status !== 'granted') {
    return normalizePermissionResponse(permission)
  }

  if (isAndroidExpoGo()) {
    return normalizePermissionResponse(permission, null, getExpoGoPushError())
  }

  try {
    const expoPushToken = await getExpoPushToken()
    const registration = await syncPushRegistration(expoPushToken, settings, metadata)

    return normalizePermissionResponse(permission, expoPushToken, registration.error)
  } catch (error) {
    return normalizePermissionResponse(permission, null, error?.message ?? 'Push token alinamadi.')
  }
}

export async function requestNotificationAccess(settings = defaultNotificationSettings, metadata = {}) {
  await setupNotificationChannels()

  const currentPermission = await Notifications.getPermissionsAsync()
  const nextPermission =
    currentPermission.status === 'granted' || currentPermission.granted
      ? currentPermission
      : await Notifications.requestPermissionsAsync()

  if (!nextPermission.granted && nextPermission.status !== 'granted') {
    return normalizePermissionResponse(nextPermission)
  }

  if (isAndroidExpoGo()) {
    return normalizePermissionResponse(nextPermission, null, getExpoGoPushError())
  }

  try {
    const expoPushToken = await getExpoPushToken()
    const registration = await syncPushRegistration(expoPushToken, settings, metadata)

    return normalizePermissionResponse(nextPermission, expoPushToken, registration.error)
  } catch (error) {
    return normalizePermissionResponse(nextPermission, null, error?.message ?? 'Push token alinamadi.')
  }
}

export async function sendTestNotification() {
  await setupNotificationChannels()

  return Notifications.scheduleNotificationAsync({
    content: {
      body: 'Bildirimler calisiyor. Fiyat degisimlerinde buradan haber verecegiz.',
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

export async function saveAndSyncNotificationSettings(settings, expoPushToken, metadata = {}) {
  await saveNotificationSettings(settings)

  if (!expoPushToken) {
    return {
      error: null,
      synced: false,
    }
  }

  return syncPushRegistration(expoPushToken, settings, metadata)
}
