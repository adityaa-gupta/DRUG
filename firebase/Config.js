// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"; // Import getFirestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxX9ZwZiNNx7w7csecxmGgSrw4gm8-Sh8",
  authDomain: "drug-dealing-ee75f.firebaseapp.com",
  projectId: "drug-dealing-ee75f",
  storageBucket: "drug-dealing-ee75f.firebasestorage.app",
  messagingSenderId: "62349957737",
  appId: "1:62349957737:web:17ccd832cf60c55c38e0f8",
  measurementId: "G-6SRFJ928SN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app); // Authentication
export const db = getFirestore(app); // Firestore database
export const storage = getStorage(app); // Firebase Storage
