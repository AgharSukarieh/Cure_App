import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  I18nManager,
  Modal,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import { useTranslation } from 'react-i18next';
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { Dropdown } from "react-native-element-dropdown";
import globalConstants from "../config/globalConstants";
import { useAuth } from "../contexts/AuthContext";
import { get, post } from "../WebService/RequestBuilder";
import Constants from "../config/globalConstants";
import SuccessfullyModel from "../components/Modals/SuccessfullyModel";
import AddNewPharmacyModel from "../components/Modals/AddNewPharmacyModel";
import GoBack from "../components/GoBack";
const { width, height } = Dimensions.get("window");

// const GoBack = ({ text }) => (
//   <View style={styles.header}>
//     <Text style={styles.headerText}>{text}</Text>
//   </View>
// );

const ClientPharmacyList = ({ header = true }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isRTL = I18nManager.isRTL;
  
  const [allPharmacies, setAllPharmacies] = useState([]);
  const [cachedPharmacies, setCachedPharmacies] = useState([]);
  const [cityArea, setCityArea] = useState(null);
  
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [allAreas, setAllAreas] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [addPharmacyModalVisible, setAddPharmacyModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const scrollViewRef = useRef(null);

  const user_id = user.id;
  const getPharmaciesEndpoint = globalConstants.baseURL + globalConstants.sales.pharmacy;
  const getCityAreaEndpoint = globalConstants.users.cityArea;

  const [filters, setFilters] = useState({
    city_id: null,
    area_id: null,
    category_id: null,
    searchTerm: "",
  });

  
  const loadFilterData = useCallback(async () => {
    try {
      console.log('🗺️ جلب بيانات المدن والمناطق...');
      const response = await get(`${getCityAreaEndpoint}${user_id}`);
      const cityArea = response.data;
      
      const cityArray = cityArea.cities.map(c => ({
        value: c.id,
        label: c.name
      }));
      setCities(cityArray);

      const areaArray = cityArea.areas.map(a => ({
        value: a.id,
        label: a.name,
        city_id: a.city_id
      }));
      setAllAreas(areaArray);
      
      console.log('✅ تم تحميل المدن:', cityArray.length);
      console.log('✅ تم تحميل المناطق:', areaArray.length);
      
    } catch (error) {
      console.error('❌ خطأ في جلب بيانات المدن والمناطق:', error);
    }
  }, [user_id, getCityAreaEndpoint]);

  const fetchData = useCallback(async (currentPage = 1, isRefresh = false) => {
    console.log('🔄 جلب البيانات - الصفحة:', currentPage, 'التحديث:', isRefresh);
    
    if (currentPage === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    
    try {
      if (currentPage === 1 || isRefresh) {
        await loadFilterData();
      }
      
      const response = await get(`${getPharmaciesEndpoint}?page=${currentPage}&limit=5&user_id=${user?.id}`);
      console.log('📊 استجابة البيانات:', response);
      
      const newPharmacies = response.data || [];
      
      if (newPharmacies.length === 0) {
        setHasMoreData(false);
      } else {
        if (isRefresh || currentPage === 1) {
          setAllPharmacies(newPharmacies);
          setCachedPharmacies(newPharmacies);
          setHasMoreData(true);
        } else {
          setAllPharmacies(prevPharmacies => {
            const existingIds = new Set(prevPharmacies.map(p => p.id));
            const filteredNewPharmacies = newPharmacies.filter(p => !existingIds.has(p.id));
            const updatedPharmacies = [...prevPharmacies, ...filteredNewPharmacies];
            setCachedPharmacies(updatedPharmacies);
            return updatedPharmacies;
          });
        }
      }
      
    } catch (error) {
      console.error('❌ خطأ في جلب البيانات:', error);
      if (currentPage === 1) {
        setAllPharmacies([]);
      }
    } finally {
      if (currentPage === 1) {
        setIsLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  }, [user?.id, getPharmaciesEndpoint, loadFilterData]);

  useEffect(() => {
    const loadInitialData = async () => {
      if (user?.id) {
        console.log('🚀 بدء تحميل البيانات الأولية...');
        console.log('👤 معرف المستخدم:', user.id);
        
        if (cachedPharmacies.length > 0) {
          console.log('♻️ استخدام البيانات المخبأة');
          setAllPharmacies(cachedPharmacies);
          setIsLoading(false);
        } else {
          console.log('🔄 تحميل بيانات جديدة');
          
          await loadFilterData();
          
          setPage(1);
          setHasMoreData(true);
          
          await fetchData(1, true);
          
          setTimeout(async () => {
            await fetchData(2, false);
            setPage(2);
          }, 300);
        }
      } else {
        console.warn('⚠️ لا يوجد معرف مستخدم');
      }
    };
    
    loadInitialData();
  }, [user?.id]);

  useEffect(() => {
    const retryTimer = setTimeout(() => {
      if (isLoading && allPharmacies.length === 0) {
        console.log('⏳ إعادة محاولة جلب البيانات...');
        fetchData(1, true);
      }
    }, 10000);

    return () => clearTimeout(retryTimer);
  }, [isLoading, allPharmacies.length, fetchData]);

  const loadMoreData = useCallback(() => {
    if (!isLoadingMore && hasMoreData && !isLoading) {
      console.log('⬇️ تحميل المزيد من البيانات');
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage, false);
    }
  }, [page, isLoadingMore, hasMoreData, isLoading, fetchData]);

  const handleScroll = useCallback((event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 50; 
    
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      loadMoreData();
    }
    
    if (contentOffset.y > 200) {
      setIsScrolled(true); 
    } else {
      setIsScrolled(false); 
    }
  }, [loadMoreData]);

  const onRefresh = useCallback(async () => {
    console.log('🔄 السحب للتحديث');
    setRefreshing(true);
    setPage(1);
    setHasMoreData(true);
    setCachedPharmacies([]); 
    
    await fetchData(1, true);
    setTimeout(async () => {
      await fetchData(2, false);
      setPage(2);
      setRefreshing(false);
    }, 400);
  }, [fetchData]);

  const filteredPharmacies = useMemo(() => {
    if (isLoading && allPharmacies.length === 0) return [];
    
    console.log('🔍 === فلترة البيانات ===');
    console.log('الفلاتر الحالية:', filters);
    console.log('إجمالي الصيدليات:', allPharmacies.length);
    
    return allPharmacies.filter(pharmacy => {
      const searchTermLower = filters.searchTerm.toLowerCase();
      const nameMatch = (pharmacy.name || '').toLowerCase().includes(searchTermLower);
      
      const cityMatch = !filters.city_id || pharmacy.city_id == filters.city_id;
      
      const areaMatch = !filters.area_id || pharmacy.area_id == filters.area_id;
      
      const categoryMatch = !filters.category_id || pharmacy.category_id == filters.category_id;
      
      console.log(`صيدلية: ${pharmacy.name}`);
      console.log(`- البحث: ${nameMatch}`);
      console.log(`- المدينة: ${pharmacy.city_id} === ${filters.city_id} ? ${cityMatch}`);
      console.log(`- المنطقة: ${pharmacy.area_id} === ${filters.area_id} ? ${areaMatch}`);
      console.log(`- التصنيف: ${pharmacy.category_id} === ${filters.category_id} ? ${categoryMatch}`);
      console.log(`- النتيجة النهائية: ${nameMatch && cityMatch && areaMatch && categoryMatch}`);
      
      return nameMatch && cityMatch && areaMatch && categoryMatch;
    });
  }, [allPharmacies, filters, isLoading]);

  const handleFilterChange = useCallback((key, value) => {
    console.log(`🔧 تغيير الفلتر: ${key} = ${value}`);
    
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      if (key === 'city_id') {
        newFilters.area_id = null;
        
        const filteredAreas = allAreas.filter(area => area.city_id == value);
        console.log('🗺️ المناطق المفلترة:', filteredAreas);
        setAreas(filteredAreas);
      }
      
      console.log('📊 الفلاتر الجديدة:', newFilters);
      return newFilters;
    });
  }, [allAreas]);

  const clearFilters = useCallback(() => {
    console.log('🗑️ مسح جميع الفلاتر');
    setFilters({ 
      searchTerm: "", 
      city_id: null, 
      area_id: null, 
      category_id: null 
    });
    setAreas([]);
  }, []);

  const onPharmacyAdded = useCallback((success) => {
    setAddPharmacyModalVisible(false);
    if (success) {
      setSuccessModalVisible(true);
      
      setPage(1);
      setHasMoreData(true);
      setCachedPharmacies([]);
      
      const reloadData = async () => {
        await fetchData(1, true);
        setTimeout(async () => {
          await fetchData(2, false);
          setPage(2);
        }, 300);
      };
      
      reloadData();
      setTimeout(() => setSuccessModalVisible(false), 2000);
    }
  }, [fetchData]);

  const scrollToTop = useCallback(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
      setIsScrolled(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
       <GoBack text={t('clientPharmacyList.headerTitle')}/>
    
      <ScrollView
        style={styles.container}
        ref={scrollViewRef}
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#183E9F']}
            tintColor="#183E9F"
            title={t('clientPharmacyList.pullToRefresh')}
          />
        }
      >
        <View style={styles.filtersContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.searchInput, isRTL && styles.rtlText]}
              placeholder={t('clientPharmacyList.searchPlaceholder') || "ابحث عن صيدلية..."}
              placeholderTextColor="#888"
              value={filters.searchTerm}
              onChangeText={(text) => handleFilterChange("searchTerm", text)}
            />
            <TouchableOpacity onPress={clearFilters}>
              <Feather name="x" color="#888" size={20} />
            </TouchableOpacity>
          </View>
          
          {isLoading && cities.length === 0 ? (
            <View style={styles.filterLoadingContainer}>
              <Text style={[styles.filterLoadingText, isRTL && styles.rtlText]}>
                جاري تحميل الفلاتر...
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.filterRow}>
                <View style={styles.filterBox}>
                  <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>
                    {t('clientPharmacyList.filterByCity') || "المدينة"}
                  </Text>
                  <Dropdown
                    style={styles.dropdown}
                    data={cities}
                    labelField="label"
                    valueField="value"
                    placeholder={t('clientPharmacyList.allCities') || "جميع المدن"}
                    value={filters.city_id}
                    onChange={(item) => handleFilterChange("city_id", item.value)}
                    {...dropdownStyles}
                  />
                </View>
                
                <View style={styles.filterBox}>
                  <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>
                    {t('clientPharmacyList.filterByArea') || "المنطقة"}
                  </Text>
                  <Dropdown
                    style={styles.dropdown}
                    data={areas}
                    labelField="label"
                    valueField="value"
                    placeholder={
                      !filters.city_id 
                        ? (t('clientPharmacyList.selectCityFirst') || "اختر المدينة أولاً")
                        : (t('clientPharmacyList.allAreas') || "جميع المناطق")
                    }
                    value={filters.area_id}
                    onChange={(item) => handleFilterChange("area_id", item.value)}
                    disable={!filters.city_id}
                    {...dropdownStyles}
                  />
                </View>
              </View>
              
              {/* <View style={styles.filterBoxFullWidth}>
                <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>
                  {t('clientPharmacyList.filterByCategory') || "التصنيف"}
                </Text>
                <Dropdown
                  style={styles.dropdown}
                  data={specialties}
                  labelField="label"
                  valueField="value"
                  placeholder={t('clientPharmacyList.allCategories') || "جميع التصنيفات"}
                  value={filters.category_id}
                  onChange={(item) => handleFilterChange("category_id", item.value)}
                  {...dropdownStyles}
                />
              </View> */}
            </>
          )}
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableWrapper}>
            <View style={styles.fixedColumn}>
              <View style={[styles.fixedHeaderCell, styles.tableHeader]}>
                <Text style={[styles.fixedHeaderText, isRTL && styles.rtlText]}>
                  {t('clientPharmacyList.pharmacyName')}
                </Text>
              </View>
              
              {isLoading && allPharmacies.length === 0 ? (
                <View style={styles.fixedCell}>
                  <Text style={[styles.emptyText, isRTL && styles.rtlText]}>
                    {t('clientPharmacyList.loading')}
                  </Text>
                </View>
              ) : (
                filteredPharmacies.map((item, index) => (
                  <View
                    key={item.id}
                    style={[styles.fixedCell, index % 2 === 1 && styles.oddRow]}
                  >
                    <Text style={styles.fixedCellText} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                ))
              )}
            </View>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              style={styles.scrollableContent}
            >
              <View>
                <View style={[styles.scrollableHeaderRow, styles.tableHeader]}>
                  <View style={styles.scrollableHeaderCell}>
                    <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                      Address
                    </Text>
                  </View>
                  <View style={styles.scrollableHeaderCell}>
                    <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                      Area
                    </Text>
                  </View>
                  <View style={styles.scrollableHeaderCell}>
                    <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                      Class
                    </Text>
                  </View>
                  <View style={styles.scrollableHeaderCell}>
                    <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                      Phone
                    </Text>
                  </View>
                  <View style={styles.scrollableHeaderCell}>
                    <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                      Responsible
                    </Text>
                  </View>
                </View>
                
                {!isLoading && filteredPharmacies.map((item, index) => (
                  <View
                    key={item.id}
                    style={[styles.scrollableRow, index % 2 === 1 && styles.oddRow]}
                  >
                    <View style={styles.scrollableCell}>
                      <Text style={styles.scrollableCellText}>
                        {item.city} 
                      </Text>
                    </View>
                    <View style={styles.scrollableCell}>
                      <Text style={styles.scrollableCellText}>
                        {item.area} 
                      </Text>
                    </View>
                    <View style={styles.scrollableCell}>
                      <Text style={styles.scrollableCellText}>
                        {item.classification}
                      </Text>
                    </View>
                    <View style={styles.scrollableCell}>
                      <Text style={styles.scrollableCellText}>
                        {item.phone}
                      </Text>
                    </View>
                    <View style={styles.scrollableCell}>
                      <Text style={styles.scrollableCellText} numberOfLines={2}>
                        {item.responsible_pharmacist_name}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
          
          {!isLoading && filteredPharmacies.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, isRTL && styles.rtlText]}>
                {t('clientPharmacyList.noData')}
              </Text>
            </View>
          )}
        </View>

        {isLoadingMore && (
          <View style={styles.loadingMoreContainer}>
            <Text style={[styles.loadingText, isRTL && styles.rtlText]}>
              {t('clientPharmacyList.loadingMore') || 'جاري تحميل المزيد...'}
            </Text>
          </View>
        )}

        {!hasMoreData && allPharmacies.length > 0 && (
          <View style={styles.loadingMoreContainer}>
            <Text style={[styles.noMoreDataText, isRTL && styles.rtlText]}>
              {t('clientPharmacyList.noMoreData') || 'لا توجد بيانات أخرى'}
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => (isScrolled ? scrollToTop() : setAddPharmacyModalVisible(true))}
      >
        <AntDesign name={isScrolled ? "up" : "plus"} size={24} color="#FFF" />   
      </TouchableOpacity>

      <AddNewPharmacyModel
        show={addPharmacyModalVisible}
        hide={() => setAddPharmacyModalVisible(false)}
        submit={onPharmacyAdded}
        cities={cities}
        allAreas={allAreas}
        specialties={specialties}
      />

       <SuccessfullyModel
        show={successModalVisible}
        message={t('clientPharmacyList.addNewPharmacyModal.successMessage')}
      /> 

    </SafeAreaView>
  );
};

