# LocationService - خدمة البيانات الجغرافية

## 📋 **الوصف**
خدمة شاملة لجلب وإدارة البيانات الجغرافية (المدن والمناطق والتخصصات) في التطبيق.

## 🚀 **الميزات**
- ✅ جلب المدن من endpoints متعددة
- ✅ جلب المناطق حسب المدينة
- ✅ جلب التخصصات الطبية
- ✅ تنسيق البيانات للـ dropdowns
- ✅ البحث والفلترة
- ✅ معالجة الأخطاء
- ✅ Logs مفصلة للتتبع

## 📁 **الملفات**
- `src/services/locationService.js` - الملف الرئيسي
- `src/examples/LocationServiceExample.js` - مثال بسيط
- `src/examples/ClientDoctorListWithLocationService.js` - مثال متقدم

## 🔧 **الاستخدام الأساسي**

### 1. **جلب المدن**
```javascript
import { fetchCities } from '../services/locationService';

const cities = await fetchCities();
console.log('المدن:', cities);
```

### 2. **جلب المناطق لمدينة معينة**
```javascript
import { getAreasForCity } from '../services/locationService';

const areas = await getAreasForCity(16); // الرياض
console.log('مناطق الرياض:', areas);
```

### 3. **جلب جميع البيانات**
```javascript
import { fetchAllLocationData } from '../services/locationService';

const data = await fetchAllLocationData();
console.log('البيانات:', data);
// data.cities - المدن
// data.specialties - التخصصات
```

## 🎯 **الاستخدام المتقدم**

### **في React Component**
```javascript
import React, { useState, useEffect } from 'react';
import { 
  fetchAllLocationData, 
  getAreasForCity,
  searchCities 
} from '../services/locationService';

const MyComponent = () => {
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await fetchAllLocationData();
    setCities(data.cities);
  };

  const handleCitySelect = async (cityId) => {
    setSelectedCity(cityId);
    const cityAreas = await getAreasForCity(cityId);
    setAreas(cityAreas);
  };

  return (
    // UI components
  );
};
```

## 🔍 **البحث والفلترة**

### **البحث في المدن**
```javascript
import { searchCities } from '../services/locationService';

const filteredCities = searchCities(cities, 'الرياض');
console.log('نتائج البحث:', filteredCities);
```

### **البحث في المناطق**
```javascript
import { searchAreas } from '../services/locationService';

const filteredAreas = searchAreas(areas, 'المركز');
console.log('نتائج البحث:', filteredAreas);
```

## 📊 **تنسيق البيانات**

### **تنسيق المدن للـ dropdown**
```javascript
import { formatCitiesForDropdown } from '../services/locationService';

const cities = await fetchCities();
const dropdownCities = formatCitiesForDropdown(cities);
// النتيجة: [{ value: 1, label: "الرياض" }, ...]
```

### **تنسيق المناطق للـ dropdown**
```javascript
import { formatAreasForDropdown } from '../services/locationService';

const areas = await fetchAreasByCity(16);
const dropdownAreas = formatAreasForDropdown(areas);
// النتيجة: [{ value: 1, label: "المركز", city_id: 16 }, ...]
```

## 🛠️ **الـ Endpoints المدعومة**

### **المدن**
- `GET /api/getcity` - المدن الأساسية
- `GET /api/get-all-cities` - جميع المدن

### **المناطق**
- `GET /api/area?city_id={id}` - المناطق حسب المدينة
- `GET /api/getAreas/{id}` - المناطق (endpoint بديل)

### **التخصصات**
- `GET /api/getspecialties` - التخصصات الطبية

## 📝 **أمثلة الاستخدام**

### **1. في ClientDoctorList**
```javascript
import { fetchAllLocationData, getAreasForCity } from '../services/locationService';

// جلب البيانات
const data = await fetchAllLocationData();
setCities(data.cities);
setSpecialties(data.specialties);

// جلب المناطق عند اختيار مدينة
const areas = await getAreasForCity(cityId);
setAreas(areas);
```

### **2. في HomePage**
```javascript
import { fetchCities, fetchAreasByCity } from '../services/locationService';

// جلب المدن
const cities = await fetchCities();

// جلب المناطق لمدينة معينة
const areas = await fetchAreasByCity(16);
```

### **3. في أي صفحة أخرى**
```javascript
import { 
  fetchAllLocationData,
  getAreasForCity,
  searchCities,
  searchAreas 
} from '../services/locationService';

// استخدام جميع الوظائف حسب الحاجة
```

## 🚨 **معالجة الأخطاء**

```javascript
try {
  const cities = await fetchCities();
  console.log('تم جلب المدن:', cities);
} catch (error) {
  console.error('خطأ في جلب المدن:', error);
  // معالجة الخطأ
}
```

## 📱 **الاستخدام في الـ UI**

### **Dropdown للمدن**
```javascript
<Dropdown
  data={cities}
  labelField="label"
  valueField="value"
  placeholder="اختر المدينة"
  value={selectedCity}
  onChange={item => setSelectedCity(item.value)}
/>
```

### **Dropdown للمناطق**
```javascript
<Dropdown
  data={areas}
  labelField="label"
  valueField="value"
  placeholder="اختر المنطقة"
  value={selectedArea}
  onChange={item => setSelectedArea(item.value)}
  disable={!selectedCity}
/>
```

## 🔄 **التحديثات المستقبلية**

- [ ] إضافة cache للبيانات
- [ ] دعم pagination للمدن الكثيرة
- [ ] إضافة validation للبيانات
- [ ] دعم offline mode
- [ ] إضافة unit tests

## 📞 **الدعم**

لأي استفسارات أو مشاكل، راجع:
- `src/examples/LocationServiceExample.js` - مثال بسيط
- `src/examples/ClientDoctorListWithLocationService.js` - مثال متقدم
- Console logs للتتبع والتصحيح
