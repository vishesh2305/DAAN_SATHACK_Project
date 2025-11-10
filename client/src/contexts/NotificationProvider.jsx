// src/contexts/NotificationProvider.jsx

import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

// --- THIS IS THE FIX ---
export const useNotification = () => useContext(NotificationContext);
// --- END FIX ---

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    message: '',
    type: 'info',
    show: false,
  });

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, show: false }));
  }, []);

  const showNotification = useCallback(
    (message, type = 'info', duration = 4000) => {
      setNotification({ message, type, show: true });
      
      // Automatically hide after the duration
      setTimeout(() => {
        hideNotification();
      }, duration);
    },
    [hideNotification]
  );

  return (
    <NotificationContext.Provider
      value={{ notification, showNotification, hideNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};