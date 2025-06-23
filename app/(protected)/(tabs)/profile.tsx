import { Alert, Keyboard, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { Image } from 'expo-image'
import CustomHeader from '@/components/layout/CustomHeader'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { moderateScale } from 'react-native-size-matters'
import colors from '@/constants/Colors'
import TaskerSwitch from '@/components/screens/profile/TaskerSwitch'
import ContentWrapper from '@/components/layout/ContentWrapper'
import SummaryCard from '@/components/common/SummaryCard'
import StarRating from '@/components/common/StarRating'
import ThemedInput from '@/components/ui/ThemedInput'
import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import InfoText from '@/components/common/InfoText'
import ScreenBackground from '@/components/layout/ScreenBackground'
import { confirmAction } from '@/lib/utils'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import api from '@/lib/axios'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'expo-router'

const ProfileScreen = () => {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [userInProfile, setUserInProfile] = useState({...user})
  const userUpdate = useAuthStore((state) => state.updateUser)

  useEffect(() => {
    setUserInProfile({ ...user });
  }, [user]);

  const router  = useRouter()

    if (!userInProfile) {
      Alert.alert('Error', 'User not found. Please log in again.');
      router.replace('/login');
      return null; // Prevent rendering if user is not found
    }

  // Review this logic to fix the missmatch between user and userInProfile
  const updateUser = async () => {
    if (!userInProfile.username || !userInProfile.email || !userInProfile.phone) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    // Save current user as backup in case we need to rollback
    const previousUser = { ...user };

    // Optimistically update the UI
    userUpdate(userInProfile);

    try {
      const response = await api.put('/users/me', userInProfile);

      if (response.status === 200) {
        userUpdate(response.data); // Confirm with fresh data from backend
        Alert.alert('Success', 'Your profile has been updated successfully.');
      } else {
        console.warn('Unexpected response:', response);
        userUpdate(previousUser); // Roll back
        Alert.alert('Update Failed', 'Something went wrong. Please try again.');
      }
    } catch (error: any) {
      console.error('Update error:', error);

      // Roll back to previous state
      userUpdate(previousUser);

      let message = 'An unexpected error occurred. Please try again.';

      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 400:
            message = data?.message || 'Invalid data provided.';
            break;
          case 401:
            message = 'You are not authorized. Please log in again.';
            router.push('/login');
            return;
          case 500:
            message = 'Server error. Please try again later.';
            break;
          default:
            message = data?.message || message;
        }
      }

      Alert.alert('Error', message);
    }
  };
  // Function to handle user profile update with confirmation
  const handleUpdateProfile = async () => {
    confirmAction(
      'Are you sure you want to update your profile?',
      updateUser,
      () => Alert.alert('Update Cancelled', 'Your profile was not updated.')
    )
  }

  const handleLogout = async () => {
    confirmAction(
      'Are you sure you want to log out?',
      async () => {
        await logout();
        router.replace('/login');
      },
      () => Alert.alert('Logout Cancelled', 'You are still logged in.')
    )
  }


  const postedTasks = userInProfile.tasksPosted ?? 0;
  const completedTasks = userInProfile.tasksCompleted ?? 0;
  const rating = userInProfile.rating ?? 0;

  return (
    <ScreenBackground>
      <CustomHeader title='Profile' />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContainer}
          extraScrollHeight={Platform.OS === 'ios' ? 60 : 0}
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
        >
          <ContentWrapper style={{ gap: moderateScale(20, 0.2) }}>
            <TouchableWithoutFeedback onPress={()=>{ router.push(`/user/avatar`) }}>
              <View style={styles.imageContainer}>
                <Image
                  source={
                    userInProfile.profilePicture
                      ? { uri: userInProfile.profilePicture }
                      : require('@/assets/images/user.jpg')
                  }
                  style={styles.image}
                />
              </View>
            </TouchableWithoutFeedback>
            <View style={styles.infoContainer}>
              <ThemedInput
                placeholder='Enter preferred username'
                value={userInProfile.username}
                onChangeText={(text) => setUserInProfile((prev) => ({ ...prev, username: text })) }
              />
              <ThemedInput
                placeholder='Enter your school email'
                value={userInProfile.email}
                onChangeText={ (text) => setUserInProfile((prev) => ({ ...prev, email: text })) }
              />
              <ThemedInput
                placeholder='e.g. 0712345678'
                value={userInProfile.phone}
                onChangeText={(text) => setUserInProfile((prev) => ({ ...prev, phone: text }))}
              />
            </View>
            <InfoText>
              To update your profile, edit the fields above then tap "Update Profile".
            </InfoText>

            <View style={styles.editContainer}>
              <Button
                title='Update Profile'
                type='primary'
                small
                onPress={ handleUpdateProfile }
              />
            </View>
            <TaskerSwitch />
            <View>
              <Text style={styles.title}>Performance</Text>
              <View style={styles.subSection}>
                <SummaryCard
                  style={{ gap: moderateScale(8, 0.2) }}
                  width={wp('42%')}
                  height={moderateScale(100, 0.2)}
                >
                    <Text style={styles.number}>{ completedTasks }</Text>
                    <Text style={styles.subText}>Tasks Completed</Text>
                </SummaryCard>
                <SummaryCard
                  style={{ gap: moderateScale(8, 0.2) }}
                  width={wp('42%')}
                  height={moderateScale(100, 0.2)}
                >
                  <Text style={styles.number}>{ postedTasks }</Text>
                  <Text style={styles.subText}>Tasks Posted</Text>
                </SummaryCard>
              </View>
              <View></View>
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
            <View>
              <TouchableOpacity onPress={ handleLogout }>
                <InfoText>
                  Logout
                </InfoText>
              </TouchableOpacity>
            </View>
          </ContentWrapper>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </ScreenBackground>
  )
}

export default ProfileScreen

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
    paddingVertical: hp('2%'),
    paddingBottom: hp('4%'),
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
    textAlign: 'center'
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
      borderRadius: '50%',
      borderStyle: 'solid',
      borderWidth: 2,
      // borderColor: colors.text.green,
      // borderColor: colors.component.stroke,
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
    alignSelf: 'center',
  },
  editContainer: {
    width: wp('40%'),
    alignSelf: 'flex-end',
  },
})