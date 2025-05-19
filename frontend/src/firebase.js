import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };