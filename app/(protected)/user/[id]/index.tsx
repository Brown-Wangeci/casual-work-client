import {
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import CustomHeader from '@/components/layout/CustomHeader';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import colors from '@/constants/Colors';
import ContentWrapper from '@/components/layout/ContentWrapper';
import SummaryCard from '@/components/common/SummaryCard';
import StarRating from '@/components/common/StarRating';
import { useEffect, useState } from 'react';
import { User } from '@/constants/Types';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Vr from '@/components/common/Vr';
import ScreenBackground from '@/components/layout/ScreenBackground';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '@/lib/utils/axios';
import { useTempUserStore } from '@/stores/tempUserStore';
import Loading from '@/components/common/Loading';
import { logError, extractErrorMessage } from '@/lib/utils';
import { showToast } from '@/lib/utils/showToast';

const UserProfileScreen = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);

  const profileData = useTempUserStore((state) => state.userProfile);
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const fetchUserData = async (force = false) => {
    if (!id) return;

    if (!force) setLoading(true);
    else setRefreshing(true);

    try {
      const response = await api.get(`/user/${id}`);// change to to /users/${id} later
      setUserData(response.data.user);
    } catch (error) {
      logError(error, 'UserProfileScreen > fetchUserData');
      const message = extractErrorMessage(error);
      showToast('error', 'Failed to Load Profile', message);
    } finally {
      if (!force) setLoading(false);
      else setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchUserData(true);
  };

  useEffect(() => {
    if (!id) return;

    if (profileData && profileData.id === id) {
      setUserData(profileData);
    } else {
      fetchUserData();
    }
  }, [id]);

  const postedTasks = userData?.tasksPosted || 0;
  const completedTasks = userData?.tasksCompleted || 0;
  const rating = userData?.rating || 0;
  const safePhone = userData?.phone?.replace(/[^0-9]/g, '');

  return (
    <ScreenBackground>
      <CustomHeader title="Profile" showBackButton />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ContentWrapper style={{ gap: moderateScale(20, 0.2) }}>
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Loading />
            </View>
          ) : !userData ? (
            <Text style={{ color: colors.text.red, fontSize: 16 }}>User data not available.</Text>
          ) : (
            <>
              <TouchableWithoutFeedback onPress={() => router.push(`/user/${id}/avatar`)}>
                <View style={styles.imageContainer}>
                  <Image
                    source={
                      userData.profilePicture
                        ? { uri: userData.profilePicture }
                        : require('@/assets/images/user.jpg')
                    }
                    style={styles.image}
                  />
                </View>
              </TouchableWithoutFeedback>

              <View style={styles.infoContainer}>
                <Text style={styles.subText}>{userData.username}</Text>
                <Text style={styles.subText}>{userData.phone}</Text>
              </View>

              <View style={styles.contactSection}>
                <TouchableOpacity onPress={() => safePhone && Linking.openURL(`tel:${safePhone}`)}>
                  <Ionicons name="call-outline" size={20} color={colors.text.bright} />
                </TouchableOpacity>
                <Vr />
                <TouchableOpacity onPress={() => safePhone && Linking.openURL(`sms:${safePhone}`)}>
                  <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.text.bright} />
                </TouchableOpacity>
                <Vr />
                <TouchableOpacity onPress={() => safePhone && Linking.openURL(`https://wa.me/${safePhone}`)}>
                  <FontAwesome name="whatsapp" size={20} color={colors.text.bright} />
                </TouchableOpacity>
              </View>

              <View>
                <Text style={styles.title}>Performance</Text>
                <View style={styles.subSection}>
                  <SummaryCard
                    style={{ gap: moderateScale(8, 0.2) }}
                    width={wp('42%')}
                    height={moderateScale(100, 0.2)}
                  >
                    <Text style={styles.number}>{completedTasks}</Text>
                    <Text style={styles.subText}>Tasks Completed</Text>
                  </SummaryCard>
                  <SummaryCard
                    style={{ gap: moderateScale(8, 0.2) }}
                    width={wp('42%')}
                    height={moderateScale(100, 0.2)}
                  >
                    <Text style={styles.number}>{postedTasks}</Text>
                    <Text style={styles.subText}>Tasks Posted</Text>
                  </SummaryCard>
                </View>
              </View>

              <View>
                <Text style={styles.title}>Rating</Text>
                <View style={styles.subSection}>
                  <SummaryCard
                    style={{ gap: moderateScale(4, 0.2) }}
                    width={wp('42%')}
                    height={moderateScale(100, 0.2)}
                  >
                    <Text style={styles.number}>{rating}</Text>
                    <StarRating rating={rating} size={moderateScale(16, 0.2)} />
                    <Text style={styles.subText}>Rating</Text>
                  </SummaryCard>
                </View>
              </View>
            </>
          )}
        </ContentWrapper>
      </ScrollView>
    </ScreenBackground>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  title: {
    color: colors.text.bright,
    fontSize: moderateScale(18, 0.2),
    fontFamily: 'poppins-semi-bold',
    marginBottom: hp('1%'),
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: hp('3%'),
  },
  subSection: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  subText: {
    color: colors.text.bright,
    fontSize: moderateScale(14, 0.2),
    fontFamily: 'poppins-regular',
    textAlign: 'center',
  },
  number: {
    color: colors.text.bright,
    fontSize: moderateScale(24, 0.2),
    fontFamily: 'poppins-bold',
    lineHeight: moderateScale(30, 0.2),
  },
  imageContainer: {
    width: wp('45%'),
    height: wp('45%'),
    borderRadius: wp('45%') / 2,
    borderWidth: 2,
    borderColor: colors.component.green.bg,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    width: '100%',
    gap: moderateScale(12, 0.2),
    alignItems: 'center',
  },
  contactSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: moderateScale(10, 0.2),
  },
});
