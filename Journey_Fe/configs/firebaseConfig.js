// firebaseConfig.js
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA1l6xMfsFNdXpr4yRSShMMQZyxSOpC-ro",
  authDomain: "chatappjourney.firebaseapp.com",
  databaseURL: "https://chatappjourney-default-rtdb.firebaseio.com",
  projectId: "chatappjourney",
  storageBucket: "chatappjourney.appspot.com",
  messagingSenderId: "221724321449",
  appId: "1:221724321449:android:7bbd330916d3f80d2d2bb8",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
