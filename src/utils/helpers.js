// Helper Utilities
import { Alert, Platform } from 'react-native';
import moment from 'moment';

/**
 * Helper utility class
 */
class Helpers {
  
  /**
   * Format date to Arabic format
   * @param {Date|string} date - Date to format
   * @param {string} format - Date format
   * @returns {string} Formatted date
   */
  static formatDate(date, format = 'YYYY-MM-DD') {
    return moment(date).format(format);
  }

  /**
   * Format date to Arabic readable format
   * @param {Date|string} date - Date to format
   * @returns {string} Arabic formatted date
   */
  static formatDateArabic(date) {
    const momentDate = moment(date);
    const arabicMonths = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    const day = momentDate.date();
    const month = arabicMonths[momentDate.month()];
    const year = momentDate.year();
    
    return `${day} ${month} ${year}`;
  }

  /**
   * Format time to Arabic format
   * @param {Date|string} time - Time to format
   * @returns {string} Arabic formatted time
   */
  static formatTimeArabic(time) {
    return moment(time).format('HH:mm');
  }

  /**
   * Get relative time in Arabic
   * @param {Date|string} date - Date to format
   * @returns {string} Relative time
   */
  static getRelativeTimeArabic(date) {
    const now = moment();
    const targetDate = moment(date);
    const diff = now.diff(targetDate, 'minutes');

    if (diff < 1) {
      return 'الآن';
    } else if (diff < 60) {
      return `منذ ${diff} دقيقة`;
    } else if (diff < 1440) {
      const hours = Math.floor(diff / 60);
      return `منذ ${hours} ساعة`;
    } else {
      const days = Math.floor(diff / 1440);
      return `منذ ${days} يوم`;
    }
  }

  /**
   * Format currency
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code
   * @returns {string} Formatted currency
   */
  static formatCurrency(amount, currency = 'JOD') {
    const formatter = new Intl.NumberFormat('ar-JO', {
      style: 'currency',
      currency: currency
    });
    return formatter.format(amount);
  }

  /**
   * Format number with commas
   * @param {number} number - Number to format
   * @returns {string} Formatted number
   */
  static formatNumber(number) {
    return new Intl.NumberFormat('ar-JO').format(number);
  }

