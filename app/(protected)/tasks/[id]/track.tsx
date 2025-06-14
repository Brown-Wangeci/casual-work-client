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
import { calculateProgress, formatStatus } from '@/lib/utils'
import { Task, User } from '@/constants/Types'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ScreenBackground from '@/components/layout/ScreenBackground'
import api from '@/lib/axios'


const TaskTrackingScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [ progress, setProgress ] = useState< number| null >(null);
  const [ loading, setLoading ] = useState< boolean >(true);
  const [ error, setError ] = useState< string | null >(null);
  const [ task, setTask ] = useState< Task | null >(null);
  const [ address, setAddress ] = useState('');
  const [mapHeight, setMapHeight] = useState(hp('30%'));

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const router = useRouter();


  const toggleMapHeight = () => {
    setMapHeight(prevHeight => (prevHeight === hp('30%') ? hp('70%') : hp('30%')));
  };

  // const { taskId } = useLocalSearchParams();
  const taskId = 2; // Hardcoded for testing, replace with useLocalSearchParams() in production

  const fetchTaskDetails = async () => {
    setLoading(true);
    setError(null);
    setProgress(null);
    try {
      const response = await api.get(`/tasks?id=${taskId}`);
      const taskData = response.data[0];
      const res = await api.get(`/users?id=${taskData.taskerAssigned}`);
      const taskerData: User = res.data[0];
      const taskWithTasker: Task = {
        ...taskData,
        taskerAssigned: taskerData,
      };
      setProgress(calculateProgress(taskData.status));
      console.log('Task status:', taskData.status);
      console.log('Task progress:', progress);
      setTask(taskWithTasker);
    } catch (error) {
      console.error('Error fetching task details:', error);
      setError('Failed to load task details. Please try again later.');
    }finally {
      setLoading(false);
    }
  }


  const onRefresh = () => {
    setRefreshing(true);
    fetchTaskDetails();
    setRefreshing(false);
  };

  const onContactTasker = () => {
    router.push(`/user/${task?.taskerAssigned?.id}`);
  }


  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);


  return (
    <ScreenBackground>
      <CustomHeader title='Task Tracking' showBackButton />
      <ScrollView
        contentContainerStyle={ styles.scrollContainer }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ContentWrapper>
          {
            loading ? (
              <Text style={{ fontSize: moderateScale(16, 0.2), color: colors.infoText }}>Loading task details...</Text>
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
                <Text style={styles.subTitle}>Tasker</Text>
                
                { task.taskerAssigned ? (
                    <View style={styles.tasker}>
                      <View style={styles.imageContainer}>
                        <Image
                          source={task.taskerAssigned?.profilePicture ? { uri: task.taskerAssigned.profilePicture } : require('@/assets/images/user.jpg')}
                          style={styles.image}
                        />
                      </View>
                      <View style={styles.taskerDetails}>
                        <Text style={styles.name}>{ task.taskerAssigned?.username }</Text>
                        <StarRating rating={task.taskerAssigned?.rating!} size={16} />
                      </View>
                      <View style={styles.buttonContainer}>
                        <Button title="Contact" type='secondary' small onPress={onContactTasker} />
                      </View>
                    </View>
                ): (
                  <Text style={{ fontSize: moderateScale(16, 0.2), color: colors.text.light }}>No tasker assigned yet.</Text>
                )}
                
                <View style={styles.ctaContainer}>
                  { task.status !== "pending" || "cancelled" ? <Button title="APPROVE TASK COMPLETION" type='primary' onPress={()=>{}} /> : null }
                  { task.status === "pending"  && <Button title="CANCEL TASK" type='cancel' onPress={()=>{}} />}
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