// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// 🔹 Replace with your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBONYLVsNL1StzsJbPSx3D6aRTx5HJaf8s",
  authDomain: "classmates-7c915.firebaseapp.com",
  databaseURL: "https://classmates-7c915-default-rtdb.firebaseio.com",
  projectId: "classmates-7c915",
  storageBucket: "classmates-7c915.appspot.com",
  messagingSenderId: "205707966122",
  appId: "1:205707966122:web:cc94d3f4c32f7cb932c2d3",
  measurementId: "G-30E1QT8SRF"
};
  

// 🔹 Initialize Firebase App
const app = initializeApp(firebaseConfig);

// 🔹 Export Firebase Services
export const auth = getAuth(app);         // Authentication
export const analytics = getAnalytics(app); 
export const database = getDatabase(app); 
export { RecaptchaVerifier, signInWithPhoneNumber };     // Firestore Database
export default app;

