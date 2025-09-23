import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. إنشاء الـ Context
const ThemeContext = createContext();

// 2. إنشاء الـ Provider
export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme(); // يقرأ ثيم الجهاز (light/dark)
  const [theme, setTheme] = useState(systemTheme);

  // دالة لقراءة الثيم المحفوظ عند بدء تشغيل التطبيق
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme);
        } else {
          // إذا لم يكن هناك ثيم محفوظ، استخدم ثيم الجهاز
          setTheme(systemTheme);
        }
      } catch (error) {
        console.error('Failed to load theme from storage', error);
        setTheme(systemTheme);
      }
    };

    loadTheme();
  }, [systemTheme]);

  // دالة لتبديل الثيم وحفظه
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme to storage', error);
    }
  };

  // تعريف الألوان لكل ثيم
  const colors = {
    light: {
      background: '#F0F4F8',
      card: '#FFFFFF',
      text: '#1E1E1E',
      primary: '#183E9F',
      secondaryText: '#666',
      icon: '#333',
      statusBar: 'dark-content',
    },
    dark: {
      background: '#121212',
      card: '#1E1E1E',
      text: '#E0E0E0',
      primary: '#BB86FC',
      secondaryText: '#999',
      icon: '#FFFFFF',
      statusBar: 'light-content',
    },
  };

  const value = {
    theme,
    isDarkMode: theme === 'dark',
    colors: colors[theme],
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. إنشاء الـ Hook المخصص
export const useTheme = () => useContext(ThemeContext);
