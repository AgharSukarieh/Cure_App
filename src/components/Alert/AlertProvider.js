import React, { useRef, useState, useCallback } from 'react';
import { View } from 'react-native';
import AlertComponent from './AlertComponent';

// إنشاء Context
export const AlertContext = React.createContext(null);

let alertId = 0;

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback((alertProps) => {
    const id = alertId++;
    const newAlert = {
      id,
      visible: true,
      ...alertProps,
    };
    
    setAlerts(prev => [...prev, newAlert]);
    
    return id;
  }, []);

  const hideAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const updateAlert = useCallback((id, updates) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, ...updates } : alert
      )
    );
  }, []);

  // دوال مساعدة للأنواع المختلفة
  const showSuccess = useCallback((title, message, options = {}) => {
    return showAlert({
      type: 'success',
      title,
      message,
      duration: 3000,
      ...options,
    });
  }, [showAlert]);

  const showError = useCallback((title, message, options = {}) => {
    return showAlert({
      type: 'error',
      title,
      message,
      duration: 4000,
      ...options,
    });
  }, [showAlert]);

  const showWarning = useCallback((title, message, options = {}) => {
    return showAlert({
      type: 'warning',
      title,
      message,
      duration: 3500,
      ...options,
    });
  }, [showAlert]);

  const showInfo = useCallback((title, message, options = {}) => {
    return showAlert({
      type: 'info',
      title,
      message,
      duration: 3000,
      ...options,
    });
  }, [showAlert]);

  const showConfirm = useCallback((title, message, onConfirm, options = {}) => {
    return showAlert({
      type: 'confirm',
      title,
      message,
      onConfirm,
      ...options,
    });
  }, [showAlert]);

  const handleClose = useCallback((id) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, visible: false } : alert
      )
    );
    
    // إزالة اليرت بعد انتهاء الأنيميشن
    setTimeout(() => {
      hideAlert(id);
    }, 300);
  }, [hideAlert]);

  const alertMethods = {
    showAlert,
    hideAlert,
    updateAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };

  return (
    <AlertContext.Provider value={alertMethods}>
      {children}
      <View pointerEvents="box-none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
        {alerts.map((alert, index) => (
          <AlertComponent
            key={alert.id}
            {...alert}
            onClose={() => handleClose(alert.id)}
          />
        ))}
      </View>
    </AlertContext.Provider>
  );
};

// Hook للاستخدام في الكومبوننت
export const useAlert = () => {
  const context = React.useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

