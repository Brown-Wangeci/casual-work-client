import { Alert, StyleSheet, Text, View } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { moderateScale } from 'react-native-size-matters'
import { Image } from 'expo-image'
import StarRating from '@/components/common/StarRating'
import Button from '@/components/ui/Button'
import colors from '@/constants/Colors'
import { User } from '@/constants/Types'
import { useRouter } from 'expo-router'

const TaskerSelectionProfileCard = ( { tasker }: { tasker: User } ) => {

  const taskerId = tasker.id;
  const router = useRouter();
  
  const onViewProfile = () => {
    router.push(`/user/${taskerId}`);
  }

  const onSelectTasker = () => {
    Alert.alert('Tasker Selected', `You have selected ${tasker.username} as your tasker.`);
  }

  return (
    <View style={styles.card}>
      <View style={styles.tasker}>
        <View style={styles.imageContainer}>
          <Image
            source={
              tasker.profilePicture
                ? { uri: tasker.profilePicture }
                : require('@/assets/images/user.jpg')
            }
            style={styles.image}
          />
        </View>
        <View style={styles.taskerDetails}>
          <Text style={styles.name}>{tasker.username}</Text>
          <StarRating rating={tasker.rating} size={16} />
          <Text style={styles.tasks}>{tasker.tasksCompleted} Tasks completed</Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="View" type="secondary" onPress={ onViewProfile } />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Select" type="primary" onPress={ onSelectTasker } />
        </View>
      </View>
    </View>
  )
}

export default TaskerSelectionProfileCard

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.component.bg,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.component.stroke,
    borderRadius: 12,
    padding: wp('4%'),
    marginBottom: hp('2%'),
    gap: hp('1%'),
  },
  
  tasker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  imageContainer: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 2,
    // borderColor: colors.component.stroke,
    borderColor: colors.component.green.bg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  taskerDetails: {
    marginLeft: wp('4%'),
    gap: moderateScale(4, 0.2),
  },
  name: {
    color: colors.text.bright,
    fontSize: moderateScale(16, 0.2),
    fontFamily: 'poppins-bold',
  },
  tasks: {
    color: colors.text.light,
    fontSize: moderateScale(12, 0.2),
    fontFamily: 'poppins-regular',
  },
  textTitle: {
    color: colors.text.light,
    fontSize: moderateScale(14, 0.2),
    fontFamily: 'poppins-medium',
  },
  improvedText: {
    color: colors.text.bright,
    fontSize: moderateScale(16, 0.2),
    fontFamily: 'poppins-medium',
  },
  offersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  improvedOfferText: {
    color: colors.text.green,
    fontSize: moderateScale(16, 0.2),
    fontFamily: 'poppins-bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: wp('2%'),
  },
  buttonWrapper: {
    width: '48%',
  }
})