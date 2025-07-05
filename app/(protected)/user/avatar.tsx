import { ScrollView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import colors from '@/constants/Colors';
import ContentWrapper from '@/components/layout/ContentWrapper';
import ScreenBackground from '@/components/layout/ScreenBackground';
import { useAuthStore } from '@/stores/authStore';
import CustomHeader from '@/components/layout/CustomHeader';
import Button from '@/components/ui/Button';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { showToast } from '@/lib/utils/showToast';
import api from '@/lib/utils/axios';
import { extractErrorMessage, logError } from '@/lib/utils';

const AvatarScreen = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [uploading, setUploading] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets.length > 0) {
        setPreviewUri(result.assets[0].uri);
      }
    } catch (error) {
      logError(error, 'AvatarScreen > pickImage');
      showToast('error', 'Failed to open gallery', extractErrorMessage(error));
    }
  };

  const uploadImage = async () => {
    if (!previewUri) return;

    const formData = new FormData();
    formData.append('image', {
      uri: previewUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    } as any);


    setUploading(true);
    const previousUser = { ...user };

    try {
      updateUser({ ...user, profilePicture: previewUri });

      const response = await api.put('/user/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 202) {
        updateUser(response.data.user);
        showToast('success', 'Avatar Updated');
        setPreviewUri(null);
      } else {
        updateUser(previousUser);
        showToast('error', 'Upload failed', 'Unexpected response.');
      }
    } catch (error) {
      updateUser(previousUser);
      logError(error, 'AvatarScreen > uploadImage');
      showToast('error', 'Upload failed', extractErrorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScreenBackground>
      <CustomHeader showBackButton={true} title="My Avatar" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ContentWrapper style={{ alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            <Image
              source={
                previewUri
                  ? { uri: previewUri }
                  : user?.profilePicture
                    ? { uri: user.profilePicture }
                    : require('@/assets/images/user.jpg')
              }
              style={styles.image}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Tap the image to select a new avatar</Text>
          {previewUri && (
            <View style={{ marginTop: hp('1%') }}>
              <Button title="Update Avatar" type="primary" onPress={uploadImage} small loading={uploading} />
            </View>
          )}
        </ContentWrapper>
      </ScrollView>
    </ScreenBackground>
  );
};

export default AvatarScreen;

const styles = StyleSheet.create({
  title: {
    color: colors.text.light,
    fontSize: moderateScale(16, 0.2),
    textAlign: 'center',
    fontFamily: 'poppins-medium',
    marginVertical: hp('2%'),
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: hp('3%'),
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1 / 1,
    borderRadius: 1000,
    borderStyle: 'solid',
    overflow: 'hidden',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: colors.component.green.bg,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
