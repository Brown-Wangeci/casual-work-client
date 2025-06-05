import colors from '@/constants/Colors'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { moderateScale } from 'react-native-size-matters'
import { StyleSheet, Text, View, Image } from 'react-native'
import { Link } from 'expo-router'


type UserHeaderProps = {
  userName: string;
  style?: object;
}

const UserHeader = ({ userName, style }: UserHeaderProps) => {
  

  return (
    <View style={[styles.user, style]}>
        <View style={styles.imageContainer}>
          <Link href='/(tabs)/profile'>
            <Image
              source={require('@/assets/images/user.jpg')}
              style={styles.image}
            />
          </Link>
        </View>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.greetings}>Hello,</Text>
          <Link href='/(tabs)/profile'>
            <Text style={styles.name}>{userName}</Text>
          </Link>
        </View>
    </View>
  )
}

export default UserHeader

const styles = StyleSheet.create({
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: wp('2%'),
    paddingHorizontal: wp('6%'),
    borderBottomWidth: 1,
    borderBottomColor: colors.component.stroke,
  },
  imageContainer: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: colors.text.green,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  welcomeTextContainer: {
    marginLeft: wp('4%'),
  },
  greetings: {
    color: colors.text.bright,
    fontSize: moderateScale(12, 0.2),
    fontFamily: 'poppins-medium',
  },
  name: {
    color: colors.text.bright,
    fontSize: moderateScale(16, 0.2),
    fontFamily: 'poppins-bold',
  },
})