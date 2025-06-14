import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { moderateScale } from 'react-native-size-matters'
import UserHeader from '@/components/screens/dashboard/UserHeader';
import SummaryCard from '@/components/common/SummaryCard';
import colors from '@/constants/Colors';
import ContentWrapper from '@/components/layout/ContentWrapper';
import TaskerSwitch from '@/components/screens/profile/TaskerSwitch';
import Button from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import ScreenBackground from '@/components/layout/ScreenBackground';
import { useAuthStore } from '@/stores/authStore';

const DashboardScreen = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!user) {
    Alert.alert('Error', 'User not found. Please log in again.');
    router.push('/login');
    return null; // Prevent rendering if user is not found
  }

  const postedTasks = user.tasksPosted ?? 0;
  const completedTasks = user.tasksCompleted ?? 0;

  // Navigation to other pages via pressable components
  const onNavigateToPostTaskScreen = () => router.push('/post-task'); 
  const onNavigateToTaskFeedScreen = () => router.push('/task-feed');


  return (
    <ScreenBackground>
      <UserHeader />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ContentWrapper style={{ gap: moderateScale(20, 0.2) }}>
          <TaskerSwitch />
          <View style={styles.summaryCards}>
              <SummaryCard width={wp('42%')} height={moderateScale(100, 0.2)}>
                <Text style={styles.numberOfTasks}>{ completedTasks }</Text>
                <Text style={styles.tasksText}>Tasks Completed</Text>
              </SummaryCard>
              <SummaryCard width={wp('42%')} height={moderateScale(100, 0.2)}>
                <Text style={styles.numberOfTasks}>{ postedTasks }</Text>
                <Text style={styles.tasksText}>Tasks Posted</Text>
              </SummaryCard>
          </View>
          <View style={styles.ctaContainer}>
            <Button title='POST YOUR TASK' type='primary' onPress={onNavigateToPostTaskScreen} />
            <Button title='VIEW TASK FEED' type='secondary' onPress={onNavigateToTaskFeedScreen} />
          </View>
          <Text style={styles.activityText}>Activity</Text>
          <View style={styles.recentActivityContainer}>

          </View>
        </ContentWrapper>
      </ScrollView>
    </ScreenBackground>
  )
}

export default DashboardScreen

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: hp('3%'),
  },
  summaryCards: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tasksText: {
    color: colors.text.bright,
    fontSize: moderateScale(14, 0.2),
    fontFamily: 'poppins-regular',
    textAlign: 'center'
  },
  numberOfTasks: {
    color: colors.text.bright,
    fontSize: moderateScale(24, 0.2),
    fontFamily: 'poppins-bold',
  },
  ctaContainer: {
    gap: hp('2'),
  },
  activityText: {
    color: colors.text.bright,
    fontFamily: 'poppins-bold',
    fontSize: moderateScale(18, 0.2),
  },
  recentActivityContainer: {

  }
})