
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import validator from 'validator';
import { DIMENSION_MD } from '../assets/styles/config';
import AppButton from '../components/AppButton';
import AppTextInput from '../components/AppTextInput';
import { useUserSignIn } from '../hooks/userHook';
import SignIntoSignUp from '../components/SignIntoSignUp';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { useErrorMessage } from '../hooks/errorHook';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: DIMENSION_MD,
  }
});

const LoginScreen = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'SignIn'>>();

  const errorMessage = useErrorMessage();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [onSubmit, success, loading, error, resetStatus] = useUserSignIn();

  const onFormSubmit = () => {

    if (!validator.isEmail(email) || !validator.isLength(password, { min: 4 })) {
      alert('Credentials incorrect');
    } else {
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          alert('No network connection');
        } else {
          onSubmit(email, password);
        }
      });
    }
  }

  useEffect(
    ()=> {
      if (success)
        navigation.replace('Main', { screen: 'Home' });

      if (error !== null)
        alert(errorMessage(error));

      resetStatus();
    },
    [success, error, errorMessage, navigation, resetStatus]
  );
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      <View>

        <AppTextInput 
          label="Email" 
          value={email} 
          disabled={loading}
          keyboardType="email-address"
          onChangeText={setEmail} 
          />

        <AppTextInput 
          label="Password" 
          value={password} 
          disabled={loading}
          passwordInput={true}
          onChangeText={setPassword} 
          />

        <AppButton text="Sign in" loading={loading} onPress={onFormSubmit} />

        <SignIntoSignUp type='signup' onPress={()=> navigation.navigate('SignUp')} />       

      </View>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
