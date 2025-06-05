import { StyleSheet, View, Text } from 'react-native';
import { Link } from 'expo-router';
import ScreenWrapper from '../components/layout/screen-wrapper';

export default function DashboardScreen() {
  return (
    <ScreenWrapper style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: 'white', fontSize: 20}}>Main Index</Text>
      <Link href='/(tabs)/dashboard'>
        <Text style={{color: 'white', fontSize: 16}}>Go to Dashboard</Text>
      </Link>
      <Link href='/tasks/1/track'>
        <Text style={{color: 'white', fontSize: 16}}>Go to Track task page</Text>
      </Link>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
});