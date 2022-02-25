
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLOR_PRIMARY, DIMENSION_SM } from '../assets/styles/config';

const styles = StyleSheet.create({ 
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: DIMENSION_SM
  },
  button: {
    color: COLOR_PRIMARY
  }
});

interface Props {
  type: 'signin' | 'signup';
  onPress: ()=> void;
}

const SignIntoSignUp = ({ type, onPress }: Props) => {
  return (
    <View style={styles.container}>
      <Text>
        { type === 'signup' && 'Don\'t have an account? ' } 
        { type === 'signin' && 'Already have an account? ' } 
      </Text>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <Text style={styles.button}>
          { type === 'signup' && 'Sign up.' }
          { type === 'signin' && 'Sign in.' }
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default SignIntoSignUp;
