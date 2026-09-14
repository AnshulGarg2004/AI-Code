
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "ai-code-406b8.firebaseapp.com",
  projectId: "ai-code-406b8",
  storageBucket: "ai-code-406b8.firebasestorage.app",
  messagingSenderId: "852610695363",
  appId: "1:852610695363:web:0af5859a24933e2704e276",
  measurementId: "G-11VQW7YD2Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvdider =  new GoogleAuthProvider();