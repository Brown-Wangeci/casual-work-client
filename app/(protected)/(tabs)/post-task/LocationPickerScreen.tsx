import React from 'react';
import { StyleSheet, View } from 'react-native';
import ContentWrapper from '@/components/layout/ContentWrapper';
import ScreenBackground from '@/components/layout/ScreenBackground';
import CustomHeader from '@/components/layout/CustomHeader';
import CustomPlacesAutocomplete from '@/components/screens/LocationPickerScreen/CustomPlacesAutocomplete';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useTaskCreationStore } from '@/stores/taskCreationStore';
import DynamicMapView from '@/components/common/DynamicMapView';
import colors from '@/constants/Colors';


const LocationPickerScreen = () => {

  const task = useTaskCreationStore((state) => state.task);

  return (
    <ScreenBackground>
      <CustomHeader showBackButton title='Pick location' />
      <ContentWrapper style={{ flexDirection: 'column', alignItems: 'center',alignSelf: 'center', gap: hp('8%'), paddingBottom: hp('8%') }}>
        <View style={{ width: '100%', marginTop: hp('4%') }}>
          <CustomPlacesAutocomplete />
        </View>
        { task.latitude && task.longitude ? (
          <View
          style={[styles.mapViewContainer, { height: hp('50%') }]}
        >
          <DynamicMapView
            latitude={task.latitude!}
            longitude={task.longitude!}
            label={task.location}
            style={{ height: '100%', width: '100%' }}
          />
        </View>
        ) : (
          null
        )}  
      </ContentWrapper>
    </ScreenBackground>
  );
};

export default LocationPickerScreen;

const styles = StyleSheet.create({
  mapViewContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.component.bg,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: colors.component.stroke,
    borderRadius: 12,
    overflow: 'hidden',
  },
});