import { Alert, StyleSheet, Text, View } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { moderateScale } from 'react-native-size-matters'
import { Image } from 'expo-image'
import StarRating from '@/components/common/StarRating'
import Button from '@/components/ui/Button'
import colors from '@/constants/Colors'
import { useRouter } from 'expo-router'
import { useTempUserStore } from '@/stores/tempUserStore'
import { TaskApplication } from '@/constants/Types'
import api from '@/lib/axios'
import { extractErrorMessage, logError } from '@/lib/utils'

const TaskerSelectionProfileCard = ( { application }: { application: TaskApplication } ) => {

  const tasker = application.tasker;
  const router = useRouter();
  
  const onViewProfile = () => {
    if (tasker) {
      useTempUserStore.getState().setUserProfile(tasker);
      router.push(`/user/${tasker.id}`);
    }
  }

  const onAcceptApplication = async () => {
    try {
      const confirm = await new Promise<boolean>((resolve) => {
        Alert.alert(
          'Confirm',
          `Are you sure you want to accept ${tasker.username}'s application?`,
          [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Accept', onPress: () => resolve(true) },
          ]
        );
      });

      if (!confirm) return;

      const response = await api.post(`/applications/${application.id}/accept`);
      
      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', response.data.message || 'Application accepted successfully.');
        router.replace('/');
      } else {
        Alert.alert('Error', 'Unexpected error. Please try again.');
      }

    } catch (error) {
      logError(error, 'TaskerSelectionProfileCard > onAcceptApplication');
      const message = extractErrorMessage(error);
      Alert.alert('Error', message || 'Failed to accept application. Please try again.');
    }
  };

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
          <Button title="Accept" type="primary" onPress={ onAcceptApplication } />
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