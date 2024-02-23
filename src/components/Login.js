import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app"; // Add this line if not already in your firebase-config
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Corrected import
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './Login.css';
import { firebaseConfig } from '../firebase/firebase-config'; // Ensure firebaseConfig is exported from your config

const app = initializeApp(firebaseConfig); // Initialize Firebase App
const auth = getAuth(app); // Initialize Auth
const db = getFirestore(app); // Initialize Firestore

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // Redirect based on user role
        checkUserRoleAndRedirect(user.uid);
      }
    });
    return () => unsubscribe(); // Cleanup subscription
  }, []);

  const checkUserRoleAndRedirect = async (userId) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The redirection is handled in the onAuthStateChanged listener
    } catch (error) {
      console.error("Error logging in:", error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
