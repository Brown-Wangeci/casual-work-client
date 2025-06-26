import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import colors from '@/constants/Colors';
import ContentWrapper from '@/components/layout/ContentWrapper';
import ScreenBackground from '@/components/layout/ScreenBackground';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import api from '@/lib/axios';
import Loading from '@/components/common/Loading';
import { useTempUserStore } from '@/stores/tempUserStore';
import { logError, extractErrorMessage } from '@/lib/utils';
import CustomHeader from '@/components/layout/CustomHeader';

const AvatarScreen = () => {
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { id } = useLocalSearchParams();
  const profileData = useTempUserStore((state) => state.userProfile);

  const fetchUserAvatar = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/users/${id}`);
      const avatar = response.data[0]?.profilePicture || null;
      setUserAvatar(avatar);
    } catch (error) {
      logError(error, 'AvatarScreen > fetchUserAvatar');
      const message = extractErrorMessage(error);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileData && profileData.id === id) {
      setUserAvatar(profileData.profilePicture || null);
    } else {
      fetchUserAvatar();
    }
  }, [id]);

  return (
    <ScreenBackground>
      <CustomHeader showBackButton={true} title="Avatar" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ContentWrapper style={{ alignItems: 'center', justifyContent: 'center' }}>
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Loading />
            </View>
          ) : error ? (
            <Text style={{ color: colors.text.red, fontSize: moderateScale(16, 0.2) }}>
              Error: {error}
            </Text>
          ) : (
            <View style={styles.imageContainer}>
              <Image
                source={
                  userAvatar
                    ? { uri: userAvatar }
                    : require('@/assets/images/user.jpg')
                }
                style={styles.image}
              />
            </View>
          )}
        </ContentWrapper>
      </ScrollView>
    </ScreenBackground>
  );
};

export default AvatarScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: hp('3%'),
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1 / 1,
    borderRadius: '50%',
    borderStyle: 'solid',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
