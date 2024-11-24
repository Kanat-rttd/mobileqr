import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAExMtAB6hTZy1ID-ZZDVbu8YEhhuuD0K4",
    authDomain: "qr-code-31975.firebaseapp.com",
    projectId: "qr-code-31975",
    storageBucket: "qr-code-31975.firebasestorage.app",
    messagingSenderId: "347575056343",
    appId: "1:347575056343:web:90c03282756d15ed733d92"
  };

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Экспорт аутентификации
export const auth = getAuth(app);

export const firestore = getFirestore(app);