
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import { useAlertCreate } from '../hooks/alertHook';
import { useErrorMessage } from '../hooks/errorHook';
import { COLOR_ERROR, COLOR_TEXT_INVERSE, DIMENSION_XL } from '../assets/styles/config';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: DIMENSION_XL,
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    width: 250,
    height: 250,
    borderRadius: 200,
    backgroundColor: COLOR_ERROR,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontSize: 40,
    color: COLOR_TEXT_INVERSE,
    fontFamily: 'AkayaTelivigala-Regular'
  }
});


const HomeScreen = () => {

  const errorMessage = useErrorMessage();

  const [
    onSubmit, 
    success, 
    loading, 
    error, 
    resetStatus
  ] = useAlertCreate();

  useEffect(
    ()=> {
      if (success)
        alert('Alert sent');

      if (error !== null)
        alert(errorMessage(error));

      resetStatus();
    },
    [success, error, resetStatus, errorMessage]
  );
  
  const sendAlert = async ()=> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
      } else {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const [{ city, country, region, subregion }] = await Location.reverseGeocodeAsync({ latitude, longitude });
        onSubmit(`${city}, ${subregion}, ${region}, ${country}`, longitude, latitude);
      }
    } catch {
      alert('Alert not sent, try again.');
    }
  }
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        activeOpacity={0.5} 
        onPress={sendAlert}
        disabled={loading}
        >
        {
          loading ?
          <ActivityIndicator size="large" color={COLOR_TEXT_INVERSE} />
          :
          <Text style={styles.text}>Send Alert</Text>
        }
      </TouchableOpacity>
    </View>
  );
}

export default HomeScreen;
