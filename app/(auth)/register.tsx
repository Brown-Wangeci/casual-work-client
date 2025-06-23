import { StyleSheet, Text, View, Platform , TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
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
import * as WebBrowser from 'expo-web-browser';
import * as  Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  userInfoEndpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
};

const SignUp = () => {
  const regexEmail = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?strathmore\.edu$/;

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [ signUpData, setSignUpData ] = useState < SignUpData >({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    profilePicture: '',
  });

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID!,
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
    },
  );

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
      setLoading(true);
      const response = await api.post('/auth/signup', {
        username: signUpData.username,
        email: signUpData.email,
        phone: signUpData.phone,
        password: signUpData.password,
        profilePicture: `https://api.dicebear.com/7.x/lorelei/svg?seed=${signUpData.username}`,
      });
      setLoading(false);

      if (response.status !== 201) {
        Alert.alert('Error', 'An error occurred while creating your account. Please try again later.');
        return;
      }

      const { user, token } = response.data;
      useAuthStore.getState().login(user, token);
      Alert.alert('Success', 'Account created successfully!');

    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert('Error', 'An error occurred while creating your account. Please try again later.');
    }
  };

  const onSignUpWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await promptAsync();
      if (result.type !== 'success' || !result.authentication?.accessToken) {
        setLoading(false);
        Alert.alert('Google Sign Up', 'Authentication failed or was cancelled.');
        return;
      }

      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${result.authentication.accessToken}` },
      });

      const userInfo = await userInfoResponse.json();

      if (!userInfo.email.endsWith('@strathmore.edu')) {
        setLoading(false);
        Alert.alert('Invalid Email', 'Only Strathmore email accounts are allowed for sign up.');
        return;
      }

      const response = await api.post('/auth/google-signup', {
        username: userInfo.name,
        email: userInfo.email,
        profilePicture: userInfo.picture,
      });

      if (response.status !== 200) {
        setLoading(false);
        throw new Error('Failed to sign up with Google');
      }

      const { user, token } = response.data;
      useAuthStore.getState().login(user, token);
      Alert.alert('Welcome', `Signed up successfully as ${user.username}`);
      setLoading(false);

    } catch (error) {
      setLoading(false);
      console.error('Google Sign Up Error:', error);
      Alert.alert('Error', 'Something went wrong with Google Sign Up.');
    }
  };

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
              <ThemedInput placeholder="username" value={signUpData.username} onChangeText={(text) => setSignUpData((prev) => ({ ...prev, username: text }))} autoCapitalize="none" />
              <ThemedInput placeholder="email address" value={signUpData.email} onChangeText={(text) => setSignUpData((prev) => ({ ...prev, email: text }))} autoCapitalize="none" keyboardType="email-address" />
              <ThemedInput placeholder="phone number" value={signUpData.phone} keyboardType="numeric" onChangeText={(text) => setSignUpData((prev) => ({ ...prev, phone: text }))} />
              <ThemedInput placeholder="password" value={signUpData.password} onChangeText={(text) => setSignUpData((prev) => ({ ...prev, password: text }))} secureTextEntry autoComplete="password" textContentType="password" autoCapitalize="none" />
              <ThemedInput placeholder="confirm password" value={signUpData.confirmPassword} onChangeText={(text) => setSignUpData((prev) => ({ ...prev, confirmPassword: text }))} secureTextEntry autoComplete="password" textContentType="password" autoCapitalize="none" />
            </View>

            <InfoText style={{ marginBottom: hp('4%'), width: '100%' }}>Already have an account? <Text style={{ color: colors.text.light }} onPress={() => { router.push('/login'); }}>Login</Text></InfoText>

            <Button title="CREATE ACCOUNT" type='primary' onPress={handleSignUp} loading={loading} />
            <Text style={styles.optionText}>Or Sign Up with</Text>
            <TouchableOpacity style={styles.googleIconContainer} onPress={onSignUpWithGoogle} disabled={loading}>
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
    gap: hp('2.5%'),
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
