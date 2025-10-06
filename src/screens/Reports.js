import React, { useState, useEffect } from 'react';
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

} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomDatePicker from '../components/CustomPicker';
import CustomDropdown from '../components/CustomDropDown'; 
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { get } from '../WebService/RequestBuilder';
import Constants from '../config/globalConstants';

const { width } = Dimensions.get('window');

const cities = ['Amman', 'Zarqa', 'Irbid', 'Aqaba'];
const areas = {
  Amman: ['AlAbdali', 'Sweifieh', 'Jabal Amman', 'Tlaa Al-Ali'],
  Zarqa: ['Zarqa City', 'Russeifa'],
  Irbid: ['Irbid City', 'Ramtha'],
  Aqaba: ['Aqaba City'],
};

const reportData = [
  { id: 1, name: 'Dr. anas', sales: 3000, target: 3500, achievement: 'NOC', region: 'North', performance: '85.7%', bonus: 500 },
  { id: 2, name: 'Dr. sami', sales: 4200, target: 4000, achievement: 'Achieved', region: 'Central', performance: '105%', bonus: 800 },
  { id: 3, name: 'Dr. layla', sales: 2800, target: 3500, achievement: 'NOC', region: 'South', performance: '80%', bonus: 300 },
  { id: 4, name: 'Dr. ahmad', sales: 500000, target: 480000, achievement: 'Exceeded', region: 'East', performance: '104.2%', bonus: 2000 },
  { id: 5, name: 'Dr. fatima', sales: 3450, target: 3500, achievement: 'NOC', region: 'West', performance: '98.6%', bonus: 450 },
  { id: 6, name: 'Dr. omar', sales: 3000, target: 3500, achievement: 'NOC', region: 'North', performance: '85.7%', bonus: 500 },
  { id: 7, name: 'Dr. yara', sales: 1200000, target: 1000000, achievement: 'Exceeded', region: 'Central', performance: '120%', bonus: 5000 },
  { id: 8, name: 'Dr. khaled', sales: 3000, target: 3500, achievement: 'NOC', region: 'South', performance: '85.7%', bonus: 500 },
  { id: 9, name: 'Dr. rami', sales: 3100, target: 3500, achievement: 'NOC', region: 'East', performance: '88.6%', bonus: 550 },
  { id: 10, name: 'Dr. suha', sales: 3900, target: 3500, achievement: 'Achieved', region: 'West', performance: '111.4%', bonus: 750 },
];

const Reports = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const isRTL = I18nManager.isRTL;

  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [availableAreas, setAvailableAreas] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  
  // API states
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Get reports endpoint based on user role
  const getReportsEndpoint = user.role == 'sales' ? 
    Constants.sales.reports : 
    Constants.medical.reports;

  // Fetch reports data from API
  const fetchReportsData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      console.log('📊 جلب بيانات التقارير من:', getReportsEndpoint);
      const response = await get(`${getReportsEndpoint}?user_id=${user?.id}`);
      console.log('📊 استجابة API التقارير:', response);
      
      const data = response.data || [];
      setReportData(data);
      
    } catch (error) {
      console.error('❌ خطأ في جلب بيانات التقارير:', error);
      setReportData([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (user?.id) {
      fetchReportsData();
    }
  }, [user?.id]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    const newAreas = areas[city] || [];
    setAvailableAreas(newAreas);
    setSelectedArea(newAreas[0] || null); 
  };

  const getAchievementColor = (achievement) => {
    switch (achievement) {
      case 'Achieved': return '#51CF66';
      case 'Exceeded': return '#339AF0';
      case 'NOC': default: return '#FF6B6B';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
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
            <View style={styles.tableWrapper}>
              <View style={styles.fixedColumn}>
                <View style={[styles.fixedHeaderCell, styles.tableHeader]}>
                  <Text style={[styles.fixedHeaderText, isRTL && styles.rtlText]}>{t("reports.name")}</Text>
                </View>
                {reportData.map((item, index) => (
                  <View key={item.id || index} style={[styles.fixedCell, index % 2 === 1 ? styles.oddRow : styles.evenRow]}>
                    <Text style={styles.fixedCellText}>{item.name || item.product}</Text>
                  </View>
                ))}
              </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.scrollableContent}>
              <View style={styles.scrollableTable}>
                <View style={[styles.scrollableHeaderRow, styles.tableHeader]}>
                  <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t("reports.sales")}</Text></View>
                  <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t("reports.target")}</Text></View>
                  <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t("reports.achievement")}</Text></View>
                  <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t("reports.region")}</Text></View>
                  <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t("reports.performance")}</Text></View>
                  <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t("reports.bonus")}</Text></View>
                </View>
                {reportData.map((item, index) => (
                  <View key={item.id || index} style={[styles.scrollableRow, index % 2 === 1 ? styles.oddRow : styles.evenRow]}>
                    <View style={styles.scrollableCell}>
                      <Text style={styles.scrollableCellText}>
                        {item.sold_units || item.sales || 0}
                      </Text>
                    </View>
                    <View style={styles.scrollableCell}>
                      <Text style={styles.scrollableCellText}>
                        {item.target || 0}
                      </Text>
                    </View>
                    <View style={styles.scrollableCell}>
                      <Text style={[styles.scrollableCellText, { color: getAchievementColor(item.achievement), fontWeight: 'bold' }]}>
                        {item.achievement || 'NOC'}
                      </Text>
                    </View>
                    <View style={styles.scrollableCell}>
                      <Text style={styles.scrollableCellText}>
                        {item.region || item.area || '-'}
                      </Text>
                    </View>
                    <View style={styles.scrollableCell}>
                      <Text style={styles.scrollableCellText}>
                        {item.percentage || item.performance || '0%'}
                      </Text>
                    </View>
                    <View style={styles.scrollableCell}>
                      <Text style={styles.scrollableCellText}>
                        {item.bonus || item.bonus || 0}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: '#1c6dbeff',
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#183E9F',
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
    tableContainer: {
      flex: 1,
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
    tableWrapper: {
      flexDirection: 'row',
    },
    fixedColumn: {
      width: width * 0.25,
     
    
      
    },
    fixedHeaderCell: {
      paddingVertical: 15,
      paddingHorizontal: 10,
      justifyContent: 'center',

    },
    fixedHeaderText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#183E9F',
      textAlign: 'center',
    },
    fixedCell: {
      paddingVertical: 15,
      paddingHorizontal: 10,
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
       
      
    },
    fixedCellText: {
      fontSize: 14,
      color: '#333',
      textAlign: 'center',
      borderRightWidth:   I18nManager.isRTL? 0 : 1,
      borderLeftWidth:  I18nManager.isRTL?1:0,
      borderLeftColor:"#9D9292",
      borderRightColor:"#9D9292",
    },
    scrollableContent: {
      flex: 1,
    },
    scrollableTable: {
      minWidth: width * 1.5,
    },
    scrollableHeaderRow: {
      flexDirection: 'row',
    },
    scrollableHeaderCell: {
      width: width * 0.25,
      paddingVertical: 16,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollableHeaderText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#1A46BE',
      textAlign: 'center',
    
    },
    scrollableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
    },
    scrollableCell: {
      width: width * 0.25,
      paddingVertical: 15,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollableCellText: {
      fontSize: 14,
      color: '#333',
      textAlign: 'center',
    },
    tableHeader: {
  
    },
    evenRow: {
      backgroundColor: '#FFFFFF',
    },
    oddRow: {
      backgroundColor: '#FAFAFA',
    },
    // أنماط RTL
    rtlText: {
      textAlign: 'right',
      writingDirection: 'rtl',
    },
  });

export default Reports;
