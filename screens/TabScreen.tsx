
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SendScreen from './SendScreen';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import { COLOR_PRIMARY } from '../assets/styles/config';
import { useUser } from '../hooks/userHook';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { AlertRepository } from '../repositories/AlertRepository';
import { useNotification } from '../hooks/notificationHook';

const Tab = createBottomTabNavigator();

export type TabParamList = {
  Home: undefined;
  Send: undefined;
  Profile: undefined;
};

export type NavigationOnTabProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const TabScreen = () => {

  const user = useUser();

  const navigation = useNavigation<NavigationOnTabProp>();

  const sendNotification = useNotification();

  useEffect(
    ()=> {
      if (user !== null) {
        
        const unsubscribe = (new AlertRepository()).getNew((alert)=> {
          if (alert.userId !== user.uid)
            sendNotification(alert);
        });

        return unsubscribe;
      }
    },
    [navigation, user, sendNotification]
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
        name="Send" 
        component={SendScreen} 
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

