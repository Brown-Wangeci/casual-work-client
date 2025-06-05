import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'react-native';
import { useEffect } from 'react';
import 'react-native-reanimated';
import ScreenWrapper from '../components/layout/screen-wrapper';
import colors from '@/constants/Colors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    'poppins-regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'poppins-medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'poppins-semi-bold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'poppins-bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'poppins-extra-bold': require('../assets/fonts/Poppins-ExtraBold.ttf'),  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <> 
        <Stack 
          screenOptions={{ 
            contentStyle: { backgroundColor: '#171717' },
            headerShown: false
          }}
        >
        </Stack>
        <StatusBar bar-style="light" backgroundColor={colors.bg} translucent={false}/>
    </>
  );
}
