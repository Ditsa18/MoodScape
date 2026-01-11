// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";   // <-- YOU FORGOT THIS

const firebaseConfig = {
  apiKey: "AIzaSyB48_UxC1Aq7YUF8pLNXYq4ulVWAmAbRQ4",
  authDomain: "moodscape-457e7.firebaseapp.com",
  projectId: "moodscape-457e7",
  storageBucket: "moodscape-457e7.appspot.com",
  messagingSenderId: "478019469318",
  appId: "1:478019469318:web:7bea745aff347078700387",
  measurementId: "G-NXMBQB80KP"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);     // <-- Now works correctly
