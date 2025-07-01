import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import ScreenBackground from '@/components/layout/ScreenBackground';
import CustomHeader from '@/components/layout/CustomHeader';
import ContentWrapper from '@/components/layout/ContentWrapper';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import colors from '@/constants/Colors';
import { logError, extractErrorMessage } from '@/lib/utils';
import api from '@/lib/axios';
import { useLocalSearchParams } from 'expo-router';
import TaskerSelectionProfileCard from '@/components/screens/tasker-selection/TaskerSelectionProfileCard';
import Loading from '@/components/common/Loading';
import { TaskApplication } from '@/constants/Types';

const TaskerSelectionScreen = () => {
  const [applications, setApplications] = useState<TaskApplication[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { id } = useLocalSearchParams();

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`applications/${id}`);
      console.log(response.data);
      setApplications(response.data.taskApplications);
    } catch (error) {
      logError(error, 'TaskerSelectionScreen > fetchApplications');
      const message = extractErrorMessage(error);
      setError(message || 'Failed to fetch applications.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchApplications();
    } catch (error) {
      logError(error, 'TaskerSelectionScreen > onRefresh');
      const message = extractErrorMessage(error);
      setError(message || 'Failed to refresh applications.');
    } finally {
      setIsRefreshing(false);
    }
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
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Loading message='Loading Applications' />
          </View>
        ) : error ? (
          <Text style={{ fontSize: moderateScale(16), color: colors.progress.cancelled }}>
            Error: {error}
          </Text>
        ) : applications && applications.length > 0 ? (
          <FlatList
            data={applications}
            renderItem={({ item }) => (
              <TaskerSelectionProfileCard application={item} />
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ gap: moderateScale(20, 0.2) }}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text style={{ fontSize: moderateScale(16), color: '#888' }}>
            No applications found for this task.
          </Text>
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
});
