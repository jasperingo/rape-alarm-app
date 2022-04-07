
import { useNetInfo } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../App';
import { COLOR_PRIMARY, COLOR_SURFACE } from '../assets/styles/config';
import Loading from '../components/Loading';
import LoadingError from '../components/LoadingError';
import { NO_INTERNET_CONNECTION } from '../constants/errorCodes';
import { useErrorMessage } from '../hooks/errorHook';
import { useAuthUserFetch, useUser } from '../hooks/userHook';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: COLOR_SURFACE
  },

  text: {
    fontSize: 60,
    color: COLOR_PRIMARY,
    fontFamily: 'AkayaTelivigala-Regular',
  }
});

const SplashScreen = () => {

  const user = useUser();

  const network = useNetInfo();

  const errorMessage = useErrorMessage();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Splash'>>();

  const [
    fetchUser, 
    setError, 
    loading, 
    success, 
    error, 
    retryFetch
  ] = useAuthUserFetch();

  useEffect(
    () => {
      if (success && user === null) {
        navigation.reset({ 
          index: 0,
          routes: [{ name: 'SignIn' }]
        });
      } else if (success && user !== null) {
        navigation.reset({ 
          index: 0,
          routes: [{ name: 'Main', params: { screen: 'Home' } }]
        });
      }
    }, 
    [success, user, navigation]
  );

  useEffect(
    () => {
      if (success) return;

      if (!network.isConnected && error === null)
        setError(NO_INTERNET_CONNECTION);
      else if (network.isConnected && !loading)
        fetchUser();
    }, 
    [success, loading, error, network.isConnected, fetchUser, setError]
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <Text style={styles.text}>Rape Alert</Text>

      { loading  && <Loading /> }

      { error !== null && <LoadingError error={errorMessage(error)} onReloadPress={retryFetch} /> }
    </View>
  );
}

export default SplashScreen;
