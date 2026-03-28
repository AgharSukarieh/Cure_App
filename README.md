# CSC Pharmacy — تطبيق موبايل للصيدليات

**React Native mobile app** for pharmacy operations: sales, medical visits, reports, chat, and team workflows connected to a REST API.

---

## نظرة عامة

تطبيق **React Native** يخدم مسارَي العمل: **مبيعات الصيدلية** و**الزيارات الطبية**، مع لوحات تقارير، إدارة مخزون وطلبات، محادثات فورية (Pusher)، خرائط، مسح باركود، ودعم لغات متعددة. مناسب لعرضه في **GitHub** أو **السيرة الذاتية** كمشروع عملي يجمع واجهة موبايل، حالة عامة (Redux Toolkit)، ومصادقة مع API.

---

## الميزات الرئيسية

| المجال | الوصف |
|--------|--------|
| **المصادقة** | تسجيل دخول/تسجيل صيدلية، استعادة كلمة المرور (خطوات تحقق) |
| **المبيعات** | مبيعات يومية/أسبوعية/شهرية، تحصيل، مرتجعات، طلبات، مخزون، تقارير مبيعات |
| **طبي** | تقارير طبية، جدول يومي، تفاصيل رسوم بيانية، قوائم أطباء/عملاء |
| **تواصل** | شات، مجموعات، جهات، معاينة صور |
| **عام** | إشعارات، المزيد (لغة، ملف شخصي، FAQ، تواصل، من نحن)، Onboarding |
| **أخرى** | كاميرا/QR، موقع جغرافي، اختيار مستندات وصور، رسوم بيانية |

---

## التقنيات

- **React Native** `0.71` · **React** `18`
- **React Navigation** (Stack + Bottom Tabs + Material Top Tabs)
- **Redux Toolkit** + **React Redux**
- **Axios** (عميل API مع اعتراض للتوكن ومعالجة أخطاء)
- **i18next** / **react-i18next** (تعدد اللغات)
- **Pusher** (WebSockets للشات الفوري)
- **خرائط، رسوم بيانية، Lottie، Reanimated، Moti** وغيرها من مكتبات الواجهة

---

## المتطلبات

- **Node.js** (يُنصح بإصدار متوافق مع React Native 0.71)
- **JDK** و **Android Studio** (لتشغيل Android)
- لـ iOS (على macOS): **Xcode** و **CocoaPods**

---

## التثبيت والتشغيل

```bash
# استنساخ المستودع
git clone <repository-url>
cd Pharmacy

# تثبيت الحزم
npm install

# تشغيل Metro
npm start

# في نافذة أخرى — Android
npm run android

# iOS (على macOS)
cd ios && pod install && cd ..
npm run ios
```

---

## إعداد الـ API

عنوان الخادم مُعرَّف في **`src/config/apiConfig.js`** (`BASE_URL`). غيّره ليتطابق مع بيئتك (مثال: `https://your-domain.com/api/`).  
التطبيق يخزّن التوكن في **AsyncStorage** ويرسله تلقائياً مع الطلبات عبر **Bearer**.

> لا ترفع مفاتيح أو عناوين إنتاج حساسة إلى GitHub؛ استخدم متغيرات بيئة أو ملفات محلية مستثناة من Git إن لزم.

---

## هيكل المشروع (مختصر)

```
Pharmacy/
├── App.js                 # الملاحة الرئيسية والـ Providers
├── src/
│   ├── screens/           # الشاشات (Auth, Sales, Medical, Chat, More, ...)
│   ├── components/        # مكونات مشتركة
│   ├── contexts/          # سياق المصادقة وغيره
│   ├── config/            # إعدادات API والثوابت
│   ├── General/           # شريط التبويب السفلي وما شابه
│   └── ...
├── android/
└── ios/
```

---

## السكربتات

| الأمر | الوظيفة |
|--------|---------|
| `npm start` | تشغيل Metro bundler |
| `npm run android` | بناء وتشغيل على Android |
| `npm run ios` | بناء وتشغيل على iOS |
| `npm test` | تشغيل الاختبارات (Jest) |
| `npm run lint` | فحص ESLint |

---
