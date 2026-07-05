import { enableScreens } from 'react-native-screens'
enableScreens()
import { Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AnaSayfa from './src/screens/AnaSayfa'
import Iller from './src/screens/Iller'
import Gecmis from './src/screens/Gecmis'

const Tab = createBottomTabNavigator()

const tabIcons = {
  'Ana Sayfa': 'H',
  'İller': 'I',
  'Geçmiş': 'G',
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 14, fontWeight: '900' }}>
              {tabIcons[route.name]}
            </Text>
          ),
          tabBarStyle: {
            backgroundColor: '#071426',
            borderTopColor: '#142844',
            height: 64,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
          },
          tabBarActiveTintColor: '#19E6B1',
          tabBarInactiveTintColor: '#8FA3B8',
        })}
      >
        <Tab.Screen name="Ana Sayfa" component={AnaSayfa} />
        <Tab.Screen name="İller" component={Iller} />
        <Tab.Screen name="Geçmiş" component={Gecmis} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
