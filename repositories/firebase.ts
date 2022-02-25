
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence } from 'firebase/auth/react-native';
import { initializeAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDddjx_hvqJxtv5PLTUP1DuHl-R8lKouQY",
  authDomain: "rape-alert-app.firebaseapp.com",
  projectId: "rape-alert-app",
  storageBucket: "rape-alert-app.appspot.com",
  messagingSenderId: "751445016329",
  databaseURL: "https://rape-alert-app-default-rtdb.firebaseio.com/",
  appId: "1:751445016329:web:e1a2af73ba2523754d1dd8"
};

const app = initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export default app;
