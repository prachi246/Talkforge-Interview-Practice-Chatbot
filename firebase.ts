// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// 🔥 Firebase configuration is now set up with your project credentials.
const firebaseConfig = {
  apiKey: "AIzaSyA9NmHv0M7Hw_PBjScwn_CZ6wG6_7WGz18",
  authDomain: "talkforge-60f4c.firebaseapp.com",
  projectId: "talkforge-60f4c",
  storageBucket: "talkforge-60f4c.appspot.com",
  messagingSenderId: "862392261637",
  appId: "1:862392261637:web:7ce52e0deebb083d7e106c",
  measurementId: "G-NZGSX2KJTK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
