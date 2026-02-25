import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../supabaseClient';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import type { UserRole, UserStatus } from '../types/database';

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  role: UserRole | null;
  status: UserStatus | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ error: unknown; role?: UserRole | null; status?: UserStatus | null }>;
  signUp: (email: string, password: string) => Promise<{ error: unknown; data?: { user: SupabaseUser | null; session: Session | null } }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [status, setStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (userId: string): Promise<{ role: UserRole | null, status: UserStatus | null }> => {
    // Helper to fetch with timeout
    const fetchWithTimeout = (timeoutMs: number) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new Promise<{ data: { role: unknown; status: unknown } | null, error: any }>((resolve) => {
        const timeoutId = setTimeout(() => {
          resolve({ data: null, error: { message: 'Timeout' } });
        }, timeoutMs);

        supabase
          .from('profiles')
          .select('role, status')
          .eq('id', userId)
          .single()
          .then((result) => {
            clearTimeout(timeoutId);
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
        const newRole = data.role as UserRole;
        // Default to pending if status is missing/null (though DB default should handle it)
        const newStatus = (data.status as UserStatus) || 'pending';

        setRole(newRole);
        setStatus(newStatus);
        setError(null);
        return { role: newRole, status: newStatus };
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
      const newRole = data.role as UserRole;
      const newStatus = (data.status as UserStatus) || 'pending';
      setRole(newRole);
      setStatus(newStatus);
      setError(null);
      return { role: newRole, status: newStatus };
    } else {
      console.error('Final profile fetch failed:', error);
      setRole(null);
      setStatus(null);
      setError('Error de sincronización de perfil. Contacte al administrador');
      return { role: null, status: null };
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
                .select('role, status')
                .eq('id', initialSession.user.id)
                .single();

              if (!isActive) return;
              if (error) throw error;

              if (mounted && isActive && data) {
                setRole(data.role as UserRole);
                setStatus((data.status as UserStatus) || 'pending');
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
          setStatus(null);
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
        await fetchProfile(newSession.user.id);
      } else {
        setRole(null);
        setStatus(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const login = async (email: string, password: string) => {
    setLoading(true); // Set loading true immediately on login attempt
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
        setLoading(false);
        return { error };
    }

    // Explicitly fetch role here to return it to the caller for immediate redirection
    if (data.user) {
      const { role: userRole, status: userStatus } = await fetchProfile(data.user.id);
      return { error: null, role: userRole, status: userStatus };
    }

    return { error: null };
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // If you need to redirect or pass data, do it here
      }
    });

    if (error) {
      setLoading(false);
      return { error };
    }

    // We don't fetch profile here immediately because the trigger takes a moment.
    // The onAuthStateChange will pick it up, or the user will be logged in and then fetchProfile will run.
    setLoading(false);
    return { error: null, data };
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setRole(null);
    setStatus(null);
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
