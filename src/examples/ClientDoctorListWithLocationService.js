import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { 
  fetchAllLocationData, 
  getAreasForCity,
  searchCities,
  searchAreas,
  searchSpecialties
} from '../services/locationService';

/**
 * مثال على استخدام locationService في ClientDoctorList
 */
const ClientDoctorListWithLocationService = () => {
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [allAreas, setAllAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    city_id: null,
    area_id: null,
    speciality_id: null,
    searchTerm: "",
  });

  // جلب جميع البيانات الجغرافية
  const loadLocationData = useCallback(async () => {
    try {
      console.log('🗺️ جلب البيانات الجغرافية...');
      setLoading(true);
      
      const data = await fetchAllLocationData();
      
      setCities(data.cities);
      setSpecialties(data.specialties);
      setAllAreas([]); // سيتم تحميلها عند اختيار مدينة
      
      console.log('✅ تم تحميل البيانات الجغرافية:', {
        cities: data.cities.length,
        specialties: data.specialties.length
      });
      
    } catch (error) {
      console.error('❌ خطأ في جلب البيانات الجغرافية:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // جلب المناطق عند اختيار مدينة
  const handleCityChange = useCallback(async (cityId) => {
    try {
      console.log(`🏙️ تم اختيار المدينة: ${cityId}`);
      
      if (cityId) {
        const cityAreas = await getAreasForCity(cityId);
        setAreas(cityAreas);
        console.log(`🏘️ المناطق للمدينة ${cityId}:`, cityAreas);
      } else {
        setAreas([]);
      }
      
      // إعادة تعيين المنطقة المختارة
      setFilters(prev => ({ ...prev, area_id: null }));
      
    } catch (error) {
      console.error('❌ خطأ في جلب المناطق:', error);
    }
  }, []);

  // البحث في المدن
  const handleCitySearch = useCallback((searchTerm) => {
    const filteredCities = searchCities(cities, searchTerm);
    console.log(`🔍 البحث في المدن: "${searchTerm}" - النتائج: ${filteredCities.length}`);
    return filteredCities;
  }, [cities]);

  // البحث في المناطق
  const handleAreaSearch = useCallback((searchTerm) => {
    const filteredAreas = searchAreas(areas, searchTerm);
    console.log(`🔍 البحث في المناطق: "${searchTerm}" - النتائج: ${filteredAreas.length}`);
    return filteredAreas;
  }, [areas]);

  // البحث في التخصصات
  const handleSpecialtySearch = useCallback((searchTerm) => {
    const filteredSpecialties = searchSpecialties(specialties, searchTerm);
    console.log(`🔍 البحث في التخصصات: "${searchTerm}" - النتائج: ${filteredSpecialties.length}`);
    return filteredSpecialties;
  }, [specialties]);

  // تحديث الفلاتر
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      if (key === 'city_id') {
        // إعادة تعيين المنطقة عند تغيير المدينة
        newFilters.area_id = null;
        handleCityChange(value);
      }
      
      return newFilters;
    });
  }, [handleCityChange]);

  // تحميل البيانات عند بدء التطبيق
  useEffect(() => {
    loadLocationData();
  }, [loadLocationData]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>جاري تحميل البيانات...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
        ClientDoctorList مع LocationService
      </Text>
      
      {/* البحث */}
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          padding: 10,
          marginBottom: 10,
          borderRadius: 5
        }}
        placeholder="البحث..."
        value={filters.searchTerm}
        onChangeText={text => handleFilterChange('searchTerm', text)}
      />
      
      {/* فلتر المدينة */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>المدينة:</Text>
        <Dropdown
          style={{
            height: 45,
            borderColor: '#ddd',
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 12,
            backgroundColor: '#fff'
          }}
          data={cities}
          labelField="label"
          valueField="value"
          placeholder="اختر المدينة"
          value={filters.city_id}
          onChange={item => handleFilterChange('city_id', item.value)}
        />
      </View>
      
      {/* فلتر المنطقة */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>المنطقة:</Text>
        <Dropdown
          style={{
            height: 45,
            borderColor: '#ddd',
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 12,
            backgroundColor: '#fff'
          }}
          data={areas}
          labelField="label"
          valueField="value"
          placeholder={!filters.city_id ? "اختر المدينة أولاً" : "اختر المنطقة"}
          value={filters.area_id}
          onChange={item => handleFilterChange('area_id', item.value)}
          disable={!filters.city_id}
        />
      </View>
      
      {/* فلتر التخصص */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>التخصص:</Text>
        <Dropdown
          style={{
            height: 45,
            borderColor: '#ddd',
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 12,
            backgroundColor: '#fff'
          }}
          data={specialties}
          labelField="label"
          valueField="value"
          placeholder="اختر التخصص"
          value={filters.speciality_id}
          onChange={item => handleFilterChange('speciality_id', item.value)}
        />
      </View>
      
      {/* معلومات الفلاتر */}
      <View style={{ marginTop: 20, padding: 10, backgroundColor: '#f5f5f5', borderRadius: 5 }}>
        <Text>المدن المتاحة: {cities.length}</Text>
        <Text>المناطق المتاحة: {areas.length}</Text>
        <Text>التخصصات المتاحة: {specialties.length}</Text>
        <Text>المدينة المختارة: {filters.city_id}</Text>
        <Text>المنطقة المختارة: {filters.area_id}</Text>
        <Text>التخصص المختار: {filters.speciality_id}</Text>
      </View>
    </View>
  );
};

export default ClientDoctorListWithLocationService;
