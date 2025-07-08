// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCSETBKYMO8TT7bMZwYSTPNAzFYpytIB5I",
    authDomain: "dataflowly.firebaseapp.com",
    projectId: "dataflowly",
    storageBucket: "dataflowly.firebasestorage.app",
    messagingSenderId: "644840046637",
    appId: "1:644840046637:web:d38081fc727da8212578a4",
    measurementId: "G-6Y5NQ3DFPZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();