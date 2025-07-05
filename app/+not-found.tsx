import ContentWrapper from '@/components/layout/ContentWrapper';
import ScreenBackground from '@/components/layout/ScreenBackground';
import colors from '@/constants/Colors';
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <ScreenBackground  style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <ContentWrapper style={styles.container}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.message}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          Go to home screen
        </Link>
      </ContentWrapper>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontFamily: 'poppins-semi-bold',
    marginBottom: 10,
    color: colors.text.bright,
  },
  message: {
    fontSize: 18,
    fontFamily: 'poppins-regular',
    color: colors.text.bright,
    textAlign: 'center',
    marginBottom: 30,
  },
  link: {
    fontSize: 16,
    fontFamily: 'poppins-medium',
    color: colors.text.green,
    textDecorationLine: 'underline',
  },
});
