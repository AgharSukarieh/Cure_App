# 🚀 نظام API شامل لتطبيق الصيدلية

## 📋 نظرة عامة

تم إنشاء نظام API متكامل لتطبيق React Native للصيدلية باستخدام الـ routes الصحيحة من الـ backend Laravel. النظام يتضمن جميع الخدمات المطلوبة مع error handling شامل و token management.

## 🏗️ هيكل النظام

```
src/
├── config/
│   └── apiConfig.js          # إعدادات API مع axios interceptors
├── services/
│   ├── authService.js        # خدمة المصادقة
│   ├── doctorService.js      # خدمة الأطباء
│   ├── pharmacyService.js    # خدمة الصيدليات
│   ├── productService.js     # خدمة المنتجات
│   ├── orderService.js       # خدمة الطلبات
│   ├── medicalService.js     # خدمة التقارير الطبية
│   ├── salesService.js       # خدمة تقارير المبيعات
│   ├── chatService.js        # خدمة الدردشة
│   ├── locationService.js    # خدمة المواقع
│   └── index.js              # تصدير جميع الخدمات
├── hooks/
│   ├── useAuth.js            # Hook للمصادقة
│   ├── useDoctors.js         # Hook للأطباء
│   ├── usePharmacies.js      # Hook للصيدليات
│   ├── useOrders.js          # Hook للطلبات
│   └── index.js              # تصدير جميع الـ hooks
├── contexts/
│   └── AuthContext.js        # Context للمصادقة
├── utils/
│   ├── storage.js            # إدارة التخزين المحلي
│   ├── validators.js         # أدوات التحقق
│   ├── helpers.js            # أدوات مساعدة
│   └── index.js              # تصدير جميع الأدوات
└── examples/
    ├── LoginExample.js       # مثال على تسجيل الدخول
    └── DoctorsListExample.js # مثال على قائمة الأطباء
```

## 🔧 الميزات الرئيسية

### 1. **إعدادات API متقدمة**
- ✅ Axios interceptors للـ token management
- ✅ Error handling شامل
- ✅ Request/Response logging للـ development
- ✅ Retry logic للطلبات الفاشلة
- ✅ Timeout handling

### 2. **خدمات API كاملة**
- ✅ **Authentication**: تسجيل الدخول، تسجيل الخروج، إنشاء حساب
- ✅ **Doctors**: إدارة الأطباء مع البحث والتصفية
- ✅ **Pharmacies**: إدارة الصيدليات مع الصور
- ✅ **Products**: إدارة المنتجات مع الباركود
- ✅ **Orders**: إدارة الطلبات مع الإرجاع
- ✅ **Medical Reports**: التقارير الطبية اليومية
- ✅ **Sales Reports**: تقارير المبيعات والمخزون
- ✅ **Chat**: دردشة فردية وجماعية
- ✅ **Location**: إدارة المدن والمناطق

### 3. **Custom Hooks**
- ✅ `useAuth()`: إدارة المصادقة
- ✅ `useDoctors()`: إدارة الأطباء
- ✅ `usePharmacies()`: إدارة الصيدليات
- ✅ `useOrders()`: إدارة الطلبات
- ✅ Loading states
- ✅ Error handling
- ✅ Pagination support
- ✅ Refresh functionality

### 4. **Context Providers**
- ✅ `AuthContext`: إدارة حالة المصادقة
- ✅ State management مع useReducer
- ✅ Automatic token refresh
- ✅ Logout on token expiry

### 5. **أدوات مساعدة**
- ✅ **Storage**: AsyncStorage management
- ✅ **Validators**: Form validation
- ✅ **Helpers**: Utility functions
- ✅ Arabic date formatting
- ✅ Currency formatting
- ✅ Text utilities

## 🚀 كيفية الاستخدام

### 1. **استيراد الخدمات**

```javascript
import { authService, doctorService, pharmacyService } from './src/services';
import { useAuth, useDoctors, usePharmacies } from './src/hooks';
import { AuthProvider } from './src/contexts/AuthContext';
```

### 2. **استخدام Authentication**

```javascript
import { useAuth } from './src/hooks/useAuth';

const LoginScreen = () => {
  const { login, loading, error, user, isAuthenticated } = useAuth();

  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.success) {
      // Navigate to home
    }
  };

  return (
    // Login form
  );
};
```

### 3. **استخدام Doctors Management**

```javascript
import { useDoctors } from './src/hooks/useDoctors';

const DoctorsScreen = () => {
  const {
    doctors,
    loading,
    error,
    fetchDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    searchDoctors,
    refresh
  } = useDoctors({ autoFetch: true });

  const handleCreateDoctor = async (doctorData) => {
    const result = await createDoctor(doctorData);
    if (result.success) {
      Alert.alert('نجح', 'تم إنشاء الطبيب بنجاح');
    }
  };

  return (
    // Doctors list
  );
};
```

### 4. **استخدام Context Provider**

```javascript
import { AuthProvider } from './src/contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        {/* Your app components */}
      </NavigationContainer>
    </AuthProvider>
  );
};
```

### 5. **استخدام Validation**

```javascript
import { formValidators, showValidationErrors } from './src/utils/validators';

const validateForm = (data) => {
  const validation = formValidators.validateDoctor(data);
  if (!validation.isValid) {
    showValidationErrors(validation.errors);
    return false;
  }
  return true;
};
```

### 6. **استخدام Storage**

```javascript
import { tokenManager, userDataManager } from './src/utils/storage';

// Store token
await tokenManager.setToken('your-token');

// Get user data
const userData = await userDataManager.getUserData();
```

