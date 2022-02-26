
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { useAlertFetch } from '../hooks/alertHook';
import LoadingError from '../components/LoadingError';
import Loading from '../components/Loading';
import { useErrorMessage } from '../hooks/errorHook';
import { NO_INTERNET_CONNECTION } from '../constants/errorCodes';
import { DIMENSION_SM } from '../assets/styles/config';
import AlertProfile from '../components/AlertProfile';

const styles = StyleSheet.create({
  container: {
    padding: DIMENSION_SM,
  }
});

export type ParamList = {
  Alert: { id: string }
};

const AlertScreen = () => {

  const errorMessage = useErrorMessage();

  const [
    alert, 
    loading, 
    error, 
    canLoad, 
    onError, 
    onStatusUpdate
  ] = useAlertFetch();

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
    [onError, canLoad]
  );

  return (
    <View style={styles.container}>

      {
        alert !== null && 
        <AlertProfile alert={alert} onStatusUpdate={onStatusUpdate} />
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
