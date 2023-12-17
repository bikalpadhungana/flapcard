// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "flap-7766c.firebaseapp.com",
  projectId: "flap-7766c",
  storageBucket: "flap-7766c.appspot.com",
  messagingSenderId: "796296778242",
  appId: "1:796296778242:web:35feb157457a8777be0d1b",
  measurementId: "G-QD8H61466X"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);