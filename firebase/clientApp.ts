import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAb6T_fBWi1vRy3JmAsLriEP69ejCV5WIc",
  authDomain: "apifirebase-e635f.firebaseapp.com",
  databaseURL: "https://apifirebase-e635f-default-rtdb.firebaseio.com",
  projectId: "apifirebase-e635f",
  storageBucket: "apifirebase-e635f.firebasestorage.app",
  messagingSenderId: "624768811993",
  appId: "1:624768811993:web:60eff9ae6e1d6c88f4cfc8",
  measurementId: "G-YZJDT4PBPZ"
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };