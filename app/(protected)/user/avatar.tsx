import { ScrollView, StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { moderateScale } from 'react-native-size-matters'
import colors from '@/constants/Colors'
import ContentWrapper from '@/components/layout/ContentWrapper'
import ScreenBackground from '@/components/layout/ScreenBackground'
import { useAuthStore } from '@/stores/authStore'
import CustomHeader from '@/components/layout/CustomHeader'

const AvatarScreen = () => {
  const userAvatar = useAuthStore((state) => state.user?.profilePicture);
  

  return (
    <ScreenBackground >
      <CustomHeader showBackButton={true} title="My Avatar" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ContentWrapper style={{ alignItems: 'center', justifyContent: 'center'}}>
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
    width: '100%',
    aspectRatio: 1/1,
    borderRadius: '50%',
    borderStyle: 'solid',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
})