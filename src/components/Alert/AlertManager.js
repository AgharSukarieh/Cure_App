import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import AlertComponent from './AlertComponent';

let alertId = 0;

const AlertManager = () => {
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
      ...options,
    });
  }, [showAlert]);

  const showError = useCallback((title, message, options = {}) => {
    return showAlert({
      type: 'error',
      title,
      message,
      ...options,
    });
  }, [showAlert]);

  const showWarning = useCallback((title, message, options = {}) => {
    return showAlert({
      type: 'warning',
      title,
      message,
      ...options,
    });
  }, [showAlert]);

  const showInfo = useCallback((title, message, options = {}) => {
    return showAlert({
      type: 'info',
      title,
      message,
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

  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9999 }}>
      {alerts.map((alert, index) => (
        <AlertComponent
          key={alert.id}
          {...alert}
          onClose={() => handleClose(alert.id)}
          position={alert.position || (index === 0 ? 'top' : `top-${index * 80 + 80}`)}
        />
      ))}
    </View>
  );
};

// إنشاء context للإدارة
const AlertContext = React.createContext(null);

export { AlertManager, AlertContext };
export default AlertManager;

