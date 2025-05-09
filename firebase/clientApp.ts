
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { envCredentials } from "./envConfigurations";
const firebaseConfig = {
    apiKey: "AIzaSyDnyWUYeFZnu_vpvhqjlU2XCjMjCX6TA1s",
    authDomain: "api-sam-4f725.firebaseapp.com",
    projectId: "api-sam-4f725",
    storageBucket: "api-sam-4f725.firebasestorage.app",
    messagingSenderId: "129939381722",
    appId: "1:129939381722:web:eee1a80e1b544a7c3434e3",
    measurementId: "G-Q25R7XSSD8"
  };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

console.log(envCredentials())