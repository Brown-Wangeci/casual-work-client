import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import colors from '@/constants/Colors';
import ContentWrapper from '@/components/layout/ContentWrapper';
import ScreenBackground from '@/components/layout/ScreenBackground';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import api from '@/lib/utils/axios';
import Loading from '@/components/common/Loading';
import { useTempUserStore } from '@/stores/tempUserStore';
import { extractErrorMessage, logError } from '@/lib/utils';
import { showToast } from '@/lib/utils/showToast';
import CustomHeader from '@/components/layout/CustomHeader';

const AvatarScreen = () => {
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { id } = useLocalSearchParams();
  const profileData = useTempUserStore((state) => state.userProfile);

  const fetchUserAvatar = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/user/${id}`);// change to /users/${id} later
      const avatar = response.data.user?.profilePicture || null;
      setUserAvatar(avatar);
    } catch (error) {
      logError(error, 'AvatarScreen > fetchUserAvatar');
      const message = extractErrorMessage(error);
      showToast('error', 'Failed to Load Avatar', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    if (profileData && profileData.id === id) {
      setUserAvatar(profileData.profilePicture || null);
    } else {
      fetchUserAvatar();
    }
  }, [id]);

  return (
    <ScreenBackground>
      <CustomHeader showBackButton title="Avatar" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ContentWrapper style={{ alignItems: 'center', justifyContent: 'center' }}>
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Loading />
            </View>
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
    aspectRatio: 1,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: colors.component.green.bg,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