  /**
   * Capitalize first letter
   * @param {string} text - Text to capitalize
   * @returns {string} Capitalized text
   */
  static capitalize(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  /**
   * Capitalize each word
   * @param {string} text - Text to capitalize
   * @returns {string} Capitalized text
   */
  static capitalizeWords(text) {
    if (!text) return '';
    return text.split(' ').map(word => this.capitalize(word)).join(' ');
  }

  /**
   * Generate random string
   * @param {number} length - String length
   * @returns {string} Random string
   */
  static generateRandomString(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random number
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   */
  static generateRandomNumber(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Debounce function
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function} Debounced function
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in ms
   * @returns {Function} Throttled function
   */
  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Deep clone object
   * @param {any} obj - Object to clone
   * @returns {any} Cloned object
   */
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  }

  /**
   * Check if object is empty
   * @param {any} obj - Object to check
   * @returns {boolean} Is empty
   */
  static isEmpty(obj) {
    if (obj == null) return true;
    if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    return false;
  }

  /**
   * Get file extension
   * @param {string} filename - File name
   * @returns {string} File extension
   */
  static getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  /**
   * Get file size in human readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} Human readable size
   */
  static getFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Validate image file
   * @param {string} filename - File name
   * @returns {boolean} Is valid image
   */
  static isValidImageFile(filename) {
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const extension = this.getFileExtension(filename).toLowerCase();
    return validExtensions.includes(extension);
  }

  /**
   * Get device info
   * @returns {Object} Device information
   */
  static getDeviceInfo() {
    return {
      platform: Platform.OS,
      version: Platform.Version,
      isIOS: Platform.OS === 'ios',
      isAndroid: Platform.OS === 'android'
    };
  }

  /**
   * Show success alert
   * @param {string} title - Alert title
   * @param {string} message - Alert message
   * @param {Function} onPress - Callback function
   */
  static showSuccessAlert(title = 'نجح', message, onPress) {
    Alert.alert(title, message, [
      { text: 'موافق', onPress }
    ]);
  }

  /**
   * Show error alert
   * @param {string} title - Alert title
   * @param {string} message - Alert message
   * @param {Function} onPress - Callback function
   */
  static showErrorAlert(title = 'خطأ', message, onPress) {
    Alert.alert(title, message, [
      { text: 'موافق', onPress }
    ]);
  }

  /**
   * Show confirmation alert
   * @param {string} title - Alert title
   * @param {string} message - Alert message
   * @param {Function} onConfirm - Confirm callback
   * @param {Function} onCancel - Cancel callback
   */
  static showConfirmationAlert(title, message, onConfirm, onCancel) {
    Alert.alert(title, message, [
      { text: 'إلغاء', onPress: onCancel, style: 'cancel' },
      { text: 'موافق', onPress: onConfirm }
    ]);
  }

  /**
   * Generate QR code data
   * @param {string} data - Data to encode
   * @returns {string} QR code data
   */
  static generateQRCodeData(data) {
    return `data:image/png;base64,${data}`;
  }

  /**
   * Parse JSON safely
   * @param {string} jsonString - JSON string
   * @param {any} defaultValue - Default value if parsing fails
   * @returns {any} Parsed JSON or default value
   */
  static parseJSON(jsonString, defaultValue = null) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('JSON parse error:', error);
      return defaultValue;
    }
  }

  /**
   * Stringify JSON safely
   * @param {any} obj - Object to stringify
   * @param {string} defaultValue - Default value if stringifying fails
   * @returns {string} JSON string or default value
   */
  static stringifyJSON(obj, defaultValue = '{}') {
    try {
      return JSON.stringify(obj);
    } catch (error) {
      console.error('JSON stringify error:', error);
      return defaultValue;
    }
  }

  /**
   * Get initials from name
   * @param {string} name - Full name
   * @returns {string} Initials
   */
  static getInitials(name) {
    if (!name) return '';
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
  }

  /**
   * Truncate text
   * @param {string} text - Text to truncate
   * @param {number} length - Maximum length
   * @param {string} suffix - Suffix to add
   * @returns {string} Truncated text
   */
  static truncateText(text, length = 50, suffix = '...') {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + suffix;
  }

  /**
   * Remove HTML tags
   * @param {string} html - HTML string
   * @returns {string} Plain text
   */
  static stripHTML(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  /**
   * Generate UUID
   * @returns {string} UUID
   */
  static generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Check if value is null or undefined
   * @param {any} value - Value to check
   * @returns {boolean} Is null or undefined
   */
  static isNullOrUndefined(value) {
    return value === null || value === undefined;
  }

  /**
   * Check if value is null, undefined, or empty
   * @param {any} value - Value to check
   * @returns {boolean} Is null, undefined, or empty
   */
  static isNullOrEmpty(value) {
    return this.isNullOrUndefined(value) || value === '' || this.isEmpty(value);
  }
}

// Array utilities
export const arrayUtils = {
  /**
   * Remove duplicates from array
   * @param {Array} array - Array to process
   * @param {string} key - Key to check for duplicates
   * @returns {Array} Array without duplicates
   */
  removeDuplicates(array, key = null) {
    if (!key) {
      return [...new Set(array)];
    }
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  },

  /**
   * Group array by key
   * @param {Array} array - Array to group
   * @param {string} key - Key to group by
   * @returns {Object} Grouped object
   */
  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const value = item[key];
      if (!groups[value]) {
        groups[value] = [];
      }
      groups[value].push(item);
      return groups;
    }, {});
  },

  /**
   * Sort array by key
   * @param {Array} array - Array to sort
   * @param {string} key - Key to sort by
   * @param {string} order - Sort order (asc/desc)
   * @returns {Array} Sorted array
   */
  sortBy(array, key, order = 'asc') {
    return array.sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (order === 'desc') {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  },

  /**
   * Chunk array into smaller arrays
   * @param {Array} array - Array to chunk
   * @param {number} size - Chunk size
   * @returns {Array} Chunked array
   */
  chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
};

// String utilities
export const stringUtils = {
  /**
   * Convert to slug
   * @param {string} text - Text to convert
   * @returns {string} Slug
   */
  toSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  /**
   * Convert to camelCase
   * @param {string} text - Text to convert
   * @returns {string} CamelCase text
   */
  toCamelCase(text) {
    return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  },

  /**
   * Convert to PascalCase
   * @param {string} text - Text to convert
   * @returns {string} PascalCase text
   */
  toPascalCase(text) {
    return text.replace(/(?:^\w|[A-Z]|\b\w)/g, word => {
      return word.toUpperCase();
    }).replace(/\s+/g, '');
  }
};

export default Helpers;
