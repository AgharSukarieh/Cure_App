# 🏙️ إدارة المدن والمناطق - React Demo

## 📋 الوصف
تطبيق React لجلب وعرض بيانات المدن والمناطق من API مع إمكانية التخزين المحلي والتفاعل مع البيانات.

## 🚀 الميزات
- ✅ جلب البيانات من API
- ✅ عرض قائمة المدن
- ✅ عرض المناطق عند اختيار مدينة
- ✅ حالة تحميل (Loading)
- ✅ معالجة الأخطاء
- ✅ حفظ البيانات في localStorage
- ✅ تصميم متجاوب (Responsive)
- ✅ إحصائيات البيانات
- ✅ أزرار التحكم

## 📁 الملفات
- `CitiesAreasDemo.js` - مكون React كامل
- `demo.html` - صفحة HTML جاهزة للتشغيل
- `README.md` - هذا الملف

## 🔧 كيفية الاستخدام

### الطريقة الأولى: فتح الملف HTML مباشرة
1. افتح ملف `demo.html` في المتصفح
2. سيتم تشغيل التطبيق تلقائياً

### الطريقة الثانية: استخدام React Component
```javascript
import CitiesAreasDemo from './CitiesAreasDemo.js';

// في مكونك الرئيسي
function App() {
  return <CitiesAreasDemo />;
}
```

## ⚙️ الإعدادات

### تغيير URL API
```javascript
// في دالة fetchCitiesAndAreas
const response = await fetch('YOUR_API_URL', {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  }
});
```

### تغيير مفتاح localStorage
```javascript
// تغيير المفتاح من 'citiesAndAreas' إلى أي مفتاح آخر
localStorage.setItem('your-custom-key', JSON.stringify(data));
```

## 📊 بنية البيانات المتوقعة
```json
{
  "success": true,
  "data": {
    "block_id": 2,
    "cities": [
      {
        "id": 1,
        "name": "الرياض"
      }
    ],
    "areas": [
      {
        "id": 1,
        "name": "منطقة الرياض الأولى",
        "city_id": 1,
        "city_name": "الرياض",
        "block_id": 2
      }
    ]
  }
}
```

## 🎨 التخصيص

### تغيير الألوان
```css
/* في ملف CSS أو style tag */
.cities-section h2 {
  border-color: #your-color;
  color: #your-color;
}
```

### تغيير التخطيط
```javascript
// تغيير من grid إلى flex
.cities-areas-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
```

## 🔍 استكشاف الأخطاء

### مشاكل شائعة:
1. **خطأ CORS**: تأكد من إعدادات الخادم
2. **خطأ 401**: تحقق من صحة التوكن
3. **خطأ 404**: تحقق من صحة URL
4. **لا تظهر البيانات**: تحقق من بنية البيانات المرجعة

### رسائل Console:
- ✅ `تم جلب البيانات بنجاح` - نجح الطلب
- ❌ `خطأ في جلب البيانات` - فشل الطلب
- 💾 `تم تحميل البيانات من localStorage` - تم استرداد البيانات المحفوظة

## 📱 التجاوب
التطبيق متجاوب ويعمل على:
- 🖥️ أجهزة سطح المكتب
- 📱 الأجهزة اللوحية
- 📱 الهواتف الذكية

## 🛠️ التقنيات المستخدمة
- React 18
- Hooks (useState, useEffect)
- Fetch API
- localStorage
- CSS Grid & Flexbox
- Responsive Design

## 📄 الترخيص
هذا المشروع مفتوح المصدر ومتاح للاستخدام الشخصي والتجاري.

---
**ملاحظة**: تأكد من تحديث URL API والتوكن قبل التشغيل.
