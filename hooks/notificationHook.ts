
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Subscription } from 'expo-modules-core';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { RootStackParamList } from '../App';
import Alert from '../models/Alert';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function schedulePushNotification(alert: Alert) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Someone just raised an alarm',
      body: 'Hurray and help if you can',
      data: { id: alert.id },
    },
    trigger: { seconds: 1 },
  });
}

export const useNotification = ()=> {

  const responseListener = useRef<Subscription>();
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Alert'>>();

  useEffect(
    () => {
      
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        navigation.navigate('Alert', { id: response.notification.request.content.data.id as string });
      });

      return () => {
        Notifications.removeNotificationSubscription(responseListener.current as Subscription);
      };
    }, 
    [navigation]
  );
  
  return async (alert: Alert)=> {
    await schedulePushNotification(alert);
  };
}

