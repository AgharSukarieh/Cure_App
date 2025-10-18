# 🎨 Alert System - نظام التنبيهات المخصص

نظام تنبيهات احترافي وقابل للتخصيص بالكامل لتطبيقات React Native.

---

## 📦 التثبيت والإعداد

### 1. إضافة AlertProvider في App.js

```javascript
import React from 'react';
import { AlertProvider } from './src/components/Alert';
import YourApp from './YourApp';

const App = () => {
  return (
    <AlertProvider>
      <YourApp />
    </AlertProvider>
  );
};

export default App;
```

---

## 🚀 الاستخدام

### الطريقة الأساسية - باستخدام useAlert Hook

```javascript
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useAlert } from '../components/Alert';

const MyScreen = () => {
  const alert = useAlert();

  const handleSuccess = () => {
    alert.showSuccess(
      'نجح!',
      'تمت العملية بنجاح'
    );
  };

  const handleError = () => {
    alert.showError(
      'خطأ!',
      'حدث خطأ أثناء تنفيذ العملية'
    );
  };

  const handleWarning = () => {
    alert.showWarning(
      'تحذير!',
      'يرجى التحقق من البيانات'
    );
  };

  const handleInfo = () => {
    alert.showInfo(
      'معلومة',
      'هذه معلومة مهمة'
    );
  };

  return (
    <View>
      <TouchableOpacity onPress={handleSuccess}>
        <Text>Show Success</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleError}>
        <Text>Show Error</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleWarning}>
        <Text>Show Warning</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleInfo}>
        <Text>Show Info</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyScreen;
```

---

## 🎨 أمثلة متقدمة

### مثال 1: Alert مع خيارات مخصصة

```javascript
alert.showSuccess(
  'تم الحفظ!',
  'تم حفظ البيانات بنجاح',
  {
    duration: 5000,              // المدة بالميلي ثانية
    position: 'top',             // 'top', 'center', 'bottom'
    animationType: 'slide',      // 'slide', 'fade', 'zoom'
    showCloseButton: true,       // إظهار زر الإغلاق
  }
);
```

### مثال 2: Alert مع زر إجراء

```javascript
alert.showError(
  'فشل الاتصال',
  'لم نتمكن من الاتصال بالخادم',
  {
    showButton: true,
    buttonText: 'إعادة المحاولة',
    onButtonPress: () => {
      console.log('إعادة المحاولة...');
      // إعادة محاولة الاتصال
    },
    duration: 0, // لا يختفي تلقائياً
  }
);
```

### مثال 3: Alert مخصص بالكامل

```javascript
const alertId = alert.showAlert({
  type: 'success',
  title: 'عنوان مخصص',
  message: 'رسالة مخصصة',
  duration: 4000,
  position: 'center',
  animationType: 'zoom',
  customIcon: 'heart',
  showCloseButton: true,
  showButton: true,
  buttonText: 'موافق',
  onButtonPress: () => {
    console.log('تم الضغط على الزر');
  },
  titleStyle: {
    fontSize: 18,
    color: '#FFF',
  },
  messageStyle: {
    fontSize: 14,
    color: '#EEE',
  },
  containerStyle: {
    backgroundColor: '#6366F1',
  },
});
```

### مثال 4: التحكم اليدوي بالـ Alert

```javascript
// إظهار Alert
const alertId = alert.showInfo('جاري التحميل...', 'يرجى الانتظار', {
  duration: 0, // لا يختفي تلقائياً
});

// بعد انتهاء العملية، تحديث Alert
setTimeout(() => {
  alert.updateAlert(alertId, {
    type: 'success',
    title: 'اكتمل!',
    message: 'تم التحميل بنجاح',
    duration: 3000,
  });
}, 3000);

// أو إخفاءه يدوياً
// alert.hideAlert(alertId);
```

---

## 🎭 الأنواع المتاحة

