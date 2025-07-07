import {
  StyleSheet,
  View,
} from 'react-native';
import ContentWrapper from '@/components/layout/ContentWrapper';
import ScreenBackground from '@/components/layout/ScreenBackground';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import CustomHeader from '@/components/layout/CustomHeader';
import { useTaskCreationStore } from '@/stores/taskCreationStore';
import colors from '@/constants/Colors';

const LocationPickerScreen = () => {
  const setLocation = useTaskCreationStore((state) => state.setLocation);

  return (
    <ScreenBackground>
      <CustomHeader showBackButton title='Pick location' />
      <ContentWrapper style={{ flexDirection: 'column', alignItems: 'center' }}>
        <View style={{ width: '100%' }}>
          <GooglePlacesAutocomplete
            placeholder="Search"
            fetchDetails={true}
            onPress={(data, details = null) => {
              if (!details) return;
              const { lat, lng } = details.geometry.location;

              setLocation({
                address: data.description,
                latitude: lat,
                longitude: lng,
              });

              console.log('Selected location:', {
                address: data.description,
                latitude: lat,
                longitude: lng,
              });
            }}
            query={{
              key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '',
              language: 'en',
            }}
            styles={{
              textInput: {
                height: 48,
                borderRadius: 8,
                paddingHorizontal: 16,
                fontSize: 16,
                borderWidth: 1,
                borderColor: colors.component.stroke,
                backgroundColor: colors.component.input,
              },
              listView: {
                backgroundColor: colors.component.bg,
                borderColor: colors.component.stroke,
                borderWidth: 1,
              },
            }}
          />
        </View>
      </ContentWrapper>
    </ScreenBackground>
  );
};

export default LocationPickerScreen;

const styles = StyleSheet.create({});
