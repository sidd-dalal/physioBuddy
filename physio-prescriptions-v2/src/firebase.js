// firebase.js — init Firebase & export Firestore helpers + Auth
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'  // <--- ADD THIS

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)  

export {
  db,
  auth,                   
  doc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc
}
