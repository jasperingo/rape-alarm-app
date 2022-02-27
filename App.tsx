import React, { useEffect, useState } from 'react';
import { NavigationContainer, NavigatorScreenParams, useNavigation  } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { COLOR_PRIMARY, COLOR_TEXT_INVERSE, DIMENSION_XL } from './assets/styles/config';
import LoginScreen from './screens/LoginScreen';
import { useFonts } from 'expo-font';
import RegisterScreen from './screens/RegisterScreen';
import TabScreen, { TabParamList } from './screens/TabScreen';
import AlertScreen from './screens/AlertScreen';
import { StatusBar } from 'expo-status-bar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from './repositories/firebase';

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


const Screen = ({ signedIn }: { signedIn: boolean })=> {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Main'>>();

  useEffect(
    () => {
      if (!signedIn) {
        navigation.reset({ 
          index: 0,
          routes: [{ name: 'SignIn' }]
        });
      }
    }, 
    [signedIn, navigation]
  );
  
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Main" component={TabScreen} />
      <Stack.Screen name="SignIn" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={RegisterScreen} />
      <Stack.Screen name="Alert" component={AlertScreen} />
    </Stack.Navigator>
  );
}

const App = ()=> {

  const [signedIn, setSignedIn] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    'AkayaTelivigala-Regular': require('./assets/fonts/AbrilFatface-Regular.ttf'),
  });

  useEffect(
    () => {
      (async ()=> {
        try {
          
          await SplashScreen.preventAutoHideAsync();

          const auth = getAuth(app);
          onAuthStateChanged(auth, (user) => {
            if (user !== null) {
              setSignedIn(true);
            }
            
            setAppIsReady(true);
          });

        } catch (e) {
          console.warn(e);
          setAppIsReady(true);
        }
      })();
    }, 
    []
  );

  useEffect(
    () => {
      if (appIsReady) {
        (async ()=> await SplashScreen.hideAsync())();
      }
    }, 
    [appIsReady]
  );

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Screen signedIn={signedIn} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
