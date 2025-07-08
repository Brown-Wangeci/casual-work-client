import { RefreshControl, StyleSheet, Text, TextInput, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenBackground from '@/components/layout/ScreenBackground';
import CustomHeader from '@/components/layout/CustomHeader';
import ContentWrapper from '@/components/layout/ContentWrapper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useTasksStore } from '@/stores/tasksStore';
import { showToast } from '@/lib/utils/showToast';
import { extractErrorMessage, logError } from '@/lib/utils';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import colors from '@/constants/Colors';
import Button from '@/components/ui/Button';
import { Image } from 'expo-image';
import api from '@/lib/utils/axios';
import StarRatingInput from '@/components/screens/rating/StarRatingInput';
import StarRating from '@/components/common/StarRating';
import { Task, User } from '@/constants/Types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Loading from '@/components/common/Loading';
import { Ionicons } from '@expo/vector-icons';
import { useTempUserStore } from '@/stores/tempUserStore';

const RatingScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const getTaskById = useTasksStore((state) => state.getTaskById);
  const updateTask = useTasksStore((state) => state.updateTask);

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [confirmPayment, setConfirmPayment] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTaskDetails = async (force = false) => {
    setLoading(!force);
    if (!force) {
      const cached = getTaskById(id as string);
      if (cached) {
        setTask(cached);
        setLoading(false);
        return;
      }
    }
    try {
      const response = await api.get(`/tasks/${id}`);
      const taskData = response.data?.task;
      if (!taskData) throw new Error('Task not found');
      updateTask(taskData);
      setTask(taskData);
    } catch (error) {
      logError(error, 'RatingScreen > fetchTaskDetails');
      showToast('error', 'Failed to load task', extractErrorMessage(error));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const otherUser = user?.id === task?.taskPoster?.id ? task?.taskerAssigned : task?.taskPoster;
  const isTaskPoster = user?.id === task?.taskPoster?.id;

  const onRefresh = () => {
    setRefreshing(true);
    fetchTaskDetails(true);
  };

  const handleSubmit = async () => {
    if (confirmPayment === null) {
      showToast('error', 'Confirm Payment', 'Please select a payment status.');
      return;
    }
    if (!rating) {
      showToast('error', 'Rating Required', 'Please select a star rating.');
      return;
    }
    try {
      setSubmitting(true);
      const response = await api.post(`/tasks/${id}/review`, { rating, comment, paymentConfirmed: confirmPayment, revieweeId: otherUser?.id });
      console.log('Review response:', response.data);
      if (response.status === 201 || response.status === 200) {
        const message = response.data?.message || 'Review submitted successfully';
        showToast('success', 'Review Submitted', message);
        updateTask(response.data?.task);
        router.push('/');
      } else {
        console.error('Unexpected response:', response);
        throw new Error('Unexpected response');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      logError(error, 'RatingScreen > handleSubmit');
      showToast('error', 'Error', extractErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleOnContactOtherUser = () => {
    if (otherUser) {
      useTempUserStore.getState().setUserProfile(otherUser);
      router.push(`/user/${otherUser.id}`);
    }
  };

  return (
    <ScreenBackground>
      <CustomHeader title="Rate and Review" showBackButton />
      {loading && !refreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Loading message="Loading task..." />
        </View>
      ) : !task || !otherUser ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.description}>No task details available.</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
            <Ionicons name="refresh" size={24} color={colors.text.green} />
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContainer}
            extraScrollHeight={80}
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            <ContentWrapper style={{ paddingTop: hp('2%') }}>
              <Text style={styles.heading}>Task completed!</Text>
              <Text style={styles.text}>Share your experience with {otherUser?.username}</Text>

              <UserCard user={otherUser} onContact={handleOnContactOtherUser} />

              <Text style={styles.label}>Rate Your Experience</Text>
              <StarRatingInput rating={rating} onChange={setRating} size={44} />

              <Text style={styles.label}>Add a comment (Optional)</Text>
              <TextInput
                style={styles.textInput}
                multiline
                placeholder="Share details of your experience"
                value={comment}
                onChangeText={setComment}
                placeholderTextColor={colors.text.placeholder}
              />

              <Text style={styles.label}>Confirm Payment</Text>
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                <TouchableOpacity
                  onPress={() => setConfirmPayment(true)}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: confirmPayment === true ? colors.text.green : colors.component.stroke,
                    backgroundColor: confirmPayment === true ? colors.component.green.bg : colors.component.input,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: colors.text.green, fontFamily: 'poppins-medium' }}>
                    {isTaskPoster ? 'Sent Payment' : 'Payment Received'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setConfirmPayment(false)}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: confirmPayment === false ? colors.text.green : colors.component.stroke,
                    backgroundColor: confirmPayment === false ? colors.component.green.bg : colors.component.input,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: colors.text.green, fontFamily: 'poppins-medium' }}>
                    {isTaskPoster ? 'Did Not Send' : 'Not Received'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Button title="SUBMIT REVIEW" type="primary" onPress={handleSubmit} loading={submitting} />
            </ContentWrapper>
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      )}
    </ScreenBackground>
  );
};

interface UserCardProps {
  user: User;
  onContact: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onContact }) => {
  if (!user) return null;
  return (
    <View style={styles.userCard}>
      <View style={styles.imageContainer}>
        <Image source={user.profilePicture ? { uri: user.profilePicture } : require('@/assets/images/user.jpg')} style={styles.image} />
      </View>
      <View style={styles.userDetails}>
        <Text style={styles.name}>{user.username}</Text>
        <StarRating rating={user.rating} size={16} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Contact" type="secondary" small onPress={() => onContact()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: hp('1%'),
    paddingBottom: hp('4%'),
  },
  heading: {
    fontSize: moderateScale(18),
    fontFamily: 'poppins-bold',
    color: colors.text.green,
  },
  text: {
    color: colors.text.light,
    fontSize: moderateScale(14),
    fontFamily: 'poppins-regular',
    marginBottom: 12,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    color: colors.text.light,
    fontFamily: 'poppins-medium',
    fontSize: moderateScale(14),
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.component.stroke,
    borderRadius: 10,
    backgroundColor: colors.component.input,
    color: colors.text.bright,
    padding: 12,
    fontFamily: 'poppins-regular',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
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
  description: {
    color: colors.text.light,
    fontSize: moderateScale(14, 0.2),
    fontFamily: 'poppins-regular',
  },
});

export default RatingScreen;
