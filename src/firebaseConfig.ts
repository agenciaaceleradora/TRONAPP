import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWVg2Axo6FIKLu9G7K8UcywdVnfmMLUIo",
  authDomain: "tron-app-339ef.firebaseapp.com",
  projectId: "tron-app-339ef",
  storageBucket: "tron-app-339ef.appspot.com",
  messagingSenderId: "758724020681",
  appId: "1:758724020681:web:668c165ca464568c59c018",
  measurementId: "G-954YPMYF85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Firestore indexes
const indexes = {
  webhooks: {
    fields: ['customer.email', 'processedAt'],
    queryScope: 'COLLECTION'
  }
};

export { indexes };