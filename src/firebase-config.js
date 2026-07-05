import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCHcwpz_8uczqdtXfcVVd4_Cbr5N6zxUA4",
    authDomain: "skill-forge-651fa.firebaseapp.com",
    projectId: "skill-forge-651fa",
    storageBucket: "skill-forge-651fa.firebasestorage.app",
    messagingSenderId: "320880636007",
    appId: "1:320880636007:web:d8e31dfadd95c83c56e4c2",
    measurementId: "G-VFVZXYE3CP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);