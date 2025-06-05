import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image'
import ScreenWrapper from '@/components/layout/screen-wrapper'
import CustomHeader from '@/components/layout/CustomHeader'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { moderateScale } from 'react-native-size-matters'
import colors from '@/constants/Colors'
import TaskerSwitch from '@/components/screens/profile/TaskerSwitch'
import ContentWrapper from '@/components/layout/content-wrapper'
import SummaryCard from '@/components/common/SummaryCard'
import StarRating from '@/components/common/StarRating'
import ThemedInput from '@/components/ui/ThemedInput'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { User } from '@/constants/Types'
import { Ionicons } from '@expo/vector-icons'
import Button from '@/components/ui/Button'
import InfoText from '@/components/common/InfoText'

const ProfileScreen = () => {
  const [ userData, setUserData ] = useState<User | null>(null)

  // Fetch user data from API.........with change to state management
  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://192.168.100.244:3001/users?id=3')
      setUserData(response.data[0])
      } catch (error) {
        console.error(error)
      }
    }

  useEffect(() => {
    fetchUserData()
  }, [])
  


  const postedTasks = userData?.tasksPosted || 0;
  const completedTasks = userData?.tasksCompleted || 0;
  const rating = userData?.rating || 0;

  return (
    <ScreenWrapper>
      <CustomHeader title='Profile' />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ContentWrapper style={{ gap: moderateScale(20, 0.2) }}>
          <View style={styles.imageContainer}>
            <Image
              source={
                userData?.profilePicture
                  ? { uri: userData.profilePicture }
                  : require('@/assets/images/user.jpg')
              }
              style={styles.image}
            />
          </View>
          <View style={styles.infoContainer}>
            <ThemedInput
              placeholder='Enter your name'
              value={userData?.username}
              onChangeText={() => {}}
            />
            <ThemedInput
              placeholder='Enter your email'
              value={userData?.email}
              onChangeText={() => {}}
            />
            <ThemedInput
              placeholder='Enter your name'
              value={userData?.phone}
              onChangeText={() => {}}
            />
          </View>
          <InfoText>
            To update your profile, edit the fields above and tap "Update Profile".
          </InfoText>

          <View style={styles.editContainer}>
            <Button
              title='Update Profile'
              type='primary'
              small
              onPress={() => {Alert.alert('Update Profile', 'Profile updated successfully!')}}
            />
          </View>
          <TaskerSwitch tasker={userData?.tasker!} userId={userData?.id!}/>
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
        </ContentWrapper>
      </ScrollView>
    </ScreenWrapper>
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
      borderColor: colors.text.green,
      // borderColor: colors.component.stroke,
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