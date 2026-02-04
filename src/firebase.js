// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1tgpRvnsrD6fCmOlJc_ZvQ74jA8JPbgY",
  authDomain: "announcement-7694d.firebaseapp.com",
  projectId: "announcement-7694d",
  storageBucket: "announcement-7694d.firebasestorage.app",
  messagingSenderId: "49904401527",
  appId: "1:49904401527:web:32230735347d448a44da72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth =getAuth(app);