# إعداد Google Maps API

## ✅ تم إعداد الملفات بنجاح

### 1. Android (تم الإعداد)
- ✅ `android/app/src/main/AndroidManifest.xml` - تم إضافة API key
- ✅ الأذونات المطلوبة موجودة

### 2. iOS (تم إعداد الملفات)
- ✅ `ios/pharmacy/AppDelegate.mm` - تم إضافة Google Maps import و API key
- ✅ `ios/pharmacy/Info.plist` - تم إضافة GMSApiKey
- ✅ `ios/Podfile` - تم إضافة Google Maps pods

## 🔧 خطوات إكمال الإعداد

### للـ iOS:
```bash
# 1. تثبيت CocoaPods (إذا لم يكن مثبت)
sudo gem install cocoapods

# 2. الانتقال إلى مجلد iOS
cd ios

# 3. تثبيت Pods
pod install

# 4. العودة إلى المجلد الرئيسي
cd ..

# 5. تشغيل التطبيق
npx react-native run-ios
```

### للـ Android:
```bash
# تشغيل التطبيق
npx react-native run-android
```

## 🔑 API Key المستخدم
```
AIzaSyAPFtQwFoAfkNbe2zZPt1B8d0V2ZGGILp4
```

## 📱 الأذونات المطلوبة
- ✅ `ACCESS_FINE_LOCATION`
- ✅ `ACCESS_COARSE_LOCATION`
- ✅ `ACCESS_BACKGROUND_LOCATION`
- ✅ `CAMERA`
- ✅ `INTERNET`

## 🗺️ الميزات المتاحة
- 📍 الحصول على الموقع الحالي
- 🗺️ عرض الخرائط
- 📍 مشاركة الموقع في المحادثات
- 🎯 تحديد المواقع بدقة عالية

## ⚠️ ملاحظات مهمة
1. تأكد من أن API key صالح في Google Cloud Console
2. فعّل Google Maps API في Google Cloud Console
3. أضف bundle ID للتطبيق في Google Cloud Console
4. تأكد من أن الأذونات مُفعلة في إعدادات التطبيق

## 🚀 بعد الإعداد
ستعمل جميع وظائف الموقع بشكل مثالي:
- زر الموقع في ChatScreen
- عرض الخرائط
- مشاركة المواقع
- الحصول على الموقع الحالي
