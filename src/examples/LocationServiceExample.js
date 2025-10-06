import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { 
  fetchCities, 
  fetchAreasByCity, 
  fetchSpecialties,
  fetchAllLocationData,
  getAreasForCity,
  searchCities,
  searchAreas,
  searchSpecialties
} from '../services/locationService';

/**
 * مثال على استخدام locationService في React Native
 */
const LocationServiceExample = () => {
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(false);

  // جلب جميع البيانات عند تحميل المكون
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllLocationData();
      setCities(data.cities);
      setSpecialties(data.specialties);
      console.log('✅ تم تحميل جميع البيانات:', data);
    } catch (error) {
      console.error('❌ خطأ في تحميل البيانات:', error);
      Alert.alert('خطأ', 'فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = async (cityId) => {
    try {
      console.log(`🏙️ تم اختيار المدينة: ${cityId}`);
      setSelectedCity(cityId);
      
      // جلب المناطق للمدينة المختارة
      const cityAreas = await getAreasForCity(cityId);
      setAreas(cityAreas);
      
      console.log(`🏘️ المناطق للمدينة ${cityId}:`, cityAreas);
    } catch (error) {
      console.error('❌ خطأ في جلب المناطق:', error);
      Alert.alert('خطأ', 'فشل في جلب المناطق');
    }
  };

  const handleSearch = (searchTerm, type) => {
    let results = [];
    
    switch (type) {
      case 'cities':
        results = searchCities(cities, searchTerm);
        console.log(`🔍 نتائج البحث في المدن: ${results.length}`);
        break;
      case 'areas':
        results = searchAreas(areas, searchTerm);
        console.log(`🔍 نتائج البحث في المناطق: ${results.length}`);
        break;
      case 'specialties':
        results = searchSpecialties(specialties, searchTerm);
        console.log(`🔍 نتائج البحث في التخصصات: ${results.length}`);
        break;
    }
    
    return results;
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
        مثال على استخدام LocationService
      </Text>
      
      <Text>المدن المتاحة: {cities.length}</Text>
      <Text>المناطق المتاحة: {areas.length}</Text>
      <Text>التخصصات المتاحة: {specialties.length}</Text>
      
      {selectedCity && (
        <Text>المدينة المختارة: {selectedCity}</Text>
      )}
      
      <TouchableOpacity 
        onPress={() => handleCitySelect(16)} // الرياض
        style={{ 
          backgroundColor: '#007BFF', 
          padding: 10, 
          marginTop: 10,
          borderRadius: 5 
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          جلب مناطق الرياض
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => handleCitySelect(17)} // جدة
        style={{ 
          backgroundColor: '#28A745', 
          padding: 10, 
          marginTop: 10,
          borderRadius: 5 
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          جلب مناطق جدة
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={loadAllData}
        style={{ 
          backgroundColor: '#FFC107', 
          padding: 10, 
          marginTop: 10,
          borderRadius: 5 
        }}
      >
        <Text style={{ color: 'black', textAlign: 'center' }}>
          إعادة تحميل البيانات
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LocationServiceExample;
