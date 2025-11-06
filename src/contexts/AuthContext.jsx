import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Dummy user data
const DEMO_USER = {
  id: 'admin-user-1',
  name: 'Admin',
  email: 'admin@gmail.com',
  company: 'Precision Agriculture',
  phone: '+62 812-3456-7890',
  role: 'Admin',
};

const DEMO_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: 'admin123',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('agri-user');
        const isAuth = localStorage.getItem('agri-authenticated');

        if (storedUser && isAuth === 'true') {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check credentials
      if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        setUser(DEMO_USER);
        setIsAuthenticated(true);
        localStorage.setItem('agri-user', JSON.stringify(DEMO_USER));
        localStorage.setItem('agri-authenticated', 'true');
        toast.success('Login successful!');
        return { success: true, user: DEMO_USER };
      } else {
        toast.error('Incorrect email or password');
        return { success: false, error: 'Incorrect email or password' };
      }
    } catch (error) {
      toast.error('An error occurred during login');
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const register = async (formData) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // For demo, just log them in
      const newUser = {
        ...DEMO_USER,
        name: formData.name || DEMO_USER.name,
        email: formData.email || DEMO_USER.email,
      };

      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('agri-user', JSON.stringify(newUser));
      localStorage.setItem('agri-authenticated', 'true');
      toast.success('Registration successful!');
      return { success: true, user: newUser };
    } catch (error) {
      toast.error('An error occurred during registration');
      return { success: false, error: 'An error occurred during registration' };
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('agri-user');
      localStorage.removeItem('agri-authenticated');
      toast.success('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('agri-user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
      return { success: true, user: updatedUser };
    } catch (error) {
      toast.error('Failed to update profile');
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // For demo, just show success
      toast.success('Password changed successfully');
      return { success: true };
    } catch (error) {
      toast.error('Failed to change password');
      return { success: false, error: 'Failed to change password' };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
