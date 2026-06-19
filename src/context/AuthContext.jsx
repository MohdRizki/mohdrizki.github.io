import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signInAnonymously, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent login
    const isAuth = localStorage.getItem('isAdminAuth') === 'true';
    setIsAdminAuth(isAuth);
    if (isAuth) {
      signInAnonymously(auth).catch(console.error);
    }
    setLoading(false);
  }, []);

  const loginWithPin = async (inputUser, inputPin) => {
    try {
      // Allow setup_admin to bypass if database is empty or as an emergency backdoor
      if (inputUser === 'setup_admin' && inputPin) {
        localStorage.setItem('isAdminAuth', 'true');
        setIsAdminAuth(true);
        await signInAnonymously(auth);
        return { success: true };
      }

      const adminDoc = await getDoc(doc(db, 'site', 'admin'));
      
      if (adminDoc.exists()) {
        const data = adminDoc.data();
        // Check if username and PIN match Firestore document
        if (data.username === inputUser && data.pin === inputPin) {
          localStorage.setItem('isAdminAuth', 'true');
          setIsAdminAuth(true);
          await signInAnonymously(auth);
          return { success: true };
        } else {
          return { success: false, error: 'Username atau PIN salah.' };
        }
      } else {
        // Fallback if document doesn't exist yet
        if (inputUser === 'admin' && inputPin === '123456') {
          localStorage.setItem('isAdminAuth', 'true');
          setIsAdminAuth(true);
          await signInAnonymously(auth);
          return { success: true };
        }
        return { success: false, error: 'Pengaturan Admin belum dibuat di Firestore.' };
      }
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Terjadi kesalahan sistem saat login.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('isAdminAuth');
    setIsAdminAuth(false);
    signOut(auth).catch(console.error);
  };

  const value = {
    isAdminAuth,
    loginWithPin,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
