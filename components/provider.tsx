"use client";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAz-QMg1d3M-gP2BRR1vp0RLURKXNpYBk",
  authDomain: "in-track-c09ce.firebaseapp.com",
  projectId: "in-track-c09ce",
  storageBucket: "in-track-c09ce.appspot.com",
  messagingSenderId: "415495409378",
  appId: "1:415495409378:web:465b3883e694c5632298bb",
  measurementId: "G-ELLH1G9H1W"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const fireAuth = getAuth();
export const storage = getStorage(app)
export const db = getFirestore(app);
