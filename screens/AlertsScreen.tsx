
import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { useNetInfo } from "@react-native-community/netinfo";
import { DIMENSION_XXS } from '../assets/styles/config';
import AlertItem from '../components/AlertItem';
import { useAlertListFetch } from '../hooks/alertHook';
import { useErrorMessage } from '../hooks/errorHook';
import { useRenderListFooter } from '../hooks/renderHook';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import LoadingEmpty from '../components/LoadingEmpty';
import { NO_INTERNET_CONNECTION } from '../constants/errorCodes';
import Loading from '../components/Loading';
import LoadingError from '../components/LoadingError';


const AlertsScreen = () => {

  const network = useNetInfo();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Main'>>();

  const errorMessage = useErrorMessage();

  const renderFooter = useRenderListFooter();

  const [
    fetchAlerts, 
    list, 
    loading, 
    loaded, 
    refreshing, 
    error, 
    setError, 
    onRefresh,
    retryFetch
  ] = useAlertListFetch();

  useEffect(
    ()=> {
      if (!network.isConnected && !loaded && error === null)
        setError(NO_INTERNET_CONNECTION);
      else if (network.isConnected && !loaded && !loading) 
        fetchAlerts();
    },
    [loaded, network.isConnected, error, loading, fetchAlerts, setError]
  );
  
  return (
    <FlatList 
      data={list}
      onRefresh={onRefresh}
      refreshing={refreshing}
      style={{ paddingTop: DIMENSION_XXS }}
      renderItem={({ item })=> (
        <AlertItem 
          alert={item} 
          onPress={()=> navigation.navigate('Alert', { id: item.id as string })} 
          />
      )}
      keyExtractor={(item)=> String(item.id)}
      ListFooterComponent={renderFooter([
        {
          canRender: loading,
          render: ()=> <Loading />
        },
        {
          canRender: error !== null,
          render: ()=> <LoadingError error={errorMessage(error)} onReloadPress={retryFetch} />
        },
        {
          canRender: loaded && list.length === 0,
          render: ()=> <LoadingEmpty text='No alert found' />
        }
      ])}
      />
  );
}

export default AlertsScreen;
