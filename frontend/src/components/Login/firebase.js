// src/components/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAtiFhAfunpGY8629CKk3GHGBG-iYDinDk",
  authDomain: "bitlogger-47cbc.firebaseapp.com",
  projectId: "bitlogger-47cbc",
  storageBucket: "bitlogger-47cbc.firebasestorage.app",
  messagingSenderId: "647500910621",
  appId: "1:647500910621:web:02687b60ce6fd81b7d36f4",
  measurementId: "G-740KVT4X5M"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Set up Firebase Auth and Google Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ Export needed parts
export { auth, provider, signInWithPopup };
