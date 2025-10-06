// Validation Utilities
import { Alert } from 'react-native';

/**
 * Validation utility class
 */
class Validators {
  
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid email
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   * @param {string} phone - Phone number to validate
   * @returns {boolean} Is valid phone
   */
  static isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result
   */
  static validatePassword(password) {
    const result = {
      isValid: false,
      errors: []
    };

    if (password.length < 8) {
      result.errors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
    }

    if (!/[A-Z]/.test(password)) {
      result.errors.push('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل');
    }

    if (!/[a-z]/.test(password)) {
      result.errors.push('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل');
    }

    if (!/\d/.test(password)) {
      result.errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      result.errors.push('كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل');
    }

    result.isValid = result.errors.length === 0;
    return result;
  }

  /**
   * Validate required fields
   * @param {Object} data - Data to validate
   * @param {string[]} requiredFields - Required field names
   * @returns {Object} Validation result
   */
  static validateRequired(data, requiredFields) {
    const result = {
      isValid: true,
      errors: {}
    };

    requiredFields.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        result.isValid = false;
        result.errors[field] = `${field} مطلوب`;
      }
    });

    return result;
  }

  /**
   * Validate string length
   * @param {string} value - Value to validate
   * @param {number} minLength - Minimum length
   * @param {number} maxLength - Maximum length
   * @returns {boolean} Is valid length
   */
  static isValidLength(value, minLength, maxLength) {
    if (typeof value !== 'string') return false;
    return value.length >= minLength && value.length <= maxLength;
  }

  /**
   * Validate number range
   * @param {number} value - Value to validate
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {boolean} Is valid range
   */
  static isValidRange(value, min, max) {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
  }

  /**
   * Validate date format
   * @param {string} date - Date to validate
   * @param {string} format - Expected format (YYYY-MM-DD, DD/MM/YYYY, etc.)
   * @returns {boolean} Is valid date
   */
  static isValidDate(date, format = 'YYYY-MM-DD') {
    if (!date) return false;
    
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj);
  }

  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} Is valid URL
   */
  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate Arabic text
   * @param {string} text - Text to validate
   * @returns {boolean} Is Arabic text
   */
  static isArabicText(text) {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text);
  }

  /**
   * Validate English text
   * @param {string} text - Text to validate
   * @returns {boolean} Is English text
   */
  static isEnglishText(text) {
    const englishRegex = /^[a-zA-Z\s]+$/;
    return englishRegex.test(text);
  }

  /**
   * Validate numeric value
   * @param {any} value - Value to validate
   * @returns {boolean} Is numeric
   */
  static isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  /**
   * Validate positive number
   * @param {any} value - Value to validate
   * @returns {boolean} Is positive number
   */
  static isPositiveNumber(value) {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  }

  /**
   * Validate integer
   * @param {any} value - Value to validate
   * @returns {boolean} Is integer
   */
  static isInteger(value) {
    return Number.isInteger(Number(value));
  }

  /**
   * Validate credit card number
   * @param {string} cardNumber - Card number to validate
   * @returns {boolean} Is valid card number
   */
  static isValidCreditCard(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    const cardRegex = /^\d{13,19}$/;
    return cardRegex.test(cleaned);
  }

  /**
   * Validate CVV
   * @param {string} cvv - CVV to validate
   * @returns {boolean} Is valid CVV
   */
  static isValidCVV(cvv) {
    const cvvRegex = /^\d{3,4}$/;
    return cvvRegex.test(cvv);
  }

  /**
   * Validate postal code
   * @param {string} postalCode - Postal code to validate
   * @param {string} country - Country code
   * @returns {boolean} Is valid postal code
   */
  static isValidPostalCode(postalCode, country = 'JO') {
    const patterns = {
      JO: /^\d{5}$/,
      US: /^\d{5}(-\d{4})?$/,
      UK: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
      CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i
    };
    
    const pattern = patterns[country] || /^\d{5}$/;
    return pattern.test(postalCode);
  }
}

