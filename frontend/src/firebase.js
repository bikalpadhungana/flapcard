// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBx_YrlBtvl5gJdTowLS-tpbgu5S0lZgVM",
  authDomain: "nfc-webpage.firebaseapp.com",
  projectId: "nfc-webpage",
  storageBucket: "nfc-webpage.appspot.com",
  messagingSenderId: "460092829444",
  appId: "1:460092829444:web:bb9d9271c30497d913aa51",
  measurementId: "G-5WP4R7XGRJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);