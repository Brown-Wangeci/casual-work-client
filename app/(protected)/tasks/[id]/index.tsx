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
import CustomHeader from '@/components/layout/CustomHeader';
import { Task, User } from '@/constants/Types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenBackground from '@/components/layout/ScreenBackground';
import Loading from '@/components/common/Loading';
import { formatDistanceToNow } from 'date-fns';
import { calculateProgress, extractErrorMessage, formatStatus, logError } from '@/lib/utils';
import { useTempUserStore } from '@/stores/tempUserStore';
import api from '@/lib/utils/axios';
import { useTasksStore } from '@/stores/tasksStore';
import ProgressBar from '@/components/ui/ProgressBar';
import { AxiosError } from 'axios';
import DynamicMapView from '@/components/common/DynamicMapView';
import { FontAwesome6 } from '@expo/vector-icons';

const TaskDetailsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [mapHeight, setMapHeight] = useState(hp('30%'));

  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const getTaskById = useTasksStore((state) => state.getTaskById);

  const fetchTaskDetails = async (force = false) => {
    if (!force) setLoading(true);
    setError(null);

    if (!force) {
      const cachedTask = getTaskById(id);
      if (cachedTask) {
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
      const taskData: Task = response.data.task;
      useTasksStore.getState().updateTask(taskData);
      setTask(taskData);
      setProgress(calculateProgress(taskData.status));
    } catch (error: unknown) {
      logError(error, 'fetchTaskDetails');
      const message = extractErrorMessage(error as AxiosError);
      setError(message || 'Failed to load task details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTaskDetails(true);
    setRefreshing(false);
  };

  const onContactUser = (user: User) => {
    useTempUserStore.getState().setUserProfile(user);
    router.push(`/user/${user.id}`);
  };

  const toggleMapHeight = () => {
    setMapHeight((prev) => (prev === hp('30%') ? hp('70%') : hp('30%')));
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const getMapData = () => {
    if (task?.latitude && task?.longitude) {
      return {
        latitude: task.latitude,
        longitude: task.longitude,
        label: task.location || 'Task Location',
      };
    }
    return {
      latitude: -1.2921,
      longitude: 36.8219,
      label: 'Nairobi, Kenya',
    };
  };

  const mapData = getMapData();

  return (
    <ScreenBackground>
      <CustomHeader title="Task Details" showBackButton />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ContentWrapper>
          {loading && !refreshing ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Loading message="Loading Task Details..." />
            </View>
          ) : error ? (
            <Text style={styles.errorText}>Error: {error}</Text>
          ) : task ? (
            <>
              <Text style={styles.title}>{task.title}</Text>
              <View style={styles.categoryAndOfferContainer}>
                {task?.category && <Tag label={task.category} />}
                <Text style={styles.finalOffer}>Ksh. {task.offer}</Text>
              </View>

              <Text style={styles.subTitle}>Description</Text>
              <Text style={styles.description}>{task.description}</Text>

              <Text style={styles.subTitle}>Status</Text>
              <Text style={styles.statusText}>{formatStatus(task.status)}</Text>

              {progress !== null && (
                <>
                  <Text style={styles.subTitle}>Progress</Text>
                  <ProgressBar percentage={progress} />
                </>
              )}

              <Text style={styles.subTitle}>Location</Text>
              <Text style={styles.description}>{mapData.label}</Text>
              <View style={[styles.mapViewContainer, { height: mapHeight }]}> 
                <DynamicMapView
                  latitude={mapData.latitude}
                  longitude={mapData.longitude}
                  label={mapData.label}
                  style={[{ height: '100%' }, { width: '100%' }]}
                />
              </View>
              <TouchableOpacity onPress={toggleMapHeight}>
                <FontAwesome6 name={mapHeight === hp('30%') ? 'expand' : 'compress'} size={24} color={colors.text.bright} style={styles.resizeIcon} />
              </TouchableOpacity>

              <Text style={styles.subTitle}>Posted</Text>
              <Text style={styles.description}>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</Text>

              <Text style={styles.subTitle}>Task Poster</Text>
              <UserCard user={task.taskPoster} onContact={onContactUser} />

              <Text style={styles.subTitle}>Tasker Assigned</Text>
              {task.taskerAssigned ? (
                <UserCard user={task.taskerAssigned} onContact={onContactUser} />
              ) : (
                <Text style={styles.description}>No tasker assigned.</Text>
              )}
            </>
          ) : (
            <Text style={styles.description}>No task details available.</Text>
          )}
        </ContentWrapper>
      </ScrollView>
    </ScreenBackground>
  );
};

interface UserCardProps {
  user: User;
  onContact: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onContact }) => {
  if (!user) return null;

  return (
    <View style={styles.userCard}>
      <View style={styles.imageContainer}>
        <Image
          source={user.profilePicture ? { uri: user.profilePicture } : require('@/assets/images/user.jpg')}
          style={styles.image}
        />
      </View>
      <View style={styles.userDetails}>
        <Text style={styles.name}>{user.username}</Text>
        <StarRating rating={user.rating} size={16} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Contact" type="secondary" small onPress={() => onContact(user)} />
      </View>
    </View>
  );
};

export default TaskDetailsScreen;

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
    marginTop: hp('2%'),
  },
  description: {
    color: colors.text.light,
    fontSize: moderateScale(14, 0.2),
    fontFamily: 'poppins-regular',
  },
  statusText: {
    fontSize: moderateScale(14, 0.2),
    fontFamily: 'poppins-medium',
    color: colors.text.light,
  },
  errorText: {
    fontSize: moderateScale(16, 0.2),
    color: colors.text.red,
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
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
  userDetails: {
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
});