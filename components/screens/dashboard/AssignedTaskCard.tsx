import { StyleSheet, Text, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import { formatDistanceToNow } from 'date-fns';
import colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '@/constants/Types';
import Button from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import TaskStatus from '@/components/common/TaskStatus';

type AssignedTaskCardProps = {
  task: Task;
};

const AssignedTaskCard = ({ task }: AssignedTaskCardProps) => {
  const router = useRouter();

  const truncate = (text: string, wordLimit: number) => {
    if (!text) return '';
    const words = text.trim().split(/\s+/);
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
  };

  const timeSince = task.createdAt
    ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })
    : '';

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{truncate(task.title, 5)}</Text>
      <Text style={styles.textTitle}>{truncate(task.description, 15)}</Text>

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

      <TaskStatus status={task.status} />

      <View style={styles.offerContainer}>
        <Text style={styles.textTitle}>
          Offer: <Text style={styles.improvedOfferText}>Ksh.{task.offer}</Text>
        </Text>
        <View>
          { task.status === 'IN_PROGRESS' ? (
            <Button title="Manage Task" type="primary" small onPress={() => router.push(`/tasks/${task.id}/update-task-progress`)} />
          ) : task.status === 'COMPLETED' && task.taskerRated === false ? (
            <Button title="Rate Task-Poster" type="primary" small onPress={()=>{ router.push(`/tasks/${task.id}/rate`) }} />
          ) : (    
            <Button title="View Task" type="primary" small onPress={() => router.push(`/tasks/${task.id}`)} />
          )}
        </View>
      </View>
    </View>
  );
};

export default AssignedTaskCard;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.component.bg,
    borderWidth: 1,
    borderColor: colors.component.stroke,
    borderRadius: 12,
    padding: wp('4%'),
    marginBottom: hp('1%'),
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
    marginVertical: hp(0.5),
  },
  locationAndDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
});
