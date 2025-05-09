import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import db from '@/lib/db';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('jobhub_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?');
    const user = stmt.get(email, password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('jobhub_user', JSON.stringify(userWithoutPassword));
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
      return true;
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = (name, email, password, role = 'jobseeker') => {
    try {
      const stmt = db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)');
      const userId = Date.now().toString();
      stmt.run(userId, name, email, password, role);
      
      const user = {
        id: userId,
        name,
        email,
        role,
      };
      
      setCurrentUser(user);
      localStorage.setItem('jobhub_user', JSON.stringify(user));
      
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
      
      return true;
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        toast({
          title: "Registration failed",
          description: "Email already in use",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration failed",
          description: "An error occurred during registration",
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('jobhub_user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};