import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBYbyvScz_UdHKnD-OdjmNSuy4YnOEImM4",
    authDomain: "guitar-helper-app.firebaseapp.com",
    projectId: "guitar-helper-app",
    storageBucket: "guitar-helper-app.firebasestorage.app",
    messagingSenderId: "52668804004",
    appId: "1:52668804004:web:cd72b5545551df6049ef31",
    measurementId: "G-60JR1MNWK8"
  };

export const app = initializeApp(firebaseConfig);
