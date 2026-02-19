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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            resolve(result as any);
          }, (err) => {
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
      // FAIL-SAFE IMPLEMENTATION: 3-second timeout
      let isActive = true;
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          isActive = false;
          reject(new Error('TIMEOUT_EXCEEDED'));
        }, 3000);
      });

      try {
        await Promise.race([
          (async () => {
            const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();

            if (!isActive) return;
            if (sessionError) throw sessionError;

            if (mounted && isActive) {
              setSession(initialSession);
              setUser(initialSession?.user ?? null);
            }

            if (initialSession?.user) {
              // Direct profile fetch for initial load to respect the strict timeout
              const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', initialSession.user.id)
                .single();

              if (!isActive) return;
              if (error) throw error;

              if (mounted && isActive && data) {
                setRole(data.role as 'admin' | 'parent');
              }
            }
          })(),
          timeoutPromise
        ]);
      } catch (error) {
        isActive = false;
        console.error('Auth initialization fail-safe triggered:', error);
        // Force cleanup on failure or timeout
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.error('Error signing out:', e);
        }

        if (mounted) {
          setUser(null);
          setSession(null);
          setRole(null);
        }
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
