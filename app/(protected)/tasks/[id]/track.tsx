import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'expo-image'
import colors from '@/constants/Colors'
import { moderateScale } from 'react-native-size-matters'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import LiveMapView from '@/components/screens/task-track/LiveMapView'
import ProgressBar from '@/components/ui/ProgressBar'
import StarRating from '@/components/common/StarRating'
import Button from '@/components/ui/Button'
import ContentWrapper from '@/components/layout/ContentWrapper'
import Tag from '@/components/screens/task-track/Tag'
import { FontAwesome6 } from '@expo/vector-icons'
import CustomHeader from '@/components/layout/CustomHeader'
import { calculateProgress, extractErrorMessage, formatStatus, logError } from '@/lib/utils'
import { Task } from '@/constants/Types'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ScreenBackground from '@/components/layout/ScreenBackground'
import api from '@/lib/utils/axios'
import { useTempUserStore } from '@/stores/tempUserStore'
import { useTasksStore } from '@/stores/tasksStore'
import Loading from '@/components/common/Loading'
import { showToast } from '@/lib/utils/showToast'
import DynamicMapView from '@/components/common/DynamicMapView'

const TaskTrackingScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const getTaskById = useTasksStore((state) => state.getCreatedTaskById);
  const cancelTask = useTasksStore((state) => state.cancelTask);
  const isCancelling = useTasksStore((state) => state.isCancelling);
  const [mapHeight, setMapHeight] = useState(hp('30%'));
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const toggleMapHeight = () => {
    setMapHeight(prevHeight => (prevHeight === hp('30%') ? hp('70%') : hp('30%')));
  };

  const fetchTaskDetails = async (force = false) => {
    setError(null);
    if (!force) {
      const cachedTask = getTaskById(id as string);
      if (cachedTask) {
        cachedTask.location = cachedTask.location || '';
        cachedTask.longitude = cachedTask.longitude || 0;
        cachedTask.latitude = cachedTask.latitude ||0;
        setTask(cachedTask);
        setProgress(calculateProgress(cachedTask.status));
        setLoading(false);
        return;
      }
    }

    try {
      const response = await api.get(`/tasks/${id}`);
      if (!response.data || !response.data.task) {
        throw new Error('Unexpected response format: task not found.');
      }
      const taskData = response.data.task;
      taskData.location = 'Nairobi, Kenya';
      taskData.latitude = -1.2921;
      taskData.longitude = 36.8219;
      useTasksStore.getState().updateTask(taskData);
      setTask(taskData);
      setProgress(calculateProgress(taskData.status));
    } catch (error: any) {
      logError(error, 'fetchTaskDetails');
      setError(extractErrorMessage(error) || 'Failed to load task details.');
    } finally {
      setLoading(false);
    }
  };

  const onContactTasker = () => {
    if (task?.taskerAssigned) {
      useTempUserStore.getState().setUserProfile(task.taskerAssigned);
      router.push(`/user/${task.taskerAssigned.id}`);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTaskDetails(true);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const handleApproveTaskCompletion = async () => {
    if (!task?.id) {
      showToast('error', 'Missing Task ID', 'Cannot approve without a valid task ID.');
      return;
    }

    try {
      setIsApproving(true);
      const response = await api.patch(`/tasks/${task.id}/approve`);

      if (response.status === 202 && response.data?.approvedTask) {
        const updatedTask = response.data.approvedTask;
        useTasksStore.getState().updateTask(updatedTask);
        setTask(updatedTask);
        setProgress(calculateProgress(updatedTask.status));
        showToast('success', 'Task Approved', response.data.message || 'Task marked as complete.');
        router.push(`/tasks/${updatedTask.id}/rate`);
      } else {
        showToast('error', 'Approval Failed', 'Unexpected server response. Please try again.');
      }
    } catch (error) {
      logError(error, 'handleApproveTaskCompletion');
      showToast('error', 'Approval Error', extractErrorMessage(error));
    } finally {
      setIsApproving(false);
    }
  };

  const handleCancelTask = () => {
    if (!task?.id) {
      showToast('error', 'Task ID not found', 'Unable to cancel task without ID.');
      return;
    }
    cancelTask(task.id);
  };

  return (
    <ScreenBackground>
      <CustomHeader title='Task Tracking' showBackButton />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ContentWrapper>
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Loading message='Loading task tracking' />
            </View>
          ) : error ? (
            <Text style={{ fontSize: moderateScale(16, 0.2), color: colors.text.red }}>Error: {error}</Text>
          ) : task ? (
            <>
              <Text style={styles.title}>{task.title}</Text>
              <View style={styles.categoryAndOfferContainer}>
                {task?.category && <Tag label={task.category} />}
                <Text style={styles.finalOffer}>Ksh. {task.offer}</Text>
              </View>

              <Text style={styles.subTitle}>Description</Text>
              <Text style={styles.description}>{task.description}</Text>

              <Text style={styles.subTitle}>Progress</Text>
              {progress !== null ? (
                <>
                  <View style={styles.progressBarContainer}>
                    <ProgressBar percentage={progress} />
                  </View>
                  <Text style={styles.status}>Status: <Text style={styles.statusState}>{formatStatus(task.status)}</Text></Text>
                </>
              ) : (
                <Text style={{ fontSize: moderateScale(16, 0.2), color: colors.text.light }}>No progress data available.</Text>
              )}

              <Text style={styles.subTitle}>Location</Text>
              <Text style={styles.description}>{task.location}</Text>
              <View style={[styles.mapViewContainer, { height: mapHeight }]}>
                {task.latitude !== null && task.longitude !== null && (
                  <DynamicMapView
                    latitude={task.latitude}
                    longitude={task.longitude}
                    label={task.location}
                    style={[{ height: '100%' }, { width: '100%' }]}
                  />
                )}
              </View>
              <TouchableOpacity onPress={toggleMapHeight}>
                <FontAwesome6 name={mapHeight === hp('30%') ? 'expand' : 'compress'} size={24} color={colors.text.bright} style={styles.resizeIcon} />
              </TouchableOpacity>

              <Text style={styles.subTitle}>Tasker</Text>
              {task.taskerAssigned ? (
                <View style={styles.tasker}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={task.taskerAssigned?.profilePicture ? { uri: task.taskerAssigned.profilePicture } : require('@/assets/images/user.jpg')}
                      style={styles.image}
                    />
                  </View>
                  <View style={styles.taskerDetails}>
                    <Text style={styles.name}>{task.taskerAssigned?.username}</Text>
                    <StarRating rating={task.taskerAssigned?.rating!} size={16} />
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button title="Contact" type='secondary' small onPress={onContactTasker} />
                  </View>
                </View>
              ) : (
                <Text style={{ fontSize: moderateScale(16, 0.2), color: colors.text.light }}>No tasker assigned yet.</Text>
              )}

              <View style={styles.ctaContainer}>
                {(task.status === "IN_PROGRESS" || task.status === "REVIEW") && (
                  <Button
                    title="APPROVE TASK COMPLETION"
                    type="primary"
                    onPress={handleApproveTaskCompletion}
                    loading={isApproving}
                  />
                )}
                {(task.status !== "CANCELLED" && task.status !== "COMPLETED") && (
                  <Button
                    title="CANCEL TASK"
                    type="cancel"
                    onPress={handleCancelTask}
                    loading={isCancelling}
                  />
                )}
              </View>
            </>
          ) : (
            <Text style={{ fontSize: moderateScale(16, 0.2), color: colors.text.light }}>No task details available.</Text>
          )}
        </ContentWrapper>
      </ScrollView>
    </ScreenBackground>
  )
}

