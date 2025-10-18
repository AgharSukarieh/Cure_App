import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  I18nManager,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomDatePicker from '../components/CustomPicker';
import CustomDropdown from '../components/CustomDropDown'; 
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { get } from '../WebService/RequestBuilder';
import Constants from '../config/globalConstants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useCurrentUser } from '../hooks/useCurrentUser';

const { width } = Dimensions.get('window');

// ✅ ثوابت الجدول
const FIXED_COLUMN_WIDTH = width * 0.3;
const SCROLLABLE_CELL_WIDTH = width * 0.25;
const ROW_HEIGHT = 70;




const Reports = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  // ✅ استخدام Custom Hook للوصول لبيانات المستخدم
  const { user: currentUser, isFromRedux, isFromContext } = useCurrentUser();
  
  // ✅ Refs
  const scrollViewRef = useRef(null);
  
  // ✅ Console logs للتحقق
  useEffect(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 مصدر بيانات المستخدم في Reports:');
    console.log('   - From Redux:', isFromRedux ? '✅' : '❌');
    console.log('   - From Context:', isFromContext ? '✅' : '❌');
    console.log('   - Current User ID:', currentUser?.id);
    console.log('   - Current User Role:', currentUser?.role);
    console.log('   - Current User Name:', currentUser?.name);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }, [currentUser, isFromRedux, isFromContext]);

  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [availableAreas, setAvailableAreas] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  
  // API states
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // ✅ Scroll to Top state
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Get reports endpoint based on user role
  const getReportsEndpoint = () => {
    // ✅ استخدم الـ endpoints الجديدة
    if (currentUser?.role === 'sales') {
      return 'target/sales';
    } else {
      return 'target/medicals';
    }
  };

  // Fetch reports data from API
  const fetchReportsData = async (isRefresh = false, pageNum = 1) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      
      // ✅ بناء الـ query parameters
      const params = {
        page: pageNum,
        per_page: 10, // عدد الصفوف لكل صفحة
      };
      
      if (fromDate) {
        params.dateFrom = fromDate;
      }
      if (toDate) {
        params.dateTo = toDate;
      }
      if (selectedCity) {
        params.cityId = selectedCity;
      }
      if (selectedArea) {
        params.areaId = selectedArea;
      }
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 جلب بيانات التقارير');
      console.log('   - Endpoint:', getReportsEndpoint());
      console.log('   - User Role:', currentUser?.role);
      console.log('   - User ID:', currentUser?.id);
      console.log('   - Page:', pageNum);
      console.log('   - Parameters:', params);
      
      const response = await get(getReportsEndpoint(), null, params);
      
      console.log('📊 استجابة API التقارير:', response);
      console.log('   - Data count:', response?.data?.length || 0);
      
      // ✅ معالجة البيانات من pagination أو direct
      let data = [];
      let meta = null;
      
      if (response?.data) {
        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          data = response.data.data;
          meta = response.data;
        }
      }
      
      // ✅ تحديد إذا كان هناك المزيد من البيانات
      if (meta) {
        const hasMore = meta.current_page < meta.last_page;
        setHasMoreData(hasMore);
        console.log(`   - Page ${meta.current_page} of ${meta.last_page}`);
        console.log(`   - Has more: ${hasMore}`);
      } else {
        // إذا لم يكن هناك pagination metadata
        setHasMoreData(data.length >= 10);
      }
      
      // ✅ إضافة البيانات أو استبدالها
      if (pageNum === 1) {
        setReportData(data);
        setCurrentPage(1);
      } else {
        setReportData(prev => [...prev, ...data]);
        setCurrentPage(pageNum);
      }
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
    } catch (error) {
      console.error('❌ خطأ في جلب بيانات التقارير:', error);
      if (pageNum === 1) {
        setReportData([]);
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  // ✅ بيانات المدن والمناطق (مثال - يمكن جلبها من Redux أو API)
  const cities = ['Amman', 'Irbid', 'Zarqa', 'Aqaba'];
  const areas = {
    'Amman': ['Abdoun', 'Shmeisani', 'Sweifieh', 'Jabal Amman'],
    'Irbid': ['Downtown', 'University', 'Hay Nuzha'],
    'Zarqa': ['Downtown', 'New Zarqa'],
    'Aqaba': ['City Center', 'Ayla']
  };

  // Load data on component mount
  useEffect(() => {
    if (currentUser?.id) {
      fetchReportsData(false, 1);
    }
  }, [currentUser?.id]);
  
  // ✅ Reload data when filters change
  useEffect(() => {
    if (currentUser?.id && (fromDate || toDate || selectedCity || selectedArea)) {
      const timer = setTimeout(() => {
        // إعادة تعيين pagination عند تغيير الفلاتر
        setCurrentPage(1);
        setHasMoreData(true);
        fetchReportsData(false, 1);
      }, 500); // debounce
      
      return () => clearTimeout(timer);
    }
  }, [fromDate, toDate, selectedCity, selectedArea]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    const newAreas = areas[city] || [];
    setAvailableAreas(newAreas);
    setSelectedArea(null); // ✅ امسح المنطقة المحددة عند تغيير المدينة
  };
  
  // ✅ إعادة تعيين الفلاتر
  const resetFilters = useCallback(async () => {
    console.log('🔄 إعادة تعيين جميع الفلاتر');
    setSelectedCity(null);
    setSelectedArea(null);
    setFromDate(null);
    setToDate(null);
    setAvailableAreas([]);
    
    // ✅ إعادة تعيين pagination
    setCurrentPage(1);
    setHasMoreData(true);
    
    // إعادة تحميل البيانات بدون فلاتر
    try {
      setIsLoading(true);
      await fetchReportsData(false, 1);
    } catch (error) {
      console.error("❌ خطأ في إعادة تحميل البيانات:", error);
    }
  }, []);
  
  // ✅ التمرير للأعلى
  const scrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);
  
  // ✅ تحميل المزيد من البيانات
  const loadMoreData = useCallback(async () => {
    if (isLoadingMore || !hasMoreData || isLoading) {
      return;
    }
    
    console.log('📥 تحميل المزيد من البيانات...');
    const nextPage = currentPage + 1;
    await fetchReportsData(false, nextPage);
  }, [isLoadingMore, hasMoreData, isLoading, currentPage]);
  
  // ✅ معالجة حدث التمرير
  const handleScroll = useCallback((event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const currentScrollY = contentOffset.y;
    
    // إظهار زر العودة للأعلى عند التمرير لأسفل أكثر من 300
    setShowScrollToTop(currentScrollY > 300);
    
    // ✅ تحميل المزيد عند الوصول للنهاية
    const paddingToBottom = 200;
    const isNearBottom = 
      layoutMeasurement.height + contentOffset.y >= 
      contentSize.height - paddingToBottom;
    
    if (isNearBottom && hasMoreData && !isLoadingMore && !isLoading) {
      console.log('🔽 وصلت للنهاية - تحميل المزيد...');
      loadMoreData();
    }
  }, [hasMoreData, isLoadingMore, isLoading, loadMoreData]);

  // ✅ حساب Achievement من النسبة المئوية
  const calculateAchievement = (soldUnits, target) => {
    if (!target || target === 0) return 'N/A';
    
    const percentage = (soldUnits / target) * 100;
    
    if (percentage >= 100) return 'Exceeded';
    if (percentage >= 80) return 'Achieved';
    return 'NOC';
  };
  
  const getAchievementColor = (achievement) => {
    switch (achievement) {
      case 'Achieved': return '#51CF66';
      case 'Exceeded': return '#339AF0';
      case 'NOC': return '#FF6B6B';
      default: return '#999';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={handleScroll}
        scrollEventThrottle={400}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchReportsData(true)}
            colors={['#183E9F']}
          />
        }
      >
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <View style={styles.filterBox}>
              <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>{t("reports.selectCity")}</Text>
              <CustomDropdown
                options={cities}
                selectedValue={selectedCity}
                onSelect={handleCitySelect}
                placeholder={t("reports.selectCity")}
              />
            </View>
            <View style={styles.filterBox}>
              <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>{t("reports.selectArea")}</Text>
              <CustomDropdown
                options={availableAreas}
                selectedValue={selectedArea}
                onSelect={setSelectedArea}
                placeholder={t("reports.selectArea")}
              />
            </View>
          </View>

          <View style={styles.filterRow}>
            <View style={styles.filterBox}>
              <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>{t("reports.from")}</Text>
              <CustomDatePicker
                value={fromDate}
                onDateChange={setFromDate}
                placeholder={t("reports.from")}
              />
            </View>
            <View style={styles.filterBox}>
              <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>{t("reports.to")}</Text>
              <CustomDatePicker
                value={toDate}
                onDateChange={setToDate}
                placeholder={t("reports.to")}
              />
            </View>
          </View>
          
          {/* ✅ زر إعادة تعيين الفلاتر */}
          <View style={styles.resetFiltersContainer}>
            <TouchableOpacity 
              style={styles.resetFiltersButton}
              onPress={resetFilters}
            >
              <AntDesign name="reload1" size={16} color="#183E9F" />
              <Text style={[styles.resetFiltersText, isRTL && styles.rtlText]}>
                {t("reports.resetFilters") || "إعادة تعيين الفلاتر"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tableContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#183E9F" />
              <Text style={styles.loadingText}>جاري التحميل...</Text>
            </View>
          ) : reportData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>لا توجد بيانات متاحة</Text>
            </View>
          ) : (
            <View style={styles.table}>
              {/* ✅ العمود الثابت */}
              <View style={styles.fixedColumn}>
                <View style={styles.fixedHeaderCell}>
                  <Text style={[styles.fixedHeaderText, isRTL && styles.rtlText]}>
                    {t("reports.name")}
                  </Text>
                </View>
                {reportData.map((item, index) => (
                  <View
                    key={`report-fixed-${item.id}-${item.product_id}-${index}`}
                    style={[
                      styles.fixedCell,
                      index % 2 === 1 ? styles.oddRow : styles.evenRow,
                    ]}
                  >
                    <Text style={styles.fixedCellText}>
                      { item.product || 'N/A'}
                    </Text>
                  </View>
                ))}
              </View>

              {/* ✅ الأعمدة المتحركة */}
              <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View style={styles.scrollablePart}>
                  {/* ✅ Header Row */}
                  <View style={styles.scrollableHeaderRow}>
                    <View style={styles.scrollableHeaderCell}>
                      <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                        {t("reports.sales")}
                      </Text>
                    </View>
                    <View style={styles.scrollableHeaderCell}>
                      <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                        {t("reports.target")}
                      </Text>
                    </View>
                    <View style={styles.scrollableHeaderCell}>
                      <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                        {t("reports.achievement")}
                      </Text> 
                     </View>
                   
                  </View>
                  
                  {/* ✅ Data Rows */}
                  {reportData.map((item, index) => {
                    // ✅ حساب Achievement إذا لم يكن موجوداً
                    const achievement = item.achievement || calculateAchievement(item.sold_units, item.target);
                    
                    return (
                      <View
                        key={`report-${item.id}-${item.product_id}-${index}`}
                        style={[
                          styles.scrollableDataRow,
                          index % 2 === 1 ? styles.oddRow : styles.evenRow,
                        ]}
                      >
                        <View style={styles.scrollableCell}>
                          <Text style={styles.scrollableCellText}>
                            {item.sold_units || 0}
                          </Text>
                        </View>
                        <View style={styles.scrollableCell}>
                          <Text style={styles.scrollableCellText}>
                            {item.target || 0}
                          </Text>
                        </View>
                      
                        <View style={styles.scrollableCell}>
                          <Text style={styles.scrollableCellText}>
                            {item.percentage || '0%'}
                          </Text>
                        </View>
                        
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
        
        {/* ✅ Loading More Indicator */}
        {isLoadingMore && (
          <View style={styles.loadingMoreContainer}>
            <AntDesign name="downcircleo" size={24} color="#183E9F" />
            <Text style={styles.loadingMoreText}>
              {t("reports.loadingMore") || "جاري تحميل المزيد..."}
            </Text>
          </View>
        )}
        
        {/* ✅ No More Data Indicator */}
        {!hasMoreData && reportData.length > 0 && (
          <View style={styles.noMoreDataContainer}>
            <Text style={styles.noMoreDataText}>
              {t("reports.noMoreData") || "لا توجد بيانات أخرى"}
            </Text>
          </View>
        )}
      </ScrollView>
      
      {/* ✅ زر العودة للأعلى - Floating فوق الجدول */}
      {showScrollToTop && (
        <TouchableOpacity
          style={styles.scrollToTopButton}
          onPress={scrollToTop}
        >
          <AntDesign name="upcircleo" size={24} color="#FFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    container: {
      flex: 1,
    },
    filtersContainer: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: '#FFFFFF',
      margin: 15,
      borderRadius: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    filterRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    filterBox: {
      flex: 1,
      marginHorizontal: 5,
    },
    filterLabel: {
      fontSize: 14,
      color: '#888',
      marginBottom: 5,
    },
    // ✅ زر Reset الفلاتر
    resetFiltersContainer: {
      marginTop: 5,
      alignItems: 'center',
    },
    resetFiltersButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#F8F9FA',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#183E9F',
    },
    resetFiltersText: {
      marginLeft: 8,
      fontSize: 14,
      color: '#183E9F',
      fontWeight: '600',
    },
    tableContainer: {
      flex: 1,
      paddingHorizontal: 15,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 50,
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#666',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 50,
    },
    emptyText: {
      fontSize: 16,
      color: '#888',
      textAlign: 'center',
    },
    // ✅ تصميم الجدول من ClientDoctorList
    table: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 8,
      overflow: 'hidden',
    },
    fixedColumn: {
      width: FIXED_COLUMN_WIDTH,
      backgroundColor: '#FFFFFF',
      borderRightWidth: 1,
      borderRightColor: '#E0E0E0',
    },
    fixedHeaderCell: {
      height: ROW_HEIGHT,
      justifyContent: 'center',
      paddingHorizontal: 10,
      backgroundColor: '#F1F3F5',
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    fixedHeaderText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#183E9F',
      textAlign: 'center',
    },
    fixedCell: {
      height: ROW_HEIGHT,
      justifyContent: 'center',
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
    },
    fixedCellText: {
      fontSize: 14,
      color: '#333',
      textAlign: 'center',
    },
    scrollablePart: {
      flex: 1,
    },
    scrollableHeaderRow: {
      flexDirection: 'row',
      backgroundColor: '#F1F3F5',
    },
    scrollableHeaderCell: {
      width: SCROLLABLE_CELL_WIDTH,
      height: ROW_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    scrollableHeaderText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#183E9F',
      textAlign: 'center',
    },
    scrollableDataRow: {
      flexDirection: 'row',
    },
    scrollableCell: {
      width: SCROLLABLE_CELL_WIDTH,
      height: ROW_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
    },
    scrollableCellText: {
      fontSize: 14,
      color: '#333',
      textAlign: 'center',
    },
    evenRow: {
      backgroundColor: '#FFFFFF',
    },
    oddRow: {
      backgroundColor: '#FAFAFA',
    },
    // ✅ زر Scroll to Top (Floating)
    scrollToTopButton: {
      position: 'absolute',
      bottom: 100,
      right: 30,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#28A745',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      zIndex: 9999, // ✅ فوق كل شيء
    },
    // ✅ Loading More Indicator
    loadingMoreContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
      gap: 10,
    },
    loadingMoreText: {
      fontSize: 14,
      color: '#183E9F',
      fontWeight: '600',
    },
    // ✅ No More Data Indicator
    noMoreDataContainer: {
      paddingVertical: 20,
      alignItems: 'center',
    },
    noMoreDataText: {
      fontSize: 14,
      color: '#999',
      fontStyle: 'italic',
    },
    // أنماط RTL
    rtlText: {
      textAlign: 'right',
      writingDirection: 'rtl',
    },
  });

export default Reports;

