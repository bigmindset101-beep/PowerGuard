import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Import Firestore
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBYx4p16l3KfH68rIPRFycqQwPpLhdFNX0",
  authDomain: "powerguard-077.firebaseapp.com",
  projectId: "powerguard-077",
  storageBucket: "powerguard-077.firebasestorage.app",
  messagingSenderId: "171061347706",
  appId: "1:171061347706:web:3e54156ce3415f836d82c3",
  measurementId: "G-3HYMEWXSDG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);

const db = getFirestore(app);

// Google provider
const googleProvider = new GoogleAuthProvider();

// Export Firebase authentication functions
export {
  auth,
  db,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
};
