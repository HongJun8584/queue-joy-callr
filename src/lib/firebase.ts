import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDiRGvkQbnLlpnJT3fEEQrY1A3nwLVIFY0",
  authDomain: "queue-joy-aa21b.firebaseapp.com",
  databaseURL: "https://queue-joy-aa21b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "queue-joy-aa21b",
  storageBucket: "queue-joy-aa21b.appspot.com",
  messagingSenderId: "950240394209",
  appId: "1:950240394209:web:78d4f2471d2d89ac91f0a0"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
