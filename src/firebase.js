// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// 🔹 Replace with your Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCHLBpn9D_BGax9QK4z_mJN6UGci1F500E",
    authDomain: "classmates-attempt2.firebaseapp.com",
    databaseURL: "https://classmates-attempt2-default-rtdb.firebaseio.com",
    projectId: "classmates-attempt2",
    storageBucket: "classmates-attempt2.appspot.com",
    messagingSenderId: "903358081736",
    appId: "1:903358081736:web:4de32d4fea0be1384913fd",
    measurementId: "G-15GVQWXLTT"
  };
  

// 🔹 Initialize Firebase App
const app = initializeApp(firebaseConfig);

// 🔹 Export Firebase Services
export const auth = getAuth(app);         // Authentication
export const analytics = getAnalytics(app);      // Firestore Database
export default app;