### 1. Success Alert ✅
```javascript
alert.showSuccess('نجح!', 'تمت العملية بنجاح');
```
- اللون: أخضر (#10B981)
- الأيقونة: check-circle

### 2. Error Alert ❌
```javascript
alert.showError('خطأ!', 'حدث خطأ في النظام');
```
- اللون: أحمر (#EF4444)
- الأيقونة: x-circle

### 3. Warning Alert ⚠️
```javascript
alert.showWarning('تحذير!', 'يرجى التحقق من البيانات');
```
- اللون: برتقالي (#F59E0B)
- الأيقونة: alert-circle

### 4. Info Alert ℹ️
```javascript
alert.showInfo('معلومة', 'هذه معلومة مهمة');
```
- اللون: أزرق (#3B82F6)
- الأيقونة: info

---

## ⚙️ الخيارات المتاحة

| الخيار | النوع | الافتراضي | الوصف |
|--------|------|----------|-------|
| `type` | string | 'success' | نوع Alert: 'success', 'error', 'warning', 'info' |
| `title` | string | '' | عنوان Alert |
| `message` | string | '' | رسالة Alert |
| `duration` | number | 4000 | مدة ظهور Alert بالميلي ثانية (0 = لا يختفي تلقائياً) |
| `position` | string | 'top' | موضع Alert: 'top', 'center', 'bottom' |
| `animationType` | string | 'slide' | نوع الأنيميشن: 'slide', 'fade', 'zoom' |
| `showCloseButton` | boolean | true | إظهار زر الإغلاق |
| `showButton` | boolean | false | إظهار زر الإجراء |
| `buttonText` | string | 'موافق' | نص زر الإجراء |
| `onButtonPress` | function | null | دالة عند الضغط على زر الإجراء |
| `customIcon` | string | null | أيقونة مخصصة (Feather icons) |
| `titleStyle` | object | {} | تنسيق مخصص للعنوان |
| `messageStyle` | object | {} | تنسيق مخصص للرسالة |
| `containerStyle` | object | {} | تنسيق مخصص للحاوية |

---

## 🔄 استبدال Alert التقليدي

### قبل (Alert التقليدي):
```javascript
import { Alert } from 'react-native';

Alert.alert('خطأ', 'حدث خطأ في النظام');
```

### بعد (Alert المخصص):
```javascript
import { useAlert } from '../components/Alert';

const alert = useAlert();
alert.showError('خطأ', 'حدث خطأ في النظام');
```

---

## 💡 نصائح الاستخدام

1. **استخدم الأنواع المناسبة:**
   - `showSuccess` للعمليات الناجحة
   - `showError` للأخطاء
   - `showWarning` للتحذيرات
   - `showInfo` للمعلومات

2. **اختر المدة المناسبة:**
   - رسائل النجاح: 2-3 ثواني
   - رسائل الخطأ: 4-5 ثواني
   - رسائل التحذير: 3-4 ثواني
   - رسائل تحتاج تفاعل: duration: 0

3. **استخدم الموضع المناسب:**
   - `top`: للإشعارات العامة
   - `center`: للرسائل المهمة
   - `bottom`: لرسائل غير مهمة

4. **اختر الأنيميشن المناسب:**
   - `slide`: للرسائل من الأعلى
   - `fade`: للرسائل البسيطة
   - `zoom`: لجذب الانتباه

---

## 📝 أمثلة عملية من التطبيق

### في AccountInfo عند إضافة دفعة:
```javascript
const { showSuccess, showError } = useAlert();

const handleAddPayment = async (data) => {
  try {
    const response = await post('/api/collect-money', data);
    
    if (response?.code === 200) {
      showSuccess('نجح', 'تم تحصيل المبلغ بنجاح!');
      await getLastPayment();
      setChooseMethodModalVisible(false);
    } else {
      showError('خطأ', response.message || 'فشل تحصيل المبلغ');
    }
  } catch (error) {
    showError('خطأ', 'حدث خطأ في الاتصال');
  }
};
```

### في Order عند إضافة طلب:
```javascript
const { showSuccess, showError } = useAlert();

const submitBtn = () => {
  if (orderData.length > 0) {
    const data = {
      pharmacy_id: item.pharmacy_id,
      payment_method: 0,
      products: orderData
    };
    
    post(Constants.orders.add_order, data)
      .then((res) => {
        showSuccess('نجح', res?.message ?? 'تم إضافة الطلب بنجاح');
        func();
        hide();
        setOrderData([]);
      })
      .catch((err) => {
        showError('خطأ', 'فشل إضافة الطلب');
      });
  }
};
```

---

## 🎨 التخصيص الكامل

يمكنك تخصيص الألوان والتصميم بتعديل `AlertComponent.js`:

```javascript
const alertConfig = {
  success: {
    icon: 'check-circle',
    backgroundColor: '#10B981',  // غيّر اللون هنا
    iconColor: '#FFFFFF',
    progressColor: '#059669',
  },
  // ...
};
```

---

## 🐛 استكشاف الأخطاء

### المشكلة: "useAlert must be used within AlertProvider"
**الحل:** تأكد من إضافة `<AlertProvider>` في `App.js`

### المشكلة: Alert لا يظهر
**الحل:** تحقق من أن `zIndex` كافٍ ولا يوجد components أخرى تغطيه

### المشكلة: Alert يظهر خلف Modal
**الحل:** استخدم Alert داخل Modal أو زد `zIndex` في AlertProvider

---

## 📚 API Reference

### Methods

#### `showSuccess(title, message, options)`
عرض alert نجاح

#### `showError(title, message, options)`
عرض alert خطأ

#### `showWarning(title, message, options)`
عرض alert تحذير

#### `showInfo(title, message, options)`
عرض alert معلومات

#### `showAlert(options)`
عرض alert مخصص

#### `hideAlert(alertId)`
إخفاء alert محدد

#### `updateAlert(alertId, updates)`
تحديث alert موجود

---

🎉 **استمتع باستخدام نظام التنبيهات المخصص!**

