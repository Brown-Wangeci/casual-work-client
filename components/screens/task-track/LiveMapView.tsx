import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Platform } from 'react-native';
import * as Location from 'expo-location';
import colors from '@/constants/Colors';
// Define types for MapView and Marker
let MapView: typeof import('react-native-maps').default | null = null;
let Marker: typeof import('react-native-maps').Marker | null = null;

// Conditionally require `react-native-maps` only if not on web
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
}


type Props = {
  setAddress: (address: string) => void;
  address: string;
};

const LiveMapView = ({ setAddress, address }: Props) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setLoading(false);

      // Reverse geocode to get the address
      const geocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (geocode.length > 0) {
        const place = geocode[0];
        const fullAddress = `${place.name || ''}, ${place.street || ''}, ${place.city || ''}, ${place.country || ''}`;
        setAddress(fullAddress);
      }
    })();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={colors.progress.success} style={styles.loader} />;
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webFallback}>
        <Text>Map is not available on the web.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      { MapView && Marker &&  (
        <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude || 0,
          longitude: location?.coords.longitude || 0,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        followsUserLocation
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title={address}
            pinColor="blue"
          />
        )}
      </MapView>
      )}
    </View>
  );
};

export default LiveMapView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
