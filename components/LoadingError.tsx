
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DIMENSION_LG, DIMENSION_XL, FONT_BOLD } from '../assets/styles/config';

const styles = StyleSheet.create({
  container: {
    marginVertical: DIMENSION_LG,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  text: {
    textAlign: 'center',
    fontWeight: FONT_BOLD,
    marginRight: DIMENSION_LG,
  }
});

interface Props {
  error: string;
  onReloadPress: ()=> void
}

const LoadingError = ({ error, onReloadPress }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{ error }</Text>
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={onReloadPress} 
        accessibilityLabel="Retry load of data"
        > 
        <Ionicons name="reload" size={DIMENSION_XL} />
      </TouchableOpacity>
    </View>
  );
}

export default LoadingError;
