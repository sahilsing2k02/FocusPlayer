import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC-WO8nmGmvNRgD4gat27wTm2-Lravo0LM",
    authDomain: "focusplayer-3779d.firebaseapp.com",
    projectId: "focusplayer-3779d",
    storageBucket: "focusplayer-3779d.firebasestorage.app",
    messagingSenderId: "545439944116",
    appId: "1:545439944116:web:1a6a581a7c5713442036e1",
    measurementId: "G-Q9DR39BBEN"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
