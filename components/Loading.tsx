
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { COLOR_PRIMARY } from '../assets/styles/config';

const Loading = () => {
  return (
    <View>
      <ActivityIndicator color={COLOR_PRIMARY} size="large" />
    </View>
  );
}

export default Loading;
