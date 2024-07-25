import '../tamagui-web.css'

import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack, useGlobalSearchParams, useRouter } from 'expo-router'
import { Provider } from './Provider'
import { Plus } from '@tamagui/lucide-icons'
import { Button } from 'tamagui'
import Actions from '@/components/community/Actions'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [interLoaded, interError])

  if (!interLoaded && !interError) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()

  const router = useRouter()
  const params = useGlobalSearchParams()

  return (
    <Provider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: 'transparent',
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="trips"
            options={{
              headerBackTitleVisible: false,
              headerStyle: {
                backgroundColor: 'transparent',
              },
              headerTitle: 'Explore Trips',
              headerRight: () => (
                <Button
                  unstyled
                  onPress={() => {
                    router.push('/create-trip')
                  }}
                >
                  <Plus />
                </Button>
              ),
              headerLargeTitle: true,
              headerSearchBarOptions: {
                placeholder: 'Search for trips',
              },
            }}
          />
          <Stack.Screen
            name="communities"
            options={{
              headerBackTitleVisible: false,
              headerTitle: 'Explore Communities',
              headerLargeTitle: true,
              headerRight: () => (
                <Button
                  unstyled
                  onPress={() => {
                    router.push('/create-community')
                  }}
                >
                  <Plus />
                </Button>
              ),
              headerSearchBarOptions: {
                placeholder: 'Search for communities',
                onSearchButtonPress: () => {
                  console.debug('Search button pressed')
                },
              },
            }}
          />
          <Stack.Screen
            name="join-community"
            options={{
              headerBackTitleVisible: false,
              headerTitle: '',
            }}
          />
          <Stack.Screen name="navigation" />
          <Stack.Screen
            name="community/[slug]/index"
            options={{
              // headerShown: false,
              title: '',
              headerBackTitleVisible: false,
              headerTransparent: true,
              headerRight: () => <Actions />,
            }}
          />
          <Stack.Screen
            name="community/[slug]/chat"
            options={{
              headerBackTitleVisible: false,
              title: params.title as string,
            }}
          />
          <Stack.Screen
            name="profile/index"
            options={{
              // headerShown: false,
              title: '',
              headerBackTitleVisible: false,
              // headerRight: () => <Actions />,
            }}
          />
          <Stack.Screen
            name="profile/[slug]/index"
            options={{
              // headerShown: false,
              title: '',
              headerBackTitleVisible: false,
              headerTransparent: true,

              // headerRight: () => <Actions />,
            }}
          />
          <Stack.Screen
            name="trip/[slug]/index"
            options={{
              headerBackTitleVisible: false,
              title: '',
              headerLargeTitle: true,
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="create-community"
            options={{
              headerBackTitleVisible: false,
              headerTitle: 'Create Community',
              headerTransparent: true,
              headerLargeTitle: true,
            }}
          />
          <Stack.Screen
            name="create-trip"
            options={{
              headerBackTitleVisible: false,
              headerTitle: 'Create Trip',
              headerTransparent: true,
              headerLargeTitle: true,
            }}
          />
        </Stack>
      </ThemeProvider>
    </Provider>
  )
}
