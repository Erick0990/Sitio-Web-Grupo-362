
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

const AuthContext = createContext<any | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user] = useState({ id: "mock-id", email: "admin@example.com" });
  const [session] = useState(null);
  const [role] = useState("admin");
  const [status] = useState("approved");
  const [loading] = useState(false);
  const [error] = useState(null);

  const login = async () => ({ error: null, role: "admin", status: "approved" });
  const signUp = async () => ({ error: null, data: {} });
  const logout = async () => {};

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
