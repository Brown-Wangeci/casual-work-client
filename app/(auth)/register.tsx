import { StyleSheet, Text, View, Platform , TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import { FontAwesome6 } from '@expo/vector-icons';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { SignUpData } from '@/constants/Types';
import ThemedInput from '@/components/ui/ThemedInput';
import colors from '@/constants/Colors';
import ContentWrapper from '@/components/layout/ContentWrapper';
import ScreenBackground from '@/components/layout/ScreenBackground';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/authStore';
import InfoText from '@/components/common/InfoText';
import { useRouter } from 'expo-router';

const SignUp = () => {

  const regexEmail = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?strathmore\.edu$/;

  const router = useRouter();

  const [ signUpData, setSignUpData ] = useState < SignUpData >({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleSignUp = async () => {

    if (!signUpData.username || !signUpData.email || !signUpData.phone || !signUpData.password || !signUpData.confirmPassword) {
      Alert.alert('Missing fields', 'Please fill out all fields.');
      return;
    }

    if (!regexEmail.test(signUpData.email)) {
      Alert.alert('Invalid Email', 'Please use a valid Strathmore email address.');
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      Alert.alert('Password Mismatch', 'Your passwords do not match. Please try again.');
      return;
    }

    try {
      const response = await api.post('/auth/signup', {
        username: signUpData.username,
        email: signUpData.email,
        phone: signUpData.phone,
        password: signUpData.password,
      });
      console.log(response.data);
      // Check if the response status is 201 (Created)
      if (response.status !== 201) {
        Alert.alert('Error', 'An error occurred while creating your account. Please try again later.');
        return;
      }

      Alert.alert('Success', 'Account created successfully!');
      console.log(response.data);

      const { user, token } = response.data;

      // Store the user data and token in zustand
      useAuthStore.getState().login(user, token);

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while creating your account. Please try again later.');
    }
  }


  const onSignUpWithGoogle = () => {
    // Implement Google Sign Up
    Alert.alert('Google Sign Up', 'Google Sign Up functionality is not implemented yet.');
  }

  return (
    <ScreenBackground>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContainer}
          extraScrollHeight={Platform.OS === 'ios' ? 60 : 0}
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
        >
          <ContentWrapper style={{ alignItems: 'center', justifyContent: 'center', width: wp('85%') }}>
            <Text style={styles.title}>Join US</Text>
            <Text style={styles.subTitle}>Fill in your details to get started</Text>

            <View style={styles.inputContainer}>
              <ThemedInput
                placeholder="username"
                value={signUpData.username}
                onChangeText={ (text) => setSignUpData( (prev) => ({ ...prev, username: text })) }
              />
              <ThemedInput
                placeholder="email address"
                value={signUpData.email}
                onChangeText={ (text) => setSignUpData( (prev) => ({ ...prev, email: text })) }
              />
              <ThemedInput
                placeholder="phone number"
                  value={signUpData.phone}
                  keyboardType="numeric"
                  onChangeText={ (text) => setSignUpData( (prev) => ({ ...prev, phone: text })) }
                />
              <ThemedInput
                placeholder="password"
                value={signUpData.password}
                onChangeText={ (text) => setSignUpData( (prev) => ({ ...prev, password: text })) }
              />
              <ThemedInput
                placeholder="confirm password"
                value={signUpData.confirmPassword}
                onChangeText={ (text) => setSignUpData( (prev) => ({ ...prev, confirmPassword: text })) }
              />

            </View>

            <InfoText style={{ marginBottom: hp('4%'), width: '100%' }}> Already have an account? <Text style={{ color: colors.text.light }} onPress={() => { router.push('/login') }}>Login</Text> </InfoText>

            <Button title="CREATE ACCOUNT" type='primary' onPress={handleSignUp} />
            <Text style={styles.optionText}>Or Sign Up with</Text>
            <TouchableOpacity style={styles.googleIconContainer} onPress={onSignUpWithGoogle}>
              <FontAwesome6 name="google" size={36} color={colors.text.bright} />
            </TouchableOpacity>
          </ContentWrapper>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </ScreenBackground>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: hp('1%'),
    paddingBottom: hp('4%'),
  },
  title: {
    color: colors.text.bright,
    fontSize: moderateScale(24, 0.2),
    fontFamily: 'poppins-bold',
    textAlign: 'center',
    marginTop: hp('4%'),
    marginBottom: hp('1%'), 
  },
  subTitle: {
    color: colors.text.light,
    fontSize: moderateScale(16, 0.2),
    fontFamily: 'poppins-regular',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginVertical: hp('4%'),
    gap: hp('2.5%'), // Ensures spacing adapts to screen size
  },
  optionText: {
    marginVertical: hp('2%'),
    color: colors.text.bright,
    fontSize: moderateScale(16, 0.2),
    fontFamily: 'poppins-medium',
    textAlign: 'center',
  },
  googleIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
