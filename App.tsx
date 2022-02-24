import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLOR_PRIMARY, COLOR_TEXT_INVERSE, DIMENSION_XL } from './assets/styles/config';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import { useFonts } from 'expo-font';
import SplashScreen from './screens/SplashScreen';
import RegisterScreen from './screens/RegisterScreen';

const Stack = createNativeStackNavigator();

const screenOptions: NativeStackNavigationOptions = {
  headerTitle: 'Rape Alert',
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

export default function App() {

  let [fontsLoaded] = useFonts({
    'AkayaTelivigala-Regular': require('./assets/fonts/AbrilFatface-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <SplashScreen />
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={screenOptions}>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Rape Alert' }} />
          <Stack.Screen name="Sign_up" component={RegisterScreen} options={{ title: 'Rape Alert' }} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

