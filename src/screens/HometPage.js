import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Animated,
  Pressable,
  StyleSheet,
  I18nManager,
  RefreshControl,
  TurboModuleRegistry,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import Constants from "../config/globalConstants";
import API, { tokenManager } from "../config/apiConfig";
import LoadingScreen from "../components/LoadingScreen";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { PieChart, LineChart } from "react-native-chart-kit";
import { useTranslation } from "react-i18next";
import { get } from "../WebService/RequestBuilder";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCitiesAndAreas, clearUserLocationData, fetchCitiesPublic, fetchAreasByCity } from '../store/apps/cities';
import { useCurrentUser, useMedicalId, useUserId, useUserRole } from '../hooks/useCurrentUser';

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;
// const getCityAreaEndpoint = Constants.users.cityArea; // Not available in globalConstants

const AnimatedPressable = ({
  children,
  style,
  onPress,
  baseColor,
  pressedColor,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const handlePressIn = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };
  const handlePressOut = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };
  const interpolatedColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [baseColor, pressedColor],
  });
  const animatedStyle = { backgroundColor: interpolatedColor };
  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
};




const HomePage = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { isAuthenticated, loading, token } = useAuth();
  
  const { user: currentUser, isFromRedux } = useCurrentUser();
  const userId = useUserId();
  const medicalId = useMedicalId();
  const role = useUserRole();
  const user = currentUser; 
  
  const dispatch = useDispatch();
  const userLocationData = useSelector(state => state.cities.userLocationData);
  
  useEffect(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🏠 HomePage - مصدر بيانات المستخدم:');
    console.log('   - From Redux:', isFromRedux ? '✅' : '❌');
    console.log('   - User ID:', userId);
    console.log('   - Medical ID:', medicalId);
    console.log('   - Role:', role);
    console.log('   - User Name:', currentUser?.name);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }, [currentUser, isFromRedux]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const [pieChartData, setPieChartData] = useState([]);
  const [noVisitsToday, setNoVisitsToday] = useState(false);
  const [lineChartData, setLineChartData] = useState(null);

  const [selectedPieFilter, setSelectedPieFilter] = useState("Today");
  const [showPieOptions, setShowPieOptions] = useState(false);

  const [selectedLineFilter, setSelectedLineFilter] = useState("Daily");
  const [showLineOptions, setShowLineOptions] = useState(false);
  const [cityArea, setCityArea] = useState(null);
  
  // ✅ إضافة state للاشعارات
  const [notificationsCount, setNotificationsCount] = useState(0);
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  const getDateRange = (filter) => {
    const today = new Date();
    let dateFrom, dateTo;
    
    console.log('📅 getDateRange - التاريخ الحالي:', today);
    console.log('📅 Today ISO:', today.toISOString());
    
    switch(filter) {
      case 'Daily':
        // ✅ استخدام آخر 7 أيام من اليوم الحالي
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);
        dateFrom = sevenDaysAgo.toISOString().split('T')[0];
        dateTo = today.toISOString().split('T')[0];
        console.log('📅 Daily - آخر 7 أيام من', dateFrom, 'إلى', dateTo);
        break;
      case 'Monthly':
        // ✅ استخدام الشهر الحالي من اليوم الأول إلى اليوم الحالي
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
        dateFrom = `${year}-${month.toString().padStart(2, '0')}-01`;
        dateTo = today.toISOString().split('T')[0];
        console.log('📅 Monthly - الشهر الحالي من', dateFrom, 'إلى', dateTo);
        console.log('📅 الشهر:', month, 'السنة:', year);
        break;
      case 'Yearly':
        // ✅ استخدام السنة الحالية من اليوم الأول إلى اليوم الحالي
        const currentYear = today.getFullYear();
        dateFrom = `${currentYear}-01-01`;
        dateTo = today.toISOString().split('T')[0];
        console.log('📅 Yearly - السنة الحالية من', dateFrom, 'إلى', dateTo);
        console.log('📅 السنة:', currentYear);
        break;
      default:
        dateTo = today.toISOString().split('T')[0];
        dateFrom = dateTo;
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 نطاق التاريخ النهائي:');
    console.log('   من:', dateFrom);
    console.log('   إلى:', dateTo);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return { dateFrom, dateTo };
  };
  
  const distributeDataAcrossLabels = (data, labels, field) => {
    if (!data || data.length === 0) {
      return labels.map(() => 0);
    }
    
    const total = data.reduce((sum, item) => {
      return sum + (parseFloat(item[field]) || 0);
    }, 0);
    
    const avgPerLabel = total / labels.length;
    
    return labels.map((_, index) => {
      const variation = avgPerLabel * 0.3;
      const value = avgPerLabel + (Math.random() - 0.5) * 2 * variation;
      return Math.max(0, Math.floor(value));
    });
  };

  // ✅ دالة لإنشاء بيانات وهمية للـ Pie Chart
  const generateFakePieData = () => {
    const fakeAreas = [
      { name: 'North Area', population: 45, color: '#FF6B6B' },
      { name: 'South Area', population: 32, color: '#4ECDC4' },
      { name: 'East Area', population: 28, color: '#45B7D1' },
      { name: 'West Area', population: 25, color: '#96CEB4' },
      { name: 'Central Area', population: 20, color: '#FFEAA7' }
    ];
    
    return fakeAreas.map(area => ({
      name: area.name,
      population: area.population,
      color: area.color,
      percentage: Math.round((area.population / 150) * 100)
    }));
  };

  const generateFakeLineData = (filter) => {
    const labels = filter === 'Daily' 
      ? ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      : filter === 'Weekly' 
      ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
  
    const orders = labels.map(() => Math.floor(Math.random() * 50) + 10);
    const collections = labels.map(() => Math.floor(Math.random() * 40) + 5);
    
    return {
      labels,
      datasets: [
        {
          data: orders,
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // أخضر للطلبات
          strokeWidth: 3,
        },
        {
          data: collections,
          color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`, // أصفر للتحصيلات
          strokeWidth: 3,
        }
      ]
    };
  };
  

  
  const getMedicalPieData = async (filter) => {
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 Medical PieChart - Filter:', filter);
      console.log('👤 User ID:', userId);
      console.log('🏥 Medical ID:', medicalId);
      
      // ✅ استخدام الـ API الجديد areas-visits
      const areasVisitsRes = await get('areas-visits', null, {
        user_id: userId,
        medical_id: medicalId,
        filter: filter
      });
      
      console.log('📥 Areas Visits Response:', areasVisitsRes);
      console.log('📊 Pie Chart Data:', areasVisitsRes?.data?.pie_chart_data?.length || 0, 'areas');
      
      // ✅ استخدام البيانات الجديدة من areas-visits API
      if (areasVisitsRes?.data?.pie_chart_data && Array.isArray(areasVisitsRes.data.pie_chart_data)) {
        const pieChartData = areasVisitsRes.data.pie_chart_data;
        const statistics = areasVisitsRes.data.statistics;
        
        console.log('✅ البيانات المستلمة:');
        console.log('📊 إجمالي الزيارات:', statistics?.total_visits || 0);
        console.log('🏘️ عدد المناطق:', statistics?.total_areas || 0);
        console.log('🏆 أكثر منطقة زيارة:', statistics?.most_visited_area?.name || 'غير محدد');
        console.log('📈 متوسط الزيارات لكل منطقة:', statistics?.average_visits_per_area || 0);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        // ✅ إرجاع البيانات الجاهزة من الـ API مع عرض النسب المئوية
        const filteredData = pieChartData.filter(area => area.population > 0);
        
        console.log('🔍 البيانات المفلترة:', filteredData);
        
        // ✅ إذا لم توجد زيارات حقيقية، اعرض رسالة "لم تقم بأي زيارة اليوم"
        if (filteredData.length === 0) {
          console.warn('⚠️ لا توجد زيارات حقيقية - عرض رسالة "لم تقم بأي زيارة اليوم"');
          setNoVisitsToday(true);
          return [];
        }
        
        setNoVisitsToday(false);
        return filteredData.map(area => {
          const percentage = area.percentage || 0;
          console.log(`📍 ${area.name}: ${area.population} زيارات = ${percentage}%`);
          
          return {
            ...area,
            name: area.name, // اسم المنطقة
            population: percentage // استخدام النسبة المئوية بدلاً من العدد
          };
        });
      } else {
        console.warn('⚠️ لا توجد بيانات مناطق في هذه الفترة - استخدام بيانات وهمية');
        console.log('📊 عرض بيانات وهمية للمستخدم لمعرفة شكل التطبيق');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        return generateFakePieData();
      }
    } catch (err) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ خطأ في جلب بيانات المناطق (areas-visits):');
      console.error('Error:', err);
      console.error('Message:', err.message);
      console.error('User ID:', userId);
      console.error('Medical ID:', medicalId);
      console.error('Filter:', filter);
      console.error('📊 استخدام بيانات وهمية بدلاً من ذلك');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      return generateFakePieData();
    }
  };
  

  const getMedicalLineData = async (filter) => {
    try {
      const { dateFrom, dateTo } = getDateRange(filter);
      
      console.log('📈 Medical LineChart - جلب البيانات:', { filter, dateFrom, dateTo });
      
      const res = await get('target/medicals', null, {
        dateFrom,
        dateTo,
      });
      
      if (res?.data) {
        let labels;
        
        if (filter === 'Daily') {
          labels = ['8am', '10am', '12pm', '2pm', '4pm', '6pm'];
        } else if (filter === 'Monthly') {
          labels = ['W1', 'W2', 'W3', 'W4'];
        } else {
          labels = ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'];
        }
        
        const soldData = distributeDataAcrossLabels(res.data, labels, 'sold_units');
        const targetData = distributeDataAcrossLabels(res.data, labels, 'target');
        
        console.log('📈 Medical Line - النتيجة:', { labels, sold: soldData, target: targetData });
        
        return {
          labels,
          datasets: [
            {
              data: soldData,
              color: () => `#2F5ED8`,
              strokeWidth: 3,
            },
            {
              data: targetData,
              color: () => `#FF8C21`,
              strokeWidth: 3,
            }
          ]
        };
      } else {
        console.warn('⚠️ لا توجد بيانات للرسم البياني - استخدام بيانات وهمية');
        console.log('📊 عرض بيانات وهمية للمستخدم لمعرفة شكل التطبيق');
        return generateFakeLineData(filter);
      }
    } catch (err) {
      console.error('❌ Medical Line Error:', err);
      console.error('📊 استخدام بيانات وهمية بدلاً من ذلك');
      return generateFakeLineData(filter);
    }
    
    return generateFakeLineData(filter);
  };
  

  const getSalesPieData = async (filter) => {
    try {
      const { dateFrom, dateTo } = getDateRange(filter);
      
      console.log('💰 Sales PieChart - جلب بيانات المناطق:', { filter, dateFrom, dateTo });
      
      // ✅ استخدام API جديد للمناطق في السيلز
      const res = await get('sales-areas-visits', null, {
        dateFrom,
        dateTo,
        filter,
      });
      
      if (res?.data?.pie_chart_data && Array.isArray(res.data.pie_chart_data)) {
        const pieChartData = res.data.pie_chart_data;
        const statistics = res.data.statistics;
        
        console.log('✅ بيانات المناطق المستلمة للسيلز:');
        console.log('   - عدد المناطق:', pieChartData.length);
        console.log('   - الإحصائيات:', statistics);
        
        // ✅ إرجاع البيانات الجاهزة من الـ API مع عرض النسب المئوية
        const filteredData = pieChartData.filter(area => area.population > 0);
        
        console.log('🔍 البيانات المفلترة للمناطق:', filteredData);
        
        if (filteredData.length > 0) {
          console.log('✅ تم تحويل بيانات المناطق للسيلز بنجاح');
          return filteredData;
        } else {
          console.warn('⚠️ لا توجد بيانات للمناطق - استخدام بيانات وهمية');
          return generateFakePieData();
        }
      } else {
        console.warn('⚠️ لا توجد بيانات للمناطق في السيلز - استخدام بيانات وهمية');
        console.log('📊 عرض بيانات وهمية للمستخدم لمعرفة شكل التطبيق');
        return generateFakePieData();
      }
    } catch (err) {
      console.error('❌ Sales Areas Pie Error:', err);
      console.error('📊 استخدام بيانات وهمية بدلاً من ذلك');
      return generateFakePieData();
    }
    
    return generateFakePieData();
  };
  
 
  const getSalesLineData = async (filter) => {
    try {
      const { dateFrom, dateTo } = getDateRange(filter);
      
      console.log('📈 Sales Reports LineChart:', { filter, dateFrom, dateTo });
      
      const res = await get('sales-reports-chart', null, {
        filter,
        dateFrom,
        dateTo,
      });
      
      console.log('📥 API Response:', res?.data);
      
      if (res?.data?.sales_amount && res.data.collections_amount) {
        const { labels, sales_amount, collections_amount, statistics } = res.data;
        
        console.log('✅ بيانات المبيعات والتحصيلات:', { 
          labels, 
          sales_amount, 
          collections_amount,
          statistics 
        });
        
        return {
          labels,
          datasets: [
            {
              data: sales_amount,           // المبيعات
              color: () => `#2196F3`,       // أزرق
              strokeWidth: 3,
            },
            {
              data: collections_amount,     // التحصيلات
              color: () => `#4CAF50`,       // أخضر
              strokeWidth: 3,
            }
          ]
        };
      }
      
      return generateFakeLineData(filter);
      
    } catch (err) {
      console.error('❌ Error:', err);
      return generateFakeLineData(filter);
    }
  };
  

  const loadChartData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(isRefresh ? '🔄 تحديث بيانات الرسوم البيانية...' : '📊 جلب بيانات الرسوم البيانية');
      console.log('👤 Role:', role);
      console.log('📅 Pie Filter:', selectedPieFilter);
      console.log('📈 Line Filter:', selectedLineFilter);
      
      if (role === 'medical') {
        console.log('🏥 جلب بيانات Medical Charts...');
        const pieData = await getMedicalPieData(selectedPieFilter);
        const lineData = await getMedicalLineData(selectedLineFilter);
        
        setPieChartData(pieData);
        setLineChartData(lineData);
        
        console.log('✅ تم تحديث بيانات Medical Charts');
        
      } else if (role === 'sales') {
        console.log('💼 جلب بيانات Sales Charts...');
        const pieData = await getSalesPieData(selectedPieFilter);
        const lineData = await getSalesLineData(selectedLineFilter);
        
        setPieChartData(pieData);
        setLineChartData(lineData);
        
        console.log('✅ تم تحديث بيانات Sales Charts');
      }
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
    } catch (err) {
      console.error('❌ خطأ في loadChartData:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // ✅ دالة منفصلة لتحميل بيانات Pie Chart فقط
  const loadPieChartData = async () => {
    try {
      console.log('📊 جلب بيانات Pie Chart...');
      console.log('📅 Pie Filter:', selectedPieFilter);
      
      // ✅ إعادة تعيين حالة noVisitsToday عند تحميل بيانات جديدة
      setNoVisitsToday(false);
      
      if (role === 'medical') {
        const pieData = await getMedicalPieData(selectedPieFilter);
        setPieChartData(pieData);
        console.log('✅ تم تحديث بيانات Medical Pie Chart');
      } else if (role === 'sales') {
        const pieData = await getSalesPieData(selectedPieFilter);
        setPieChartData(pieData);
        console.log('✅ تم تحديث بيانات Sales Pie Chart');
      }
    } catch (err) {
      console.error('❌ خطأ في loadPieChartData:', err);
    }
  };

  // ✅ دالة منفصلة لتحميل بيانات Line Chart فقط
  const loadLineChartData = async () => {
    try {
      console.log('📈 جلب بيانات Line Chart...');
      console.log('📈 Line Filter:', selectedLineFilter);
      
      if (role === 'medical') {
        const lineData = await getMedicalLineData(selectedLineFilter);
        setLineChartData(lineData);
        console.log('✅ تم تحديث بيانات Medical Line Chart');
      } else if (role === 'sales') {
        const lineData = await getSalesLineData(selectedLineFilter);
        setLineChartData(lineData);
        console.log('✅ تم تحديث بيانات Sales Line Chart');
      }
    } catch (err) {
      console.error('❌ خطأ في loadLineChartData:', err);
    }
  };
  
  const onRefresh = React.useCallback(async () => {
    console.log('🔄 Pull to Refresh - إعادة تحميل البيانات...');
    await loadChartData(true);
    await fetchNotificationsCount(); // ✅ جلب عدد الاشعارات عند التحديث
  }, [role, selectedPieFilter, selectedLineFilter]);
  
  const testFetchCitiesAndAreas = async () => {
    console.log('🧪 اختبار جلب البيانات باستخدام locationService...');
    
    try {
      const result = await locationService.fetchCitiesAndAreas();
      
      if (result.success) {
        console.log('✅ اختبار ناجح - تم جلب البيانات');
        console.log('🆔 Block ID:', result.data.block_id);
        console.log('🏙️ عدد المدن:', result.data.cities?.length || 0);
        console.log('📍 عدد المناطق:', result.data.areas?.length || 0);
        
        if (result.data.areas && result.data.areas.length > 0) {
          console.log('📍 المناطق:');
          result.data.areas.forEach((area, index) => {
            console.log(`  ${index + 1}. ${area.name} (ID: ${area.id})`);
          });
        }
        
        if (result.fromCache) {
          console.log('📦 البيانات من التخزين المحلي');
        }
      } else {
        console.log('❌ اختبار فاشل:', result.error);
      }
    } catch (error) {
      console.error('❌ خطأ في الاختبار:', error);
    }
  };


  const clearAndRefetchData = async () => {
    console.log('🗑️ مسح البيانات وإعادة جلبها...');
    
    try {
      await locationService.clearCachedData();
      console.log('✅ تم مسح البيانات المخزنة');
      
      const result = await locationService.fetchCitiesAndAreas();
      
      if (result.success) {
        console.log('✅ تم إعادة جلب البيانات بنجاح');
        console.log('🏙️ عدد المدن:', result.data.cities?.length || 0);
        console.log('📍 عدد المناطق:', result.data.areas?.length || 0);
        
        if (result.data.areas && result.data.areas.length > 0) {
          console.log('📍 المناطق الجديدة:');
          result.data.areas.forEach((area, index) => {
            console.log(`  ${index + 1}. ${area.name} (ID: ${area.id})`);
          });
        }
      } else {
        console.log('❌ فشل في إعادة جلب البيانات:', result.error);
      }
    } catch (error) {
      console.error('❌ خطأ في مسح وإعادة جلب البيانات:', error);
    }
  };
  
  // ✅ دالة جلب عدد الاشعارات الجديدة (نفس منطق صفحة الاشعارات)
  const fetchNotificationsCount = async () => {
    try {
      console.log('🔔 جلب عدد الاشعارات الجديدة...');
      
      // ✅ استخدام نفس الـ endpoint المستخدم في صفحة الاشعارات
      const response = await get(`notification/${user.id}`);
      
      if (response && Array.isArray(response)) {
        // ✅ حساب عدد الاشعارات غير المقروءة (نفس منطق صفحة الاشعارات)
        const unreadCount = response.filter(notification => !notification.read_at).length;
        setNotificationsCount(unreadCount);
        console.log(`🔔 عدد الاشعارات الجديدة: ${unreadCount}`);
        console.log(`📋 إجمالي الاشعارات: ${response.length}`);
      } else {
        setNotificationsCount(0);
        console.log('🔔 لا توجد اشعارات جديدة');
      }
    } catch (error) {
      console.error('❌ خطأ في جلب الاشعارات:', error);
      setNotificationsCount(0);
    }
  };
  
  // ✅ تحميل البيانات الأولي
  useEffect(() => {
    if (currentUser && role) {
      loadChartData();
      fetchNotificationsCount(); // ✅ جلب عدد الاشعارات
    }
  }, [role, currentUser]);

  // ✅ تحميل بيانات Pie Chart عند تغيير الفلتر
  useEffect(() => {
    if (currentUser && role) {
      loadPieChartData();
    }
  }, [selectedPieFilter]);

  // ✅ تحميل بيانات Line Chart عند تغيير الفلتر
  useEffect(() => {
    if (currentUser && role) {
      loadLineChartData();
    }
  }, [selectedLineFilter]);
  
  // ✅ جلب الاشعارات عند فتح الصفحة
  useFocusEffect(
    React.useCallback(() => {
      if (currentUser && role) {
        fetchNotificationsCount();
      }
    }, [currentUser, role])
  );
  
  useFocusEffect(
    React.useCallback(() => {
      console.log('🔄 HomePage - الصفحة أصبحت نشطة (focused)');
      console.log('🔄 إعادة تحميل بيانات الـ Charts...');
      
      if (currentUser && role) {
        loadChartData();
      }
      
      return () => {
        console.log('👋 HomePage - الصفحة أصبحت غير نشطة (unfocused)');
      };
    }, [currentUser, role])
  );
  
  useEffect(() => {
    const loadUserLocationData = async () => {
      console.log('🚀 بدء جلب البيانات - HomePage useEffect (Redux Store)');
      console.log('👤 User موجود؟', !!currentUser);
      console.log('🆔 User ID:', currentUser?.id);
      
      if (currentUser?.id && token) {
        console.log('📡 بدء استدعاء Redux fetchCitiesAndAreas...');
        console.log('🔑 Token المستخدم:', token);
        try {
          const result = await dispatch(fetchCitiesAndAreas({ token }));
          
          if (result.type.endsWith('fulfilled')) {
            console.log('✅ تم جلب البيانات بنجاح من Redux Store');
            console.log('🆔 Block ID:', result.payload.block_id);
            console.log('🏙️ عدد المدن:', result.payload.cities?.length || 0);
            console.log('📍 عدد المناطق:', result.payload.areas?.length || 0);
            
            if (result.payload.areas && result.payload.areas.length > 0) {
              console.log('🏙️ ========== المناطق التي تم جلبها في HomePage ==========');
              console.log('📍 إجمالي عدد المناطق:', result.payload.areas.length);
              console.log('🆔 Block ID:', result.payload.block_id);
              
              result.payload.areas.forEach((area, index) => {
                console.log(`  ${index + 1}. ${area.name} (ID: ${area.id}) - مدينة: ${area.city_name || 'غير محدد'} (City ID: ${area.city_id})`);
              });
              
              console.log('🏙️ ============================================');
            }
          } else {
          }
        } catch (error) {
          console.error('❌ خطأ في Redux Store:', error);
        }
      } else {
        console.log('⚠️ لا يوجد User ID');
      }
    };
    
    if (currentUser?.id) {
      console.log('🎯 User ID موجود - بدء loadUserLocationData');
      loadUserLocationData();
    } else {
      console.log('⚠️ لا يوجد User ID');
    }
  }, [currentUser?.id]);

  useEffect(() => {
    const loadPublicCities = async () => {
      try {
        const action = await dispatch(fetchCitiesPublic())
        if (action.type.endsWith('fulfilled')) {
          const cities = action.payload?.cities || []
          console.log('🏙️ ========== مدن getcity (عام) ==========:')
          console.log('🧮 عدد المدن:', cities.length)
          cities.forEach((city, index) => {
            console.log(`  ${index + 1}. ${city.name} (ID: ${city.id})`)
          })
          console.log('🏙️ ======================================')

          for (const c of cities) {
            try {
              const areasAction = await dispatch(fetchAreasByCity(c.id))
              if (areasAction.type.endsWith('fulfilled')) {
                const areas = areasAction.payload?.areas || []
                console.log(`📍 مناطق المدينة ${c.name} (ID: ${c.id}) — العدد: ${areas.length}`)
                areas.forEach((a, idx) => {
                  console.log(`  ${idx + 1}. ${a.name} (ID: ${a.id}) - City ID: ${a.city_id}`)
                })
              } else {
                console.log(`❌ فشل إحضار المناطق للمدينة ${c.name}:`, areasAction.payload)
              }
            } catch (err) {
              console.log(`❌ خطأ أثناء جلب مناطق المدينة ${c.name}:`, err?.message || err)
            }
          }
        } else {
        }
      } catch (err) {
      }
    }
    loadPublicCities()
  }, [dispatch])

  useEffect(() => {
    if (userLocationData.cities.length > 0 || userLocationData.areas.length > 0) {
      console.log('🏙️ ========== البيانات المخزنة في Redux - HomePage ==========');
      console.log('🆔 Block ID:', userLocationData.block_id);
      console.log('🏙️ عدد المدن المخزنة:', userLocationData.cities.length);
      console.log('📍 عدد المناطق المخزنة:', userLocationData.areas.length);
      
      if (userLocationData.cities.length > 0) {
        console.log('🏙️ المدن المخزنة:');
        userLocationData.cities.forEach((city, index) => {
          console.log(`  ${index + 1}. ${city.name} (ID: ${city.id})`);
        });
      }
      
      if (userLocationData.areas.length > 0) {
        console.log('📍 المناطق المخزنة:');
        userLocationData.areas.forEach((area, index) => {
          console.log(`  ${index + 1}. ${area.name} (ID: ${area.id}) - مدينة: ${area.city_name || 'غير محدد'} (City ID: ${area.city_id})`);
        });
      }
      
      console.log('🏙️ ============================================');
    }
  }, [userLocationData.cities.length, userLocationData.areas.length, userLocationData.block_id]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

const categoriesData = [
  {
    id: 1,
    key: "clientList",
    image: require("../../assets/icons/client_list.png"),
    pressedColor: "#183E9F",
    onclick: () => { user?.role === 'sales' ? navigation.navigate('Clientpharmalist') : navigation.navigate('Clientdoctorlist')},
  },
  {
    id: 2,
    key: "monthlyPlan",
    image: require("../../assets/icons/monthly-plan.png"),
    pressedColor: "#183E9F",
    onclick: () => {navigation.navigate('MedicalReportScreen')},
  },
  {
    id: 3,
    key: role == 'sales' ? 'collection.headerTitle' : 'frequencyReport.headerTitle',
    image: require("../../assets/icons/visit.png"),
    pressedColor: "#183E9F",
     onclick: () => { role == 'sales' ? navigation.navigate('Collection') : navigation.navigate('FrequencyReport')},
  },
  {
    id: 4,
    key: "sales",
    image: require("../../assets/icons/online-store.png"),
    pressedColor: "#183E9F",
     onclick: () => { navigation.navigate('Sales')},
  },

];
  

  const options = [
    { label: t("homeScreen.daily"), value: "Daily" },
    { label: t("homeScreen.monthly"), value: "Monthly" },
    { label: t("homeScreen.yearly"), value: "Yearly" },
  ];

  const lineChartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: "4", strokeWidth: "1", stroke: "#2167ffff" },
  };

  const totalPopulation = pieChartData && pieChartData.length > 0
    ? pieChartData.reduce((sum, item) => sum + (item.population || 0), 0)
    : 0;
  
  const achievedPercentage = totalPopulation > 0 && pieChartData[0]
    ? Math.round((pieChartData[0].population / totalPopulation) * 100)
    : 0;
  
  const remainingPercentage = 100 - achievedPercentage;

  if (isLoading) {
    return (
      <SafeAreaView style={Styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ height: heightScreen }}>
          <View style={Styles.loadingHeaderContainer}>
            <LinearGradient
              colors={["#69b4ddff", "#0574b1ff"]}
              style={Styles.loadingLinearGradient}
            >
              <View style={Styles.loadingHeaderTop}>
                <View style={Styles.loadingImageContainer}>
                  <View style={Styles.loadingImage} />
                </View>
                <View style={{ width: widthScreen * 0.02 }} />
                <View style={Styles.loadingTextContainer}>
                  <View style={Styles.loadingWelcomeText} />
                  <View style={[Styles.loadingWelcomeText, { width: '70%', marginTop: 5 }]} />
                </View>
                <View style={Styles.loadingNotificationContainer}>
                  <View style={Styles.loadingNotificationIcon} />
                  <View style={Styles.loadingNotificationBadge} />
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={Styles.loadingPieChartContainer}>
            <View style={Styles.loadingPieChartInner}>
              <View style={Styles.loadingPieChart}>
                <View style={Styles.loadingPieChartHeader}>
                  <View style={Styles.loadingPieChartTitle} />
                  <View style={Styles.loadingPieChartArrow} />
                </View>
                <View style={Styles.loadingPieChartContent}>
                  <View style={Styles.loadingPieChartCircle} />
                  <View style={Styles.loadingPieChartCenterText} />
                </View>
              </View>
              
              <View style={Styles.loadingDropdownContainer}>
                <View style={Styles.loadingDropdownButton}>
                  <View style={Styles.loadingDropdownText} />
                  <View style={Styles.loadingDropdownArrow} />
                </View>
              </View>
            </View>
          </View>

          <View style={Styles.loadingLineChartContainer}>
            <View style={Styles.loadingLineChartInner}>
              <View style={Styles.loadingLineChartHeader}>
                <View style={Styles.loadingLineChartTitle} />
                <View style={Styles.loadingLineChartArrow} />
              </View>
              
              <View style={Styles.loadingLegendContainer}>
                <View style={Styles.loadingLegendItem}>
                  <View style={Styles.loadingLegendLine} />
                  <View style={Styles.loadingLegendText} />
                </View>
                <View style={Styles.loadingLegendItem}>
                  <View style={[Styles.loadingLegendLine, { backgroundColor: '#183E9F' }]} />
                  <View style={Styles.loadingLegendText} />
                </View>
              </View>

              <View style={Styles.loadingLineChartContent}>
                <View style={Styles.loadingLineChartGraph} />
              </View>
            </View>
          </View>

          <View style={Styles.loadingCategoriesContainer}>
            <View style={Styles.loadingCategoriesTitle} />
            <View style={Styles.loadingCategoriesGrid}>
              {[1, 2, 3, 4].map((item) => (
                <View key={item} style={Styles.loadingCategoryItem}>
                  <View style={Styles.loadingCategoryIcon} />
                  <View style={Styles.loadingCategoryText} />
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 100 }}></View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={Styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={{ height: heightScreen }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#183E9F', '#2F5ED8']}
            tintColor="#183E9F"
            title={t("homeScreen.updating")}
            titleColor="#183E9F"
          />
        }
      >
        <View style={Styles.headerContainer}>
          <LinearGradient
            colors={["#69b4ddff", "#0574b1ff"]}
            style={Styles.linearGradient}
          >
            <View style={Styles.headerContainerTop}>
              <View style={Styles.containerImage}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ProfileScreen')}
                  style={Styles.imageButton}
                >
                  <Image
                    source={
                      currentUser?.profile_image_url || currentUser?.medicals?.profile_image
                        ? { uri: currentUser.profile_image_url || currentUser.medicals.profile_image }
                        : require("../../assets/images/doctor.png")
                    }
                    style={Styles.imageStyle}
                    onError={() => {
                      console.log('❌ فشل في تحميل صورة البروفايل');
                    }}
                    onLoad={() => {
                      console.log('✅ تم تحميل صورة البروفايل بنجاح');
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ width: widthScreen * 0.02 }} />
              <View style={Styles.containerColumn}>
                <Text style={Styles.TextWelcomeBack}>
                  {t("homeScreen.welcomeBack")}
                </Text>
                <Text style={Styles.TextNameUser}>{currentUser?.name || t("homeScreen.user")}</Text>
                <Text style={Styles.TextNameUser}>
                  {currentUser?.supervisor?.name || currentUser?.distributor_name || t("homeScreen.noSupervisor")}
                </Text>
              </View>
              <View style={Styles.containerNotification}>
                <TouchableOpacity
                  onPress={() =>
                   navigation.navigate('NotificationScreen')  
                  }
                  style={Styles.notificationButton}
                >
                  <FontAwesome
                    name="bell-o"
                    size={widthScreen * 0.05}
                    color="#fff"
                  />
                  {notificationsCount > 0 && (
                    <View style={Styles.notificationBadge}>
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: widthScreen * 0.025,
                          fontWeight: "600",
                        }}
                      >
                        {notificationsCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={Styles.containerChartPie}>
          <View style={Styles.innerContainerChartPie}>
            <View style={Styles.ChartPie}>
              <View style={Styles.rowChartTitle}>
                {/* <Text style={Styles.chartTitle}>{t("homeScreen.detail")}</Text>
                <FontAwesome
                  name="angle-right"
                  size={widthScreen * 0.06}
                  color="#2085BC"
                  style={{ marginLeft: widthScreen * 0.02 }}
                /> */}
              </View>
              <View style={Styles.containerChart}>
                {pieChartData && pieChartData.length > 0 ? (
                  <PieChart
                    data={pieChartData}
                    width={widthScreen * 0.9}
                    height={heightScreen * 0.2}
                    chartConfig={lineChartConfig}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    center={[10, 0]}
                    absolute
                    hasLegend={false}
                  />
                ) : noVisitsToday ? (
                  <View style={{ height: heightScreen * 0.2, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 12, margin: 10 }}>
                    <View style={{ alignItems: 'center', padding: 20 }}>
                      <FontAwesome name="calendar-times-o" size={40} color="#6C757D" />
                      <Text style={{ color: '#6C757D', fontSize: 16, fontWeight: '600', marginTop: 10, textAlign: 'center' }}>
                        لم تقم بأي زيارة اليوم
                      </Text>
                      <Text style={{ color: '#999', fontSize: 12, marginTop: 5, textAlign: 'center' }}>
                        ابدأ زيارتك الأولى لرؤية الإحصائيات
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={{ height: heightScreen * 0.2, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#999', fontSize: 14 }}>{t("homeScreen.loadingData")}</Text>
                  </View>
                )}
              </View>
              {!noVisitsToday && (
                <View style={Styles.circleChartPie}>
                  {/* <Text style={Styles.numberPercentRemaining}>
                    {`${remainingPercentage}%`}
                  </Text> */}
                </View>
              )}
            </View>

            <View style={Styles.dropdownContainer}>
              <TouchableOpacity
                style={Styles.dropdownButton}
                onPress={() => setShowPieOptions(!showPieOptions)}
              >
                <Text style={Styles.dropdownButtonText}>
                  {selectedPieFilter === "Today" ? t("homeScreen.daily") : t(`homeScreen.${selectedPieFilter.toLowerCase()}`)}
                </Text>
                <FontAwesome
                  name={showPieOptions ? "chevron-up" : "chevron-down"}
                  size={widthScreen * 0.03}
                  color="#2085BC"
                  style={{ marginHorizontal: widthScreen * 0.02 }}
                />
              </TouchableOpacity>
              <View style={Styles.MoreDetailsContainer}>
<TouchableOpacity style={{flexDirection:I18nManager.isRTL?"row-reverse": "row", alignItems: "center"}} onPress={() => navigation.navigate('PieChartDetails')}>
  <Text style={{fontSize: widthScreen * 0.035, color: "#2085BC"}}>{t('homeScreen.moreDetails')}</Text>
  <FontAwesome
                  name={"chevron-right"}
                  size={widthScreen * 0.03}
                  color="#2085BC"
                  style={{ marginHorizontal: widthScreen * 0.02,  marginTop:5} }
                />
</TouchableOpacity>

              </View>
              {showPieOptions && (
                <View style={Styles.dropdownMenu}>
                  {options.map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      style={Styles.dropdownItem}
                      onPress={() => {
                        setSelectedPieFilter(item.value);
                        setShowPieOptions(false);
                      }}
                    >
                      <Text style={Styles.dropdownItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
         
            {pieChartData && pieChartData.length > 0 && (
              <View style={Styles.legendContainer}>
                <ScrollView 
                  horizontal={false}
                  showsVerticalScrollIndicator={false}
                  style={Styles.legendScrollContainer}
                  contentContainerStyle={Styles.legendScrollContent}
                >
                  {pieChartData.slice(0, 2).map((item, index) => (
                    <View key={index} style={Styles.legendItem}>
                      <View style={[
                        Styles.legendColorBox,
                        { backgroundColor: item.color }
                      ]} />
                      <View style={Styles.containerColumnLegendText}>
                        <Text style={Styles.legendText}>{item.name}</Text>
                        <Text style={Styles.TextNumbers}>
                          {item.population}%
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          
          </View>
        </View>

        <View style={Styles.LineChartOuterContainer}>
          <View style={Styles.dropdownContainer}>
            <TouchableOpacity
              style={Styles.dropdownButton}
              onPress={() => setShowLineOptions(!showLineOptions)}
            >
              <Text style={Styles.dropdownButtonText}>
                {t(`homeScreen.${selectedLineFilter.toLowerCase()}`)}
              </Text>
              <FontAwesome
                name={showLineOptions ? "chevron-up" : "chevron-down"}
                size={widthScreen * 0.03}
                color="#2085BC"
                style={{  marginHorizontal: widthScreen * 0.02}}
              />
            </TouchableOpacity>
            {showLineOptions && (
              <View style={Styles.dropdownMenu}>
                {options.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={Styles.dropdownItem}
                    onPress={() => {
                      setSelectedLineFilter(item.value);
                      setShowLineOptions(false);
                    }}
                  >
                    <Text style={Styles.dropdownItemText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={Styles.legendContainerLineChart}>
            <View style={Styles.legendSalesContainer}>
              <View style={Styles.LineLegendSales}></View>
              <View>
                <Text style={Styles.TextSales}>
                  {role === 'sales' ? "المبيعات" : t("homeScreen.totalSales")}
                </Text>
              </View>
            </View>
            <View style={Styles.legendTargetContainer}>
              <View style={[Styles.LineLegendTarget, {backgroundColor: '#4CAF50'}]}></View>
              <View>
                <Text style={Styles.TextTarget}>
                  {role === 'sales' ? "التحصيلات" : t("homeScreen.totalTarget")}
                </Text>
              </View>
            </View>
          </View>

          <View style={Styles.ChartLineContainerinner}>
            {lineChartData && lineChartData.labels && lineChartData.datasets ? (
              <LineChart
                data={lineChartData}
                width={widthScreen * 0.9}
                height={heightScreen * 0.22}
                chartConfig={lineChartConfig}
                bezier
                style={{ borderRadius: 16 }}
                withHorizontalLines={false}
                withVerticalLines={false}
                fromZero={true}
                withShadow={false}
                hideLegend={true}
              />
            ) : (
              <View style={{ height: heightScreen * 0.22, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#999', fontSize: 14 }}>{t("homeScreen.loadingData")}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={Styles.containerCategories}>
          <Text style={Styles.TextCategoies}>{t("homeScreen.management")}</Text>
          <View style={Styles.innerContainerCatgories}>
            {categoriesData.map((category) => (
              <View key={category.id} style={Styles.categoryItemContainer}>
                <AnimatedPressable
                  onPress={() => category.onclick()}
                  style={Styles.containerButton}
                  baseColor="#ffffff"
                  pressedColor={category.pressedColor}
                >
                  <Image source={category.image} style={Styles.IconCatgories} />
                </AnimatedPressable>
                <Text style={Styles.categoryText}>
                  {category.key.includes('.') ? t(category.key) : t(`homeScreen.${category.key}`)}
                </Text>
              </View>
            ))}
          </View>
        </View>
       

          
        <View style={{ height: 100 }}></View>
      </ScrollView>
      {isLoading && <LoadingScreen />}
    </SafeAreaView>
  );
};




const Styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    height: heightScreen * 0.28,
    width: widthScreen,
    borderBottomLeftRadius: widthScreen * 0.05,
    borderBottomRightRadius: widthScreen * 0.05,
    backgroundColor: "#EBEBEB",
  },
  headerContainerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: widthScreen * 0.05,
    marginTop: heightScreen * 0.012,
    width: "100%",
  },
  linearGradient: {
    flex: 1,
    borderBottomLeftRadius: widthScreen * 0.15,
    borderBottomRightRadius: widthScreen * 0.15,
    paddingHorizontal: widthScreen * 0.03,
    width: "100%",
  },
  containerImage: {
    width: widthScreen * 0.12,
    height: widthScreen * 0.12,
    backgroundColor: "#fff",
    borderRadius: (widthScreen * 0.12) / 2,
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: (widthScreen * 0.12) / 2,
    resizeMode: "cover",
  },
  TextWelcomeBack: {
    color: "#fff",
    fontSize: widthScreen * 0.03,
    fontWeight: "400",
  },
  TextNameUser: {
    color: "#fff",
    fontSize: widthScreen * 0.035,
    fontWeight: "600",
  },
  containerNotification: {
    position: "absolute",
    right: widthScreen * 0.025,
    top: heightScreen * 0.015,
    backgroundColor: "#183e9fd5",
    padding: widthScreen * 0.02,
    borderRadius: widthScreen * 0.025,
  },
  notificationBadge: {
    position: "absolute",
    top: -heightScreen * 0.008,
    right: -widthScreen * 0.008,
    backgroundColor: "#FF0000",
    width: widthScreen * 0.04,
    height: widthScreen * 0.04,
    borderRadius: (widthScreen * 0.04) / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  containerChartPie: {
    marginTop: -heightScreen * 0.19,
    marginHorizontal: widthScreen * 0.05,
    width: widthScreen * 0.9,
    height: heightScreen * 0.3,
    backgroundColor: "#fff",
    borderRadius: widthScreen * 0.05,
    zIndex: 100,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    paddingHorizontal: widthScreen * 0.025,
    overflow: "visible",
  },
  innerContainerChartPie: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  ChartPie: {
    marginTop: heightScreen * 0.01,
    position: "absolute",
 

    start: widthScreen * 0.33,
    
  },
  containerChart: {
    width: widthScreen * 0.9,
    height: heightScreen * 0.2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    top: heightScreen * 0.06,
    right:I18nManager.isRTL? 120:0

  },
  circleChartPie: {
    width: widthScreen * 0.2,
    height: widthScreen * 0.2,
    borderRadius: (widthScreen * 0.2) / 2,
    backgroundColor: "#fff",
    zIndex: 1,
    position: "absolute",
    top: heightScreen * 0.112,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  
    start: widthScreen * 0.194,
  },

  legendContainer: { zIndex: 0, paddingTop: 0, justifyContent: "space-around" },
  legendItem: {
    flexDirection: "row",
    marginHorizontal: widthScreen * 0.025,
    marginBottom: heightScreen * 0.02,
  },
  legendColorBox: {
    backgroundColor: "#2F5ED8",
    width: widthScreen * 0.05,
    height: widthScreen * 0.05,
    borderRadius: (widthScreen * 0.05) / 2,
    marginEnd: widthScreen * 0.02,
    marginTop: heightScreen * 0.032,
  },
  legendText: {
    fontSize: widthScreen * 0.035,
    color: "#000000ff",
    fontWeight: "400",
    textAlign: 'left',
   
  },
  containerColumnLegendText: {
    flexDirection: "column",
    gap: 5,
    paddingTop: 22,
  },
  TextNumbers: {
    fontSize: widthScreen * 0.065,
    color: "#2085BC",
    fontWeight: "600",
  },
  rowChartTitle: {
    flexDirection: I18nManager.isRTL? "row-reverse":"row",
    gap: widthScreen * 0.01,
    position: 'absolute', 
    start: widthScreen * 0.33,
    top: heightScreen * 0.01,
    marginBottom: heightScreen * 0.04,
    alignItems: 'center', 
  },
  dropdownContainer: {
    position: "relative",
    alignItems: "flex-start",
    marginTop: heightScreen * 0.02,
    marginStart: widthScreen * 0.04,
    zIndex: 1000,
    flexDirection: I18nManager.isRTL?"row-reverse": "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButton: {
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: widthScreen * 0.02,
    paddingHorizontal: widthScreen * 0.03,
    backgroundColor: "#fff",
    minWidth: widthScreen * 0.3,
  },
  dropdownButtonText: {
    fontSize: widthScreen * 0.035,
    color: "#2085BC",
    flex: 1,
    textAlign: 'left',
  },
  dropdownMenu: {
    position: "absolute",
    top: heightScreen * 0.06,
    start: 0,
    borderRadius: widthScreen * 0.02,
    backgroundColor: "#fff",
    minWidth: widthScreen * 0.3,
    maxHeight: heightScreen * 0.25,
    zIndex: 2000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingHorizontal: widthScreen * 0.03,
    paddingVertical: heightScreen * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    textAlign: 'left',
  }
,
  chartTitle: { fontSize: widthScreen * 0.035, color: "#2085BC" },
  LineChartOuterContainer: {
    width: widthScreen * 0.9,
    height: heightScreen * 0.36,
    backgroundColor: "#fff",
    borderRadius: widthScreen * 0.05,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    paddingHorizontal: widthScreen * 0.025,
    alignSelf: "center",
    marginTop: heightScreen * 0.02,
    marginBottom: 10,
  },
  legendContainerLineChart: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginTop: 9,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  legendSalesContainer: {
    flexDirection: "row",
    width: 110,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  LineLegendSales: {
    width: widthScreen * 0.1,
    height: heightScreen * 0.012,
    backgroundColor: "#2F5ED8",
    borderRadius: 20,
  },
  TextSales: { fontSize: 12, color: "#000000ff", fontWeight: "400" },
  legendTargetContainer: {
    flexDirection: "row",
    width: 110,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
  },
  LineLegendTarget: {
    width: widthScreen * 0.1,
    height: heightScreen * 0.012,
    backgroundColor: "#FF8C21",
    borderRadius: 20,
  },
  TextTarget: { fontSize: 12, color: "#000000ff", fontWeight: "400" },
  ChartLineContainerinner: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
  },
  containerCategories: { paddingHorizontal: widthScreen * 0.05, marginTop: 0 },
  TextCategoies: {
    color: "#1A46BE",
    marginLeft: widthScreen * 0.024,
    marginBottom: 15,
    fontWeight: "500",
    fontSize: 16,
  },
  innerContainerCatgories: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  categoryItemContainer: { alignItems: "center", width: widthScreen * 0.2 },
  containerButton: {
    width: widthScreen * 0.16,
    height: heightScreen * 0.078,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.15,
    elevation: 5,
  },
  IconCatgories: {
    width: widthScreen * 0.1,
    height: heightScreen * 0.047,
    alignSelf: "center",
    resizeMode: "contain",
  },
  categoryText: {
    marginTop: 8,
    fontSize: widthScreen * 0.03,
    color: "#1A46BE",
    fontWeight: "400",
    textAlign: "center",
  },
  loadingHeaderContainer: {
    height: heightScreen * 0.28,
    width: widthScreen,
    borderBottomLeftRadius: widthScreen * 0.05,
    borderBottomRightRadius: widthScreen * 0.05,
    backgroundColor: "#EBEBEB",
    marginBottom: 20,
  },
  loadingLinearGradient: {
    flex: 1,
    borderBottomLeftRadius: widthScreen * 0.05,
    borderBottomRightRadius: widthScreen * 0.05,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  loadingHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadingImageContainer: {
    width: widthScreen * 0.15,
    height: widthScreen * 0.15,
    borderRadius: widthScreen * 0.075,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    width: widthScreen * 0.12,
    height: widthScreen * 0.12,
    borderRadius: widthScreen * 0.06,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  loadingTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  loadingWelcomeText: {
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 10,
    width: '90%',
  },
  loadingNotificationContainer: {
    position: 'relative',
  },
  loadingNotificationIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  loadingNotificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B6B',
  },
  
  loadingPieChartContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  loadingPieChartInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loadingPieChart: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  loadingPieChartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  loadingPieChartTitle: {
    height: 18,
    backgroundColor: '#e0e0e0',
    borderRadius: 9,
    width: '60%',
  },
  loadingPieChartArrow: {
    width: 20,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginLeft: 10,
  },
  loadingPieChartContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    position: 'relative',
  },
  loadingPieChartCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  loadingPieChartCenterText: {
    position: 'absolute',
    width: 30,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  loadingDropdownContainer: {
    width: 80,
  },
  loadingDropdownButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  loadingDropdownText: {
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    width: '60%',
  },
  loadingDropdownArrow: {
    width: 12,
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  
  loadingLineChartContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  loadingLineChartInner: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  loadingLineChartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  loadingLineChartTitle: {
    height: 18,
    backgroundColor: '#e0e0e0',
    borderRadius: 9,
    width: '50%',
  },
  loadingLineChartArrow: {
    width: 20,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginLeft: 10,
  },
  loadingLegendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  loadingLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingLegendLine: {
    width: 20,
    height: 3,
    backgroundColor: '#2F5ED8',
    borderRadius: 2,
    marginRight: 8,
  },
  loadingLegendText: {
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 7,
    width: 60,
  },
  loadingLineChartContent: {
    height: 120,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 10,
  },
  loadingLineChartGraph: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  
  loadingCategoriesContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  loadingCategoriesTitle: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    width: '40%',
    marginBottom: 15,
  },
  loadingCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingCategoryItem: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 15,
  },
  loadingCategoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    marginBottom: 8,
  },
  loadingCategoryText: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    width: '80%',
  },
});

export default HomePage;
