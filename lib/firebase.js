// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZg3evaATtP8drPgwa-hdiw0qkw115Gtk",
  authDomain: "bsdtest1981-634bc.firebaseapp.com",
  projectId: "bsdtest1981-634bc",
  storageBucket: "bsdtest1981-634bc.firebasestorage.app",
  messagingSenderId: "361854763143",
  appId: "1:361854763143:web:bab76761ba5a926d0ff822",
  measurementId: "G-1NJ68EYDSR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export { app, analytics };