
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { 
  COLOR_SURFACE, 
  DIMENSION_MD, 
  DIMENSION_XS, 
  DIMENSION_XXS, 
  FONT_BOLD 
} from '../assets/styles/config';
import Alert from '../models/Alert';

const styles = StyleSheet.create({
  container: {
    marginBottom: DIMENSION_MD,
    backgroundColor: COLOR_SURFACE,
    padding: DIMENSION_XS,
    borderRadius: DIMENSION_XS
  },

  location: {
    fontWeight: FONT_BOLD,
    marginBottom: DIMENSION_XXS
  },

  date: {
    marginBottom: DIMENSION_XXS
  },

  status: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusTextActive: {
    color: 'green'
  },

  statusTextInActive: {
    color: 'brown'
  }
});

const AlertItem = ({ alert: { date, status, latitude, longitude }, onPress }: { alert: Alert, onPress: ()=> void }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        <Text style={styles.location}>Latitude: {latitude} - Longitude: {longitude}</Text>
        <Text style={styles.date}>{ date }</Text>
        <View style={styles.status}>
          <Ionicons 
            size={DIMENSION_MD} 
            name={status === 'Active' ? 'checkmark-circle' : 'close-circle'} 
            style={status === 'Active' ? styles.statusTextActive : styles.statusTextInActive} 
            />
          <Text style={status === 'Active' ? styles.statusTextActive : styles.statusTextInActive}>{ status }</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default AlertItem;