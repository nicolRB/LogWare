// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBiCGxr3MdKL2lVIDnAn3ac9RPczTsvn-Q",
  authDomain: "logware-7f896.firebaseapp.com",
  projectId: "logware-7f896",
  storageBucket: "logware-7f896.appspot.com",
  messagingSenderId: "1055666425094",
  appId: "1:1055666425094:web:e062007f6e73ce91576287"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);