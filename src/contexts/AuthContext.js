import React, {createContext, useContext, useState, useEffect} from 'react';
import Constants from '../config/globalConstants';
const AuthContext = createContext();
import {
  storeJsonData,
  getStoreJsonData,
  removeStoreData,
} from '../helper/GeneralStorage';
import {
  post,
  clearAuthToken,
  setAuthToken
} from '../WebService/RequestBuilder';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    await getStoreJsonData(Constants.storageTokenKeyName).then(data => {
      if (data) {
        setToken(data);
        setAuthToken(data);
        setIsLoggedIn(true);
      }
    });
    await getStoreJsonData(Constants.userData).then(data => {
      if (data) {
        setUser(data);
      }
    });
    await getStoreJsonData(Constants.role).then(data => {
      if (data) {
        setRole(data);
      }
    });
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    await post(Constants.auth.login, {email, password})
      .then(res => {
        const token = res.token;
        const userData = res.user;
        const role = res.user.role;

        storeJsonData(Constants.storageTokenKeyName, token);
        storeJsonData(Constants.userData, userData);
        storeJsonData(Constants.role, role);

        setToken(token);
        setAuthToken(token);
        setUser(userData);
        setRole(role);
        setIsLoggedIn(true);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const logout = async () => {
    setIsLoading(true);
    await post(Constants.auth.logout)
      .then(res => {
        removeStoreData(Constants.storageTokenKeyName);
        removeStoreData(Constants.userData);
        removeStoreData(Constants.role);

        clearAuthToken();
        setToken(null);
        setIsLoggedIn(false);
        setUser(null);
        setRole(null);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    setIsLoading(false);
  };

  const authContextValue = {
    isLoading,
    isLoggedIn,
    token,
    user,
    role,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
