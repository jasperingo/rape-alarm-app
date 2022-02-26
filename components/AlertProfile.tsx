
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import NetInfo from "@react-native-community/netinfo";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { 
  COLOR_ERROR, 
  COLOR_PRIMARY, 
  COLOR_TEXT_INVERSE, 
  DIMENSION_LG, 
  DIMENSION_MD, 
  DIMENSION_SM, 
  DIMENSION_XL, 
  DIMENSION_XS, 
  DIMENSION_XXL, 
  FONT_BOLD 
} from '../assets/styles/config';
import { useUser, useUserFetch } from '../hooks/userHook';
import Alert from '../models/Alert';
import Loading from './Loading';
import LoadingError from './LoadingError';
import { NO_INTERNET_CONNECTION } from '../constants/errorCodes';
import { useErrorMessage } from '../hooks/errorHook';
import { useAlertUpdateStatus } from '../hooks/alertHook';

const styles = StyleSheet.create({
  address: {
    fontWeight: FONT_BOLD,
    fontSize: DIMENSION_XXL,
    marginBottom: DIMENSION_SM
  },

  location: {
    color: COLOR_PRIMARY,
    fontWeight: FONT_BOLD,
    fontSize: DIMENSION_MD,
    marginBottom: DIMENSION_SM
  },

  date: {
    fontSize: DIMENSION_MD,
    marginBottom: DIMENSION_SM
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSION_SM
  },

  status: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusButton: {
    padding: DIMENSION_XS,
    color: COLOR_TEXT_INVERSE,
    borderRadius: DIMENSION_XS,
    backgroundColor: COLOR_ERROR,
  },

  statusTextActive: {
    color: 'green'
  },

  statusTextInActive: {
    color: 'brown'
  },

  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSION_LG
  },

  map: {
    width: '100%',
    height: 400
  }
});


interface Props {
  alert: Alert;
  onStatusUpdate: ()=> void;
}

const AlertProfile = ({ alert: { id, userId, address, latitude, longitude, status, date }, onStatusUpdate }: Props) => {

  const userAuth = useUser();

  const errorMessage = useErrorMessage();

  const [
    user, 
    userLoading, 
    userError, 
    userCanLoad,
    userOnError
  ] = useUserFetch(userId ?? null);

  const [
    statusOnSubmit, 
    statusSuccess, 
    statusLoading, 
    statusError, 
    statusResetStatus
  ] = useAlertUpdateStatus();

  useEffect(
    ()=> {
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          userOnError(NO_INTERNET_CONNECTION);
        } else {
          userCanLoad();
        }
      });
    },
    [userOnError, userCanLoad]
  );

  useEffect(
    ()=> {
      if (statusSuccess) {
        onStatusUpdate();
        alert('Alert deactivated');
      }

      if (statusError !== null)
        alert(errorMessage(statusError));

      statusResetStatus();
    },
    [statusSuccess, statusError, errorMessage, statusResetStatus, onStatusUpdate]
  );
  
  const deactivate = ()=> {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        alert('No network connection');
      } else {
        statusOnSubmit({ id, userId, address, latitude, longitude, status, date });
      }
    });
  }
  
  return (
    <View>
      <Text style={styles.address}>{ address }</Text>
      <Text style={styles.location}>Latitude: {latitude} - Longitude: {longitude}</Text>
      <Text style={styles.date}>{ date }</Text>
      <View style={styles.statusContainer}>
        <View style={styles.status}>
          <Ionicons 
            size={DIMENSION_XL} 
            name={status === 'Active' ? 'checkmark-circle' : 'close-circle'} 
            style={status === 'Active' ? styles.statusTextActive : styles.statusTextInActive} 
            />
          <Text style={status === 'Active' ? styles.statusTextActive : styles.statusTextInActive}>{ status }</Text>
        </View>
        {
          (status === 'Active' && userId === userAuth?.uid) &&
          <TouchableOpacity activeOpacity={0.7} onPress={deactivate}>
            {
              statusLoading ?
              <ActivityIndicator size="small" color={COLOR_PRIMARY} />
              :
              <Text style={styles.statusButton}>Deactivate</Text>
            }
          </TouchableOpacity>
        }
      </View>
      
      {
        user !== null && 
        <>
          <View style={styles.userContainer}>
            <Ionicons 
              name='person' 
              size={DIMENSION_XL} 
              color={COLOR_PRIMARY} 
              />
            <Text>{ user.fullName }</Text>
          </View>
          <MapView 
            style={styles.map} 
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            >
              <Marker
                coordinate={{ latitude, longitude }}
                title={"Location of victim or incdent"}
                />
          </MapView>
        </>
      }

      {
        userLoading && <Loading />
      }

      {
        userError !== null && 
        <LoadingError 
          error={errorMessage(userError)}
          onReloadPress={userCanLoad}
          />
      }

    </View>
  );
}

export default AlertProfile;
