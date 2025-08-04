// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEqFX-XVDxr6EZGeN3sdr591IevQrhvz8",
  authDomain: "ps-dashboard-dc8c1.firebaseapp.com",
  projectId: "ps-dashboard-dc8c1",
  storageBucket: "ps-dashboard-dc8c1.firebasestorage.app",
  messagingSenderId: "964559045561",
  appId: "1:964559045561:web:4e655cb24ebad580ee6c68",
  measurementId: "G-TKNEFQQFBR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
const analytics = getAnalytics(app);