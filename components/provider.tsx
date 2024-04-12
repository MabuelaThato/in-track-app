"use client";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBxIwcnk2GLi3MTM1EUVTOYk9VJjTYqVHg",
    authDomain: "learner-management-syste-afdbf.firebaseapp.com",
    projectId: "learner-management-syste-afdbf",
    storageBucket: "learner-management-syste-afdbf.appspot.com",
    messagingSenderId: "761841546410",
    appId: "1:761841546410:web:a32770ab1d029db6cb8cd3",
    measurementId: "G-MNGT812XK3"
  };

// Initialize Firebase
getApps().length ? getApp() : initializeApp(firebaseConfig);

export const fireAuth = getAuth();

