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
import { Task, User } from '@/constants/Types'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ScreenBackground from '@/components/layout/ScreenBackground'
import api from '@/lib/axios'
import { useTempUserStore } from '@/stores/tempUserStore'
import { useTasksStore } from '@/stores/tasksStore'
import Loading from '@/components/common/Loading'


const UpdateTaskProgressScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [ progress, setProgress ] = useState< number| null >(null);
  const [ loading, setLoading ] = useState< boolean >(true);
  const [ error, setError ] = useState< string | null >(null);
  const [ task, setTask ] = useState< Task | null >(null);
  const [ address, setAddress ] = useState('');
  const getTaskById = useTasksStore((state) => state.getCreatedTaskById);

  const [mapHeight, setMapHeight] = useState(hp('30%'));


  const router = useRouter();


  const toggleMapHeight = () => {
    setMapHeight(prevHeight => (prevHeight === hp('30%') ? hp('70%') : hp('30%')));
  };

  const { id } = useLocalSearchParams();

  const fetchTaskDetails = async () => {
    setLoading(true);
    setError(null);

    const cachedTask = getTaskById(id as string);
    if (cachedTask) {
      setTask(cachedTask);
      setProgress(calculateProgress(cachedTask.status));
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
      setProgress(calculateProgress(taskData.status));
    } catch (error: any) {
      logError(error, 'fetchTaskDetails');
      const message = extractErrorMessage(error);
      console.warn('Fetch task error:', message);
      setError(message || 'Failed to load task details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const onContactTaskPoster = () => {
    if (task?.taskPoster) {
      useTempUserStore.getState().setUserProfile(task.taskPoster);
      router.push(`/user/${task.taskPoster.id}`);
    }
  };

  
  const onRefresh = () => {
    setRefreshing(true);
    fetchTaskDetails();
    setRefreshing(false);
  };
  
  useEffect(() => {
    fetchTaskDetails();
  }, [id]);




  const handleTaskCompletion = async () => {}



  return (
    <ScreenBackground>
      <CustomHeader title='Update Progress' showBackButton />
      <ScrollView
        contentContainerStyle={ styles.scrollContainer }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ContentWrapper>
          {
            loading ? (
               <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Loading message='Loading task tracking' />
              </View>
            ) : error ? (
              <Text style={{ fontSize: moderateScale(16, 0.2), color: colors.text.red }}>Error: {error}</Text>
            ) : task ? (
              <>
                <Text style={styles.title}>{task.title}</Text>
                <View style={styles.categoryAndOfferContainer}>
                  { task?.category && <Tag label={task.category} />}
                  <Text style={styles.finalOffer}>Ksh. {task.offer}</Text>
                </View>
                
                <Text style={styles.subTitle}>Description</Text>
                <Text style={styles.description}>{task.description}</Text>
                
                <Text style={styles.subTitle}>Progress</Text>
                { progress !== null ? 
                  (
                  <>
                    <View style={styles.progressBarContainer}>
                    <ProgressBar percentage={progress} />
                    </View>
                    <Text style={styles.status}>Status: <Text style={styles.statusState}>{ formatStatus(task.status) }</Text></Text>
                  </>
                  ):
                  (
                    <Text style={{ fontSize: moderateScale(16, 0.2), color: colors.text.light }}>No progress data available.</Text>
                  )
                }
                
                <Text style={styles.subTitle}>Location</Text>
                <Text style={styles.description}>{address}</Text>
                <View style={[styles.mapViewContainer, { height: mapHeight }]}>
                  <LiveMapView setAddress={setAddress} address={address} />
                </View>
                <TouchableOpacity onPress={toggleMapHeight}>
                  <FontAwesome6 name={mapHeight === hp('30%') ? 'expand': 'compress' } size={24} color={colors.text.bright} style={styles.resizeIcon} />
                </TouchableOpacity>
                <Text style={styles.subTitle}>TaskPoster</Text>
                
                <View style={styles.tasker}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={task.taskPoster?.profilePicture ? { uri: task.taskPoster.profilePicture } : require('@/assets/images/user.jpg')}
                      style={styles.image}
                    />
                  </View>
                  <View style={styles.taskerDetails}>
                    <Text style={styles.name}>{ task.taskPoster?.username }</Text>
                    <StarRating rating={task.taskPoster?.rating!} size={16} />
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button title="Contact" type='secondary' small onPress={onContactTaskPoster} />
                  </View>
                </View>

                
                <View style={styles.ctaContainer}>
                  { task.status === 'IN_PROGRESS' ? (
                    <Button title="COMPLETE TASK" type="primary" small onPress={handleTaskCompletion} />
                  ) : task.status === 'CANCELLED' ? (
                    <Text style={{ fontSize: moderateScale(16, 0.2), color: colors.text.light }}>Task has been cancelled.</Text>
                  ) : task.status === 'COMPLETED' ? (
                    <Text style={{ fontSize: moderateScale(16, 0.2), color: colors.text.light }}>Task Poster has Approved Completion.</Text>
                  ) : task.status === 'PENDING' ? (
                    null
                  ) : (
                    <Button title="View Task" type="primary" small onPress={()=>{ router.push(`/tasks/${task.id}`) }} />
                  )}
                </View>
              </>
            ) : (
              <Text style={{ fontSize: moderateScale(16, 0.2), color: colors.text.light }}>No task details available.</Text>
            )
          }
        </ContentWrapper>
      </ScrollView>
    </ScreenBackground>
  )
}

export default UpdateTaskProgressScreen


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
})