import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBPkiTDPsJ7Zuk2w1TtINtJG-JU2tKraw",
  authDomain: "whatsappclone-e19a1.firebaseapp.com",
  databaseURL: "https://whatsappclone-e19a1-default-rtdb.firebaseio.com",
  projectId: "whatsappclone-e19a1",
  storageBucket: "whatsappclone-e19a1.appspot.com",
  messagingSenderId: "51964871385",
  appId: "1:51964871385:web:a1c56fb9914c8d0fde34c8",
  measurementId: "G-R0BS4MPGBJ",
};
const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

export const auth = app.auth();
export const db = app.firestore();
export default app;
export const provider = new firebase.auth.GoogleAuthProvider();
