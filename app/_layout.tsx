import { useEffect } from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/store/auth';
import { SplashScreen } from './splash';
import { AuthNavigator } from '. /(auth)/_layout';
import { AppNavigator } from './(app)/_layout';

const Stack = createNativeStackNavigator();

const linking: LinkingOptions<any> = {
  prefixes: ['lazorkit://', 'https://lazorkit.com'],
  config: {
    screens: {
      AuthScreen: 'login',
      AppScreen: 'app/: screen',
    },
  },
};

export default function RootLayout() {
  const { accessToken, loadFromStorage, isLoading } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack. Navigator
        screenOptions={{
          headerShown:  false,
          animationEnabled: true,
        }}
      >
        {! accessToken ? (
          <Stack.Group>
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="App" component={AppNavigator} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}