import { useEffect } from 'react'
import { enableScreens } from 'react-native-screens'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AnaSayfa from './src/screens/AnaSayfa'
import Iller from './src/screens/Iller'
import Gecmis from './src/screens/Gecmis'
import Bildirimler from './src/screens/Bildirimler'
import {
  defaultNotificationSettings,
  configureNotificationHandler,
  loadNotificationSettings,
  subscribeToNotificationEvents,
  syncExistingNotificationPermission,
} from './src/services/notifications'
import { colors } from './src/theme'

enableScreens()
configureNotificationHandler()

const Tab = createBottomTabNavigator()

const tabs = {
  home: 'Ana Sayfa',
  cities: 'İller',
  history: 'Geçmiş',
  alerts: 'Bildirimler',
}

const tabIcons = {
  [tabs.home]: 'home',
  [tabs.cities]: 'map-marker',
  [tabs.history]: 'history',
  [tabs.alerts]: 'bell-outline',
}

const startupNotificationMeta = {
  trackedCities: ['İstanbul', 'Ankara', 'İzmir'],
  trackedFuels: defaultNotificationSettings.trackedFuels,
}

export default function App() {
  useEffect(() => {
    const unsubscribe = subscribeToNotificationEvents()

    loadNotificationSettings()
      .then((settings) => syncExistingNotificationPermission(settings, startupNotificationMeta))
      .catch(() => {})

    return unsubscribe
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name={tabIcons[route.name]} color={color} size={size ?? 22} />
            ),
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '700',
              marginBottom: 2,
            },
            tabBarItemStyle: {
              paddingTop: 4,
              paddingBottom: 2,
            },
            tabBarStyle: {
              backgroundColor: colors.bg,
              borderTopColor: colors.border,
              borderTopWidth: 1,
              height: 70,
              paddingTop: 8,
              paddingBottom: 10,
            },
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.muted,
            sceneStyle: {
              backgroundColor: colors.bg,
            },
          })}
        >
          <Tab.Screen name={tabs.home} component={AnaSayfa} />
          <Tab.Screen name={tabs.cities} component={Iller} />
          <Tab.Screen name={tabs.history} component={Gecmis} />
          <Tab.Screen name={tabs.alerts} component={Bildirimler} />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}
