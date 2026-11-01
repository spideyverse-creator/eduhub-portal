// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ 
            id: firebaseUser.uid, 
            email: firebaseUser.email, 
            ...userDoc.data(),
            completedResources: userDoc.data().completedResources || [] // Default empty array
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // src/context/AuthContext.jsx
const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    
    if (!userDoc.exists()) {
      return { success: false, error: "User data not found in database." };
    }
    
    return { success: true, role: userDoc.data()?.role };
  } catch (error) {
    console.error(error);
    let errMsg = "Login failed. Please try again.";
    
    if (error.code === 'auth/user-not-found') {
      errMsg = "No account found with this email.";
    } else if (error.code === 'auth/wrong-password') {
      errMsg = "Incorrect password. Please try again.";
    } else if (error.code === 'auth/invalid-email') {
      errMsg = "Please enter a valid email address.";
    } else if (error.code === 'auth/too-many-requests') {
      errMsg = "Too many failed attempts. Please try again later.";
    }
    
    return { success: false, error: errMsg };
  }
};

  const logout = () => {
    signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);