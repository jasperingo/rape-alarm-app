
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLOR_PRIMARY, COLOR_TEXT_INVERSE, DIMENSION_MD, DIMENSION_SM, DIMENSION_XS, DIMENSION_XXS, FONT_BOLD } from '../assets/styles/config';

const styles = StyleSheet.create({
  container: {
    padding: DIMENSION_MD,
    backgroundColor: COLOR_PRIMARY,
    marginVertical: DIMENSION_XXS,
    borderRadius: DIMENSION_XXS
  },
  text: {
    textAlign: 'center',
    color: COLOR_TEXT_INVERSE,
    fontWeight: FONT_BOLD,
  }
});

interface Props {
  text: string;
  loading: boolean;
  onPress: ()=> void
}

const AppButton = ({ text, loading, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.container} disabled={loading} activeOpacity={0.8} onPress={onPress}>
      { 
        loading ?
        <ActivityIndicator color={COLOR_TEXT_INVERSE} size="small" />
        :
        <Text style={styles.text}>{ text }</Text>
      }
    </TouchableOpacity>
  )
}

export default AppButton;
