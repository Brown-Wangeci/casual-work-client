import { Platform, View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { AppleMaps, GoogleMaps } from 'expo-maps';

type Props = {
  latitude: number;
  longitude: number;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

const DynamicMapView = ({
  latitude,
  longitude,
  label = "Selected Location",
  style,
}: Props) => {
  if (!latitude || !longitude) {
    return (
      <View style={[styles.fallback, style]}>
        <Text>Invalid coordinates</Text>
      </View>
    );
  }

  const cameraPosition = {
    coordinates: { latitude, longitude },
    zoom: 14,
  };

  const marker = {
    coordinates: { latitude, longitude },
    title: label,
  };

  if (Platform.OS === 'ios') {
    return (
      <AppleMaps.View
        style={style}
        cameraPosition={cameraPosition}
        markers={[marker]}
      />
    );
  } else if (Platform.OS === 'android') {
    return (
      <GoogleMaps.View
        style={style}
        cameraPosition={cameraPosition} 
        markers={[marker]}
      />
    );
  } else {
    return (
      <View style={[styles.fallback, style]}>
        <Text>Maps are only available on Android and iOS</Text>
      </View>
    );
  }
};

export default DynamicMapView;

const styles = StyleSheet.create({
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 10,
  },
});
