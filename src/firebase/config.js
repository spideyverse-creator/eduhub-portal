import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDj2YanXobgI0ts_GEoUF7th7gMLBivGOo",
  authDomain: "eduhub-portal-69b74.firebaseapp.com",
  projectId: "eduhub-portal-69b74",
  storageBucket: "eduhub-portal-69b74.firebasestorage.app",
  messagingSenderId: "84025911603",
  appId: "1:84025911603:web:7607adaeca72e2c7607646",
  measurementId: "G-8VNCK0HJRD"
};

const app = initializeApp(firebaseConfig);

// Services export karo
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);