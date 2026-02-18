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

  const fetchRole = useCallback(async (userId: string, retryCount = 0) => {
    try {
      // Reset error on start of fetch/retry chain
      if (retryCount === 0) setError(null);

      const { data, error: queryError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (queryError) {
        // If error is PGRST116 (JSON object requested, multiple (or no) rows returned), it usually means no profile found.
        console.warn(`Attempt ${retryCount + 1}: Error fetching role:`, queryError.message);
      }

      if (data) {
        setRole(data.role as 'admin' | 'parent');
        setError(null);
        return; // Success
      }

      // Retry logic: 3 attempts with 500ms pause
      const maxRetries = 3;
      if (retryCount < maxRetries) {
        console.log(`Profile not found, retrying in 500ms... (Attempt ${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 500));
        return fetchRole(userId, retryCount + 1);
      } else {
        console.error('Max retries reached. Profile not found.');
        setRole(null);
        setError('Error al cargar perfil de usuario. Por favor intenta de nuevo.');
      }

    } catch (err) {
      console.error('Unexpected error fetching role:', err);
      setRole(null);
      setError('Error inesperado al cargar perfil.');
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
