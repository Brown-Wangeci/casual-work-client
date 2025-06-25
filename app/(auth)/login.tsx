import { StyleSheet, Text, View, Platform, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import { FontAwesome6 } from '@expo/vector-icons';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { LoginData } from '@/constants/Types';
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
import { extractErrorMessage, logError } from '@/lib/utils';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  userInfoEndpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
};

const Login = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID!,
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
    },
  );

  const onLogin = async () => {
    if (!loginData.email || !loginData.password) {
      Alert.alert('Missing fields', 'Please fill out all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', loginData);

      if (
        response.status === 200 &&
        response.data &&
        response.data.user &&
        response.data.token
      ) {
        const { user, token, message } = response.data;
        useAuthStore.getState().login(user, token);
        // Alert.alert('Success', message || 'Logged in successfully!');
      } else {
        logError(response, 'Unexpected response structure in onLogin');
        Alert.alert('Error', 'Unexpected error. Please try again.');
      }
    } catch (error) {
      logError(error, 'onLogin');
      const message = extractErrorMessage(error);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const onLoginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await promptAsync();

      if (result.type !== 'success' || !result.authentication?.accessToken) {
        Alert.alert('Google Login', 'Authentication was cancelled or failed.');
        return;
      }

      const userInfoRes = await fetch(discovery.userInfoEndpoint, {
        headers: { Authorization: `Bearer ${result.authentication.accessToken}` },
      });

      const userInfo = await userInfoRes.json();

      if (!userInfo.email.endsWith('@strathmore.edu')) {
        Alert.alert('Invalid Email', 'Only Strathmore emails are allowed.');
        return;
      }

      const response = await api.post('/auth/google-login', {
        email: userInfo.email,
        username: userInfo.name,
        profilePicture: userInfo.picture,
      });

      if (
        response.status === 200 &&
        response.data &&
        response.data.user &&
        response.data.token
      ) {
        const { user, token, message } = response.data;
        useAuthStore.getState().login(user, token);
        Alert.alert('Success', message || `Logged in as ${user.username}`);
      } else {
        logError(response, 'Unexpected response structure in onLoginWithGoogle');
        Alert.alert('Login Error', 'Unexpected error.');
      }
    } catch (error) {
      logError(error, 'onLoginWithGoogle');
      const message = extractErrorMessage(error);
      Alert.alert('Login Failed', message);
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
          <ContentWrapper style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subTitle}>Log in to Proceed</Text>

            <View style={styles.inputContainer}>
              <ThemedInput
                placeholder="Email Address"
                value={loginData.email}
                onChangeText={(text) => setLoginData((prev) => ({ ...prev, email: text }))}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
              <ThemedInput
                placeholder="Password"
                value={loginData.password}
                onChangeText={(text) => setLoginData((prev) => ({ ...prev, password: text }))}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
              />
            </View>

            <InfoText style={{ marginBottom: hp('4%'), width: '100%' }}>
              Don't have an account?{' '}
              <Text style={{ color: colors.text.light }} onPress={() => router.push('/register')}>
                Sign Up
              </Text>
            </InfoText>

            <Button title='LOGIN' type="primary" onPress={onLogin} loading={loading} />
            <Text style={styles.optionText}>Or Sign In with</Text>
            <TouchableOpacity style={styles.googleIconContainer} onPress={onLoginWithGoogle} disabled={loading}>
              <FontAwesome6 name="google" size={36} color={colors.text.bright} />
            </TouchableOpacity>
          </ContentWrapper>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </ScreenBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('5%'),
  },
  title: {
    color: colors.text.bright,
    fontSize: moderateScale(24, 0.2),
    fontFamily: 'poppins-bold',
    textAlign: 'center',
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
