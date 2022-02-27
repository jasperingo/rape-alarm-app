
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import AlertItem from '../components/AlertItem';
import { useAlertListFetch } from '../hooks/alertHook';
import { NO_INTERNET_CONNECTION } from '../constants/errorCodes';
import Loading from '../components/Loading';
import LoadingError from '../components/LoadingError';
import { useErrorMessage } from '../hooks/errorHook';
import { useRenderListFooter } from '../hooks/renderHook';
import { useUser } from '../hooks/userHook';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import LoadingEmpty from '../components/LoadingEmpty';
import { DIMENSION_XXS } from '../assets/styles/config';


const HomeScreen = () => {

  const [started, setStarted] = useState(false);

  const user = useUser();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Main'>>();

  const errorMessage = useErrorMessage();

  const renderFooter = useRenderListFooter();

  const [
    list, 
    loading, 
    refreshing,
    error, 
    canLoad, 
    onError, 
    onRefresh
  ] = useAlertListFetch();

  useEffect(
    ()=> {
      if (user !== null) {
        NetInfo.fetch().then(state => {
          setStarted(true);
          if (!state.isConnected) {
            onError(NO_INTERNET_CONNECTION);
          } else {
            canLoad();
          }
        });
      }
    },
    [user, onError, canLoad]
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
      onEndReached={canLoad}
      ListFooterComponent={renderFooter([
        {
          canRender: loading,
          render: ()=> <Loading />
        },
        {
          canRender: error !== null,
          render: ()=> <LoadingError error={errorMessage(error)} onReloadPress={canLoad} />
        },
        {
          canRender: !loading &&  error === null && list.length === 0 && started,
          render: ()=> <LoadingEmpty text='No alert found' />
        }
      ])}
      />
  );
}

export default HomeScreen;
