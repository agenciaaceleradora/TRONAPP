import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBWVg2Axo6FIKLu9G7K8UcywdVnfmMLUIo",
  authDomain: "tron-app-339ef.firebaseapp.com",
  projectId: "tron-app-339ef",
  storageBucket: "tron-app-339ef.firebasestorage.app",
  messagingSenderId: "758724020681",
  appId: "1:758724020681:web:668c165ca464568c59c018",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);