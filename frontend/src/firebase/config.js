// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcPVoBA1AGJZih9KYfi6OAcwRFuisQudc",
  authDomain: "hawkeye-cb7ea.firebaseapp.com",
  projectId: "hawkeye-cb7ea",
  storageBucket: "hawkeye-cb7ea.firebasestorage.app",
  messagingSenderId: "781787360581",
  appId: "1:781787360581:web:09f73fe9691c3137fae22c",
  measurementId: "G-V00X8QYQ92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser and production)
let analytics = null;
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}

// Initialize Firestore
const db = getFirestore(app);

export { app, analytics, db };

