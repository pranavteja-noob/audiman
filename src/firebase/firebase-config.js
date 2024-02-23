// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAZF4Nlw0y7sgaE3IgIhdgs7qxj8LkQwQI",
    authDomain: "auditorium-management-system.firebaseapp.com",
    projectId: "auditorium-management-system",
    storageBucket: "auditorium-management-system.appspot.com",
    messagingSenderId: "20442681527",
    appId: "1:20442681527:web:d01d902e87557beabbfd32",
    measurementId: "G-RZM4RX3F80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// Export the services for use in your app
export { db, auth, analytics, firebaseConfig };
