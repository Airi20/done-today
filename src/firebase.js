// 必要なSDKだけimport
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase設定（これ1回だけ書く）
const firebaseConfig = {
  apiKey: "AIzaSyC9rXoOX40vqrlpVWXmzBfwAQ2-3GAQf1g",
  authDomain: "done-today-firebase.firebaseapp.com",
  projectId: "done-today-firebase",
  storageBucket: "done-today-firebase.firebasestorage.app",
  messagingSenderId: "598252744264",
  appId: "1:598252744264:web:c51bb07f7534d4b64bf27d",
  measurementId: "G-433BGS05SP"
};

// Firebase初期化も1回だけ
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firestoreの初期化
export const db = getFirestore(app);
