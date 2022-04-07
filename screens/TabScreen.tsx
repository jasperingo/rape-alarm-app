
import React, { useEffect, useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AlertsScreen from './AlertsScreen';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import { COLOR_PRIMARY } from '../assets/styles/config';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { AlertRepository } from '../repositories/AlertRepository';
import { useNotification } from '../hooks/notificationHook';
import { useUser } from '../hooks/userHook';
import { User } from 'firebase/auth';

const Tab = createBottomTabNavigator();

export type TabParamList = {
  Home: undefined;
  Send: undefined;
  Profile: undefined;
};

export type NavigationOnTabProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const TabScreen = () => {

  const user = useUser() as User;

  const sendNotification = useNotification();

  const api = useMemo(()=> new AlertRepository(), []);

  const timeOpened = useMemo(()=> Date.now(), []);

  useEffect(
    ()=> api.getCreated(
      (alert)=> {
        if (alert.userId !== user.uid && Number(alert.date) > timeOpened)
          sendNotification(alert);
      },
      console.log
    ),
    [api, timeOpened, user, sendNotification]
  );
  
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>

      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          tabBarIcon: ({ color, size })=> <Ionicons name='home' color={color} size={size} />,
          tabBarActiveTintColor: COLOR_PRIMARY 
        }}
        />

      <Tab.Screen 
        name="Alerts" 
        component={AlertsScreen} 
        options={{ 
          tabBarIcon: ({ color, size })=> <Ionicons name='megaphone' color={color} size={size} />,
          tabBarActiveTintColor: COLOR_PRIMARY 
        }} 
        />

      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          tabBarIcon: ({ color, size })=> <Ionicons name='person' color={color} size={size} />,
          tabBarActiveTintColor: COLOR_PRIMARY 
        }}
        />

    </Tab.Navigator>
  );
}

export default TabScreen;

