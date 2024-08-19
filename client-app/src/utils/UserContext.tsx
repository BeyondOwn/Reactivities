'use client'
import { User } from '@/app/models/user';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import agent from './agent';


interface UserContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('jwt');
      if (token) {
        try {
          const userData = await agent.Account.current(); // Make API call to get user info
          setUser(userData);
        } catch (err) {
          setError(err as Error); // Cast to Error
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};