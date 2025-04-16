import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBYbyvScz_UdHKnD-OdjmNSuy4YnOEImM4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "guitar-helper-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "guitar-helper-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "guitar-helper-app.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "52668804004",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:52668804004:web:cd72b5545551df6049ef31",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-60JR1MNWK8"
};

export const app = initializeApp(firebaseConfig);
