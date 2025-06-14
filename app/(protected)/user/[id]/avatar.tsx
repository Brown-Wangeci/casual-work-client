import { ScrollView, StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { moderateScale } from 'react-native-size-matters'
import colors from '@/constants/Colors'
import ContentWrapper from '@/components/layout/ContentWrapper'
import { useEffect, useState } from 'react'
import { User } from '@/constants/Types'
import ScreenBackground from '@/components/layout/ScreenBackground'
import { useLocalSearchParams } from 'expo-router'
import api from '@/lib/axios'

const AvatarScreen = () => {
  const [ userAvatar, setUserAvatar ] = useState<User | null>(null)

  // Get user id from navigation params
  const { id } = useLocalSearchParams();
  console.log('User ID from params:', useLocalSearchParams());
  // If userId is not provided, default to 3 for testing purposes
  const userId = id || 3;

  // Fetch user data from API.........with change to state management
  const fetchUserAvatar = async () => {
    try {
        const response = await api.get(`/users/?id=${userId}`)
      setUserAvatar(response.data[0].profilePicture)
    } catch (error) {
        console.error(error)
      }
    }

  useEffect(() => {
    fetchUserAvatar()
  }, [])
  

  return (
    <ScreenBackground >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <ContentWrapper style={{ alignItems: 'center', justifyContent: 'center' }}>
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
            </ContentWrapper>
        </ScrollView>
    </ScreenBackground>
  )
}

export default AvatarScreen

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
  imageContainer: {
    aspectRatio: 1/1,
    width: '100%',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
})