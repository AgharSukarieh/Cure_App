import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'moment';
import { get, post } from '../WebService/RequestBuilder';
import Constants from '../config/globalConstants';
import { fetchCitiesAndAreas } from '../store/apps/cities';

/**
 * Custom Hook لإدارة المدن والمناطق
 */
const useLocationManagement = (currentUser, token, selectedDate) => {
    const dispatch = useDispatch();
    
    // البيانات من Redux Store
    const userLocationData = useSelector(state => state.cities.userLocationData || {});
    const {
        citiesFormatted = [],
        areas: reduxAreas = [],
        loading: locationsLoading,
    } = userLocationData;

    // الحالة المحلية
    const [currentCity, setCurrentCity] = useState("");
    const [currentArea, setCurrentArea] = useState("");
    const [currentCityId, setCurrentCityId] = useState(null);
    const [currentAreaId, setCurrentAreaId] = useState(null);
    const [weeklyscdata, setWeeklyscdata] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);

    /**
     * جلب المدن والمناطق من Redux عند التحميل
     */
    useEffect(() => {
        if (token) {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📡 useLocationManagement: جلب المدن والمناطق من Redux...');
            console.log('🔑 Token:', token ? 'موجود ✓' : 'غير موجود ✗');
            dispatch(fetchCitiesAndAreas({ token }));
            console.log('✅ تم إرسال الطلب إلى Redux Store');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        }
    }, [token, dispatch]);

    /**
     * مراقبة تحديثات Redux Store
     */
    useEffect(() => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 Redux Store Update:');
        console.log('   🏙️ عدد المدن:', citiesFormatted.length);
        console.log('   📍 عدد المناطق:', reduxAreas.length);
        console.log('   ⏳ حالة التحميل:', locationsLoading ? 'جاري التحميل...' : 'تم التحميل ✓');
        if (citiesFormatted.length > 0) {
            console.log('   ✅ المدن:', citiesFormatted.map(c => c.label).join(', '));
        }
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }, [citiesFormatted.length, reduxAreas.length, locationsLoading]);

    /**
     * دالة لجلب الخطط (للحصول على المنطقة الحالية)
     */
    const getPlans = useCallback(async () => {
        try {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📡 جلب الخطط للحصول على المنطقة الحالية');
            console.log('🔍 Parameters:');
            console.log('   - user_id:', currentUser?.id);
            console.log('   - date:', Moment(selectedDate).format('yyyy-MM-DD'));
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            
            const res = await get(Constants.plans.get_plans, null, { 
                user_id: currentUser?.id, 
                date: Moment(selectedDate).format('yyyy-MM-DD') 
            });
            
            console.log('✅ استجابة API:', res);
            console.log('📊 عدد الخطط المسترجعة:', res.data?.length || 0);
            
            const plans = res.data || [];
            setWeeklyscdata(plans);
            
            // تحديث المنطقة الحالية من البيانات المحفوظة
            const matchingData = plans.find(data => 
                Moment(data.date).isSame(selectedDate, 'day')
            );
            
            if (matchingData && matchingData.area) {
                setCurrentArea(matchingData.area);
                setCurrentCity(matchingData.city || '');
                setCurrentCityId(matchingData.city_id || null);
                setCurrentAreaId(matchingData.area_id || null);
                console.log('📍 المنطقة الحالية:', matchingData.area);
                console.log('🏙️ المدينة الحالية:', matchingData.city);
                console.log('🆔 City ID:', matchingData.city_id);
                console.log('🆔 Area ID:', matchingData.area_id);
            } else {
                setCurrentArea("");
                setCurrentCity("");
                setCurrentCityId(null);
                setCurrentAreaId(null);
                console.log('⚠️ لا توجد منطقة محفوظة لهذا التاريخ');
            }
            
            console.log('✅ انتهى جلب البيانات بنجاح');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        } catch (err) {
            console.error('❌ خطأ في جلب الخطط:', err);
            setCurrentArea("");
            setCurrentCity("");
        }
    }, [currentUser?.id, selectedDate]);

    /**
     * دالة لحفظ المنطقة في API
     */
    const savePlan = useCallback(async (data) => {
        const body = {
            user_id: currentUser?.id,
            city_id: data.city,
            area_id: data.area,
            date: Moment(selectedDate).format('yyyy-MM-DD')
        };
      
        console.log('📡 إرسال البيانات إلى API:', body);
        
        try {
            const res = await post(Constants.plans.get_plans, body, null);
            console.log('✅ تم حفظ المنطقة بنجاح:', res);
            
            // تحديث المنطقة والمدينة المحلية
            setCurrentCity(data.cityName);
            setCurrentArea(data.areaName);
            
            // إعادة تحميل البيانات لتحديث الواجهة
            await getPlans();
            
            return true;
        } catch (err) {
            console.error('❌ خطأ في حفظ المنطقة:', err);
            alert('حدث خطأ أثناء حفظ المنطقة. حاول مرة أخرى.');
            return false;
        }
    }, [currentUser?.id, selectedDate, getPlans]);

    /**
     * دالة لتحديث المناطق عند اختيار المدينة
     */
    const handleCityChange = useCallback((cityId) => {
        console.log('🏙️ تم اختيار المدينة:', cityId);
        setSelectedCity(cityId);
        setSelectedArea(null);
        
        // فلترة المناطق من Redux حسب المدينة المختارة
        const filteredAreas = reduxAreas
            .filter(area => String(area.city_id) === String(cityId))
            .map(area => ({
                value: area.id,
                label: area.name,
                city_id: area.city_id
            }));
        
        setAreas(filteredAreas);
        console.log('📍 تم جلب', filteredAreas.length, 'منطقة للمدينة', cityId);
    }, [reduxAreas]);

    /**
     * دالة لحفظ التحديد
     */
    const handleSaveLocation = useCallback(() => {
        if (selectedCity && selectedArea) {
            const cityName = citiesFormatted.find(c => c.value === selectedCity)?.label;
            const areaName = areas.find(a => a.value === selectedArea)?.label;
            
            console.log('💾 حفظ المنطقة الجديدة:', areaName);
            console.log('🏙️ المدينة:', cityName);
            
            // حفظ المنطقة والمدينة محلياً
            setCurrentCity(cityName || '');
            setCurrentArea(areaName || '');
            
            // حفظ في API
            return savePlan({
                city: selectedCity,
                area: selectedArea,
                cityName: cityName,
                areaName: areaName
            });
        } else {
            console.warn('⚠️ يرجى اختيار المدينة والمنطقة');
            alert('يرجى اختيار المدينة والمنطقة');
            return false;
        }
    }, [selectedCity, selectedArea, citiesFormatted, areas, savePlan]);

    /**
     * تحميل القيم الحالية عند فتح المودال
     */
    const loadCurrentLocation = useCallback(() => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🗺️ تحميل المنطقة الحالية للمودال');
        
        // البحث عن المنطقة الحالية في البيانات المحفوظة
        const currentPlan = weeklyscdata.find(plan => 
            Moment(plan.date).isSame(selectedDate, 'day')
        );
        
        if (currentPlan) {
            console.log('✅ تم العثور على خطة محفوظة:', currentPlan);
            
            if (currentPlan.city_id) {
                setSelectedCity(currentPlan.city_id);
                console.log('🏙️ تم تعيين المدينة:', currentPlan.city_id);
                
                // فلترة المناطق للمدينة المحفوظة
                const filteredAreas = reduxAreas
                    .filter(area => String(area.city_id) === String(currentPlan.city_id))
                    .map(area => ({
                        value: area.id,
                        label: area.name,
                        city_id: area.city_id
                    }));
                setAreas(filteredAreas);
                console.log('📍 تم فلترة', filteredAreas.length, 'منطقة للمدينة');
            }
            
            if (currentPlan.area_id) {
                setSelectedArea(currentPlan.area_id);
                console.log('📍 تم تعيين المنطقة:', currentPlan.area_id);
            }
        } else {
            console.log('⚠️ لا توجد خطة محفوظة لهذا التاريخ');
            setSelectedCity(null);
            setSelectedArea(null);
            setAreas([]);
        }
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }, [weeklyscdata, selectedDate, reduxAreas]);

    /**
     * تحميل البيانات عند تغيير التاريخ
     */
    useEffect(() => {
        if (currentUser?.id) {
            getPlans();
        }
    }, [currentUser?.id, selectedDate, getPlans]);

    return {
        // البيانات
        citiesFormatted,
        areas,
        currentCity,
        currentArea,
        currentCityId,
        currentAreaId,
        selectedCity,
        selectedArea,
        locationsLoading,
        weeklyscdata,
        
        // الدوال
        handleCityChange,
        handleSaveLocation,
        loadCurrentLocation,
        setSelectedArea,
        getPlans
    };
};

export default useLocationManagement;

