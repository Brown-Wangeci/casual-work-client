import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'expo-image'
import colors from '@/constants/Colors'
import { moderateScale } from 'react-native-size-matters'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import LiveMapView from '@/components/screens/task-track/LiveMapView'
import StarRating from '@/components/common/StarRating'
import Button from '@/components/ui/Button'
import ContentWrapper from '@/components/layout/ContentWrapper'
import Tag from '@/components/screens/task-track/Tag'
import { FontAwesome6 } from '@expo/vector-icons'
import CustomHeader from '@/components/layout/CustomHeader'
import { Task } from '@/constants/Types'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ScreenBackground from '@/components/layout/ScreenBackground'
import Loading from '@/components/common/Loading'
import { formatDistanceToNow } from 'date-fns'
import { extractErrorMessage, logError } from '@/lib/utils'
import { useTempUserStore } from '@/stores/tempUserStore'
import { useTaskFeedStore } from '@/stores/taskFeedStore'
import api from '@/lib/axios'
import { useTasksStore } from '@/stores/tasksStore'

const ViewTaskScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [address, setAddress] = useState('');
  const [mapHeight, setMapHeight] = useState(hp('30%'));

  const router = useRouter();
  const { id } = useLocalSearchParams();
  const getTaskById = useTaskFeedStore((state) => state.getTaskById);

  const toggleMapHeight = () => {
    setMapHeight(prevHeight => (prevHeight === hp('30%') ? hp('70%') : hp('30%')));
  };

  const fetchTaskDetails = async () => {
    setLoading(true);
    setError(null);

    const cachedTask = getTaskById(id as string);
    if (cachedTask) {
      console.log('Using cached task data:', cachedTask);
      setTask(cachedTask);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/tasks/${id}`);
      if (!response.data || !response.data.task) {
        throw new Error('Unexpected response format: task not found.');
      }
      const taskData = response.data.task;
      setTask(taskData);
    } catch (error: any) {
      logError(error, 'fetchTaskDetails');
      const message = extractErrorMessage(error);
      console.warn('Fetch task error:', message);
      setError(message || 'Failed to load task details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTaskDetails();
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


  return (
    <ScreenBackground>
      <CustomHeader title='Task Details' showBackButton />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ContentWrapper>
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Loading message='Loading Taskfeed task' />
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

              <Text style={styles.subTitle}>Location</Text>
              <Text style={styles.description}>{address}</Text>
              <View style={[styles.mapViewContainer, { height: mapHeight }]}>
                <LiveMapView setAddress={setAddress} address={address} />
              </View>
              <TouchableOpacity onPress={toggleMapHeight}>
                <FontAwesome6 name={mapHeight === hp('30%') ? 'expand' : 'compress'} size={24} color={colors.text.bright} style={styles.resizeIcon} />
              </TouchableOpacity>

              <Text style={styles.subTitle}>Posted Time</Text>
              <Text style={styles.description}>{formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}</Text>

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
                  <Button title="Contact" type='secondary' small onPress={onContactTaskPoster} />
                </View>
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

export default ViewTaskScreen

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
  taskPoster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingVertical: wp('2%'),
  },
  imageContainer: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: '50%',
    borderStyle: 'solid',
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
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  ctaContainer: {
    marginTop: hp('4%'),
  },
})