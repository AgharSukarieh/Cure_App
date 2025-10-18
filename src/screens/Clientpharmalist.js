import React, { useEffect, useState, useCallback, useRef } from "react";
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
  RefreshControl,
  StatusBar,
} from "react-native";
import { useTranslation } from 'react-i18next';
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { Dropdown } from "react-native-element-dropdown";
import { useAuth } from "../contexts/AuthContext";
import { get } from "../WebService/RequestBuilder";
import SuccessfullyModel from "../components/Modals/SuccessfullyModel";
import AddNewPharmacyModel from "../components/Modals/AddNewPharmacyModel";
import GoBack from "../components/GoBack";
import { useDispatch, useSelector } from 'react-redux';
import SkuModel from "../components/Modals/skuModel";

const { width } = Dimensions.get("window");
const FIXED_COLUMN_WIDTH = width * 0.4;
const SCROLLABLE_COLUMN_WIDTH = width * 0.35;
const ROW_HEIGHT = 60;

const ClientPharmacyList = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isRTL = I18nManager.isRTL;
  const dispatch = useDispatch();
  const userLocationData = useSelector(state => state.cities.userLocationData);
  
  const [allPharmacies, setAllPharmacies] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [allAreas, setAllAreas] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [addPharmacyModalVisible, setAddPharmacyModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const scrollViewRef = useRef(null);

  const [filters, setFilters] = useState({
    city_id: null,
    area_id: null,
    classification: null,
    searchTerm: "",
  });

  const classifications = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
  ];

  const fetchPharmacies = useCallback(async (pageNum = 1, isRefresh = false) => {
    if (pageNum === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    
    try {
      console.log(`🔄 جلب الصيدليات - الصفحة: ${pageNum}`);
      
      const params = {
        user_id: user.id,
        page: pageNum,
        limit: 10,
      };
      
      if (filters.city_id) params.city_id = filters.city_id;
      if (filters.area_id) params.area_id = filters.area_id;
      if (filters.classification) params.classification = filters.classification;
      if (filters.searchTerm) params.search_term = filters.searchTerm;
      
      const res = await get('sales/pharamcy', null, params);
      
      if (res?.data) {
        const newPharmacies = res.data;
        
        if (newPharmacies.length === 0) {
          setHasMoreData(false);
        } else {
          if (isRefresh || pageNum === 1) {
            setAllPharmacies(newPharmacies);
            setHasMoreData(true);
          } else {
            setAllPharmacies(prev => {
              const existingIds = new Set(prev.map(p => p.id));
              const filtered = newPharmacies.filter(p => !existingIds.has(p.id));
              return [...prev, ...filtered];
            });
          }
        }
        
        console.log(`✅ تم جلب ${newPharmacies.length} صيدلية`);
      } else {
        setAllPharmacies([]);
      }
      
    } catch (err) {
      console.error('❌ خطأ في جلب الصيدليات:', err);
      if (pageNum === 1) {
        setAllPharmacies([]);
      }
    } finally {
      if (pageNum === 1) {
        setIsLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  }, [user?.id, filters]);

  useEffect(() => {
    if (user?.id) {
      fetchPharmacies(1, true);
    }
  }, [user?.id]);

  useEffect(() => {
    if (userLocationData.cities.length > 0) {
      console.log('🏙️ تحميل البيانات من Redux...');
      setCities(userLocationData.citiesFormatted || []);
      setAllAreas(userLocationData.areas.map(a => ({
        value: a.id,
        label: a.name,
        city_id: a.city_id
      })));
      
      console.log(`✅ ${userLocationData.cities.length} مدن، ${userLocationData.areas.length} مناطق`);
    }
  }, [userLocationData.cities, userLocationData.citiesFormatted, userLocationData.areas]);

  const handleFilterChange = useCallback((key, value) => {
    console.log(`🔧 تغيير الفلتر: ${key} = ${value}`);
    
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      if (key === 'city_id') {
        newFilters.area_id = null;
        
        if (value) {
          const filteredAreas = allAreas.filter(area => 
            String(area.city_id) === String(value)
          );
          setAreas(filteredAreas);
          console.log(`📍 ${filteredAreas.length} منطقة للمدينة ${value}`);
        } else {
          setAreas([]);
        }
      }
      
      return newFilters;
    });
  }, [allAreas]);


  useEffect(() => {
    if (user?.id) {
      setPage(1);
      setHasMoreData(true);
      fetchPharmacies(1, true);
    }
  }, [filters.city_id, filters.area_id, filters.classification, filters.searchTerm]);


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMoreData(true);
    await fetchPharmacies(1, true);
    setRefreshing(false);
  }, [fetchPharmacies]);


  const clearFilters = useCallback(() => {
    console.log('🗑️ مسح الفلاتر');
    setFilters({ 
      searchTerm: "", 
      city_id: null, 
      area_id: null,
      classification: null,
    });
    setAreas([]);
  }, []);

 
  const loadMoreData = useCallback(() => {
    if (!isLoadingMore && hasMoreData && !isLoading) {
      console.log('⬇️ تحميل المزيد من البيانات');
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPharmacies(nextPage, false);
    }
  }, [page, isLoadingMore, hasMoreData, isLoading, fetchPharmacies]);

  
  const handleScroll = useCallback((event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 50;
    
    
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      loadMoreData();
    }
    
   
    if (contentOffset.y > 200) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  }, [loadMoreData]);

  
  const scrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    setShowScrollToTop(false);
  }, []);

  
  const openDetailsModal = useCallback((pharmacy) => {
    console.log('📋 فتح تفاصيل الصيدلية:', pharmacy);
    setSelectedPharmacy(pharmacy);
    setDetailsModalVisible(true);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar 
        barStyle={'dark-content'} 
        backgroundColor={"#F8F9FA"} 
      />
      <GoBack text="قائمة الصيدليات" />
    
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
            onRefresh={onRefresh}
            colors={['#183E9F']}
            tintColor="#183E9F"
          />
        }
      >
      
        <View style={styles.filtersContainer}>
      
          <View style={[styles.searchContainer, isRTL && styles.rtlSearchContainer]}>
            <TextInput
              style={[styles.searchInput, isRTL && styles.rtlText]}
              placeholder="ابحث عن صيدلية..."
              placeholderTextColor="#888"
              value={filters.searchTerm}
              onChangeText={(text) => handleFilterChange("searchTerm", text)}
            />
            <Feather name="search" size={20} color="#888" />
          </View>
          
        
          <View style={styles.filterRow}>
            <View style={styles.filterBox}>
              <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>
                المدينة
              </Text>
              <Dropdown
                style={styles.dropdown}
                data={cities}
                labelField="label"
                valueField="value"
                placeholder="جميع المدن"
                value={filters.city_id}
                onChange={(item) => handleFilterChange("city_id", item.value)}
                itemTextStyle={{ color: "#333", fontSize: 14 }}
                selectedTextStyle={{ fontSize: 14, color: "#333" }}
                placeholderStyle={{ fontSize: 14, color: "#999" }}
              />
            </View>
            
            <View style={styles.filterBox}>
              <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>
                المنطقة
              </Text>
              <Dropdown
                style={styles.dropdown}
                data={areas}
                labelField="label"
                valueField="value"
                placeholder={!filters.city_id ? "اختر المدينة أولاً" : "جميع المناطق"}
                value={filters.area_id}
                onChange={(item) => handleFilterChange("area_id", item.value)}
                disable={!filters.city_id}
                itemTextStyle={{ color: "#333", fontSize: 14 }}
                selectedTextStyle={{ fontSize: 14, color: "#333" }}
                placeholderStyle={{ fontSize: 14, color: "#999" }}
              />
            </View>
          </View>

         
          <View style={styles.filterBoxFullWidth}>
            <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>
              التصنيف
            </Text>
            <Dropdown
              style={styles.dropdown}
              data={classifications}
              labelField="label"
              valueField="value"
              placeholder="جميع التصنيفات"
              value={filters.classification}
              onChange={(item) => handleFilterChange("classification", item.value)}
              itemTextStyle={{ color: "#333", fontSize: 14 }}
              selectedTextStyle={{ fontSize: 14, color: "#333" }}
              placeholderStyle={{ fontSize: 14, color: "#999" }}
            />
          </View>

        
          <View style={styles.resetFiltersContainer}>
            <TouchableOpacity 
              style={styles.resetFiltersButton}
              onPress={clearFilters}
            >
              <AntDesign name="reload1" size={16} color="#183E9F" />
              <Text style={[styles.resetFiltersText, isRTL && styles.rtlText]}>
                إعادة تعيين الفلاتر
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      
        <View style={styles.tableContainer}>
          {isLoading && allPharmacies.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, isRTL && styles.rtlText]}>
                جاري التحميل...
              </Text>
            </View>
          ) : allPharmacies.length > 0 ? (
            <View style={styles.table}>
           
              <View style={styles.fixedColumn}>
                <View style={styles.fixedHeaderCell}>
                  <Text style={[styles.fixedHeaderText, isRTL && styles.rtlText]}>
                    اسم الصيدلية
                  </Text>
                </View>
                {allPharmacies.map((item, index) => (
                  <View
                    key={`pharmacy-fixed-${item.id}-${index}`}
                    style={[
                      styles.fixedCell,
                      index % 2 === 1 ? styles.oddRow : styles.evenRow,
                    ]}
                  >
                    <Text style={styles.fixedCellText}>{item.name}</Text>
                    <Text style={[styles.fixedCellText, { fontSize: 12, color: '#666' }]}>
                      {item.owner_name}
                    </Text>
                  </View>
                ))}
              </View>

             
              <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View style={styles.scrollablePart}>
                 
                  <View style={styles.scrollableHeaderRow}>
                    <View style={styles.scrollableHeaderCell}>
                      <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                        العنوان
                      </Text>
                    </View>
                    <View style={styles.scrollableHeaderCell}>
                      <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                        المدينة
                      </Text>
                    </View>
                    <View style={styles.scrollableHeaderCell}>
                      <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                        المنطقة
                      </Text>
                    </View>
                    <View style={styles.scrollableHeaderCell}>
                      <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                        الهاتف
                      </Text>
                    </View>
                    <View style={styles.scrollableHeaderCell}>
                      <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                        الصيدلي المسؤول
                      </Text>
                    </View>
                    <View style={styles.scrollableHeaderCell}>
                      <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                        التصنيف
                      </Text>
                    </View>
                    <View style={styles.scrollableHeaderCell}>
                      <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                        التفاصيل
                      </Text>
                    </View>
                  </View>

                
                  {allPharmacies.map((item, index) => (
                    <View
                      key={`pharmacy-${item.id}-${index}`}
                      style={[
                        styles.scrollableDataRow,
                        index % 2 === 1 ? styles.oddRow : styles.evenRow,
                      ]}
                    >
                      <View style={styles.scrollableCell}>
                        <Text style={styles.scrollableCellText} numberOfLines={2} ellipsizeMode="tail">
                          {item.address}
                        </Text>
                      </View>
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
                          {item.phone}
                        </Text>
                      </View>
                      <View style={styles.scrollableCell}>
                        <Text style={styles.scrollableCellText}>
                          {item.responsible_pharmacist_name}
                        </Text>
                      </View>
                      <View style={styles.scrollableCell}>
                        <Text style={styles.scrollableCellText}>
                          {item.classification}
                        </Text>
                      </View>
                      <View style={styles.scrollableCell}>
                        <TouchableOpacity 
                          style={styles.detailsButton}
                          onPress={() => openDetailsModal(item)}
                        >
                          <AntDesign name="infocirlceo" size={20} color="#183E9F" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, isRTL && styles.rtlText]}>
                لا توجد بيانات
              </Text>
            </View>
          )}
        </View>

     
        {isLoadingMore && (
          <View style={styles.loadingMoreContainer}>
            <AntDesign name="downcircleo" size={24} color="#183E9F" />
            <Text style={[styles.loadingText, isRTL && styles.rtlText]}>
              جاري تحميل المزيد...
            </Text>
          </View>
        )}

      
        {!hasMoreData && allPharmacies.length > 0 && (
          <View style={styles.loadingMoreContainer}>
            <Text style={[styles.noMoreDataText, isRTL && styles.rtlText]}>
              لا توجد بيانات أخرى
            </Text>
          </View>
        )}
      </ScrollView>

    
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddPharmacyModalVisible(true)}
      >
        <AntDesign name="plus" size={24} color="#FFF" />
      </TouchableOpacity>

     
      {showScrollToTop && (
        <TouchableOpacity
          style={styles.scrollButton}
          onPress={scrollToTop}
        >
          <AntDesign name="upcircleo" size={24} color="#FFF" />
        </TouchableOpacity>
      )}

      <AddNewPharmacyModel
        show={addPharmacyModalVisible}
        hide={() => setAddPharmacyModalVisible(false)}
        submit={(success) => {
          setAddPharmacyModalVisible(false);
          if (success) {
            setSuccessModalVisible(true);
            setPage(1);
            setHasMoreData(true);
            fetchPharmacies(1, true);
            setTimeout(() => setSuccessModalVisible(false), 2000);
          }
        }}
        cities={cities}
        allAreas={allAreas}
      />

    

      <SkuModel
        show={detailsModalVisible}
        hide={() => setDetailsModalVisible(false)}
        data={{
          doctorName: selectedPharmacy?.name,
          doctorPhone: selectedPharmacy?.phone,
          doctorEmail: selectedPharmacy?.email || selectedPharmacy?.owner_email,
          doctorAddress: selectedPharmacy?.address,
          specialty: 'صيدلية', // Pharmacy type
          classification: selectedPharmacy?.classification,
          city_id: selectedPharmacy?.city_id,
          area_id: selectedPharmacy?.area_id,
          cityName: selectedPharmacy?.city,
          areaName: selectedPharmacy?.area,
          status: selectedPharmacy?.status,
          notes: `المالك: ${selectedPharmacy?.owner_name || 'N/A'}\nالصيدلي المسؤول: ${selectedPharmacy?.responsible_pharmacist_name || 'N/A'}\nموقع الويب: ${selectedPharmacy?.website || 'N/A'}\nالبلد: ${selectedPharmacy?.country || 'N/A'}`,
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: 20,
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
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingHorizontal: 5,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  filterBox: {
    flex: 1,
    marginHorizontal: 5,
  },
  filterBoxFullWidth: {
    marginHorizontal: 5,
  },
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
  resetFiltersContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  resetFiltersButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#183E9F",
  },
  resetFiltersText: {
    marginLeft: 8,
    color: "#183E9F",
    fontSize: 14,
    fontWeight: "500",
  },
  tableContainer: {
    marginHorizontal: 15,
  },
  table: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    overflow: "hidden",
  },
  fixedColumn: {
    width: FIXED_COLUMN_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
  },
  scrollablePart: {
    flex: 1,
  },
  fixedHeaderCell: {
    height: ROW_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: "#F1F3F5",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  fixedHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#183E9F",
    textAlign: "left",
  },
  fixedCell: {
    height: ROW_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  fixedCellText: {
    fontSize: 14,
    color: "#333",
    textAlign: "left",
  },
  scrollableHeaderRow: {
    flexDirection: "row",
    height: ROW_HEIGHT,
    backgroundColor: "#F1F3F5",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  scrollableDataRow: {
    flexDirection: "row",
    height: ROW_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  scrollableHeaderCell: {
    width: SCROLLABLE_COLUMN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  scrollableHeaderText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1A46BE",
    textAlign: "center",
  },
  scrollableCell: {
    width: SCROLLABLE_COLUMN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  scrollableCellText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  evenRow: {
    backgroundColor: "#FFFFFF",
  },
  oddRow: {
    backgroundColor: "#FAFAFA",
  },
  emptyContainer: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  loadingMoreContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
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
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scrollButton: {
    position: "absolute",
    bottom: 100,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#28A745",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  detailsButton: {
    backgroundColor: "#E3F2FD",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rtlText: {
    textAlign: "right",
  },
  rtlSearchContainer: {
    flexDirection: "row-reverse",
  },
});

export default ClientPharmacyList;
