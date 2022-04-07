
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useNetInfo } from "@react-native-community/netinfo";
import { RootStackParamList } from '../App';
import { DIMENSION_MD } from '../assets/styles/config';
import AppButton from '../components/AppButton';
import AppTextInput from '../components/AppTextInput';
import SignIntoSignUp from '../components/SignIntoSignUp';
import { useErrorMessage } from '../hooks/errorHook';
import { useSignUpValidation } from '../hooks/validationHook';
import { useUserSignUp } from '../hooks/userHook';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: DIMENSION_MD,
  }
});

const RegisterScreen = () => {

  const network = useNetInfo();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'SignUp'>>();

  const [
    isInvalid,
    nameError, 
    emailError, 
    passwordError
  ] = useSignUpValidation();

  const [onSubmit, success, loading, error, resetStatus] = useUserSignUp();

  const errorMessage = useErrorMessage();

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const onFormSubmit = () => {

    if (isInvalid(name, email, password)) {
      return;
    }
    
    if (!network.isConnected) {
      alert('No network connection');
    } else {
      onSubmit(name, email, password);
    }
  }

  useEffect(
    ()=> {
      if (success)
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }]
        });
      
      if (error !== null) {
        alert(errorMessage(error));
        resetStatus();
      }
    },
    [success, error, navigation, errorMessage, resetStatus]
  );
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      <View>

        <AppTextInput 
          label="Full name" 
          value={name} 
          disabled={loading}
          error={errorMessage(nameError)}
          onChangeText={setName} 
          />

        <AppTextInput 
          label="Email" 
          value={email} 
          disabled={loading}
          error={errorMessage(emailError)}
          keyboardType="email-address"
          onChangeText={setEmail} 
          />

        <AppTextInput 
          label="Password" 
          value={password} 
          error={errorMessage(passwordError)}
          disabled={loading}
          passwordInput={true}
          onChangeText={setPassword} 
          />

        <AppButton text="Sign Up" loading={loading} onPress={onFormSubmit} />

        <SignIntoSignUp type='signin' onPress={()=> navigation.navigate('SignIn')} />       

      </View>
    </KeyboardAvoidingView>
  );
}

export default RegisterScreen;
