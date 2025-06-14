import { StyleSheet, Text, View, Platform , TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import { FontAwesome6 } from '@expo/vector-icons';
import Button from '@/components/ui/Button';
import { LoginData } from '@/constants/Types';
import { useState } from 'react';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/authStore';
import ScreenBackground from '@/components/layout/ScreenBackground';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ContentWrapper from '@/components/layout/ContentWrapper';
import colors from '@/constants/Colors';
import ThemedInput from '@/components/ui/ThemedInput';
import InfoText from '@/components/common/InfoText';
import { useRouter } from 'expo-router';

const Login = () => {

  const [ loginData, setLoginData ] = useState< LoginData >({
    email: '',
    password: '',
  });

  const router = useRouter();


  const onLogin = async () => {

    if (!loginData.email || !loginData.password) {
      Alert.alert('Missing fields', 'Please fill out all fields.');
      return;
    }

    try {
      const response = await api.post('/auth/login', loginData);
      // Check if the response status is 201 (Created)
      if (response.status !== 201) {
        Alert.alert('Error', 'An error occurred while logging into your account. Please try again later.');
        return;
      }

      Alert.alert('Success', 'Logged in successfully!');
      console.log(response.data);

      const { user, token } = response.data;

      // Store the user data and token in zustand
      useAuthStore.getState().login(user, token);

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while logging into your account. Please try again later.');
    }
  };

  const onLoginWithGoogle = () => {
    // Implement Google Login
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
          <ContentWrapper style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subTitle}>Log in to Proceed</Text>

            <View style={styles.inputContainer}>
              <ThemedInput
                placeholder="Email Address"
                value={loginData.email}
                onChangeText={(text) => setLoginData((prev) => ({ ...prev, email: text }))}
              />
              <ThemedInput
                placeholder="Password"
                value={loginData.password}
                onChangeText={(text) => setLoginData((prev) => ({ ...prev, password: text }))}
              />
            </View>

            <InfoText style={{ marginBottom: hp('4%'), width: '100%' }}> Don't have an account? <Text style={{ color: colors.text.light }} onPress={() => { router.push('/register') }}>Sign Up</Text> </InfoText>
            
            <Button title="LOGIN" type='primary' onPress={onLogin} />
            <Text style={styles.optionText}>Or Sign In with</Text>
            <TouchableOpacity style={styles.googleIconContainer} onPress={onLoginWithGoogle}>
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
    paddingVertical: hp('5%'), // Adds padding to prevent content cutoff
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