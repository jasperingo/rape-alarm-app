
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import validator from 'validator';
import { DIMENSION_MD } from '../assets/styles/config';
import AppButton from '../components/AppButton';
import AppTextInput from '../components/AppTextInput';
import { useUserSignIn } from '../hooks/userHook';
import SignIntoSignUp from '../components/SignIntoSignUp';
import { useNavigation } from '@react-navigation/native';

declare global {   
  namespace ReactNavigation {
    interface RootParamList {
      Sign_up: undefined;
    }   
  } 
 } 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: DIMENSION_MD,
    fontFamily: 'AkayaTelivigala-Regular'
  }
});

const LoginScreen = () => {

  const navigation = useNavigation();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [onSubmit, success, loading, error, resetStatus] = useUserSignIn();

  const onFormSubmit = async () => {

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
      if (success) {
        alert('Signed in');
      }  

      if (error !== null) {
        alert(`Error: ${error}`);
      }

      resetStatus();
    },
    [success, error]
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
          error={null}
          keyboardType="email-address"
          onChangeText={setEmail} 
          />

        <AppTextInput 
          label="Password" 
          value={password} 
          error={null}
          disabled={loading}
          passwordInput={true}
          onChangeText={setPassword} 
          />

        <AppButton text="Sign in" loading={loading} onPress={onFormSubmit} />

        <SignIntoSignUp onPress={()=> navigation.navigate('Sign_up')} />       

      </View>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