// Form validation utilities
export const formValidators = {
  /**
   * Validate login form
   * @param {Object} data - Form data
   * @returns {Object} Validation result
   */
  validateLogin(data) {
    const errors = {};

    if (!data.email || !Validators.isValidEmail(data.email)) {
      errors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!data.password || data.password.length < 6) {
      errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Validate registration form
   * @param {Object} data - Form data
   * @returns {Object} Validation result
   */
  validateRegistration(data) {
    const errors = {};

    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'الاسم يجب أن يكون حرفين على الأقل';
    }

    if (!data.email || !Validators.isValidEmail(data.email)) {
      errors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!data.phone || !Validators.isValidPhone(data.phone)) {
      errors.phone = 'رقم الهاتف غير صحيح';
    }

    if (!data.password || data.password.length < 8) {
      errors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    }

    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'كلمة المرور غير متطابقة';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Validate doctor form
   * @param {Object} data - Form data
   * @returns {Object} Validation result
   */
  validateDoctor(data) {
    const errors = {};

    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'اسم الطبيب مطلوب';
    }

    if (!data.specialty_id) {
      errors.specialty_id = 'التخصص مطلوب';
    }

    if (!data.phone || !Validators.isValidPhone(data.phone)) {
      errors.phone = 'رقم الهاتف غير صحيح';
    }

    if (!data.city_id) {
      errors.city_id = 'المدينة مطلوبة';
    }

    if (!data.area_id) {
      errors.area_id = 'المنطقة مطلوبة';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Validate pharmacy form
   * @param {Object} data - Form data
   * @returns {Object} Validation result
   */
  validatePharmacy(data) {
    const errors = {};

    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'اسم الصيدلية مطلوب';
    }

    if (!data.phone || !Validators.isValidPhone(data.phone)) {
      errors.phone = 'رقم الهاتف غير صحيح';
    }

    if (!data.city_id) {
      errors.city_id = 'المدينة مطلوبة';
    }

    if (!data.area_id) {
      errors.area_id = 'المنطقة مطلوبة';
    }

    if (!data.address || data.address.trim().length < 5) {
      errors.address = 'العنوان يجب أن يكون 5 أحرف على الأقل';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Validate product form
   * @param {Object} data - Form data
   * @returns {Object} Validation result
   */
  validateProduct(data) {
    const errors = {};

    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'اسم المنتج مطلوب';
    }

    if (!data.price || !Validators.isPositiveNumber(data.price)) {
      errors.price = 'السعر يجب أن يكون رقم موجب';
    }

    if (!data.quantity || !Validators.isInteger(data.quantity) || data.quantity < 0) {
      errors.quantity = 'الكمية يجب أن تكون رقم صحيح غير سالب';
    }

    if (!data.category_id) {
      errors.category_id = 'الفئة مطلوبة';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Validate order form
   * @param {Object} data - Form data
   * @returns {Object} Validation result
   */
  validateOrder(data) {
    const errors = {};

    if (!data.pharmacy_id) {
      errors.pharmacy_id = 'الصيدلية مطلوبة';
    }

    if (!data.products || data.products.length === 0) {
      errors.products = 'يجب اختيار منتج واحد على الأقل';
    }

    if (data.products) {
      data.products.forEach((product, index) => {
        if (!product.product_id) {
          errors[`products.${index}.product_id`] = 'المنتج مطلوب';
        }
        if (!product.quantity || product.quantity < 1) {
          errors[`products.${index}.quantity`] = 'الكمية يجب أن تكون 1 على الأقل';
        }
      });
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

// Show validation errors
export const showValidationErrors = (errors) => {
  const errorMessages = Object.values(errors).filter(Boolean);
  if (errorMessages.length > 0) {
    Alert.alert('خطأ في التحقق', errorMessages.join('\n'));
  }
};

// Show single validation error
export const showValidationError = (message) => {
  Alert.alert('خطأ في التحقق', message);
};

export default Validators;
