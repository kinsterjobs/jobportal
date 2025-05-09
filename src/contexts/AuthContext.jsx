
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('jobhub_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // For demo purposes, we'll use hardcoded users
    // In a real app, this would be an API call
    const users = JSON.parse(localStorage.getItem('jobhub_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Don't store password in currentUser
      const { password, ...userWithoutPassword } = user;
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
    // For demo purposes, we'll store users in localStorage
    // In a real app, this would be an API call
    const users = JSON.parse(localStorage.getItem('jobhub_users') || '[]');
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      toast({
        title: "Registration failed",
        description: "Email already in use",
        variant: "destructive",
      });
      return false;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role,
      createdAt: new Date().toISOString(),
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem('jobhub_users', JSON.stringify(users));
    
    // Log in the user
    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('jobhub_user', JSON.stringify(userWithoutPassword));
    
    toast({
      title: "Registration successful",
      description: "Your account has been created",
    });
    
    return true;
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
