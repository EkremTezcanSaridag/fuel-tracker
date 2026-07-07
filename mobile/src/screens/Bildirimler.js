import { useEffect, useMemo, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native'
import { colors, shadows } from '../theme'
import { useFuelData } from '../hooks/useFuelData'
import {
  defaultNotificationSettings,
  getNotificationPermissionStatus,
  loadNotificationSettings,
  requestNotificationAccess,
  saveAndSyncNotificationSettings,
  sendTestNotification,
} from '../services/notifications'

const fuelChips = ['Benzin', 'Motorin', 'LPG']

function getPermissionCopy(permission) {
  if (permission.granted) {
    return {
      badge: 'Aktif',
      icon: 'bell-check-outline',
      title: 'Bildirim izni açık',
      desc: permission.expoPushToken ? 'Push token hazırlandı.' : 'Yerel bildirimler hazır.',
      tone: 'active',
    }
  }

  if (permission.canAskAgain === false) {
    return {
      badge: 'Kapalı',
      icon: 'bell-off-outline',
      title: 'Telefon izni kapalı',
      desc: 'Bildirimleri açmak için cihaz ayarlarından izin vermek gerekiyor.',
      tone: 'blocked',
    }
  }

  return {
    badge: 'Bekliyor',
    icon: 'bell-plus-outline',
    title: 'Bildirim izni bekliyor',
    desc: 'Açık ayarlardan biri seçildiğinde izin isteyeceğiz.',
    tone: 'pending',
  }
}

function formatToken(token) {
  if (!token) {
    return 'Token yok'
  }

  return `${token.slice(0, 18)}...${token.slice(-6)}`
}

export default function Bildirimler() {
  const { data } = useFuelData()
  const [settings, setSettings] = useState(defaultNotificationSettings)
  const [permission, setPermission] = useState({
    canAskAgain: true,
    expoPushToken: null,
    granted: false,
    status: 'undetermined',
    tokenError: null,
  })
  const [loading, setLoading] = useState(true)
  const [permissionBusy, setPermissionBusy] = useState(false)
  const [testBusy, setTestBusy] = useState(false)
  const cityChips = data.cities.slice(0, 3).map((city) => city.name)
  const registrationMeta = useMemo(
    () => ({
      trackedCities: cityChips,
      trackedFuels: fuelChips,
    }),
    [cityChips.join('|')],
  )
  const permissionCopy = getPermissionCopy(permission)

  useEffect(() => {
    let isMounted = true

    loadNotificationSettings().then(async (storedSettings) => {
      const currentPermission = await getNotificationPermissionStatus(storedSettings, registrationMeta)

        if (!isMounted) {
          return
        }

        setSettings(storedSettings)
        setPermission(currentPermission)
        setLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [registrationMeta])

  const notificationRows = useMemo(
    () => [
      {
        desc: 'Önemli fiyat hareketlerinde anlık uyarı.',
        icon: 'bell-ring-outline',
        key: 'dailyAlerts',
        title: 'Günlük fiyat uyarıları',
        value: settings.dailyAlerts,
      },
      {
        desc: 'Takip edilen iller için ayrı bildirim.',
        icon: 'map-marker-radius-outline',
        key: 'cityAlerts',
        title: 'İl bazlı uyarılar',
        value: settings.cityAlerts,
      },
      {
        desc: 'Haftalık kısa fiyat özeti.',
        icon: 'email-newsletter',
        key: 'weeklySummary',
        title: 'Haftalık özet',
        value: settings.weeklySummary,
      },
    ],
    [settings],
  )

  async function ensureNotificationAccess() {
    setPermissionBusy(true)

    const nextPermission = await requestNotificationAccess(settings, registrationMeta)

    setPermission(nextPermission)
    setPermissionBusy(false)

    if (!nextPermission.granted) {
      Alert.alert('Bildirim izni kapalı', 'Telefon ayarlarından Yakıt Radar bildirimlerine izin vermen gerekiyor.')
      return false
    }

    return true
  }

  async function updateSetting(key, value) {
    if (value && key !== 'quietHours') {
      const allowed = await ensureNotificationAccess()

      if (!allowed) {
        return
      }
    }

    const nextSettings = {
      ...settings,
      [key]: value,
    }

    setSettings(nextSettings)
    const registration = await saveAndSyncNotificationSettings(nextSettings, permission.expoPushToken, registrationMeta)

    if (registration.error) {
      setPermission((current) => ({
        ...current,
        tokenError: registration.error,
      }))
    }
  }

  async function handleTestNotification() {
    const allowed = permission.granted || (await ensureNotificationAccess())

    if (!allowed) {
      return
    }

    setTestBusy(true)

    try {
      await sendTestNotification()
      Alert.alert('Test bildirimi hazır', 'Birkaç saniye içinde telefonuna test bildirimi düşmeli.')
    } catch (error) {
      Alert.alert('Bildirim gönderilemedi', error?.message ?? 'Beklenmeyen bir sorun oluştu.')
    } finally {
      setTestBusy(false)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerMark}>
            <MaterialCommunityIcons name="bell-outline" size={18} color={colors.accent} />
          </View>
          <Text style={styles.brand}>Yakıt Radar</Text>
          <MaterialCommunityIcons name="account-circle-outline" size={21} color={colors.accent} />
        </View>

        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <Text style={styles.title}>Bildirimler</Text>
            <Text style={styles.subtitle}>Fiyat değişimlerini ve özet raporları yönetin.</Text>
          </View>
          <View style={[styles.statusBadge, styles[`${permissionCopy.tone}Badge`]]}>
            <View style={[styles.statusDot, styles[`${permissionCopy.tone}Dot`]]} />
            <Text style={[styles.statusBadgeText, styles[`${permissionCopy.tone}Text`]]}>{permissionCopy.badge}</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <MaterialCommunityIcons name={permissionCopy.icon} size={22} color={colors.accent} />
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>{permissionCopy.title}</Text>
            <Text style={styles.summaryDesc}>{loading ? 'Durum kontrol ediliyor.' : permissionCopy.desc}</Text>
            {permission.granted && (
              <Text style={styles.tokenText}>Expo token: {formatToken(permission.expoPushToken)}</Text>
            )}
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            disabled={permissionBusy}
            onPress={ensureNotificationAccess}
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed, permissionBusy && styles.disabled]}
          >
            {permissionBusy ? (
              <ActivityIndicator color={colors.bg} size="small" />
            ) : (
              <MaterialCommunityIcons name="shield-check" size={18} color={colors.bg} />
            )}
            <Text style={styles.actionButtonText}>İzni Kontrol Et</Text>
          </Pressable>

          <Pressable
            disabled={testBusy}
            onPress={handleTestNotification}
            style={({ pressed }) => [styles.ghostButton, pressed && styles.pressed, testBusy && styles.disabled]}
          >
            {testBusy ? (
              <ActivityIndicator color={colors.accent} size="small" />
            ) : (
              <MaterialCommunityIcons name="send-check-outline" size={18} color={colors.accent} />
            )}
            <Text style={styles.ghostButtonText}>Test Gönder</Text>
          </Pressable>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Uyarı Ayarları</Text>

          {notificationRows.map((row, index) => (
            <View key={row.key} style={[styles.row, index === 0 && styles.rowFirst]}>
              <View style={styles.rowIcon}>
                <MaterialCommunityIcons name={row.icon} size={18} color={colors.accent} />
              </View>
              <View style={styles.rowCopy}>
                <Text style={styles.rowTitle}>{row.title}</Text>
                <Text style={styles.rowDesc}>{row.desc}</Text>
              </View>
              <Switch
                disabled={permissionBusy}
                onValueChange={(value) => updateSetting(row.key, value)}
                thumbColor={row.value ? colors.accent : '#D6DEE9'}
                trackColor={{ false: '#25364F', true: colors.accentDark }}
                value={row.value}
              />
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <View style={styles.panelTop}>
            <View>
              <Text style={styles.panelTitle}>Sessiz Saatler</Text>
              <Text style={styles.panelSubtitle}>Kritik olmayan bildirimleri duraklatır.</Text>
            </View>
            <Switch
              onValueChange={(value) => updateSetting('quietHours', value)}
              thumbColor={settings.quietHours ? colors.accent : '#D6DEE9'}
              trackColor={{ false: '#25364F', true: colors.accentDark }}
              value={settings.quietHours}
            />
          </View>

          <View style={styles.timeRow}>
            <View style={styles.timeChip}>
              <MaterialCommunityIcons name="weather-night" size={15} color={colors.accent} />
              <Text style={styles.timeText}>22:00</Text>
            </View>
            <View style={styles.timeLine} />
            <View style={styles.timeChip}>
              <MaterialCommunityIcons name="white-balance-sunny" size={15} color={colors.warning} />
              <Text style={styles.timeText}>08:00</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Takip Edilenler</Text>

          <Text style={styles.groupLabel}>Yakıt türleri</Text>
          <View style={styles.chipRow}>
            {fuelChips.map((item) => (
              <View key={item} style={styles.chip}>
                <Text style={styles.chipText}>{item}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.groupLabel}>Öne çıkan iller</Text>
          <View style={styles.chipRow}>
            {cityChips.map((item) => (
              <View key={item} style={styles.chipMuted}>
                <MaterialCommunityIcons name="map-marker" size={12} color={colors.mutedSoft} />
                <Text style={styles.chipMutedText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="information-outline" size={18} color={colors.accent} />
          <Text style={styles.infoText}>
            {permission.tokenError ??
              'Bildirim izni aktifse cihaz tokeni otomatik kaydedilir. Fiyat değişimlerinde backend bu cihaza uyarı gönderebilir.'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    backgroundColor: colors.bg,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.bg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -16,
    marginTop: -8,
    marginBottom: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerMark: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  brand: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '900',
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleCopy: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 5,
  },
  statusBadge: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  activeBadge: {
    backgroundColor: colors.accentDark,
    borderColor: colors.accent,
  },
  pendingBadge: {
    backgroundColor: colors.bgSoft,
    borderColor: colors.border,
  },
  blockedBadge: {
    backgroundColor: colors.dangerDark,
    borderColor: colors.danger,
  },
  statusDot: {
    borderRadius: 999,
    height: 7,
    marginRight: 6,
    width: 7,
  },
  activeDot: {
    backgroundColor: colors.accent,
  },
  pendingDot: {
    backgroundColor: colors.warning,
  },
  blockedDot: {
    backgroundColor: colors.danger,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '900',
  },
  activeText: {
    color: colors.accent,
  },
  pendingText: {
    color: colors.warning,
  },
  blockedText: {
    color: colors.danger,
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 14,
    ...shadows.card,
  },
  summaryIcon: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    marginRight: 12,
    width: 42,
  },
  summaryText: {
    flex: 1,
  },
  summaryTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  summaryDesc: {
    color: colors.mutedSoft,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  tokenText: {
    color: colors.info,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 5,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 2,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    color: colors.bg,
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 7,
  },
  ghostButton: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  ghostButtonText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 7,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.74,
  },
  panel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    padding: 14,
    ...shadows.soft,
  },
  panelTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  panelTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
  panelSubtitle: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  row: {
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingTop: 13,
    paddingBottom: 13,
  },
  rowFirst: {
    marginTop: 8,
  },
  rowIcon: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    marginRight: 10,
    width: 36,
  },
  rowCopy: {
    flex: 1,
    paddingRight: 12,
  },
  rowTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  rowDesc: {
    color: colors.mutedSoft,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  timeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 16,
  },
  timeChip: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  timeText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 6,
  },
  timeLine: {
    backgroundColor: colors.border,
    flex: 1,
    height: 1,
    marginHorizontal: 10,
  },
  groupLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 14,
    textTransform: 'uppercase',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    backgroundColor: colors.accentDark,
    borderColor: colors.accent,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chipText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900',
  },
  chipMuted: {
    alignItems: 'center',
    backgroundColor: colors.bgSoft,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginRight: 8,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  chipMutedText: {
    color: colors.mutedSoft,
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 5,
  },
  infoCard: {
    alignItems: 'flex-start',
    backgroundColor: colors.bgSoft,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 12,
    padding: 12,
  },
  infoText: {
    color: colors.mutedSoft,
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
    marginLeft: 8,
  },
})
