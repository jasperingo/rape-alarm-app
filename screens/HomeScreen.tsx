
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import AlertItem from '../components/AlertItem';
import { DIMENSION_SM } from '../assets/styles/config';
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

const styles = StyleSheet.create({
  container: {
    padding: DIMENSION_SM
  }
});

const HomeScreen = () => {

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
          if (!state.isConnected) {
            onError(NO_INTERNET_CONNECTION);
          } else {
            canLoad();
          }
        });
      }
    },
    []
  );
  
  return (
    <View style={styles.container}>
      <FlatList 
        data={list}
        onRefresh={onRefresh}
        refreshing={refreshing}
        renderItem={({ item })=> (
          <AlertItem alert={item} onPress={()=> navigation.navigate('Alert', { id: item.id as string })} />
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
        ])}
        />
    </View>
  );
}

export default HomeScreen;