const dropdownStyles = {
  itemTextStyle: { color: "#333", fontSize: 14, textAlign: "left" },
  selectedTextStyle: { fontSize: 14, color: "#333" },
  placeholderStyle: { fontSize: 14, color: "#999" },
  containerStyle: { borderRadius: 8 },
  maxHeight: 200,
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8F9FA" },
  container: { flex: 1 },
  header: {
    padding: 15,
    backgroundColor: "#FFF",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  headerText: { fontSize: 18, fontWeight: "bold", color: "#183E9F" },
  
  filtersContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    margin: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F6F8",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    height: 45,
  },
  searchInput: { flex: 1, fontSize: 16, color: "#333", paddingHorizontal: 5 },
  filterRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  filterBox: { flex: 1, marginHorizontal: 5 },
  filterBoxFullWidth: { marginHorizontal: 5 },
  filterLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    fontWeight: "600",
  },
  dropdown: {
    height: 45,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
  },
  
  tableContainer: { flex: 1, marginHorizontal: 15, minHeight: 300 },
  tableWrapper: { flexDirection: "row", minHeight: 200 },
  fixedColumn: { width: width * 0.4 },
  scrollableContent: { flex: 1 },
  
  tableHeader: { backgroundColor: "#F1F3F5" },
  fixedHeaderCell: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  fixedHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#183E9F",
    textAlign: "center",
  },
  scrollableHeaderRow: { flexDirection: "row" },
  scrollableHeaderCell: {
    width: width * 0.4,
    paddingVertical: 16.1,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  scrollableHeaderText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1A46BE",
    textAlign: "center",
  },
  
  fixedCell: {
    width: width * 0.4,
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#FFF",
  },
  fixedCellText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  scrollableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#FFF",
  },
  scrollableCell: {
    width: width * 0.4,
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollableCellText: { 
    fontSize: 14, 
    color: "#333", 
    textAlign: "center",
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  oddRow: { backgroundColor: "#FAFAFA" },
  
  emptyState: { 
    padding: 40, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  emptyText: { 
    fontSize: 16, 
    color: "#888", 
    textAlign: "center" 
  },
  loadingMoreContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#007BFF",
    textAlign: "center",
    fontWeight: "500",
  },
  noMoreDataText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    fontStyle: "italic",
  },
  
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#183E9F",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  
  rtlText: {
    textAlign: "right",
  },
  
  filterLoadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  
  filterLoadingText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});

export default ClientPharmacyList;