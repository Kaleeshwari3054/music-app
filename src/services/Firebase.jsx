import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyDM93120Ba-eBBO2sYTWI9htHCOrgkPgN8",
  authDomain: "chordify-2e659.firebaseapp.com",
  projectId: "chordify-2e659",
  storageBucket: "chordify-2e659.appspot.com",
  messagingSenderId: "271734174990",
  appId: "1:271734174990:web:3733790be87253e33dd35f",
  measurementId: "G-Z9KG64HFL5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const db = getFirestore(app); 
export { auth, db };
