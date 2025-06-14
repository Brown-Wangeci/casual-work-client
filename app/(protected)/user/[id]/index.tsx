import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { Image } from 'expo-image'
import CustomHeader from '@/components/layout/CustomHeader'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { moderateScale } from 'react-native-size-matters'
import colors from '@/constants/Colors'
import ContentWrapper from '@/components/layout/ContentWrapper'
import SummaryCard from '@/components/common/SummaryCard'
import StarRating from '@/components/common/StarRating'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { User } from '@/constants/Types'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import Vr from '@/components/common/Vr'
import ScreenBackground from '@/components/layout/ScreenBackground'
import { useLocalSearchParams, useRouter } from 'expo-router'
import api from '@/lib/axios'

const UserProfileScreen = () => {
  const [ userData, setUserData ] = useState<User | null>(null)

  // Get user id from navigation params
  const { id } = useLocalSearchParams();
  console.log('User ID from params:', useLocalSearchParams());
  // If userId is not provided, default to 3 for testing purposes
  const router = useRouter();

  const userId = id || 3;

  // Fetch user data from API.........with change to state management
  const fetchUserData = async () => {
    try {
      const response = await api.get(`/users/?id=${userId}`)
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
    <ScreenBackground>
      <CustomHeader title='Tasker Profile' showBackButton />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ContentWrapper style={{ gap: moderateScale(20, 0.2) }}>
          <TouchableWithoutFeedback onPress={()=>{ router.push(`/user/${userId}/avatar`) }}>
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
          </TouchableWithoutFeedback>
          <View style={styles.infoContainer}>
            <Text style={styles.subText}>{userData?.username}</Text>
            <Text style={styles.subText}>{userData?.phone}</Text>
          </View>
          <View style={styles.contactSection}>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${userData?.phone}`)}>
                <Ionicons name="call-outline" size={20} color={colors.text.bright} />
            </TouchableOpacity>
            <Vr/>
            <TouchableOpacity onPress={() => Linking.openURL(`sms:${userData?.phone}`)}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.text.bright} />
            </TouchableOpacity>
            <Vr/>
            <TouchableOpacity
                onPress={() =>
                    Linking.openURL(`https://wa.me/${userData?.phone?.replace(/[^0-9]/g, '')}`)
                }
            >
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
    </ScreenBackground>
  )
}

export default UserProfileScreen

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
      borderColor: colors.component.green.bg,
      // borderColor: colors.text.green,
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
  }
})