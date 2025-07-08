import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
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
import { Ionicons } from '@expo/vector-icons';

const TaskerSelectionScreen = () => {
  const [applications, setApplications] = useState<TaskApplication[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { id } = useLocalSearchParams();

  const fetchApplications = async (isRefetch = false) => {
    try {
      if (!isRefetch) setIsLoading(true);
      const response = await api.get(`applications/${id}`);
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
    if (id) fetchApplications();
  }, [id]);

  return (
    <ScreenBackground>
      <CustomHeader title="Tasker Selection" showBackButton />
      <ContentWrapper style={styles.container}>
        {isLoading ? (
          <View style={styles.center}>
            <Loading message="Loading Applications" />
          </View>
        ) : (
          <FlatList
            data={applications || []}
            renderItem={({ item }) => <TaskerSelectionProfileCard application={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={[
              { gap: moderateScale(20, 0.2) },
              (!applications || applications.length === 0) && styles.center,
            ]}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No applications found for this task.</Text>
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
