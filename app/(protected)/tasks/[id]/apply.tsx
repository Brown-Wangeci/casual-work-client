import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import colors from '@/constants/Colors';
import { moderateScale } from 'react-native-size-matters';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import StarRating from '@/components/common/StarRating';
import Button from '@/components/ui/Button';
import ContentWrapper from '@/components/layout/ContentWrapper';
import Tag from '@/components/screens/task-track/Tag';
import { FontAwesome6 } from '@expo/vector-icons';
import CustomHeader from '@/components/layout/CustomHeader';
import { Task } from '@/constants/Types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenBackground from '@/components/layout/ScreenBackground';
import Loading from '@/components/common/Loading';
import { formatDistanceToNow } from 'date-fns';
import { extractErrorMessage, logError } from '@/lib/utils';
import { useTempUserStore } from '@/stores/tempUserStore';
import { useTaskFeedStore } from '@/stores/taskFeedStore';
import api from '@/lib/utils/axios';
import { useAuthStore } from '@/stores/authStore';
import { useTasksStore } from '@/stores/tasksStore';
import { showToast } from '@/lib/utils/showToast';
import DynamicMapView from '@/components/common/DynamicMapView';
import { Ionicons } from '@expo/vector-icons';

const TaskApplicationScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const [mapHeight, setMapHeight] = useState(hp('30%'));
  const [isMapInteracting, setIsMapInteracting] = useState(false);

  const updateTask = useTaskFeedStore((state) => state.updateTask);
  const addTaskApplication = useTasksStore((state) => state.addTaskApplication);
  const getTaskById = useTaskFeedStore((state) => state.getTaskById);
  const getApplicationStatus = useTasksStore((state) => state.getApplicationStatus);

  const router = useRouter();
  const { id } = useLocalSearchParams();

  const toggleMapHeight = () => {
    setMapHeight((prev) => (prev === hp('30%') ? hp('70%') : hp('30%')));
  };

  const fetchTaskDetails = async (force = false) => {
    if (!force) {
      const cachedTask = getTaskById(id as string);
      if (cachedTask) {
        setTask(cachedTask);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await api.get(`/tasks/${id}`);
      if (!response.data?.task) throw new Error('Task not found.');
      const taskData = response.data.task;
      updateTask(taskData);
      setTask(taskData);
    } catch (error) {
      logError(error, 'fetchTaskDetails');
      const message = extractErrorMessage(error);
      showToast('error', 'Failed to load task', message);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const onApplyForTask = async () => {
    if (!task || !id) {
      showToast('error', 'Task Info Missing', 'Please try again later.');
      return;
    }

    const user = useAuthStore.getState().user;
    if (!user) {
      showToast('error', 'Not Logged In', 'Please log in to apply for tasks.');
      return;
    }

    if (!user.isTasker) {
      showToast('info', 'Not a Tasker', 'Switch to tasker mode to apply.');
      return;
    }

    const status = getApplicationStatus(id as string, user.id);
    if (status === 'accepted') {
      showToast('info', 'You’ve Been Accepted', 'You are now assigned to this task.');
      return;
    } else if (status === 'pending') {
      showToast('info', 'Already Applied', 'You already applied for this task.');
      return;
    }

    setIsApplying(true);

    try {
      const response = await api.post(`/tasks/${id}/apply`);
      if (response.status === 201 || response.data?.success) {
        updateTask(response.data.data.task);
        addTaskApplication(response.data.data);
        showToast('success', 'Application Sent', 'You’ll be contacted if selected.');
        router.push(`/`);
      } else {
        const msg = response.data?.message || 'Unexpected server response.';
        showToast('error', 'Application Failed', msg);
      }
    } catch (error) {
      logError(error, 'onApplyForTask');
      showToast('error', 'Failed to Apply', extractErrorMessage(error));
    } finally {
      setIsApplying(false);
    }
  };

  const user = useAuthStore.getState().user;
  const status = user && id ? getApplicationStatus(id as string, user.id) : null;

  const dummyNairobi = {
    latitude: -1.286389,
    longitude: 36.817223,
    label: 'Nairobi CBD',
  };

  return (
    <ScreenBackground>
      <CustomHeader title='Task Details' showBackButton />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        scrollEnabled={!isMapInteracting}
      >
        <ContentWrapper>
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Loading message='Loading task details...' />
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

              <Text style={styles.subTitle}>Location</Text>
              <Text style={styles.description}>{task.location || dummyNairobi.label}</Text>
              <View
                style={[styles.mapViewContainer, { height: mapHeight }]}
                onTouchStart={() => setIsMapInteracting(true)}
                onTouchEnd={() => setIsMapInteracting(false)}
                onTouchCancel={() => setIsMapInteracting(false)}
              > 
                <DynamicMapView
                  latitude={task.latitude || dummyNairobi.latitude}
                  longitude={task.longitude || dummyNairobi.longitude}
                  label={task.location || dummyNairobi.label}
                  style={[{ height: '100%' }, { width: '100%' }]}
                />
              </View>
              <TouchableOpacity onPress={toggleMapHeight}>
                <FontAwesome6 name={mapHeight === hp('30%') ? 'expand' : 'compress'} size={24} color={colors.text.bright} style={styles.resizeIcon} />
              </TouchableOpacity>

              <Text style={styles.subTitle}>Posted</Text>
              <Text style={styles.description}>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</Text>

              <Text style={styles.subTitle}>Task Poster</Text>
              <View style={styles.taskPoster}>
                <View style={styles.imageContainer}>
                  <Image
                    source={task.taskPoster?.profilePicture ? { uri: task.taskPoster.profilePicture } : require('@/assets/images/user.jpg')}
                    style={styles.image}
                  />
                </View>
                <View style={styles.taskPosterDetails}>
                  <Text style={styles.name}>{task.taskPoster?.username}</Text>
                  <StarRating rating={task.taskPoster?.rating!} size={16} />
                </View>
                <View style={styles.buttonContainer}>
                  <Button title="Contact" type="secondary" small onPress={onContactTaskPoster} />
                </View>
              </View>

              <View style={styles.ctaContainer}>
                {status === 'accepted' ? (
                  <Text style={styles.acceptedText}>🎉 You’ve been selected for this task!</Text>
                ) : status === 'denied' ? (
                  <Text style={styles.rejectedText}>Unfortunately, your application was not selected.</Text>
                ) : status === 'pending' ? (
                  <Text style={styles.infoText}>You have already applied for this task. Please wait for the poster’s response.</Text>
                ) : (
                  <Button title="APPLY FOR TASK" type="primary" onPress={onApplyForTask} loading={isApplying} />
                )}
              </View>
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.description}>No task details available.</Text>
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

export default TaskApplicationScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: hp('2%'),
    paddingBottom: hp('8%'),
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
    marginTop: hp('2%'),
  },
  description: {
    color: colors.text.light,
    fontSize: moderateScale(14, 0.2),
    fontFamily: 'poppins-regular',
  },
  mapViewContainer: {
    width: '100%',
    backgroundColor: colors.component.bg,
    borderWidth: 2,
    borderColor: colors.component.stroke,
    borderRadius: 12,
    overflow: 'hidden',
  },
  resizeIcon: {
    alignSelf: 'center',
    marginTop: hp('1%'),
  },
  taskPoster: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: wp('2%'),
  },
  imageContainer: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.component.stroke,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  taskPosterDetails: {
    marginLeft: wp('4%'),
  },
  name: {
    color: colors.text.bright,
    fontSize: moderateScale(16, 0.2),
    fontFamily: 'poppins-bold',
  },
  buttonContainer: {
    marginLeft: 'auto',
  },
  ctaContainer: {
    marginTop: hp('4%'),
  },
  acceptedText: {
    fontSize: moderateScale(14, 0.2),
    fontFamily: 'poppins-bold',
    color: colors.text.green,
  },
  infoText: {
    fontSize: moderateScale(14, 0.2),
    fontFamily: 'poppins-medium',
    color: colors.text.infoText,
  },
  rejectedText: {
    fontSize: moderateScale(14, 0.2),
    fontFamily: 'poppins-medium',
    color: colors.text.red,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: hp('2%'),
    marginTop: hp('10%'),
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
