import React from 'react';
import { NavigationContainer, NavigatorScreenParams  } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLOR_PRIMARY, COLOR_TEXT_INVERSE, DIMENSION_XL } from './assets/styles/config';
import LoginScreen from './screens/LoginScreen';
import { useFonts } from 'expo-font';
import SplashScreen from './screens/SplashScreen';
import RegisterScreen from './screens/RegisterScreen';
import TabScreen, { TabParamList } from './screens/TabScreen';
import AlertScreen from './screens/AlertScreen';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

const screenOptions: NativeStackNavigationOptions = {
  title: 'Rape Alert',
  headerStyle: {
    backgroundColor: COLOR_PRIMARY,
  },
  headerTintColor: COLOR_TEXT_INVERSE,
  headerTitleStyle: {
    fontSize: DIMENSION_XL,
    fontFamily: 'AkayaTelivigala-Regular',
  },
  headerTitleAlign: 'center',
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  Test: undefined;
  Alert: { id: string };
  Main: NavigatorScreenParams<TabParamList>;
};

export default function App() {

  const [fontsLoaded] = useFonts({
    'AkayaTelivigala-Regular': require('./assets/fonts/AbrilFatface-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <SplashScreen />
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen name="Main" component={TabScreen}  />
          <Stack.Screen name="SignIn" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={RegisterScreen} />
          <Stack.Screen name="Alert" component={AlertScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

