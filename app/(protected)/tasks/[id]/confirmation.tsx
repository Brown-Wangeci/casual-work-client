import { Keyboard, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ContentWrapper from '@/components/layout/ContentWrapper';
import CustomHeader from '@/components/layout/CustomHeader';
import Button from '@/components/ui/Button';
import StarRating from '@/components/common/StarRating';
import { Image } from 'expo-image';
import ContentCard from '@/components/common/ContentCard';
import colors from '@/constants/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ScreenBackground from '@/components/layout/ScreenBackground';
import { useLocalSearchParams, useRouter } from 'expo-router';
import api from '@/lib/utils/axios';
import { extractErrorMessage, logError } from '@/lib/utils';
import { useTasksStore } from '@/stores/tasksStore';
import { useAuthStore } from '@/stores/authStore';
import { showToast } from '@/lib/utils/showToast';
import { safeFormatPhoneNumber } from '@/lib/utils/formatPhone';

const TaskConfirmationScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const cancelTask = useTasksStore((state) => state.cancelTask);
  const isCancelling = useTasksStore((state) => state.isCancelling);
  const getPostedTaskById = useTasksStore((state) => state.getCreatedTaskById);
  const updateTask = useTasksStore((state) => state.updateTask);
  const refreshUser = useAuthStore((state => state.refreshUser));
  const task = id ? getPostedTaskById(id as string) : null;

  // const [phone, setPhone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   if (task?.taskPoster?.phone) {
  //     setPhone(task.taskPoster.phone);
  //   }
  // }, [task]);

  const handleConfirmTask = async () => {
    try {
      // const formattedPhone = safeFormatPhoneNumber(phone);

      // if (!formattedPhone) {
      //   showToast('error', 'Invalid phone number');
      //   return;
      // }

      setLoading(true);

      const response = await api.post(`/tasks/${id}/confirm`);

      if (response.status === 202 && response.data?.task) {
        updateTask(response.data.task);
        showToast('success', 'Confirmed', response.data.message);
        await refreshUser();
        router.push('/');
      } else {
        console.log(response)
        showToast('error', 'Unexpected Error', 'Please try again.');
      }
    } catch (error: any) {
      logError(error, 'handleConfirmTask');
      const message = error.message?.includes('Invalid phone number')
        ? error.message
        : extractErrorMessage(error);
      showToast('error', 'Confirmation Failed', message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTask = () => {
      if (!id) {
        showToast('error', 'Task ID not found', 'Unable to cancel task without ID.');
        return;
      }
      cancelTask(id as string)
    };

  if (!task) {
    return (
      <ScreenBackground>
        <CustomHeader title="Task Confirmation" showBackButton />
        <ContentWrapper>
          <Text style={styles.textTitle}>Task not found in store.</Text>
        </ContentWrapper>
      </ScreenBackground>
    );
  }

  // const serviceFee = process.env.EXPO_PUBLIC_SERVICE_FEE ? parseFloat(process.env.EXPO_PUBLIC_SERVICE_FEE) : 2;
  const taskPoster = task.taskPoster;

  return (
    <ScreenBackground>
      <CustomHeader title='Task Confirmation' showBackButton />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContainer}
          extraScrollHeight={80}
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
        >
          <ContentWrapper>
            <Text style={styles.title}>Task Summary</Text>
            <ContentCard>
              <Text style={styles.textTitle}>Title: <Text style={styles.improvedText}>{task.title}</Text></Text>
              <Text style={styles.textTitle}>Time Posted: <Text style={styles.improvedText}>{new Date(task.createdAt).toLocaleString()}</Text></Text>
              <Text style={styles.textTitle}>Location: <Text style={styles.improvedText}>{task.location}</Text></Text>
              <Text style={styles.textTitle}>Offer: <Text style={styles.improvedText}>KSh. {task.offer}</Text></Text>
            </ContentCard>

            <Text style={styles.title}>Task Poster</Text>
            <ContentCard>
              <View style={styles.tasker}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: taskPoster.profilePicture }} style={styles.image} />
                </View>
                <View style={styles.taskerDetails}>
                  <Text style={styles.name}>{taskPoster.username}</Text>
                  <StarRating rating={taskPoster.rating} size={16} />
                </View>
              </View>
            </ContentCard>

            {/* <Text style={styles.title}>Payment Details</Text>
            <ContentCard>
              <View style={styles.paymentDetail}>
                <Text style={styles.paymentText}>Service Fee:</Text>
                <Text style={styles.paymentText}>KSh. {serviceFee.toFixed(2)}</Text>
              </View>
              <View style={styles.hr}></View>
              <View style={styles.paymentDetail}>
                <Text style={styles.improvedText}>Total:</Text>
                <Text style={styles.improvedText}>KSh. {serviceFee}</Text>
              </View>
            </ContentCard>

            <Text style={styles.title}>Payment Number</Text>
            <Text style={[styles.textTitle, { color: colors.infoText }]}>This number will be prompted to pay for the service</Text>
            <View style={styles.numberInputContainer}>
              <View style={styles.countryCodeContainer}>
                <Text style={[styles.paymentText, { color: colors.text.bright }]}>+254</Text>
              </View>
              <TextInput
                style={styles.numberInput}
                placeholder='e.g 0712345678'
                value={phone}
                onChangeText={(text) => setPhone(text)}
                placeholderTextColor={colors.text.placeholder}
                keyboardType='phone-pad'
              />
            </View> */}
            <View style={styles.ctaContainer}>
              <Button title="CONFIRM TASK" type='primary' onPress={handleConfirmTask} loading={loading} />
              <Button title="CANCEL TASK" type='cancel' onPress={handleCancelTask} loading={isCancelling} />
            </View>
          </ContentWrapper>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </ScreenBackground>
  );
};

export default TaskConfirmationScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: hp('1%'),
    paddingBottom: hp('4%'),
  },
  title: {
    color: colors.text.light,
    fontSize: moderateScale(16, 0.2),
    fontFamily: 'poppins-semi-bold',
    marginVertical: hp('2%'), 
  },
  textTitle: {
    color: colors.text.light,
    fontSize: moderateScale(12, 0.2),
    fontFamily: 'poppins-regular',
  },
  improvedText: {
    color: colors.text.bright,
    fontSize: moderateScale(14, 0.2),
    fontFamily: 'poppins-medium',
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
  hr: {
    width: '100%',
    height: 1,
    backgroundColor: colors.component.stroke,
    marginVertical: hp('1%'),
  },
  paymentDetail: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentText: {
    color: colors.text.light,
    fontSize: moderateScale(14, 0.2),
    fontFamily: 'poppins-regular',
  },
  numberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.component.stroke,
    backgroundColor: colors.component.input,
    paddingHorizontal: wp('5%'),
    marginTop: hp('1%'),
    marginBottom: hp('4%'),
  },
  countryCodeContainer: {
    marginRight: wp('5%'),
  },
  numberInput: {
    flex: 1,
    color: colors.text.bright,
    paddingLeft: wp('5%'),
    fontFamily: 'poppins-medium',
    fontSize: moderateScale(14, 0.2),
    borderLeftWidth: 1,
    borderLeftColor: colors.component.stroke,
  },
  ctaContainer: {
    marginTop: hp('4%'),
    gap: hp('2.5%'),
  },
});
