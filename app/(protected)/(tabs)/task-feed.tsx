import { FlatList, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import CustomHeader from '@/components/layout/CustomHeader';
import ContentWrapper from '@/components/layout/ContentWrapper';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import TaskFeedCard from '@/components/screens/task-feed/TaskFeedCard';
import ScreenBackground from '@/components/layout/ScreenBackground';
import api from '@/lib/utils/axios';
import { extractErrorMessage, logError } from '@/lib/utils';
import Loading from '@/components/common/Loading';
import { useTaskFeedStore } from '@/stores/taskFeedStore';
import { showToast } from '@/lib/utils/showToast';
import colors from '@/constants/Colors';

const TaskFeedScreen = () => {
  const tasks = useTaskFeedStore((state) => state.tasks);
  const setTasks = useTaskFeedStore((state) => state.setTasks);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTasks = async (isRefetch = false) => {
    try {
      if (!isRefetch) setIsLoading(true);

      const response = await api.get('/tasks?status=PENDING');
      setTasks(response.data.tasks || []);
    } catch (error) {
      logError(error, 'TaskFeedScreen > fetchTasks');
      const message = extractErrorMessage(error);
      showToast('error', 'Failed to fetch tasks', message);
    } finally {
      if (isRefetch) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchTasks(true);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <ScreenBackground>
      <CustomHeader title="Available Tasks" />
      <ContentWrapper style={styles.container}>
        {isLoading ? (
          <View style={styles.center}>
            <Loading message="Loading task feed..." />
          </View>
        ) : (
          <FlatList
            data={tasks}
            renderItem={({ item }) => <TaskFeedCard task={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={[
              { gap: moderateScale(20, 0.2) },
              (!tasks || tasks.length === 0) && styles.center,
            ]}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.noTasks}>No tasks available!!</Text>
                <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
                  <Ionicons name="refresh" size={24} color={colors.text.green} />
                  <Text style={styles.retryText}>Tap to retry</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </ContentWrapper>
    </ScreenBackground>
  );
};

export default TaskFeedScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: hp('3%'),
    alignSelf: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTasks: {
    fontSize: moderateScale(16),
    color: colors.text.light,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: hp('2%'),
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1%'),
    paddingHorizontal: hp('2%'),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.text.green,
  },
  retryText: {
    color: colors.text.green,
    fontFamily: 'poppins-medium',
    fontSize: moderateScale(14, 0.2),
    marginLeft: 8,
  },

});
