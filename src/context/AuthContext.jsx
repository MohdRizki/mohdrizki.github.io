import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdminAuth, setIsAdminAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAdminAuth(!!user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithPin = async (inputUser, inputPin) => {
    try {
      // Because we are using Email/Password, we can map "admin" to an email.
      // E.g., if inputUser is "admin", we use "admin@sdnpasirmae1.com"
      const email = inputUser.includes('@') ? inputUser : `${inputUser}@sdnpasirmae1.com`;
      
      if (inputUser === 'setup_admin') {
        // Special command to create the admin account
        await createUserWithEmailAndPassword(auth, 'admin@sdnpasirmae1.com', inputPin);
        return { success: true };
      }

      await signInWithEmailAndPassword(auth, email, inputPin);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'Username atau Password salah.' };
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    currentUser,
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
