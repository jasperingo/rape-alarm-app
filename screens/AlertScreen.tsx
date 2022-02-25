
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAlertFetch } from '../hooks/alertHook';
import LoadingError from '../components/LoadingError';
import Loading from '../components/Loading';
import { useErrorMessage } from '../hooks/errorHook';
import { NO_INTERNET_CONNECTION } from '../constants/errorCodes';
import { 
  COLOR_PRIMARY,
  DIMENSION_LG,
  DIMENSION_MD, 
  DIMENSION_SM, 
  DIMENSION_XL, 
  DIMENSION_XXL, 
  FONT_BOLD 
} from '../assets/styles/config';
import { useUserFetch } from '../hooks/userHook';
import MapView, { Marker } from 'react-native-maps';

const styles = StyleSheet.create({
  container: {
    padding: DIMENSION_SM,
  },

  location: {
    fontWeight: FONT_BOLD,
    fontSize: DIMENSION_XXL,
    marginBottom: DIMENSION_SM
  },

  date: {
    fontSize: DIMENSION_MD,
    marginBottom: DIMENSION_SM
  },

  status: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DIMENSION_SM
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

export type ParamList = {
  Alert: { id: string }
};

const AlertScreen = () => {

  const errorMessage = useErrorMessage();

  const [alert, loading, error, canLoad, onError] = useAlertFetch();

  const [
    user, 
    userLoading, 
    userError, 
    userCanLoad
  ] = useUserFetch(alert?.userId ?? null);

  useEffect(
    ()=> {
      NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          onError(NO_INTERNET_CONNECTION);
        } else {
          canLoad();
        }
      });
    },
    []
  );

  useEffect(
    ()=> {
      if (alert !== null) userCanLoad();
    },
    [alert]
  );

  return (
    <View style={styles.container}>

      {
        alert !== null && 
        <View>
          <Text style={styles.location}>Latitude: {alert.latitude} - Longitude: {alert.longitude}</Text>
          <Text style={styles.date}>{ alert.date }</Text>
          <View style={styles.status}>
            <Ionicons 
              size={DIMENSION_XL} 
              name={alert.status === 'Active' ? 'checkmark-circle' : 'close-circle'} 
              style={alert.status === 'Active' ? styles.statusTextActive : styles.statusTextInActive} 
              />
            <Text style={alert.status === 'Active' ? styles.statusTextActive : styles.statusTextInActive}>{ alert.status }</Text>
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
                  latitude: alert.latitude,
                  longitude: alert.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                >
                  <Marker
                    coordinate={{ latitude: alert.latitude, longitude: alert.longitude }}
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
      }

      {
        loading && <Loading />
      }

      {
        error !== null && 
        <LoadingError 
          error={errorMessage(error)}
          onReloadPress={canLoad}
          />
      }

    </View>
  );
}

export default AlertScreen;
