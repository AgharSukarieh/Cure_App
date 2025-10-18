import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  I18nManager,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrentUser, useMedicalId, useUserId } from '../../hooks/useCurrentUser';
import { get } from '../../WebService/RequestBuilder';
import { PieChart } from 'react-native-chart-kit';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import GoBack from '../../components/GoBack';

const { width: widthScreen, height: heightScreen } = Dimensions.get('window');

const PieChartDetails = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { user: currentUser } = useCurrentUser();
  const medicalId = useMedicalId();
  const userId = useUserId();
  const isRTL = I18nManager.isRTL;

  const [pieChartData, setPieChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('Monthly');


  const filterOptions = [
    { label: t("homeScreen.today"), value: "Today" },
  
    { label: t("homeScreen.monthly"), value: "Monthly" },
    { label: t("homeScreen.yearly"), value: "Yearly" },
  ];

 
  const getAreasData = async (filter) => {
    try {
      setIsLoading(true);
      console.log('📊 جلب بيانات المناطق - Filter:', filter);
      console.log('👤 نوع المستخدم:', currentUser?.role || user?.role);
      
      let areasVisitsRes;
      
      // ✅ التحقق من نوع المستخدم واستخدام API المناسب
      if (currentUser?.role === 'sales' || user?.role === 'sales') {
        console.log('💼 جلب بيانات المناطق للسيلز...');
        areasVisitsRes = await get('sales-areas-visits', null, {
          filter: filter
        });
      } else {
        console.log('🏥 جلب بيانات المناطق للميديكال...');
        areasVisitsRes = await get('areas-visits', null, {
          user_id: userId,
          medical_id: medicalId,
          filter: filter
        });
      }
      
      console.log('📥 Areas Visits Response:', areasVisitsRes);
      
      if (areasVisitsRes?.data?.pie_chart_data && Array.isArray(areasVisitsRes.data.pie_chart_data)) {
        const pieChartData = areasVisitsRes.data.pie_chart_data;
        const statistics = areasVisitsRes.data.statistics;
        
        console.log('✅ البيانات المستلمة:');
        console.log('📊 إجمالي الزيارات:', statistics?.total_visits || 0);
        console.log('🏘️ عدد المناطق:', statistics?.total_areas || 0);
        
      
        const filteredData = pieChartData
          .filter(area => area.population > 0)
          .map(area => ({
            ...area,
            name: area.name || 'غير محدد',
            population: area.population || 0, // ✅ استخدام population مباشرة (النسبة المئوية)
            color: area.color || '#FF6B6B',
            visits_count: area.visits_count || 0,
            pharmacies_count: area.pharmacies_count || 0,
            total_sales: area.total_sales || 0
          }));
        
        console.log('📊 البيانات المفلترة:', filteredData);
        setPieChartData(filteredData);
      } else {
        setPieChartData([]);
      }
    } catch (err) {
      console.error('❌ خطأ في جلب بيانات المناطق:', err);
      setPieChartData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAreasData(selectedFilter);
  }, [selectedFilter]);

 
  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForLabels: {
      fontSize: 12,
      fontFamily: 'System',
      fontWeight: '600'
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome 
          name={isRTL ? "chevron-right" : "chevron-left"} 
          size={24} 
          color="#183E9F" 
        />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>
        {t("homeScreen.detail")}
      </Text>
      <View style={styles.headerSpacer} /> */}
       <GoBack  text={t("homeScreen.detail")}/>
    </View>
  );

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.filterButton,
              selectedFilter === option.value && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter(option.value)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === option.value && styles.filterButtonTextActive
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPieChart = () => (
    <View style={styles.chartContainer}>
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.chartCard}
      >
        {/* <Text style={[styles.chartTitle, isRTL && styles.rtlText]}>
          {t("homeScreen.detail")}
        </Text> */}
        
        {pieChartData && pieChartData.length > 0 ? (
          <View style={styles.donutContainer}>
            {(() => {
              try {
                console.log('📊 رسم PieChart مع البيانات:', pieChartData);
                return (
                  <PieChart
                    data={pieChartData}
                    width={widthScreen * 0.85}
                    height={heightScreen * 0.3}
                    chartConfig={chartConfig}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    paddingLeft={"15"}
                    center={[65, 0]}
                    absolute={false}
                    hasLegend={false}
                  />
                );
              } catch (chartError) {
                console.error('❌ خطأ في رسم PieChart:', chartError);
                return (
                  <View style={styles.noDataContainer}>
                    <Text style={[styles.noDataText, isRTL && styles.rtlText]}>
                      خطأ في عرض الرسم البياني
                    </Text>
                  </View>
                );
              }
            })()}
            <View style={styles.donutHole}>
              <Text style={styles.donutAreaName}>
                {pieChartData.length > 0 ? pieChartData[0].name : ''}
              </Text>
              <Text style={styles.donutPercentage}>
                {pieChartData.length > 0 ? `${pieChartData[0].population}%` : ''}
              </Text>
              <Text style={styles.donutVisits}>
                {pieChartData.length > 0 ? (
                  currentUser?.role === 'sales' || user?.role === 'sales' 
                    ? `${pieChartData[0].visits_count || 0} زيارة` 
                    : `${pieChartData[0].population} زيارة`
                ) : ''}
              </Text>
              {(currentUser?.role === 'sales' || user?.role === 'sales') && pieChartData.length > 0 && (
                <Text style={styles.donutSales}>
                  {pieChartData[0].total_sales ? `${pieChartData[0].total_sales.toLocaleString()} JOD` : ''}
                </Text>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={[styles.noDataText, isRTL && styles.rtlText]}>
              {isLoading ? t("homeScreen.loadingData") : 'لا توجد بيانات للمناطق'}
            </Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );

  const renderAreasList = () => {
    // ✅ Debug: تحقق من الترجمة
    console.log('🔍 PieChartDetails Debug:');
    console.log('Current language:', i18n.language);
    console.log('Translation result:', t("pieChartDetails.areasAndVisits"));
    console.log('RTL:', isRTL);
    console.log('i18n object:', i18n);
    console.log('i18n.language type:', typeof i18n.language);
    
    return (
      <View style={styles.areasContainer}>
        <Text style={[styles.areasTitle, isRTL && styles.rtlText]}>
         {I18nManager.isRTL?" المناطق والزيارات":"Areas and Visits"}
        </Text>
      
      {pieChartData.map((area, index) => (
        <View key={index} style={styles.areaItem}>
          <View style={styles.areaItemLeft}>
            <View style={[
              styles.areaColorBox,
              { backgroundColor: area.color }
            ]} />
            <View style={styles.areaInfo}>
              <Text style={[styles.areaName, isRTL && styles.rtlText]}>
                {area.name}
              </Text>
              
            </View>
          </View>
          <View style={styles.areaItemRight}>
            <Text style={[styles.areaValue, isRTL && styles.rtlText]}>
              {area.population}%
            </Text>
            <Text style={[styles.areaVisits, isRTL && styles.rtlText]}>
              {currentUser?.role === 'sales' || user?.role === 'sales' 
                ? `${area.visits_count || 0} ${I18nManager.isRTL?" زيارة":"Visit"}` 
                : `${area.population} ${I18nManager.isRTL?" زيارة":"Visit"}`}
            </Text>
            {(currentUser?.role === 'sales' || user?.role === 'sales') && (
              <Text style={[styles.areaSales, isRTL && styles.rtlText]}>
                {area.total_sales ? `${area.total_sales.toLocaleString()} JOD` : '0 JOD'}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#F8F9FA" barStyle="dark-content" />
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, isRTL && styles.rtlText]}>
            {t("homeScreen.loadingData")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#F8F9FA" barStyle="dark-content" />
      
      {renderHeader()}
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderFilterButtons()}
        {renderPieChart()}
        {renderAreasList()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 15,
  },
  headerSpacer: {
    flex: 1,
  },
  rtlText: {
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  filterContainer: {
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  filterScrollContent: {
    paddingHorizontal: 5,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#183E9F',
    borderColor: '#183E9F',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  chartContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    flexDirection:  'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
//   chartCard: {
//     borderRadius: 15,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 8,
//     shadowOpacity: 0.1,
//     elevation: 4,
//   },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  noDataContainer: {
    height: heightScreen * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  areasContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  areasTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  areaItem: {
    flexDirection: I18nManager?"row-reverse":'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  areaItemLeft: {
    flexDirection: I18nManager?"row-reverse":'row',
    alignItems: 'center',
    flex: 1,
  },
  areaColorBox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
    marginHorizontal:5
  },
  areaInfo: {
    flex: 1,
  },
  areaName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  areaPercentage: {
    fontSize: 12,
    color: '#666',
  },
  areaItemRight: {
    alignItems: 'center',
  },
  areaValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#183E9F',
  },
  areaVisits: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  areaSales: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 2,
  },
  
  // ✅ إضافة styles للدونت
  donutContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutHole: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 80,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
   
  
  },
  donutText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#183E9F',
    textAlign: 'center',
  },
  donutAreaName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#183E9F',
    textAlign: 'center',
    marginBottom: 4,
  },
  donutPercentage: {
    fontSize: 18,
    fontWeight: '800',
    color: '#183E9F',
    textAlign: 'center',
  },
  donutVisits: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  donutSales: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 2,
  },
});

export default PieChartDetails;
