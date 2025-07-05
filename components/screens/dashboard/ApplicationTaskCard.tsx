import { StyleSheet, Text, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import { formatDistanceToNow } from 'date-fns';
import colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { TaskApplication } from '@/constants/Types';
import ApplicationStatus from '@/components/common/ApplicationStatus';
import Button from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { showToast } from '@/lib/utils/showToast';
import { logError } from '@/lib/utils';

type ApplicationTaskCardProps = {
  taskApplication: TaskApplication;
};

const ApplicationTaskCard = ({ taskApplication }: ApplicationTaskCardProps) => {
  const router = useRouter();
  const task = taskApplication?.task;

  if (!task) return null;

  const truncateText = (text: string, wordLimit: number): string => {
    return text?.split(" ").slice(0, wordLimit).join(" ") + (text?.split(" ").length > wordLimit ? "..." : "");
  };

  const timeSince = task.createdAt
    ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })
    : "";

  const handleViewTask = () => {
    try {
      if (!task.id) throw new Error('Task ID is missing');
      router.push(`/tasks/${task.id}/apply`);
    } catch (error) {
      logError(error, 'ApplicationTaskCard > handleViewTask');
      showToast('error', 'Unable to open task', 'Please try again.');
    }
  };

  const isAccepted = taskApplication.status === 'ACCEPTED';

  return (
    <View
      style={StyleSheet.flatten([
        styles.card,
        isAccepted && styles.acceptedCard
      ])}
    >
      <Text style={styles.title}>{truncateText(task.title, 5)}</Text>
      <Text style={styles.textTitle}>{truncateText(task.description, 15)}</Text>

      <View style={styles.locationAndDateOuterContainer}>
        <View style={styles.locationAndDateContainer}>
          <Ionicons name="location-sharp" size={16} color="#FD42C8" />
          <Text style={styles.textTitle}>{task.location}</Text>
        </View>
        <View style={styles.locationAndDateContainer}>
          <Ionicons name="time-outline" size={16} color="#DAA520" />
          <Text style={styles.textTitle}>{timeSince}</Text>
        </View>
      </View>

      <ApplicationStatus status={taskApplication.status} />

      <View style={styles.offerContainer}>
        <Text style={styles.textTitle}>
          Offer: <Text style={styles.improvedOfferText}>Ksh. {task.offer}</Text>
        </Text>
        <View>
          <Button title="View Task" type="primary" small onPress={handleViewTask} />
        </View>
      </View>
    </View>
  );
};

export default ApplicationTaskCard;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.component.bg,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.component.stroke,
    borderRadius: 12,
    padding: wp('4%'),
  },
  acceptedCard: {
    borderColor: colors.text.green,
    backgroundColor: 'rgba(0, 255, 0, 0.03)',
  },
  title: {
    color: colors.text.bright,
    fontSize: moderateScale(16, 0.2),
    fontFamily: 'poppins-bold',
  },
  textTitle: {
    color: colors.text.light,
    fontSize: moderateScale(12, 0.2),
    fontFamily: 'poppins-regular',
  },
  offerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },
  improvedOfferText: {
    color: colors.text.green,
    fontSize: moderateScale(16, 0.2),
    fontFamily: 'poppins-bold',
  },
  locationAndDateOuterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: wp('1%'),
    marginVertical: hp('.5%'),
  },
  locationAndDateContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: wp('2%'),
  },
});
