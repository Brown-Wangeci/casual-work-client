import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import colors from '@/constants/Colors';
import { moderateScale } from 'react-native-size-matters';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ProgressBar from '@/components/ui/ProgressBar';
import StarRating from '@/components/common/StarRating';
import Button from '@/components/ui/Button';
import ContentWrapper from '@/components/layout/ContentWrapper';
import Tag from '@/components/screens/task-track/Tag';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import CustomHeader from '@/components/layout/CustomHeader';
import { calculateProgress, extractErrorMessage, formatStatus, logError } from '@/lib/utils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenBackground from '@/components/layout/ScreenBackground';
import api from '@/lib/utils/axios';
import { useTempUserStore } from '@/stores/tempUserStore';
import { useTasksStore } from '@/stores/tasksStore';
import Loading from '@/components/common/Loading';
import { showToast } from '@/lib/utils/showToast';
import DynamicMapView from '@/components/common/DynamicMapView';

const UpdateTaskProgressScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [task, setTask] = useState<any | null>(null);
  const getTaskById = useTasksStore((state) => state.getAssignedTaskById);
  const router = useRouter();
  const [mapHeight, setMapHeight] = useState(hp('30%'));
  const { id } = useLocalSearchParams();
  const [isCompleting, setIsCompleting] = useState<boolean>(false);
  const [isMapInteracting, setIsMapInteracting] = useState(false);

  const toggleMapHeight = () => {
    setMapHeight(prev => (prev === hp('30%') ? hp('70%') : hp('30%')));
  };

  const dummyLocation = {
    latitude: -1.2921,
    longitude: 36.8219,
    label: 'Nairobi, Kenya',
  };

  const fetchTaskDetails = async (force = false) => {
    const cachedTask = getTaskById(id as string);
    if (cachedTask && !force) {
      cachedTask.location = cachedTask.location || dummyLocation.label;
      cachedTask.latitude = cachedTask.latitude || dummyLocation.latitude;
      cachedTask.longitude = cachedTask.longitude || dummyLocation.longitude;
      setTask(cachedTask);
      setProgress(calculateProgress(cachedTask.status));
      setLoading(false);
      return;
    }
    try {
      const response = await api.get(`/tasks/${id}`);
      const taskData = response.data?.task;
      if (!taskData) throw new Error('Task not found.');

      taskData.location = taskData.location || dummyLocation.label;
      taskData.latitude = taskData.latitude || dummyLocation.latitude;
      taskData.longitude = taskData.longitude || dummyLocation.longitude;

      useTasksStore.getState().updateTask(taskData);
      setTask(taskData);
      setProgress(calculateProgress(taskData.status));
    } catch (error) {
      logError(error, 'fetchTaskDetails');
      const message = extractErrorMessage(error);
      showToast('error', 'Failed to load task', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTaskDetails(); }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTaskDetails(true);
    setRefreshing(false);
  };

  const onContactTaskPoster = () => {
    if (task?.taskPoster) {
      useTempUserStore.getState().setUserProfile(task.taskPoster);
      router.push(`/user/${task.taskPoster.id}`);
    }
  };

  const handleTaskCompletion = async () => {
    if (!task?.id) {
      showToast('error', 'Missing Task ID', 'Cannot complete task without a valid task ID.');
      return;
    }

    try {
      setIsCompleting(true);
      const response = await api.patch(`/tasks/${task.id}/complete`);
      if (response.status === 200 && response.data?.data) {
        const updatedTask = response.data.data;
        useTasksStore.getState().updateTask(updatedTask);
        setTask(updatedTask);
        setProgress(calculateProgress(updatedTask.status));
        showToast('success', 'Task Marked as Complete', response.data.message || 'Awaiting approval.');
        // router.push('/');
      } else {
        showToast('error', 'Completion Failed', 'Unexpected server response. Please try again.');
      }
    } catch (error) {
      logError(error, 'handleTaskCompletion');
      showToast('error', 'Error Completing Task', extractErrorMessage(error));
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <ScreenBackground>
      <CustomHeader title='Update Progress' showBackButton />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        scrollEnabled={!isMapInteracting}
      >
        <ContentWrapper>
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Loading message='Loading task tracking' />
            </View>
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
              <View
                style={[styles.mapViewContainer, { height: mapHeight }]}
                onTouchStart={() => setIsMapInteracting(true)}
                onTouchEnd={() => setIsMapInteracting(false)}
                onTouchCancel={() => setIsMapInteracting(false)}
              > 
                <DynamicMapView
                  latitude={task.latitude}
                  longitude={task.longitude}
                  label={task.location}
                  style={[{ height: '100%' }, { width: '100%' }]}
                />
              </View>
              <TouchableOpacity onPress={toggleMapHeight}>
                <FontAwesome6 name={mapHeight === hp('30%') ? 'expand' : 'compress'} size={24} color={colors.text.bright} style={styles.resizeIcon} />
              </TouchableOpacity>
              <Text style={styles.subTitle}>TaskPoster</Text>
              <View style={styles.tasker}>
                <View style={styles.imageContainer}>
                  <Image source={task.taskPoster?.profilePicture ? { uri: task.taskPoster.profilePicture } : require('@/assets/images/user.jpg')} style={styles.image} />
                </View>
                <View style={styles.taskerDetails}>
                  <Text style={styles.name}>{task.taskPoster?.username}</Text>
                  <StarRating rating={task.taskPoster?.rating!} size={16} />
                </View>
                <View style={styles.buttonContainer}>
                  <Button title='Contact' type='secondary' small onPress={onContactTaskPoster} />
                </View>
              </View>
              <View style={styles.ctaContainer}>
                {task.status === 'IN_PROGRESS' && (
                  <Button title='COMPLETE TASK' type='primary' onPress={handleTaskCompletion} loading={isCompleting} />
                )}
              </View>
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.noTask}>No task details found!</Text>
              <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
                <Ionicons name="refresh" size={24} color={colors.text.green} />
                <Text style={styles.retryText}>Tap to retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </ContentWrapper>
      </ScrollView>
    </ScreenBackground>
  );
};

export default UpdateTaskProgressScreen;

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
    borderRadius: 999,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: colors.component.green.bg,
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
  emptyContainer: {
    flex: 1,
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
  noTask: {
    fontSize: moderateScale(16),
    color: colors.text.light,
    textAlign: 'center',
  },
});
