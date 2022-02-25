
import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLOR_ERROR, COLOR_PRIMARY, COLOR_SURFACE, DIMENSION_SM, DIMENSION_XS, DIMENSION_XXS, FONT_BOLD } from '../assets/styles/config';

const styles = StyleSheet.create({
  container: {
    marginBottom: DIMENSION_XXS
  },

  input: {
    padding: DIMENSION_SM,
    backgroundColor: COLOR_SURFACE,
    borderRadius: DIMENSION_XS,
    borderColor: COLOR_PRIMARY,
    borderWidth: 1,
  },

  text: {
    fontWeight: FONT_BOLD
  },

  error: {
    fontSize: DIMENSION_SM,
    color: COLOR_ERROR,
    
  }
});

interface Props {
  label: string;
  value: string;
  disabled: boolean;
  error?: string;
  passwordInput?: boolean;
  keyboardType?: KeyboardTypeOptions; 
  onChangeText: (value: string)=> void
}

const AppTextInput = ({ label, value, error = '', disabled, keyboardType = 'default', passwordInput = false, onChangeText }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{ label }</Text>
      <TextInput 
        value={value}
        editable={!disabled}
        keyboardType={keyboardType}
        secureTextEntry={passwordInput}
        onChangeText={(text)=> onChangeText(text)}
        style={[styles.input, error !== '' ? { borderColor: COLOR_ERROR } : null]} 
        />
      <Text style={styles.error}>{ error }</Text>
    </View>
  );
}

export default AppTextInput;
