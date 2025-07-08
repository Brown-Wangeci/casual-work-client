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
import { Task } from '@/constants/Types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenBackground from '@/components/layout/ScreenBackground';
import api from '@/lib/utils/axios';
import { useTempUserStore } from '@/stores/tempUserStore';
import { useTasksStore } from '@/stores/tasksStore';
import Loading from '@/components/common/Loading';
import { showToast } from '@/lib/utils/showToast';
import DynamicMapView from '@/components/common/DynamicMapView';

const TaskTrackingScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [task, setTask] = useState<Task | null>(null);
  const getTaskById = useTasksStore((state) => state.getCreatedTaskById);
  const cancelTask = useTasksStore((state) => state.cancelTask);
  const isCancelling = useTasksStore((state) => state.isCancelling);
  const [isMapInteracting, setIsMapInteracting] = useState(false);
  const [mapHeight, setMapHeight] = useState(hp('30%'));
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const toggleMapHeight = () => {
    setMapHeight(prev => (prev === hp('30%') ? hp('70%') : hp('30%')));
  };

  const dummyLocation = {
    latitude: -1.309300,
    longitude: 36.814800,
    label: 'Nairobi, Kenya',
  };

  const fetchTaskDetails = async (force = false) => {
    if (!force) {
      const cached = getTaskById(id as string);
      if (cached) {
        cached.location = cached.location || dummyLocation.label;
        cached.latitude = cached.latitude || dummyLocation.latitude;
        cached.longitude = cached.longitude || dummyLocation.longitude;
        setTask(cached);
        setProgress(calculateProgress(cached.status));
        setLoading(false);
        return;
      }
    }
    try {
      const res = await api.get(`/tasks/${id}`);
      if (!res.data?.task) throw new Error('Task not found');
      const data = res.data.task;
      data.location = data.location || dummyLocation.label;
      data.latitude = data.latitude || dummyLocation.latitude;
      data.longitude = data.longitude || dummyLocation.longitude;
      useTasksStore.getState().updateTask(data);
      setTask(data);
      setProgress(calculateProgress(data.status));
    } catch (err) {
      logError(err, 'fetchTaskDetails');
      showToast('error', 'Failed to fetch task', extractErrorMessage(err));
    } finally {
      setLoading(false);
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

  const onContactTasker = () => {
    if (task?.taskerAssigned) {
      useTempUserStore.getState().setUserProfile(task.taskerAssigned);
      router.push(`/user/${task.taskerAssigned.id}`);
    }
  };

  const onApprove = async () => {
    if (!task?.id) return;
    try {
      setIsApproving(true);
      const res = await api.patch(`/tasks/${task.id}/approve`);
      if (res.status === 202 && res.data?.approvedTask) {
        const updated = res.data.approvedTask;
        useTasksStore.getState().updateTask(updated);
        setTask(updated);
        setProgress(calculateProgress(updated.status));
        showToast('success', 'Task Approved', res.data.message || 'Approved');
        router.push(`/tasks/${updated.id}/rate`);
      } else {
        showToast('error', 'Unexpected response', 'Please try again.');
      }
    } catch (err) {
      logError(err, 'onApprove');
      showToast('error', 'Approval Error', extractErrorMessage(err));
    } finally {
      setIsApproving(false);
    }
  };

  const onCancel = () => {
    if (!task?.id) return;
    cancelTask(task.id);
  };

  return (
    <ScreenBackground>
      <CustomHeader title='Task Tracking' showBackButton />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        scrollEnabled={!isMapInteracting}
      >
        <ContentWrapper>
          {loading ? (
            <View style={styles.center}><Loading message='Loading task...' /></View>
          ) : task ? (
            <>
              <Text style={styles.title}>{task.title}</Text>
              <View style={styles.categoryAndOfferContainer}>
                {task.category && <Tag label={task.category} />}
                <Text style={styles.finalOffer}>Ksh. {task.offer}</Text>
              </View>
              <Text style={styles.subTitle}>Description</Text>
              <Text style={styles.description}>{task.description}</Text>
              <Text style={styles.subTitle}>Progress</Text>
              {progress !== null ? (
                <>
                  <View style={styles.progressBarContainer}><ProgressBar percentage={progress} /></View>
                  <Text style={styles.status}>Status: <Text style={styles.statusState}>{formatStatus(task.status)}</Text></Text>
                </>
              ) : (
                <Text style={styles.description}>No progress data</Text>
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
                  latitude={task.latitude!}
                  longitude={task.longitude!}
                  label={task.location}
                  style={{ height: '100%', width: '100%' }}
                />
              </View>
              <TouchableOpacity onPress={toggleMapHeight}>
                <FontAwesome6 name={mapHeight === hp('30%') ? 'expand' : 'compress'} size={24} color={colors.text.bright} style={styles.resizeIcon} />
              </TouchableOpacity>
              <Text style={styles.subTitle}>Tasker</Text>
              {task.taskerAssigned ? (
                <View style={styles.tasker}>
                  <View style={styles.imageContainer}>
                    <Image source={task.taskerAssigned.profilePicture ? { uri: task.taskerAssigned.profilePicture } : require('@/assets/images/user.jpg')} style={styles.image} />
                  </View>
                  <View style={styles.taskerDetails}>
                    <Text style={styles.name}>{task.taskerAssigned.username}</Text>
                    <StarRating rating={task.taskerAssigned.rating!} size={16} />
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button title='Contact' type='secondary' small onPress={onContactTasker} />
                  </View>
                </View>
              ) : (
                <Text style={styles.description}>No tasker assigned yet</Text>
              )}
              <View style={styles.ctaContainer}>
                {(task.status === "IN_PROGRESS" || task.status === "REVIEW") && (
                  <Button title='APPROVE TASK COMPLETION' type='primary' onPress={onApprove} loading={isApproving} />
                )}
                {(task.status !== "CANCELLED" && task.status !== "COMPLETED") && (
                  <Button title='CANCEL TASK' type='cancel' onPress={onCancel} loading={isCancelling} />
                )}
              </View>
            </>
          ) : (
            <View style={styles.center}>
              <Text style={styles.errorText}>No task data available</Text>
              <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
                <Ionicons name='refresh' size={24} color={colors.text.green} />
                <Text style={styles.retryText}>Tap to retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </ContentWrapper>
      </ScrollView>
    </ScreenBackground>
  );
};

export default TaskTrackingScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: hp('2%'),
    paddingBottom: hp('4%'),
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: hp('2%'),
  },
  errorText: {
    fontSize: moderateScale(16),
    color: colors.text.light,
    textAlign: 'center',
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
  title: {
    fontSize: moderateScale(22, 0.2),
    fontFamily: 'poppins-bold',
    color: colors.text.bright,
    marginBottom: hp('1%'),
  },
  categoryAndOfferContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  finalOffer: {
    fontSize: moderateScale(18, 0.2),
    fontFamily: 'poppins-bold',
    color: colors.text.green,
    marginLeft: wp('8%'),
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
  status: {
    fontSize: moderateScale(14, 0.2),
    fontFamily: 'poppins-regular',
    color: colors.text.light,
  },
  statusState: {
    fontFamily: 'poppins-bold',
    color: colors.text.bright,
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
    alignItems: 'center',
    paddingVertical: wp('2%'),
  },
  imageContainer: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: wp('8%'),
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
