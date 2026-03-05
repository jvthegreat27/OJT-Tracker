import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB7p1ahh0JOzmTX17Fn84-pa3bvmvovrr8",
  authDomain: "ojt-tracker-app-e64be.firebaseapp.com",
  projectId: "ojt-tracker-app-e64be",
  storageBucket: "ojt-tracker-app-e64be.firebasestorage.app",
  messagingSenderId: "293525615520",
  appId: "1:293525615520:web:d99e462806eb6e85cbeac5",
  measurementId: "G-J005J5YRQJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
