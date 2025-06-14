import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'react-native';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useAuthStore } from '@/stores/authStore';
import ScreenWrapper from '../components/layout/ScreenWrapper';
import colors from '@/constants/Colors';
import Loading from '@/components/common/Loading';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'poppins-regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'poppins-medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'poppins-semi-bold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'poppins-bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'poppins-extra-bold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
  });

  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (fontsLoaded && isHydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isHydrated]);

  // If fonts are not loaded or session is not hydrated, show loading screen
  if (!fontsLoaded) {
  return <Loading message="Loading fonts..." />;
  }

  if (!isHydrated) {
    return <Loading message="Restoring session..." />;
  }

  return (
    <ScreenWrapper>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.bg },
          headerShown: false,
          animation: 'fade_from_bottom',
        }}
      />
      <StatusBar bar-style="light" backgroundColor={colors.bg} translucent={false} />
    </ScreenWrapper>
  );
}
