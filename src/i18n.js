import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// استيراد ملفات الترجمة
import en from '../locales/en/translation.json';
import ar from '../locales/ar/translation.json';

const STORE_LANGUAGE_KEY = 'user-language';

// --- 2. إنشاء كاشف لغة مخصص ---
const languageDetector = {
  type: 'languageDetector',
  async: true, // مهم جدًا
  detect: async (callback) => {
    try {
      // قراءة اللغة المحفوظة من AsyncStorage
      const savedLang = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
      if (savedLang) {
        // إذا وجدنا لغة محفوظة، نستخدمها
        return callback(savedLang);
      } else {
        // إذا لم نجد، نعتمد على اتجاه الجهاز كخيار افتراضي
        const defaultLang = I18nManager.isRTL ? 'ar' : 'en';
        return callback(defaultLang);
      }
    } catch (error) {
      // في حال حدوث خطأ، نستخدم الإنجليزية كخيار آمن
      console.error('Error detecting language:', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: (language) => {
    // هذه الدالة يمكنها حفظ اللغة تلقائيًا، لكننا سنقوم بذلك يدويًا
  },
};

i18n
  .use(languageDetector) // --- 3. استخدام كاشف اللغة المخصص
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    // --- 4. إزالة `lng` من هنا، لأن الكاشف سيقوم بتحديدها ---
    // lng: I18nManager.isRTL ? 'ar' : 'en', 
    fallbackLng: 'en',
    debug: __DEV__, // إضافة debug في وضع التطوير
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    // إضافة إعدادات إضافية لضمان عمل الترجمة
    load: 'languageOnly',
    cleanCode: true,
    nonExplicitSupportedLngs: true,
  });

export default i18n;
