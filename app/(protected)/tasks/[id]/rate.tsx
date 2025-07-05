import { StyleSheet, Text, TextInput, View, Switch } from 'react-native';
import React, { useState } from 'react';
import ScreenBackground from '@/components/layout/ScreenBackground';
import CustomHeader from '@/components/layout/CustomHeader';
import ContentWrapper from '@/components/layout/ContentWrapper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useTasksStore } from '@/stores/tasksStore';
import { showToast } from '@/lib/utils/showToast';
import { extractErrorMessage, logError } from '@/lib/utils';
import { moderateScale } from 'react-native-size-matters';
import colors from '@/constants/Colors';
import Button from '@/components/ui/Button';
import { Image } from 'expo-image';
import api from '@/lib/utils/axios';
import StarRatingInput from '@/components/screens/rating/StarRatingInput';

const RatingScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const task = useTasksStore((state) => state.getTaskById(id as string));

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [confirmPayment, setConfirmPayment] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isTaskPoster = user?.id === task?.taskPoster?.id;
  const otherUser = isTaskPoster ? task?.taskerAssigned : task?.taskPoster;

  const handleSubmit = async () => {
    if (!confirmPayment) {
      showToast('error', 'Confirm Payment', 'You must confirm that payment has been received.');
      return;
    }
    if (!rating) {
      showToast('error', 'Rating Required', 'Please select a star rating.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post(`/tasks/${id}/rate`, {
        rating,
        comment,
        paymentConfirmed: confirmPayment,
      });

      if (response.status === 201 || response.status === 200) {
        showToast('success', 'Review submitted');
        router.replace('/');
      } else {
        throw new Error('Unexpected response');
      }
    } catch (error) {
      logError(error, 'RatingScreen > handleSubmit');
      showToast('error', 'Error', extractErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (!task || !otherUser) {
    return (
      <ScreenBackground>
        <CustomHeader title="Rate and Review" showBackButton />
        <ContentWrapper>
          <Text style={styles.text}>Task data not found.</Text>
        </ContentWrapper>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <CustomHeader title="Rate and Review" showBackButton />
      <ContentWrapper>
        <Text style={styles.heading}>Task completed!</Text>
        <Text style={styles.text}>Share your experience with {otherUser.username}</Text>

        <View style={styles.userRow}>
          <Image
            source={otherUser.profilePicture ? { uri: otherUser.profilePicture } : require('@/assets/images/user.jpg')}
            style={styles.avatar}
          />
          <Text style={styles.username}>{otherUser.username}</Text>
        </View>

        <Text style={styles.label}>Rate Your Experience</Text>
        <StarRatingInput rating={rating} onChange={setRating} size={30} />

        <Text style={styles.label}>Add a comment (Optional)</Text>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Share details of your experience"
          value={comment}
          onChangeText={setComment}
          placeholderTextColor={colors.text.placeholder}
        />

        <View style={styles.switchRow}>
          <Switch
            value={confirmPayment}
            onValueChange={setConfirmPayment}
            trackColor={{ false: 'transparent', true: 'transparent' }}
            ios_backgroundColor={colors.component.stroke}
            thumbColor={confirmPayment ? colors.text.green : colors.component.green.bg}
          />
          <Text style={styles.confirmText}>I confirm payment has been received</Text>
        </View>

        <Button title="SUBMIT REVIEW" type="primary" onPress={handleSubmit} loading={submitting} />
      </ContentWrapper>
    </ScreenBackground>
  );
};

export default RatingScreen;

const styles = StyleSheet.create({
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
    color: colors.text.light,
    fontFamily: 'poppins-medium',
    fontSize: moderateScale(14),
  },
  username: {
    color: colors.text.bright,
    fontSize: moderateScale(16),
    fontFamily: 'poppins-bold',
    marginLeft: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  confirmText: {
    color: colors.text.light,
    fontFamily: 'poppins-regular',
    fontSize: moderateScale(12),
  },
});
