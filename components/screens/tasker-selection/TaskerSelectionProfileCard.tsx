import { Alert, StyleSheet, Text, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import { Image } from 'expo-image';
import StarRating from '@/components/common/StarRating';
import Button from '@/components/ui/Button';
import colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useTempUserStore } from '@/stores/tempUserStore';
import { TaskApplication } from '@/constants/Types';
import api from '@/lib/utils/axios';
import { extractErrorMessage, logError } from '@/lib/utils';
import { useTasksStore } from '@/stores/tasksStore';
import { useState } from 'react';
import { showToast } from '@/lib/utils/showToast';

const TaskerSelectionProfileCard = ({ application }: { application: TaskApplication }) => {
  const updateTask = useTasksStore((state) => state.updateTask);
  const [loading, setLoading] = useState(false);

  const tasker = application.user;
  const router = useRouter();

  const onViewProfile = () => {
    if (!tasker) return;
    useTempUserStore.getState().setUserProfile(tasker);
    router.push(`/user/${tasker.id}`);
  };

  const onAcceptApplication = async () => {
    if (!tasker || loading) return;

    const confirmed = await new Promise<boolean>((resolve) => {
      Alert.alert(
        'Confirm',
        `Are you sure you want to accept ${tasker.username}'s application?`,
        [
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
          { text: 'Accept', style: 'default', onPress: () => resolve(true) },
        ]
      );
    });

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await api.patch(`/applications/${application.id}/accept`);
      const updatedTask = response.data?.data;

      if (updatedTask) {
        updateTask(updatedTask);
        showToast('success', 'Application accepted', response.data.message || 'Tasker successfully assigned.');
        router.push('/');
      } else {
        showToast('error', 'Unexpected error', 'No updated task data received.');
      }
    } catch (error) {
      logError(error, 'onAcceptApplication');
      showToast('error', 'Failed to accept', extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.tasker}>
        <View style={styles.imageContainer}>
          <Image
            source={tasker.profilePicture ? { uri: tasker.profilePicture } : require('@/assets/images/user.jpg')}
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
          <Button title="View" type="secondary" onPress={onViewProfile} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Accept" type="primary" onPress={onAcceptApplication} loading={loading} />
        </View>
      </View>
    </View>
  );
};

export default TaskerSelectionProfileCard;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.component.bg,
    borderWidth: 1,
    borderColor: colors.component.stroke,
    borderRadius: 12,
    padding: wp('4%'),
    marginBottom: hp('2%'),
    gap: hp('1%'),
  },
  tasker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: wp('8%'),
    borderWidth: 2,
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp('2%'),
  },
  buttonWrapper: {
    width: '48%',
  },
});
