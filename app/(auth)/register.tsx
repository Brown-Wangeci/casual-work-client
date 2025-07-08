import { StyleSheet, Text, View, Platform, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
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
import api from '@/lib/utils/axios';
import { useAuthStore } from '@/stores/authStore';
import InfoText from '@/components/common/InfoText';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { extractErrorMessage, logError } from '@/lib/utils';
import { showToast } from '@/lib/utils/showToast';
import { safeFormatPhoneNumber } from '@/lib/utils/formatPhone';

WebBrowser.maybeCompleteAuthSession();

const SignUp = () => {
  const regexEmail = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?strathmore\.edu$/;

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [signUpData, setSignUpData] = useState<SignUpData>({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    profilePicture: '',
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID!,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
  });

  const handleSignUp = async () => {
    const formattedPhone = safeFormatPhoneNumber(signUpData.phone);

    if (!signUpData.username || !signUpData.email || !signUpData.password || !signUpData.confirmPassword || !signUpData.phone) {
      showToast('error', 'Missing Fields', 'Please fill in all required fields.');
      return;
    }

    if (!formattedPhone) {
      showToast('error', 'Invalid Phone Number', 'Please enter a valid phone number.');
      return;
    }

    if (!regexEmail.test(signUpData.email)) {
      showToast('error', 'Invalid Email', 'Use your Strathmore email.');
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      showToast('error', 'Password Mismatch', 'Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      const res = await api.post('/auth/signup', {
        ...signUpData,
        phone: formattedPhone,
        profilePicture: `https://api.dicebear.com/7.x/lorelei/svg?seed=${signUpData.username}`,
      });

      if (res.status === 201 && res.data?.result?.user && res.data?.result?.token) {
        const { user, token } = res.data.result;
        useAuthStore.getState().login(user, token);
        router.replace('/');
        showToast('success', res.data.message || 'Sign up successful');
      } else {
        logError(res, 'Unexpected signup response');
        showToast('error', 'Signup Error', 'Please try again.');
      }
    } catch (error) {
      logError(error, 'handleSignUp');
      const msg = extractErrorMessage(error) || 'An error occurred during signup';
      showToast('error', 'Signup Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const onSignUpWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await promptAsync();

      if (result.type !== 'success' || !result.authentication?.accessToken) {
        showToast('error', 'Google Sign Up Failed', 'Authentication was cancelled or failed.');
        return;
      }

      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${result.authentication.accessToken}` },
      });

      const userInfo = await userInfoResponse.json();

      if (!userInfo.email.endsWith('@strathmore.edu')) {
        showToast('error', 'Invalid Email', 'Only Strathmore emails are allowed.');
        return;
      }

      const response = await api.post('/auth/google-signup', {
        username: userInfo.name,
        email: userInfo.email,
        profilePicture: userInfo.picture,
      });

      if (response.status === 201 && response.data?.user && response.data?.token) {
        const { user, token } = response.data;
        useAuthStore.getState().login(user, token);
        router.replace('/');
      } else {
        logError(response, 'Unexpected Google signup response');
        showToast('error', 'Signup Error', 'Please try again.');
      }
    } catch (error) {
      logError(error, 'onSignUpWithGoogle');
      const message = extractErrorMessage(error);
      showToast('error', 'Google Sign Up Failed', message);
    } finally {
      setLoading(false);
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
            {/* <Text style={styles.optionText}>Or Sign Up with</Text>
            <TouchableOpacity style={[styles.googleIconContainer, loading && { opacity: 0.5 }]} onPress={onSignUpWithGoogle} disabled={loading}>
              <FontAwesome6 name="google" size={36} color={colors.text.bright} />
            </TouchableOpacity> */}
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
