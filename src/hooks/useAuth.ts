import { useState, useEffect } from 'react';
import { currentUser } from '../lib/demoData';
import { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setUser(currentUser);
      setLoading(false);
    }, 500);
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    // Demo signup - just set the current user
    setUser(currentUser);
    return { user: currentUser };
  };

  const signIn = async (email: string, password: string) => {
    // Demo signin - just set the current user
    setUser(currentUser);
    return { user: currentUser };
  };

  const signOut = async () => {
    setUser(null);
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };
}