import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBiAVLLR5J4FhS-gEKr_r0pJgIFrEzNkc4",
  authDomain: "blufold.firebaseapp.com",
  projectId: "blufold",
  storageBucket: "blufold.firebasestorage.app",
  messagingSenderId: "487279636637",
  appId: "1:487279636637:web:0522e50521c4f47945e474",
  measurementId: "G-4T75NVSGDF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
