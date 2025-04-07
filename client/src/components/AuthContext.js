import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
  
    if (storedUser) {
      setIsAuthenticated(true);
  
      fetch('http://localhost:5000/check-auth', {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
          }
        })
        .catch(err => {
          console.error('Failed to fetch user info:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsAuthenticated(true);
  
    fetch('http://localhost:5000/check-auth', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(userData); 
        }
      })
      .catch(err => {
        console.error('Failed to fetch full user data after login:', err);
        setUser(userData);
      });
  };

  const logout = () => {
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);

    fetch('http://localhost:5000/logout', {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Logout failed on server');
        console.log('Logged out from backend');
      })
      .catch((err) => console.error('Logout error:', err));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
