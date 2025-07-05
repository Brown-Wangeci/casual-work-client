import {  StyleSheet, Text, View } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { moderateScale } from 'react-native-size-matters'
import { formatDistanceToNow } from 'date-fns';
import colors from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { Task } from '@/constants/Types';
import Button from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import TaskStatus from '@/components/common/TaskStatus';


type PostedTaskCardProps = {
  task: Task 
}

const PostedTaskCard = ({ task }: PostedTaskCardProps) => {

  const router = useRouter();

  // Truncate text to a specified word limit
  const truncateText = (text: string, wordLimit: number) => {
    if (!text) return '';
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  let timeSince;
  if (task.createdAt) {
    timeSince = formatDistanceToNow(new Date(task.createdAt), { addSuffix: true });
  } else {
    timeSince = "";
  }


  return (
    <View style={styles.card}>
      <Text style={styles.title}>{truncateText(task.title, 5)}</Text>
      <Text style={styles.textTitle}>{truncateText(task.description, 15)}</Text>
      <View style={styles.locationAndDateOuterContainer}>
        <View style={styles.locationAndDateContainer}>
          <Ionicons name="location-sharp" size={16} color='#FD42C8' />
          <Text style={styles.textTitle}>{task.location}</Text>
        </View>
        <View style={styles.locationAndDateContainer}>
          <Ionicons name="time-outline" size={16} color='#DAA520' />
          <Text style={styles.textTitle}>{timeSince}</Text>
        </View>
      </View>
      <TaskStatus status={task.status} />
      <View style={styles.offerContainer}>
        <Text style={styles.textTitle}>Offer: <Text style={styles.improvedOfferText}>Ksh.{task.offer}</Text></Text>
        <View>
          { task.status === 'IN_PROGRESS' ? (
            <Button title="Track Progress" type="primary" small onPress={()=>{ router.push(`/tasks/${task.id}/track`) }} />
          ) : task.status === 'CREATED' ? (
            <Button title="Confirm Task" type="primary" small onPress={()=>{ router.push(`/tasks/${task.id}/confirmation`) }} /> 
          ) : task.status === 'REVIEW' ? (
            <Button title="Approve" type="primary" small onPress={()=>{ router.push(`/tasks/${task.id}/track`) }} /> 
          ) : task.status === 'PENDING' ? (
            null
          ) : (
            <Button title="View Task" type="primary" small onPress={()=>{ router.push(`/tasks/${task.id}`) }} />
          )}
        </View>
      </View>
      { task.status === 'PENDING' ? (
        <View style={styles.ctaContainer}>
          <View style={{ alignItems: 'center', justifyContent: 'center', width: '48%' }}>
            <Button title="Track" type="secondary" small onPress={()=>{ router.push(`/tasks/${task.id}/track`) }} />
          </View>
          <View  style={{ alignItems: 'center', justifyContent: 'center', width: '48%' }}>
            <Button title="Applications" type="primary" small onPress={()=>{ router.push(`/tasks/${task.id}/tasker-selection`) }} />
          </View>
        </View>
      ) : null }
    </View>
  )
}

export default PostedTaskCard

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
  improvedText: {
    color: colors.text.bright,
    fontSize: moderateScale(14, 0.2),
    fontFamily: 'poppins-medium',
  },
  offerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('0.5%'),
  },
  offer: {
    color: colors.text.bright,
    fontSize: moderateScale(14, 0.2),
    fontFamily: 'poppins-bold',
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
  ctaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})