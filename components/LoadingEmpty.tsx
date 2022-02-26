
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLOR_SURFACE, DIMENSION_XL, DIMENSION_XXXL } from '../assets/styles/config';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_SURFACE,
    paddingVertical: DIMENSION_XXXL,
  },
  
  text: {
    textAlign: 'center',
    fontSize: DIMENSION_XL
  }
});

const LoadingEmpty = ({ text }: { text: string }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{ text }</Text>
    </View>
  );
}

export default LoadingEmpty;
