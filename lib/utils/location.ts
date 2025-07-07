import * as Location from 'expo-location';
import { showToast } from './showToast';

export type UserCoordinates = {
  latitude: number;
  longitude: number;
};

export async function getCurrentUserLocation(): Promise<UserCoordinates | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      showToast(
        'info',
        'Location Permission Denied',
        'Please allow location access to auto-fill your current location.'
      );
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Failed to get current location:', error);
    showToast(
      'error',
      'Location Error',
      'Failed to retrieve your current location. Try again.'
    );
    return null;
  }
}
