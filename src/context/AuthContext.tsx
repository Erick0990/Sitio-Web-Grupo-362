import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { auth, db } from '../firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext<any | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null); // For backwards compatibility if needed
  const [role, setRole] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setSession(firebaseUser ? { user: firebaseUser } : null);

      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRole(userData.role);
            setStatus(userData.status);
          } else {
            // Unlikely to happen if we create it on signUp, but just in case
            setRole(null);
            setStatus(null);
          }
        } catch (err: any) {
          console.error("Error fetching user data:", err);
          setError(err.message);
        }
      } else {
        setRole(null);
        setStatus(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Fetch role directly to return it, matching the old Supabase flow pattern in Login.tsx
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      let userRole = null;
      let userStatus = null;

      if (userDoc.exists()) {
        const userData = userDoc.data();
        userRole = userData.role;
        userStatus = userData.status;
      }

      return {
        error: null,
        role: userRole,
        status: userStatus
      };
    } catch (err: any) {
      return { error: err, role: null, status: null };
    }
  };

  const signUp = async (email: string, password: string, options?: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        role: 'parent',
        status: 'pending',
        createdAt: serverTimestamp(),
        // Save extra data if passed like full_name
        ...(options?.data?.full_name && { full_name: options.data.full_name })
      });

      return { error: null, data: { user: userCredential.user } };
    } catch (err: any) {
      return { error: err, data: null };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setRole(null);
      setStatus(null);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  return (
    <AuthContext.Provider value={{
      user: user ? { ...user, id: user.uid } : null, // Backwards compatibility for user.id
      session,
      role,
      status,
      loading,
      error,
      login,
      signUp,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
