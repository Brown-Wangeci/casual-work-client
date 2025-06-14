import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import ContentWrapper from '@/components/layout/ContentWrapper'
import CustomHeader from '@/components/layout/CustomHeader'
import Button from '@/components/ui/Button'
import StarRating from '@/components/common/StarRating'
import { Image } from 'expo-image'
import ContentCard from '@/components/common/ContentCard'
import colors from '@/constants/Colors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { moderateScale } from 'react-native-size-matters'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ScreenBackground from '@/components/layout/ScreenBackground'

const TaskConfirmationScreen = () => {
  const [task] = useState({
    title: 'Grocery shopping and Delivery',
    date: 'Mar 8, 2025 • 4:15 PM',
    location: 'Siwaka, Madaraka',
    offer: 100,
    serviceFee: 29,
  });

  const [user, setUser] = useState({
    name: 'John Doe',
    phoneNumber: '712345678',
    rating: 3,
    image: require('@/assets/images/user.jpg'),
  });

  return (
    <ScreenBackground>
      <CustomHeader title='Task Confirmation' showBackButton />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContainer}
          extraScrollHeight={Platform.OS === 'ios' ? 60 : 0}
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
        >
          <ContentWrapper>
            <Text style={styles.title}>Task Summary</Text>
            <ContentCard>
                <Text style={styles.textTitle}>Title: <Text style={styles.improvedText}>{task.title}</Text></Text>
                <Text style={styles.textTitle}>Time Posted: <Text style={styles.improvedText}>{task.date}</Text></Text>
                <Text style={styles.textTitle}>Location: <Text style={styles.improvedText}>{task.location}</Text></Text>
                <Text style={styles.textTitle}>Offer: <Text style={styles.improvedText}>KSh. {task.offer}</Text></Text>
            </ContentCard>

            <Text style={styles.title}>Selected Tasker</Text>
            <ContentCard>
              <View style={styles.tasker}>
                <View style={styles.imageContainer}>
                  <Image source={user.image} style={styles.image} />
                </View>
                <View style={styles.taskerDetails}>
                  <Text style={styles.name}>{user.name}</Text>
                  <StarRating rating={user.rating} size={16} />
                </View>
              </View>
            </ContentCard>

            <Text style={styles.title}>Payment Details</Text>
            <ContentCard>
              <View style={styles.paymentDetail}>
                <Text style={styles.paymentText}>Task Price:</Text>
                <Text style={styles.paymentText}>KSh. {task.offer.toFixed(2)}</Text>
              </View>
              <View style={styles.paymentDetail}>
                <Text style={styles.paymentText}>Service Fee:</Text>
                <Text style={styles.paymentText}>KSh. {task.serviceFee.toFixed(2)}</Text>
              </View>
              <View style={styles.hr}></View>
              <View style={styles.paymentDetail}>
                <Text style={styles.improvedText}>Total:</Text>
                <Text style={styles.improvedText}>KSh. {(task.offer + task.serviceFee)}</Text>
              </View>
            </ContentCard>

            <Text style={styles.title}>Payment Number</Text>
            <Text style={[styles.textTitle, {color: colors.infoText}]}>This number will be prompted to pay for the service</Text>
            <View style={styles.numberInputContainer}>
              <View style={styles.countryCodeContainer}>
                <Text style={[styles.paymentText, { color: colors.text.bright }]}>+254</Text>
              </View>
              <TextInput
                style={styles.numberInput}
                placeholder='712345678'
                value={user.phoneNumber}
                onChangeText={(text) => setUser(prev => ({ ...prev, phoneNumber: text }))}
                placeholderTextColor={colors.text.placeholder}
                keyboardType='phone-pad'
              />
            </View>
            <Button title="CONFIRM TASK" type='primary' onPress={() => {Alert.alert('Hello')}} />
          </ContentWrapper>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </ScreenBackground>
  )
}

export default TaskConfirmationScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: hp('1%'),
    paddingBottom: hp('4%'),
  },
  content: {
    width: wp('90%'),
  },
  title: {
    color: colors.text.green,
    fontSize: moderateScale(16, 0.2),
    fontFamily: 'poppins-semi-bold',
    marginTop: hp('2%'),
    marginBottom: hp('0.5%'),
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
});