## 📱 أمثلة الاستخدام

### **Login Example**
```javascript
const { login, loading, error } = useAuth();

const handleLogin = async () => {
  const result = await login(email, password);
  if (result.success) {
    // Navigate to home
  } else {
    Alert.alert('خطأ', result.message);
  }
};
```

### **Fetch Doctors Example**
```javascript
const { doctors, loading, refetch, pagination } = useDoctors({
  page: 1,
  per_page: 20,
  search: 'أحمد'
});

// Auto fetch on mount
// Support pagination
// Support search
// Support refresh
```

### **Create Order Example**
```javascript
const { createOrder, loading } = useOrders();

const handleCreateOrder = async () => {
  const result = await createOrder({
    pharmacy_id: 1,
    products: [
      { product_id: 1, quantity: 2 },
      { product_id: 2, quantity: 1 }
    ]
  });
  
  if (result.success) {
    Alert.alert('نجاح', 'تم إنشاء الطلب بنجاح');
  }
};
```

## 🔐 Error Handling

### **HTTP Status Codes**
- ✅ **401**: Auto logout + redirect to login
- ✅ **403**: Show permission error
- ✅ **404**: Show not found error
- ✅ **422**: Show validation errors
- ✅ **500**: Show server error + retry option
- ✅ **Network Error**: Show offline message + retry

### **Response Format**
```javascript
{
  success: boolean,
  data: any,
  message?: string,
  errors?: object,
  pagination?: {
    total: number,
    per_page: number,
    current_page: number,
    last_page: number
  }
}
```

## 🌐 API Endpoints

### **Authentication**
- `POST /api/login` - تسجيل الدخول
- `POST /api/logout` - تسجيل الخروج
- `POST /api/register` - إنشاء حساب
- `DELETE /api/delete-account` - حذف الحساب

### **Doctors**
- `GET /api/doctors` - جلب الأطباء (public)
- `GET /api/sales/doctor` - جلب أطباء المستخدم
- `POST /api/sales/doctor` - إنشاء طبيب
- `PUT /api/sales/doctor/:id` - تحديث طبيب
- `DELETE /api/sales/doctor/:id` - حذف طبيب

### **Pharmacies**
- `GET /api/getpharmacy` - جلب الصيدليات (public)
- `GET /api/sales/pharmacy` - جلب صيدليات المستخدم
- `POST /api/sales/pharmacy` - إنشاء صيدلية
- `PUT /api/sales/pharmacy/:id` - تحديث صيدلية
- `DELETE /api/sales/pharmacy/:id` - حذف صيدلية

### **Products**
- `GET /api/products` - جلب المنتجات (public)
- `GET /api/product` - جلب منتجات المستخدم
- `POST /api/product` - إنشاء منتج
- `PUT /api/product/:id` - تحديث منتج
- `DELETE /api/product/:id` - حذف منتج

### **Orders**
- `GET /api/orders` - جلب الطلبات
- `POST /api/orders` - إنشاء طلب
- `PUT /api/orders/:id` - تحديث طلب
- `DELETE /api/orders/:id` - حذف طلب

### **Medical Reports**
- `GET /api/target/medicals` - جلب التقارير الطبية
- `POST /api/med_adddaily` - إضافة تقرير يومي
- `POST /api/med_editdaily` - تعديل تقرير يومي
- `GET /api/med_getdailyreport` - جلب التقرير اليومي

### **Sales Reports**
- `GET /api/target/sales` - جلب تقارير المبيعات
- `POST /api/sal_add_report` - إضافة تقرير مبيعات
- `GET /api/sal_get_report` - جلب تقرير المبيعات

### **Chat**
- `GET /api/get-single-chat-list` - جلب المحادثات الفردية
- `GET /api/get-single-chat-messages` - جلب رسائل الدردشة الفردية
- `POST /api/single_chat_message_mobile` - إرسال رسالة فردية
- `GET /api/get-group-chat-list` - جلب المحادثات الجماعية
- `POST /api/group_chat_message_mobile` - إرسال رسالة جماعية

### **Location**
- `GET /api/getcity` - جلب المدن
- `GET /api/area` - جلب المناطق
- `GET /api/getAreas/:cityId` - جلب المناطق حسب المدينة
- `POST /api/updatelocation` - تحديث الموقع

## 🎯 Best Practices

1. **استخدم TypeScript types** إن أمكن
2. **أضف JSDoc comments** لكل function
3. **استخدم async/await** بدلاً من .then()
4. **أضف try/catch** في جميع async functions
5. **استخدم constants** للـ endpoints بدلاً من hardcoding
6. **أضف loading indicators** لجميع API calls
7. **استخدم FlatList pagination** للقوائم الطويلة
8. **أضف pull-to-refresh** لجميع القوائم
9. **استخدم React Query** أو SWR للـ caching
10. **أضف offline support** باستخدام NetInfo

## 📦 التبعيات المطلوبة

```json
{
  "axios": "^1.4.0",
  "@react-native-async-storage/async-storage": "^1.24.0",
  "moment": "^2.29.4"
}
```

## 🔄 التحديثات المستقبلية

- [ ] إضافة React Query للـ caching
- [ ] إضافة offline support
- [ ] إضافة push notifications
- [ ] إضافة real-time updates
- [ ] إضافة image compression
- [ ] إضافة biometric authentication

## 📞 الدعم

لأي استفسارات أو مشاكل، يرجى التواصل مع فريق التطوير.

---

**تم إنشاء هذا النظام باستخدام أحدث التقنيات وأفضل الممارسات في تطوير تطبيقات React Native.** 🚀