export default TaskTrackingScreen

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: hp('2%'),
    paddingBottom: hp('4%'),
  },
  title: {
    fontSize: moderateScale(22, 0.2),
    fontFamily: 'poppins-bold',
    color: colors.text.bright,
    marginBottom: hp('1%'),
  },
  categoryAndOfferContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  finalOffer: {
    fontSize: moderateScale(18, 0.2),
    fontFamily: 'poppins-bold',
    color: colors.text.green,
    marginLeft: wp('8%'),
  },
  status: {
    color: colors.text.light,
    fontSize: moderateScale(14, 0.2),
    fontFamily: 'poppins-regular',
  },
  statusState: {
    color: colors.text.bright,
    fontSize: moderateScale(14, 0.2),
    fontFamily: 'poppins-bold',
  },
  subTitle: {
    color: colors.text.bright,
    fontSize: moderateScale(16, 0.2),
    fontFamily: 'poppins-semi-bold',
    marginTop: hp('1%'),
  },
  description: {
    color: colors.text.light,
    fontSize: moderateScale(14, 0.2),
    fontFamily: 'poppins-regular',
  },
  progressBarContainer: {
    marginVertical: hp('1%'),
  },
  mapViewContainer: {
    width: '100%',
    backgroundColor: colors.component.bg,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: colors.component.stroke,
    borderRadius: 12,
    overflow: 'hidden',
  },
  resizeIcon: {
    alignSelf: 'center',
    marginTop: hp('1%'),
  },
  tasker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingVertical: wp('2%'),
  },
  imageContainer: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: wp('8%'),
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: colors.component.stroke,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  taskerDetails: {
    marginLeft: wp('4%'),
  },
  name: {
    color: colors.text.bright,
    fontSize: moderateScale(16, 0.2),
    fontFamily: 'poppins-bold',
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  ctaContainer: {
    gap: hp('2%'),
    marginTop: hp('4%'),
  },
});
