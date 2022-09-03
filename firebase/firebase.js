// Firebase is used as off-chain data source to enable vault transfer notifications
// Ideally this would be queried on the UP, but couldn't figure it out in time
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPfK0qHKqu2zlCkKzgDJ5639x7d-KXOV8",
  authDomain: "marble-e61bd.firebaseapp.com",
  projectId: "marble-e61bd",
  storageBucket: "marble-e61bd.appspot.com",
  messagingSenderId: "18537690850",
  appId: "1:18537690850:web:8b2949fe38f87b27d610bb",
  measurementId: "G-ZDSLNGD91C",
};

const app = initializeApp(firebaseConfig);
export default getFirestore();
