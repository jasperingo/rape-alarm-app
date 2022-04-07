
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNetInfo } from "@react-native-community/netinfo";
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

  const network = useNetInfo();

  const errorMessage = useErrorMessage();

  const [
    fetchAlert, 
    alert, 
    loading, 
    error, 
    setError, 
    onStatusUpdate, 
    retryFetch
  ] = useAlertFetch();

  useEffect(
    ()=> {
      if (!network.isConnected && alert === null && error === null) {
        setError(NO_INTERNET_CONNECTION);
      } else if (network.isConnected && alert === null && !loading) {
        fetchAlert();
      }
    },
    [network.isConnected, loading, alert, error, setError, fetchAlert]
  );

  return (
    <ScrollView>
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
            onReloadPress={retryFetch}
            />
        }
      </View>
    </ScrollView>
  );
}

export default AlertScreen;
