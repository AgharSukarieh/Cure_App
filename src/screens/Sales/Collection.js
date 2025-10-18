import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  I18nManager,
  Alert,
  StatusBar,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import AntDesign from "react-native-vector-icons/AntDesign";
import DatePicker from "react-native-date-picker";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCitiesAndAreas, fetchCitiesPublic, fetchAreasByCity } from '../../store/apps/cities';
import { get } from '../../WebService/RequestBuilder';
import Constants from '../../config/globalConstants';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import GoBack from "../../components/GoBack";
import { CollectionTable, FiltersSection } from '../../components/Collection';

const COLLECTION_ENDPOINT = Constants.sales.collection || 'collect-money';
const { width } = Dimensions.get("window");
const FIXED_COLUMN_WIDTH = width * 0.35;
const SCROLLABLE_COLUMN_WIDTH = width * 0.3;
const ROW_HEIGHT = 60;

const Collection = ({ navigation }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const dispatch = useDispatch();
  const { user } = useCurrentUser();
  
  const { userLocationData, loading: citiesLoading, error: citiesError } = useSelector(state => state.cities);
  
  const [allCollections, setAllCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [areas, setAreas] = useState([]);
  const [allAreas, setAllAreas] = useState([]);
  

  const [filters, setFilters] = useState({
    city_id: null,
    area_id: null,
    dateFrom: null,
    dateTo: null,
  });

  const [dateFrom, setDateFrom] = useState(new Date());
  const [openDateFrom, setOpenDateFrom] = useState(false);
  const [dateTo, setDateTo] = useState(new Date());
  const [openDateTo, setOpenDateTo] = useState(false);

  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const scrollViewRef = useRef(null);

  const fetchCitiesAndAreasData = useCallback(async () => {
    try {
      if (user?.token) {
        await dispatch(fetchCitiesAndAreas(user.token));
      } else {
        await dispatch(fetchCitiesPublic());
      }
    } catch (error) {
      console.error('Error fetching cities and areas:', error);
    }
  }, [dispatch, user?.token]);

  const fetchCollectionData = useCallback(async (pageNum = 1, resetData = true) => {
    try {
      if (resetData) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      
      const params = new URLSearchParams();
      params.append('limit', '20');
      params.append('page', pageNum.toString());
      
      if (filters.dateFrom) {
        params.append('dateFrom', filters.dateFrom);
      }
      if (filters.dateTo) {
        params.append('dateTo', filters.dateTo);
      }
      if (filters.city_id) {
        params.append('city_id', filters.city_id.toString());
      }
      if (filters.area_id) {
        params.append('area_id', filters.area_id.toString());
      }
      
      const endpoint = `${COLLECTION_ENDPOINT}?${params.toString()}`;
      console.log('📡 Collection API Endpoint:', endpoint);
      
      const response = await get(endpoint);
      
      if (response && response.data) {
        const newData = response.data;
        
        if (resetData) {
          setAllCollections(newData);
          console.log(`✅ تم جلب ${newData.length} عنصر من Collection (الصفحة ${pageNum})`);
          
        } else {
          setAllCollections(prev => [...prev, ...newData]);
          console.log(`✅ تم إضافة ${newData.length} عنصر جديد (الصفحة ${pageNum})`);
        }
        
        setHasMoreData(newData.length === 20); 
      } else {
        console.log('⚠️ لا توجد بيانات في الاستجابة');
        if (resetData) {
          setAllCollections([]);
        }
        setHasMoreData(false);
      }
    } catch (error) {
      console.error('❌ خطأ في جلب بيانات Collection:', error);
      if (resetData) {
        setAllCollections([]);
      }
      setHasMoreData(false);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCitiesAndAreasData();
  }, [fetchCitiesAndAreasData]);

  useEffect(() => {
    fetchCollectionData();
  }, [filters]);

  // ✅ تحديث البيانات عند الدخول للصفحة
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 Collection Screen - تحديث البيانات عند الدخول للصفحة');
      fetchCollectionData(1, true); // إعادة تحميل البيانات من الصفحة الأولى
    }, [fetchCollectionData])
  );

  const cities = userLocationData?.citiesFormatted || [];
  const allAreasData = userLocationData?.areas || [];

  const filteredCollections = useMemo(() => {
    if (isLoading && allCollections.length === 0) return [];
    return allCollections;
  }, [allCollections, isLoading]);

  const handleFilterChange = useCallback(
    (key, value) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [key]: value };
        if (key === "city_id") {
          newFilters.area_id = null; 
          const filteredAreas = allAreasData.filter((area) => area.city_id == value);
          setAreas(filteredAreas.map(area => ({
            label: area.name,
            value: area.id,
            city_id: area.city_id
          })));
        }
        return newFilters;
      });

      setPage(1);
      setHasMoreData(true);
    },
    [allAreasData]
  );

  const handleRowPress = (item) => {
    Alert.alert(
      "Collection Item Selected",
      `Client: ${item.client_name}\nAmount: ${item.amount}`
    );
  };

  // ✅ دالة لتحديث البيانات بعد إضافة دفعة
  const refreshData = useCallback(() => {
    console.log('🔄 Collection - تحديث البيانات بعد إضافة دفعة');
    fetchCollectionData(1, true); // إعادة تحميل البيانات من الصفحة الأولى
  }, [fetchCollectionData]);

  // ✅ دالة لتحديث البيانات عند إضافة دفعة (يمكن استدعاؤها من مكونات أخرى)
  const handlePaymentAdded = useCallback(() => {
    console.log('💰 Collection - تم إضافة دفعة جديدة، تحديث قائمة الديون');
    fetchCollectionData(1, true);
  }, [fetchCollectionData]);

  // ✅ دالة لتحديث الشيكات المعلقة عند إضافة شيك جديد
  const handleCheckAdded = useCallback(() => {
    console.log('💳 Collection - تم إضافة شيك جديد، تحديث الشيكات المعلقة');
    fetchCollectionData(1, true);
  }, [fetchCollectionData]);

  // ✅ دالة لتحديث الشيكات المعلقة عند الموافقة على شيك
  const handleCheckApproved = useCallback(() => {
    console.log('✅ Collection - تم الموافقة على شيك، تحديث الشيكات المعلقة');
    fetchCollectionData(1, true);
  }, [fetchCollectionData]);

  // ✅ دالة لتحديث الشيكات المعلقة عند رفض شيك
  const handleCheckDeclined = useCallback(() => {
    console.log('❌ Collection - تم رفض شيك، تحديث الشيكات المعلقة');
    fetchCollectionData(1, true);
  }, [fetchCollectionData]);

  const clearFilters = useCallback(() => {
    setFilters({
      city_id: null,
      area_id: null,
      dateFrom: null,
      dateTo: null,
    });
    setAreas([]);
    setDateFrom(new Date());
    setDateTo(new Date());
    
    setPage(1);
    setHasMoreData(true);
  }, []);

  const loadMoreData = useCallback(async () => {
    if (!isLoadingMore && hasMoreData && !isLoading) {
      const nextPage = page + 1;
      console.log(`📄 تحميل الصفحة ${nextPage}...`);
      
      try {
        setIsLoadingMore(true);
        setPage(nextPage);
        
        const params = new URLSearchParams();
        params.append('limit', '20');
        params.append('page', nextPage.toString());
        
        if (filters.dateFrom) {
          params.append('dateFrom', filters.dateFrom);
        }
        if (filters.dateTo) {
          params.append('dateTo', filters.dateTo);
        }
        if (filters.city_id) {
          params.append('city_id', filters.city_id.toString());
        }
        if (filters.area_id) {
          params.append('area_id', filters.area_id.toString());
        }
        
        const endpoint = `${COLLECTION_ENDPOINT}?${params.toString()}`;
        const response = await get(endpoint);
        
        if (response && response.data) {
          const newData = response.data;
          setAllCollections(prev => [...prev, ...newData]);
          setHasMoreData(newData.length === 20);
        } else {
          setHasMoreData(false);
        }
      } catch (error) {
        console.error("❌ خطأ في تحميل المزيد:", error);
        setPage(page); // العودة للصفحة السابقة
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [page, isLoadingMore, hasMoreData, isLoading, filters]);

  const scrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const handleScroll = useCallback(
    (event) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;
      const currentScrollY = contentOffset.y;
      setScrollY(currentScrollY);

      setShowScrollToTop(currentScrollY > 300);

      const paddingToBottom = 200; 
      const isNearBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;

      if (isNearBottom && hasMoreData && !isLoadingMore && !isLoading && allCollections.length > 0) {
        console.log("🔄 تم الوصول للنهاية، بدء تحميل المزيد...");
        loadMoreData();
      }
    },
    [loadMoreData, hasMoreData, isLoadingMore, isLoading, allCollections.length]
  );

  const getStatusColor = (method) => {
    switch (method?.toLowerCase()) {
      case "cash":
        return "#28A745";
      case "check":
        return "#007BFF";
      case "credit":
        return "#FFC107";
      default:
        return "#6C757D";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoBack text={t("collection.headerTitle")} navigation={navigation} />
      <StatusBar backgroundColor="#F8F9FA" barStyle="dark-content" />
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <FiltersSection
          filters={filters}
          cities={cities}
          areas={areas}
          onFilterChange={handleFilterChange}
          onDateFromPress={() => setOpenDateFrom(true)}
          onDateToPress={() => setOpenDateTo(true)}
          onClearFilters={clearFilters}
          isRTL={isRTL}
        />


        <CollectionTable
          filteredCollections={filteredCollections}
          isLoading={isLoading}
          FIXED_COLUMN_WIDTH={FIXED_COLUMN_WIDTH}
          SCROLLABLE_COLUMN_WIDTH={SCROLLABLE_COLUMN_WIDTH}
          ROW_HEIGHT={ROW_HEIGHT}
          getStatusColor={getStatusColor}
          onRowPress={handleRowPress}
          onRefresh={refreshData}
        />

        {isLoadingMore && (
          <View style={styles.loadingMoreContainer}>
            <Text style={styles.loadingText}>
              {t("collection.loadingMore")}
            </Text>
          </View>
        )}

        {!hasMoreData && allCollections.length > 0 && (
          <View style={styles.loadingMoreContainer}>
            <Text style={styles.noMoreDataText}>
              {t("collection.noMoreData")}
            </Text>
          </View>
        )}
      </ScrollView>

      {showScrollToTop && (
        <TouchableOpacity
          style={styles.scrollButton}
          onPress={scrollToTop}
        >
          <AntDesign name="upcircleo" size={24} color="#FFF" />
        </TouchableOpacity>
      )}

      <DatePicker
        modal
        mode="date"
        open={openDateFrom}
        date={dateFrom}
        onConfirm={(date) => {
          setOpenDateFrom(false);
          setDateFrom(date);
          handleFilterChange("dateFrom", date.toISOString().split("T")[0]);
        }}
        onCancel={() => setOpenDateFrom(false)}
      />
      <DatePicker
        modal
        mode="date"
        open={openDateTo}
        date={dateTo}
        onConfirm={(date) => {
          setOpenDateTo(false);
          setDateTo(date);
          handleFilterChange("dateTo", date.toISOString().split("T")[0]);
        }}
        onCancel={() => setOpenDateTo(false)}
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
});

export default Collection;
