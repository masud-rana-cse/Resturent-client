import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import app from "../firebase/firebase.init";
import { AuthProvider } from "../Provider/authProvider";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthContext = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, (currentUser) => {
      // console.log(currentUser)
      setUser(currentUser);
      setLoading(true);
    });
    return () => subscribe();
  }, []);

  const userInfo = {
    user,
    loading,
  };
  return (
    <AuthProvider.Provider value={userInfo}>{children}</AuthProvider.Provider>
  );
};

export default AuthContext;
