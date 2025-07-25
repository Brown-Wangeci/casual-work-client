import { StyleSheet, View, Text, ScrollView, Alert, RefreshControl } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import { useEffect, useState } from 'react';

import UserHeader from '@/components/screens/dashboard/UserHeader';
import SummaryCard from '@/components/common/SummaryCard';
import colors from '@/constants/Colors';
import ContentWrapper from '@/components/layout/ContentWrapper';
import TaskerSwitch from '@/components/screens/profile/TaskerSwitch';
import Button from '@/components/ui/Button';
import ScreenBackground from '@/components/layout/ScreenBackground';
import { useRouter } from 'expo-router';

import { useAuthStore } from '@/stores/authStore';
import { useTasksStore } from '@/stores/tasksStore';
import TaskTab from '@/components/screens/dashboard/TaskTab';
import Loading from '@/components/common/Loading';
import ApplicationTaskCard from '@/components/screens/dashboard/ApplicationTaskCard';
import AssignedTaskCard from '@/components/screens/dashboard/AssignedTaskCard';
import PostedTaskCard from '@/components/screens/dashboard/PostedTaskCard';
import { Task, TaskApplication } from '@/constants/Types';

const DashboardScreen = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const {
    loading,
    error,
    fetchUserTasks,
    posted,
    assigned,
    applications,
  } = useTasksStore();

  const [selectedTab, setSelectedTab] = useState<'Posted' | 'Assigned' | 'Applications'>('Posted');
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserTasks();
      setInitialLoadDone(true);
    };
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserTasks();
    setRefreshing(false);
  };

  if (!user) {
    Alert.alert('Error', 'User not found. Please log in again.');
    router.replace('/login');
    return null;
  }

  const postedTasks = user.tasksPosted ?? 0;
  const completedTasks = user.tasksCompleted ?? 0;

  const onNavigateToPostTaskScreen = () => router.push('/post-task');
  const onNavigateToTaskFeedScreen = () => router.push('/task-feed');

  const taskTabs = ['Posted', 'Assigned', 'Applications'];

  const getFilteredTasks = (): (Task | TaskApplication)[] => {
    switch (selectedTab) {
      case 'Posted':
        return posted;
      case 'Assigned':
        return assigned;
      case 'Applications':
        return applications;
      default:
        return [];
    }
  };

  const filteredTasks = getFilteredTasks();

  return (
    <ScreenBackground>
      <UserHeader />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ContentWrapper style={{ gap: moderateScale(16, 0.2) }}>
          <TaskerSwitch />

          <View style={styles.summaryCards}>
            <SummaryCard width={wp('42%')} height={moderateScale(100, 0.2)}>
              <Text style={styles.numberOfTasks}>{completedTasks}</Text>
              <Text style={styles.tasksText}>Tasks Completed</Text>
            </SummaryCard>
            <SummaryCard width={wp('42%')} height={moderateScale(100, 0.2)}>
              <Text style={styles.numberOfTasks}>{postedTasks}</Text>
              <Text style={styles.tasksText}>Tasks Posted</Text>
            </SummaryCard>
          </View>

          <View style={styles.ctaContainer}>
            <Button title="POST YOUR TASK" type="primary" onPress={onNavigateToPostTaskScreen} />
            <Button title="VIEW TASK FEED" type="secondary" onPress={onNavigateToTaskFeedScreen} />
          </View>

          <Text style={styles.activityText}>Recent Activity</Text>

          <View style={styles.tabsContainer}>
            {taskTabs.map((tab, index) => (
              <TaskTab key={index} title={tab} tab={selectedTab} onPress={() => setSelectedTab(tab as any)} />
            ))}
          </View>

          <View style={styles.recentActivityContainer}>
            {!initialLoadDone || (loading && !refreshing) ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: moderateScale(20, 0.2) }}>
                <Loading message="Loading user tasks" />
              </View>
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : filteredTasks.length === 0 ? (
              <Text style={styles.infoText}>No tasks in this category yet.</Text>
            ) : (
              filteredTasks.map((item) => {
                if (selectedTab === 'Posted') {
                  return <PostedTaskCard key={(item as Task).id} task={item as Task} />;
                }
                if (selectedTab === 'Assigned') {
                  return <AssignedTaskCard key={(item as Task).id} task={item as Task} />;
                }
                if (selectedTab === 'Applications') {
                  return <ApplicationTaskCard key={(item as TaskApplication).id} taskApplication={item as TaskApplication} />;
                }
                return null;
              })
            )}
          </View>
        </ContentWrapper>
      </ScrollView>
    </ScreenBackground>
  );
};

export default DashboardScreen;

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
    textAlign: 'center',
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
    marginBottom: -10,
  },
  tabsContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.component.stroke,
    paddingVertical: moderateScale(4, 0.2),
    paddingHorizontal: moderateScale(4, 0.2),
    width: '100%',
    flexDirection: 'row',
    backgroundColor: colors.component.bg,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  recentActivityContainer: {
    width: '100%',
    gap: moderateScale(20, 0.2),
  },
  errorText: {
    fontSize: moderateScale(16),
    color: '#f00',
    fontFamily: 'poppins-regular',
    textAlign: 'center',
  },
  infoText: {
    fontSize: moderateScale(16),
    color: colors.infoText,
    fontFamily: 'poppins-regular',
    textAlign: 'center',
  },
});
