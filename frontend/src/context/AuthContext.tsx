import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { loginApi, getMeApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('quantguard_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function verifyExistingToken() {
      const storedToken = localStorage.getItem('quantguard_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      try {
        const { user } = await getMeApi();
        setUser(user);
        setToken(storedToken);
      } catch (e) {
        console.warn('Session expired or invalid token:', e);
        localStorage.removeItem('quantguard_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    verifyExistingToken();
  }, []);

  const login = async (username: string, pass: string) => {
    const res = await loginApi(username, pass);
    localStorage.setItem('quantguard_token', res.access_token);
    setToken(res.access_token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('quantguard_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
