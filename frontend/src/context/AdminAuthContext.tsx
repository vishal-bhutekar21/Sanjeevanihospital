import React, { createContext, useContext, useState } from 'react';
import { ADMIN_TOKEN_KEY, ADMIN_USER_KEY } from '../lib/api';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  hospitalId: string;
  hospitalName: string;
}

interface AdminAuthContextType {
  token: string | null;
  admin: AdminUser | null;
  isAuthenticated: boolean;
  login: (token: string, admin: AdminUser) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_KEY));
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem(ADMIN_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const login = (newToken: string, newAdmin: AdminUser) => {
    setToken(newToken);
    setAdmin(newAdmin);
    localStorage.setItem(ADMIN_TOKEN_KEY, newToken);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(newAdmin));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        admin,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
