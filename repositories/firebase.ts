// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
