// import { initializeApp, getApps } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getDatabase, ref, get, push, set } from "firebase/database";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyDM93120Ba-eBBO2sYTWI9htHCOrgkPgN8",
//   authDomain: "chordify-2e659.firebaseapp.com",
//   projectId: "chordify-2e659",
//   storageBucket: "chordify-2e659.appspot.com",
//   messagingSenderId: "271734174990",
//   appId: "1:271734174990:web:3733790be87253e33dd35f",
//   measurementId: "G-Z9KG64HFL5",
// };

// const app =
//   getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// const auth = getAuth(app);

// const rtdb = getDatabase(app);

// const db = getFirestore(app);

// export { auth, rtdb, ref, get, push, set, db };

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, push, set } from "firebase/database";
import { getFirestore } from "firebase/firestore";
console.log("🔑 API Key from .env:", process.env.REACT_APP_FIREBASE_API_KEY);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const rtdb = getDatabase(app);
const db = getFirestore(app);

export { auth, rtdb, ref, get, push, set, db };
