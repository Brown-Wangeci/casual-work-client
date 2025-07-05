import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import ScreenBackground from '@/components/layout/ScreenBackground';
import CustomHeader from '@/components/layout/CustomHeader';
import ContentWrapper from '@/components/layout/ContentWrapper';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import colors from '@/constants/Colors';
import { logError, extractErrorMessage } from '@/lib/utils';
import api from '@/lib/utils/axios';
import { useLocalSearchParams } from 'expo-router';
import TaskerSelectionProfileCard from '@/components/screens/tasker-selection/TaskerSelectionProfileCard';
import Loading from '@/components/common/Loading';
import { TaskApplication } from '@/constants/Types';
import { showToast } from '@/lib/utils/showToast';

const TaskerSelectionScreen = () => {
  const [applications, setApplications] = useState<TaskApplication[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { id } = useLocalSearchParams();

  const fetchApplications = async (isRefetch = false) => {
    try {
      if (!isRefetch) setIsLoading(true);
      const response = await api.get(`applications/${id}`);
      console.log('Fetched applications:', response.data);
      setApplications(response.data.taskApplications || []);
    } catch (error) {
      logError(error, 'TaskerSelectionScreen > fetchApplications');
      showToast('error', 'Failed to load applications', extractErrorMessage(error));
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
    await fetchApplications(true);
  };

  useEffect(() => {
    if (id) {
      fetchApplications();
    }
  }, [id]);

  return (
    <ScreenBackground>
      <CustomHeader title="Tasker Selection" showBackButton />
      <ContentWrapper style={styles.container}>
        {isLoading ? (
          <View style={styles.center}>
            <Loading message="Loading Applications" />
          </View>
        ) : applications && applications.length > 0 ? (
          <FlatList
            data={applications}
            renderItem={({ item }) => <TaskerSelectionProfileCard application={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ gap: moderateScale(20, 0.2) }}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text style={styles.emptyText}>No applications found for this task.</Text>
        )}
      </ContentWrapper>
    </ScreenBackground>
  );
};

export default TaskerSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: hp('3%'),
    alignSelf: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: moderateScale(16),
    color: colors.text.light,
    textAlign: 'center',
  },
});
