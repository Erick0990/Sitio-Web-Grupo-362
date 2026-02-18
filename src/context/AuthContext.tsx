import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../supabaseClient';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  role: 'admin' | 'parent' | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ error: unknown }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<'admin' | 'parent' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRole = useCallback(async (userId: string) => {
    // Helper to fetch with timeout
    const fetchWithTimeout = (timeoutMs: number) => {
      return new Promise<{ data: { role: unknown } | null, error: any }>((resolve) => {
        const timeoutId = setTimeout(() => {
          resolve({ data: null, error: { message: 'Timeout' } });
        }, timeoutMs);

        supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single()
          .then((result) => {
            clearTimeout(timeoutId);
            // supabase .single() returns { data, error }
            // we need to cast or handle the type, assuming result structure matches
            resolve(result as any);
          })
          .catch((err) => {
            clearTimeout(timeoutId);
            resolve({ data: null, error: err });
          });
      });
    };

    const startTime = Date.now();
    const TIMEOUT = 5000;

    // Retry loop
    while (Date.now() - startTime < TIMEOUT) {
      const { data, error } = await fetchWithTimeout(2000); // 2s timeout per attempt

      if (data) {
        setRole(data.role as 'admin' | 'parent');
        setError(null);
        return;
      }

      // If error is not timeout, log it (could be RLS or missing row)
      if (error && error.message !== 'Timeout') {
        console.warn('Attempt failed:', error.message);
      }

      // Wait 1s before next retry, but don't oversleep the total timeout
      if (Date.now() - startTime < TIMEOUT) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    // One last attempt
    console.log('Profile fetch timed out, trying one last time...');
    const { data, error } = await fetchWithTimeout(3000); // 3s for last attempt

    if (data) {
      setRole(data.role as 'admin' | 'parent');
      setError(null);
    } else {
      console.error('Final profile fetch failed:', error);
      setRole(null);
      setError('Error de sincronización de perfil. Contacte al administrador');
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          if (initialSession?.user) {
            // This await ensures loading stays true until retries are done
            await fetchRole(initialSession.user.id);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      console.log('Auth state changed:', event);

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        // If we just signed in, we might need to wait for the trigger
        if (event === 'SIGNED_IN') {
             setLoading(true); // Ensure loading is true while we fetch/retry
        }
        await fetchRole(newSession.user.id);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchRole]);

  const login = async (email: string, password: string) => {
    setLoading(true); // Set loading true immediately on login attempt
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    // Note: onAuthStateChange will handle the success case (setting user, fetching role, setting loading false)
    if (error) {
        setLoading(false); // Only set loading false here if error, otherwise let the auth listener handle it
    }
    return { error };
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setRole(null);
    setUser(null);
    setSession(null);
    setError(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      role,
      loading,
      error,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
