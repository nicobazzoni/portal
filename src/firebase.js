import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWZOAOwOIHv_MVopB_rxHf4mZBRhbizkw",
  authDomain: "mediaman-a8ba1.firebaseapp.com",
  projectId: "mediaman-a8ba1",
  storageBucket: "mediaman-a8ba1.appspot.com",
  messagingSenderId: "609976652760",
  appId: "1:609976652760:web:2aa5c419c1ce8c4f2258ad"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { auth, db, storage, functions };
