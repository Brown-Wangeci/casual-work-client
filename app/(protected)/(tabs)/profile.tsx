import {
  Alert,
  Keyboard,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Pressable,
} from 'react-native'
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
import { confirmAction, extractErrorMessage, logError } from '@/lib/utils'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import api from '@/lib/utils/axios'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { showToast } from '@/lib/utils/showToast'
import { safeFormatPhoneNumber } from '@/lib/utils/formatPhone'

const ProfileScreen = () => {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const updateUserStore = useAuthStore((state) => state.updateUser)
  const [userInProfile, setUserInProfile] = useState({ ...user })
  const [isEditing, setIsEditing] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const router = useRouter()

  const fetchUserProfile = async () => {
    setRefreshing(true)
    try {
      const response = await api.get('/user/me')
      updateUserStore(response.data.user)
      setUserInProfile(response.data.user)
      showToast('success', 'Profile refreshed')
    } catch (error) {
      logError(error, 'ProfileScreen > fetchUserProfile')
      showToast('error', 'Failed to refresh profile', extractErrorMessage(error))
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    setUserInProfile({ ...user })
  }, [user])

  useEffect(() => {
    const original = JSON.stringify({
      username: user?.username,
      email: user?.email,
      phone: user?.phone,
    })

    const current = JSON.stringify({
      username: userInProfile?.username,
      email: userInProfile?.email,
      phone: userInProfile?.phone,
    })

    setHasChanges(original !== current)
  }, [userInProfile])

  if (!userInProfile) {
    showToast('error', 'User not found. Please log in again.')
    router.replace('/login')
    return (
      <ScreenBackground>
        <CustomHeader title='Profile' />
        <ContentWrapper>
          <Text style={styles.title}>Redirecting to login...</Text>
        </ContentWrapper>
      </ScreenBackground>
    )
  }

  const updateUser = async () => {
    const { username, email, phone } = userInProfile

    if (!username || !email || !phone) {
      showToast('info', 'Please fill in all required fields.')
      return
    }

    if (!email.endsWith('@strathmore.edu')) {
      showToast('error', 'Invalid Email', 'Only Strathmore emails are allowed.')
      return
    }

    let formattedPhone = safeFormatPhoneNumber(phone)
    if (!formattedPhone) {
      showToast('error', 'Invalid Phone Number', 'Please enter a valid phone number.')
      return
    }

    setIsEditing(true)
    const previousUser = { ...user }
    const updatedProfile = { ...userInProfile, phone: formattedPhone }
    updateUserStore(updatedProfile)

    try {
      const response = await api.put('/user/me', updatedProfile)

      if (response.status === 202) {
        updateUserStore(response.data.user)
        showToast('success', response.data.message || 'Profile updated successfully.')
      } else {
        updateUserStore(previousUser)
        showToast('error', 'Update Failed', 'Something went wrong. Please try again later.')
      }
    } catch (error) {
      updateUserStore(previousUser)
      logError(error, 'handleUpdateUser')
      showToast('error', 'Error', extractErrorMessage(error) || 'An error occurred while updating your profile.')
    } finally {
      setIsEditing(false)
    }
  }

  const handleUpdateProfile = async () => {
    confirmAction(
      'Are you sure you want to update your profile?',
      updateUser,
      () => {}
    )
  }

  const handleLogout = async () => {
    confirmAction(
      'Are you sure you want to log out?',
      async () => {
        await logout()
      },
      () => {}
    )
  }

  const postedTasks = userInProfile.tasksPosted ?? 0
  const completedTasks = userInProfile.tasksCompleted ?? 0
  const rating = userInProfile.rating ?? 0
  const formarttedRating = rating ? parseFloat(rating.toFixed(1)) : 0

  return (
    <ScreenBackground>
      <CustomHeader title='Profile' />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContainer}
          extraScrollHeight={Platform.OS === 'ios' ? 60 : 0}
          enableOnAndroid
          keyboardShouldPersistTaps='handled'
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchUserProfile} />}
        >
          <ContentWrapper style={{ gap: moderateScale(20, 0.2) }}>
            <Pressable onPress={() => { router.push(`/user/avatar`) }}>
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
            </Pressable>
            <View style={styles.infoContainer}>
              <ThemedInput
                placeholder='Enter preferred username'
                value={userInProfile.username}
                onChangeText={(text) => setUserInProfile((prev) => ({ ...prev, username: text }))}
                autoCapitalize='none'
              />
              <ThemedInput
                placeholder='Enter your school email'
                value={userInProfile.email}
                onChangeText={(text) => setUserInProfile((prev) => ({ ...prev, email: text }))}
                autoCapitalize='none'
                keyboardType='email-address'
                autoComplete='email'
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
                onPress={handleUpdateProfile}
                loading={isEditing}
                disabled={!hasChanges}
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
                  <Text style={styles.number}>{formarttedRating}</Text>
                  <StarRating rating={formarttedRating} size={moderateScale(16, 0.2)} />
                  <Text style={styles.subText}>Rating</Text>
                </SummaryCard>
              </View>
            </View>
            <View>
              <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
                <Ionicons name='log-out-outline' size={24} color={colors.text.light} />
                <InfoText style={{ width: '100%' }}>Logout</InfoText>
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
    borderRadius: 1000,
    borderStyle: 'solid',
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
    alignSelf: 'center',
  },
  editContainer: {
    width: wp('40%'),
    alignSelf: 'flex-end',
  },
  logoutContainer: {
    flexDirection: 'row',
    width: wp('30%'),
    alignItems: 'center',
    padding: moderateScale(10, 0.2),
    gap: moderateScale(10, 0.2),
  }
})