import { Alert, Keyboard, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { useState } from 'react'
import ContentWrapper from '@/components/layout/ContentWrapper'
import CustomHeader from '@/components/layout/CustomHeader'
import Button from '@/components/ui/Button'
import colors from '@/constants/Colors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { moderateScale } from 'react-native-size-matters'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useRouter } from 'expo-router'
import ThemedInput from '@/components/ui/ThemedInput'
import InfoText from '@/components/common/InfoText'
import TaskCategorySelect from '@/components/screens/post-task/TaskCategorySelect'
import Hr from '@/components/common/Hr'
import { TaskInCreation } from '@/constants/Types'
import ScreenBackground from '@/components/layout/ScreenBackground'
import api from '@/lib/axios'
import { extractErrorMessage, logError } from '@/lib/utils'
import { useTasksStore } from '@/stores/tasksStore'

const PostTaskScreen = () => {
  const [createdTask, setCreatedTask] = useState< TaskInCreation >(
    {
      title: '',
      description: '',
      category: '',
      location: '',
      offer: null,
    }
  );
  const addPostedTask = useTasksStore((state) => state.addCreatedTask);
  const [ loading, setLoading ] = useState < boolean > (false);

  const MAX_DESCRIPTION_LENGTH = 400;
  const MAX_TITLE_LENGTH = 50;
  const router = useRouter()

  const handleCreateTask = async () => {

    if (!createdTask.title || !createdTask.description || !createdTask.location || createdTask.offer === null) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (createdTask.title.length > MAX_TITLE_LENGTH) {
      Alert.alert('Error', `Title cannot exceed ${MAX_TITLE_LENGTH} characters.`);
      return;
    }

    if (createdTask.description.length > MAX_DESCRIPTION_LENGTH) {
      Alert.alert('Error', `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`);
      return;
    }

    if (createdTask.offer <= 0) {
      Alert.alert('Error', 'Offer amount must be greater than zero.');
      return;
    }

    try {

      setLoading(true);
      const response = await api.post(`/tasks`, { ...createdTask });

      if (
        response.status === 201 &&
        response.data &&
        response.data.task &&
        typeof response.data.task.id === 'string'
      ) {
        const successMessage = response.data.message || 'Task created successfully!';
        console.log('Created task:', response.data.task);
        addPostedTask(response.data.task);
        Alert.alert('Success', successMessage);
        router.push(`/tasks/${response.data.task.id}/confirmation`);
      } else {
        logError(response, 'Unexpected response structure in handleCreateTask');
        Alert.alert('Error', 'Unexpected server response. Please try again.');
      }
    } catch (error) {
      logError(error, 'handleCreateTask');
      const message = extractErrorMessage(error);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenBackground>
      <CustomHeader title='Create Task' />
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
                  value={createdTask.title}
                  onChangeText={(text) => setCreatedTask((prev) => ({ ...prev, title: text }))}
                  maxLength={MAX_TITLE_LENGTH}
                />
                <Text style={[styles.textCount]}>
                  { createdTask.title.length } / { MAX_TITLE_LENGTH }
                </Text>
              </View>
              <View style={styles.inputBlock}>
                <Text style={styles.inputLabel}>Description</Text>
                <InfoText style={{ marginBottom: hp('1%') }}>
                  Provide a detailed description of the task to help taskers understand your needs.
                </InfoText>
                <ThemedInput
                  multiline
                  numberOfLines={6}
                  style={{ 
                    minHeight: 120,
                    textAlignVertical: 'top'
                  }}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  value={createdTask.description}
                  onChangeText={(text) => setCreatedTask((prev) => ({ ...prev, description: text }))}
                  placeholder="Describe the task in detail"
                />
                <Text style={[styles.textCount]}>
                  { createdTask.description.length } / { MAX_DESCRIPTION_LENGTH }
                </Text>
              </View>
              <View style={styles.inputBlock}>
                <Text style={styles.inputLabel}>Category</Text>
                <TaskCategorySelect
                  onValueChange={(value) => setCreatedTask((prev) => ({ ...prev, category: value }))}
                  categoryValue={createdTask.category}
                />
              </View>
              <View style={styles.inputBlock}>
                <Text style={styles.inputLabel}>Location</Text>
                <ThemedInput
                  placeholder="Your Address"
                  value={createdTask.location}
                  onChangeText={(text) => setCreatedTask({ ...createdTask, location: text })}
                />
              </View>
            </View>

            <Hr/>
            <Text style={styles.title}>Offer</Text>

            <View style={styles.inputContainer}>
              <View style={styles.inputBlock}>
                <Text style={styles.inputLabel}>Offer Amount</Text>
                <ThemedInput
                  placeholder="Ksh. 100"
                  keyboardType="numeric"
                  value={ createdTask.offer !== null ? createdTask.offer.toString() : ''}
                  onChangeText={(text) => {
                    const numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));
                    setCreatedTask({ ...createdTask, offer: isNaN(numericValue) ? null : numericValue });
                  }}
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Button title="CREATE TASK" type='primary' onPress={ handleCreateTask } loading={loading} />
            </View>
          </ContentWrapper>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </ScreenBackground>
  )
}

export default PostTaskScreen

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
});