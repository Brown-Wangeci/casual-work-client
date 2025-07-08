import { Keyboard, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import ContentWrapper from '@/components/layout/ContentWrapper';
import CustomHeader from '@/components/layout/CustomHeader';
import Button from '@/components/ui/Button';
import colors from '@/constants/Colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import ThemedInput from '@/components/ui/ThemedInput';
import InfoText from '@/components/common/InfoText';
import TaskCategorySelect from '@/components/screens/post-task/TaskCategorySelect';
import Hr from '@/components/common/Hr';
import ScreenBackground from '@/components/layout/ScreenBackground';
import api from '@/lib/utils/axios';
import { extractErrorMessage, logError } from '@/lib/utils';
import { showToast } from '@/lib/utils/showToast';
import { useTasksStore } from '@/stores/tasksStore';
import { useState } from 'react';
import { useTaskCreationStore } from '@/stores/taskCreationStore';
import { TouchableOpacity } from 'react-native';

const MAX_DESCRIPTION_LENGTH = 400;
const MAX_TITLE_LENGTH = 50;

const PostTaskScreen = () => {
  const router = useRouter();
  const addPostedTask = useTasksStore((state) => state.addCreatedTask);
  const task = useTaskCreationStore((state) => state.task);
  const setField = useTaskCreationStore((state) => state.setField);
  const resetTask = useTaskCreationStore((state) => state.resetTask);
  const [loading, setLoading] = useState(false);

  const handleCreateTask = async () => {
    const { title, description, category, location, offer } = task;

    if (!title || !description || !location || offer === null || !category) {
      showToast('error', 'Missing fields', 'Please fill in all required fields.');
      return;
    }

    if (title.length > MAX_TITLE_LENGTH) {
      showToast('error', 'Title too long', `Maximum ${MAX_TITLE_LENGTH} characters allowed.`);
      return;
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      showToast('error', 'Description too long', `Maximum ${MAX_DESCRIPTION_LENGTH} characters allowed.`);
      return;
    }

    if (offer <= 0) {
      showToast('error', 'Invalid offer', 'Offer amount must be greater than zero.');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/tasks', task);

      if (response.status === 201 && response.data?.task?.id) {
        const successMessage = response.data.message || 'Task created successfully!';
        addPostedTask(response.data.task);
        resetTask();
        showToast('success', 'Task Created', successMessage);
        router.push(`/tasks/${response.data.task.id}/confirmation`);
      } else {
        logError(response, 'Unexpected response structure');
        showToast('error', 'Task creation Failed', 'Unexpected server response. Please try again.');
      }
    } catch (error) {
      logError(error, 'PostTaskScreen > handleCreateTask');
      const message = extractErrorMessage(error);
      showToast('error', 'Task creation Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenBackground>
      <CustomHeader title="Create Task" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContainer}
          extraScrollHeight={Platform.OS === 'ios' ? 60 : 0}
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
        >
          <ContentWrapper>
            <Text style={styles.title}>Task Details</Text>
            <View style={styles.inputContainer}>
              <View style={styles.inputBlock}>
                <Text style={styles.inputLabel}>Task Title</Text>
                <InfoText style={{ marginBottom: hp('1%') }}>
                  Keep it short and descriptive. This helps taskers quickly understand the task.
                </InfoText>
                <ThemedInput
                  placeholder="e.g. Weekly Laundry Service"
                  value={task.title}
                  onChangeText={(text) => setField('title', text)}
                  maxLength={MAX_TITLE_LENGTH}
                />
                <Text style={styles.textCount}>{task.title.length} / {MAX_TITLE_LENGTH}</Text>
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.inputLabel}>Description</Text>
                <InfoText style={{ marginBottom: hp('1%') }}>
                  Provide a detailed description of the task to help taskers understand your needs.
                </InfoText>
                <ThemedInput
                  multiline
                  numberOfLines={6}
                  style={{ minHeight: 120, textAlignVertical: 'top' }}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  value={task.description}
                  onChangeText={(text) => setField('description', text)}
                  placeholder="Describe the task in detail"
                />
                <Text style={styles.textCount}>{task.description.length} / {MAX_DESCRIPTION_LENGTH}</Text>
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.inputLabel}>Category</Text>
                <TaskCategorySelect
                  onValueChange={(value) => setField('category', value)}
                  categoryValue={task.category}
                />
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.inputLabel}>Location</Text>
                <TouchableOpacity
                    style={styles.locationInput}
                    onPress={() => router.push('/post-task/LocationPickerScreen')}
                    activeOpacity={0.7}
                >
                    <Text style={task.location ? styles.locationText : styles.placeholderText}>
                    {task.location || 'Select Location'}
                    </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Hr />
            <Text style={styles.title}>Offer</Text>

            <View style={styles.inputContainer}>
              <View style={styles.inputBlock}>
                <Text style={styles.inputLabel}>Offer Amount</Text>
                <ThemedInput
                  placeholder="Ksh. 100"
                  keyboardType="numeric"
                  value={task.offer !== null ? task.offer.toString() : ''}
                  onChangeText={(text) => {
                    const numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));
                    setField('offer', isNaN(numericValue) ? null : numericValue);
                  }}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Button title="CREATE TASK" type="primary" onPress={handleCreateTask} loading={loading} />
            </View>
          </ContentWrapper>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </ScreenBackground>
  );
};

export default PostTaskScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: hp('3%'),
    paddingBottom: hp('4%'),
  },
  title: {
    color: colors.text.green,
    fontSize: moderateScale(18, 0.2),
    fontFamily: 'poppins-semi-bold',
    marginBottom: hp('1%'),
  },
  inputContainer: {
    width: '100%',
    marginBottom: hp('2%'),
    gap: hp('2%'),
  },
  inputBlock: {
    width: '100%',
  },
  inputLabel: {
    color: colors.text.bright,
    fontSize: moderateScale(16, 0.2),
    fontFamily: 'poppins-medium',
    marginBottom: hp('0.4%'),
  },
  hr: {
    width: '100%',
    height: 1,
    backgroundColor: colors.component.stroke,
    marginVertical: hp('2%'),
  },
  buttonContainer: {
    width: '100%',
    marginTop: hp('2%'),
  },
  textCount: {
    color: colors.text.green,
    fontSize: moderateScale(12, 0.2),
    fontFamily: 'poppins-regular',
    textAlign: 'right',
    marginTop: hp('0.5%'),
    marginBottom: hp('-2%'),
  },
  locationInput: {
    backgroundColor: colors.component.input,
    borderRadius: 10,
    borderColor: colors.component.stroke,
    borderWidth: 1,
    paddingVertical: hp('1.4%'),
    paddingHorizontal: wp('4%'),
    justifyContent: 'center',
    },

    placeholderText: {
    color: colors.text.placeholder,
    fontFamily: 'poppins-regular',
    fontSize: moderateScale(14, 0.2),
    },

    locationText: {
    color: colors.text.bright,
    fontFamily: 'poppins-regular',
    fontSize: moderateScale(14, 0.2),
    },

});
