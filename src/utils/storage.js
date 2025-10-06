// Storage Utilities
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER_DATA: 'userData',
  LANGUAGE: 'language',
  USER_ID: 'uId',
  ROLE: 'role',
  VISIT_ID: 'visit_id',
  THEME: 'theme',
  NOTIFICATIONS: 'notifications',
  LOCATION: 'location',
  SETTINGS: 'settings'
};

/**
 * Storage utility class
 */
class Storage {
  
  /**
   * Store data
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @returns {Promise<boolean>} Success status
   */
  static async setItem(key, value) {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
      return true;
    } catch (error) {
      console.error('Storage setItem error:', error);
      return false;
    }
  }

  /**
   * Get data
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if key doesn't exist
   * @returns {Promise<any>} Stored value or default
   */
  static async getItem(key, defaultValue = null) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) {
        return defaultValue;
      }
      
      // Try to parse as JSON, if fails return as string
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('Storage getItem error:', error);
      return defaultValue;
    }
  }

  /**
   * Remove data
   * @param {string} key - Storage key
   * @returns {Promise<boolean>} Success status
   */
  static async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage removeItem error:', error);
      return false;
    }
  }

  /**
   * Store multiple items
   * @param {Object} items - Key-value pairs to store
   * @returns {Promise<boolean>} Success status
   */
  static async setMultiple(items) {
    try {
      const entries = Object.entries(items).map(([key, value]) => [
        key,
        typeof value === 'string' ? value : JSON.stringify(value)
      ]);
      
      await AsyncStorage.multiSet(entries);
      return true;
    } catch (error) {
      console.error('Storage setMultiple error:', error);
      return false;
    }
  }

  /**
   * Get multiple items
   * @param {string[]} keys - Keys to retrieve
   * @returns {Promise<Object>} Key-value pairs
   */
  static async getMultiple(keys) {
    try {
      const values = await AsyncStorage.multiGet(keys);
      const result = {};
      
      values.forEach(([key, value]) => {
        if (value !== null) {
          try {
            result[key] = JSON.parse(value);
          } catch {
            result[key] = value;
          }
        }
      });
      
      return result;
    } catch (error) {
      console.error('Storage getMultiple error:', error);
      return {};
    }
  }

  /**
   * Remove multiple items
   * @param {string[]} keys - Keys to remove
   * @returns {Promise<boolean>} Success status
   */
  static async removeMultiple(keys) {
    try {
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (error) {
      console.error('Storage removeMultiple error:', error);
      return false;
    }
  }

  /**
   * Clear all storage
   * @returns {Promise<boolean>} Success status
   */
  static async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  /**
   * Get all keys
   * @returns {Promise<string[]>} All storage keys
   */
  static async getAllKeys() {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Storage getAllKeys error:', error);
      return [];
    }
  }

  /**
   * Check if key exists
   * @param {string} key - Storage key
   * @returns {Promise<boolean>} Key existence
   */
  static async hasKey(key) {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.includes(key);
    } catch (error) {
      console.error('Storage hasKey error:', error);
      return false;
    }
  }

  /**
   * Get storage size
   * @returns {Promise<number>} Storage size in bytes
   */
  static async getSize() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;
      
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += key.length + value.length;
        }
      }
      
      return totalSize;
    } catch (error) {
      console.error('Storage getSize error:', error);
      return 0;
    }
  }
}

// Token management utilities
export const tokenManager = {
  /**
   * Store authentication token
   * @param {string} token - Authentication token
   * @returns {Promise<boolean>} Success status
   */
  async setToken(token) {
    return await Storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  /**
   * Get authentication token
   * @returns {Promise<string|null>} Authentication token
   */
  async getToken() {
    return await Storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Remove authentication token
   * @returns {Promise<boolean>} Success status
   */
  async removeToken() {
    return await Storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Check if token exists
   * @returns {Promise<boolean>} Token existence
   */
  async hasToken() {
    const token = await this.getToken();
    return token !== null && token !== '';
  }
};

// User data management utilities
export const userDataManager = {
  /**
   * Store user data
   * @param {Object} userData - User data
   * @returns {Promise<boolean>} Success status
   */
  async setUserData(userData) {
    return await Storage.setItem(STORAGE_KEYS.USER_DATA, userData);
  },

  /**
   * Get user data
   * @returns {Promise<Object|null>} User data
   */
  async getUserData() {
    return await Storage.getItem(STORAGE_KEYS.USER_DATA);
  },

  /**
   * Remove user data
   * @returns {Promise<boolean>} Success status
   */
  async removeUserData() {
    return await Storage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  /**
   * Update user data
   * @param {Object} updates - Data updates
   * @returns {Promise<boolean>} Success status
   */
  async updateUserData(updates) {
    try {
      const currentData = await this.getUserData();
      if (currentData) {
        const updatedData = { ...currentData, ...updates };
        return await this.setUserData(updatedData);
      }
      return false;
    } catch (error) {
      console.error('Update user data error:', error);
      return false;
    }
  }
};

// Settings management utilities
export const settingsManager = {
  /**
   * Store settings
   * @param {Object} settings - Settings data
   * @returns {Promise<boolean>} Success status
   */
  async setSettings(settings) {
    return await Storage.setItem(STORAGE_KEYS.SETTINGS, settings);
  },

  /**
   * Get settings
   * @returns {Promise<Object>} Settings data
   */
  async getSettings() {
    return await Storage.getItem(STORAGE_KEYS.SETTINGS, {});
  },

  /**
   * Update setting
   * @param {string} key - Setting key
   * @param {any} value - Setting value
   * @returns {Promise<boolean>} Success status
   */
  async updateSetting(key, value) {
    try {
      const settings = await this.getSettings();
      settings[key] = value;
      return await this.setSettings(settings);
    } catch (error) {
      console.error('Update setting error:', error);
      return false;
    }
  }
};

// Language management utilities
export const languageManager = {
  /**
   * Store language preference
   * @param {string} language - Language code
   * @returns {Promise<boolean>} Success status
   */
  async setLanguage(language) {
    return await Storage.setItem(STORAGE_KEYS.LANGUAGE, language);
  },

  /**
   * Get language preference
   * @returns {Promise<string>} Language code
   */
  async getLanguage() {
    return await Storage.getItem(STORAGE_KEYS.LANGUAGE, 'ar');
  }
};

// Location management utilities
export const locationManager = {
  /**
   * Store location data
   * @param {Object} location - Location data
   * @returns {Promise<boolean>} Success status
   */
  async setLocation(location) {
    return await Storage.setItem(STORAGE_KEYS.LOCATION, location);
  },

  /**
   * Get location data
   * @returns {Promise<Object|null>} Location data
   */
  async getLocation() {
    return await Storage.getItem(STORAGE_KEYS.LOCATION);
  },

  /**
   * Remove location data
   * @returns {Promise<boolean>} Success status
   */
  async removeLocation() {
    return await Storage.removeItem(STORAGE_KEYS.LOCATION);
  }
};

// Clear all user data
export const clearUserData = async () => {
  try {
    await Storage.removeMultiple([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.ROLE,
      STORAGE_KEYS.VISIT_ID
    ]);
    return true;
  } catch (error) {
    console.error('Clear user data error:', error);
    return false;
  }
};

export default Storage;
