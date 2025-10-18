// import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
// import {
//   View,
//   SafeAreaView,
//   StyleSheet,
//   TextInput,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions,
//   I18nManager,
//   Modal,
//   Alert,
//   RefreshControl,
//   Animated,
//   StatusBar,
// } from "react-native";
// import { useTranslation } from "react-i18next";

// import GoBack from "../components/GoBack";
// import AddNewDoctorModel from "../components/Modals/AddNewDoctorModel";

// const SuccessfullyModel = ({ show, hide, message }) => (
//   <Modal transparent={true} visible={show} animationType="fade">
//     <View style={styles.successModalOverlay}>
//       <View style={styles.successModalContainer}>
//         <AntDesign name="checkcircle" size={40} color="#28A745" />
//         <Text style={styles.successModalText}>{message}</Text>
//       </View>
//     </View>
//   </Modal>
// );

// import { Dropdown } from "react-native-element-dropdown";
// import AntDesign from "react-native-vector-icons/AntDesign";
// import Feather from "react-native-vector-icons/Feather";
// import globalConstants from "../config/globalConstants";
// import { useAuth } from "../contexts/AuthContext";
// import { get, post } from "../WebService/RequestBuilder";
// import API from "../config/apiConfig";
// import {
//   getAreasForCity,
//   formatCitiesForDropdown,
//   formatAreasForDropdown,
//   formatSpecialtiesForDropdown,
// } from "../services/locationService";
// import { fetchSpecialties } from "../services/specialtyService";
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchCitiesAndAreas, updateAreasForCity } from '../store/apps/cities';
// import { useCurrentUser, useUserId } from '../hooks/useCurrentUser';

// const { width, height } = Dimensions.get("window");
// const FIXED_COLUMN_WIDTH = width * 0.35;
// const SCROLLABLE_COLUMN_WIDTH = width * 0.3;
// const ROW_HEIGHT = 60;

// const ClientDoctorList = ({ navigation, header = true }) => {
//   const { t } = useTranslation();
//   const isRTL = I18nManager.isRTL;
//   const scrollViewRef = useRef(null);
  
//   const dispatch = useDispatch();
//   const userLocationData = useSelector(state => state.cities.userLocationData);

//   const [allDoctors, setAllDoctors] = useState([]);
//   const [cachedDoctors, setCachedDoctors] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [areas, setAreas] = useState([]);
//   const [specialties, setSpecialties] = useState([]);
//   const [allAreas, setAllAreas] = useState([]);

//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMoreData, setHasMoreData] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [showScrollToTop, setShowScrollToTop] = useState(false);
//   const [scrollY, setScrollY] = useState(0);

//   const [addDoctorModalVisible, setAddDoctorModalVisible] = useState(false);
//   const [successModalVisible, setSuccessModalVisible] = useState(false);

//   const [filters, setFilters] = useState({
//     city_id: null,
//     area_id: null,
//     speciality_id: null,
//     searchTerm: "",
//   });

//   const { user: currentUser } = useCurrentUser();
//   const userId = useUserId();
//   const { token } = useAuth();
//   const user = currentUser; // لتوافق المراجع في useEffect
  
//   useEffect(() => {
//   }, [currentUser, user, userId, token]);

//   const renderSpecialtyItem = useCallback((item) => {
//     return (
//       <View style={{ 
//         paddingVertical: 15, 
//         paddingHorizontal: 20,
//         backgroundColor: '#ffffff',
//         borderBottomWidth: 1,
//         borderBottomColor: '#e0e0e0',
//         minHeight: 50,
//         justifyContent: 'center'
//       }}>
//         <Text style={{ 
//           color: '#2c3e50', 
//           fontSize: 16, 
//           fontWeight: '500',
//           textAlign: 'left',
//           lineHeight: 20
//         }}>
//           {item?.label ?? ''}
//         </Text>
//       </View>
//     );
//   }, []);

//   const getCityNameById = useCallback((cityId) => {
//     if (!cityId) return '';
//     const map = userLocationData.citiesMap || {};
//     if (map[cityId]) return map[cityId].name || '';
//     const found = (userLocationData.cities || []).find(c => c && (c.id === cityId || String(c.id) === String(cityId)));
//     return found ? (found.name || '') : '';
//   }, [userLocationData.citiesMap, userLocationData.cities]);

//   const getAreaNameById = useCallback((areaId) => {
//     if (!areaId) return '';
//     const map = userLocationData.areasMap || {};
//     if (map[areaId]) return map[areaId].name || '';
//     const found = (userLocationData.areas || []).find(a => a && (a.id === areaId || String(a.id) === String(areaId)));
//     return found ? (found.name || '') : '';
//   }, [userLocationData.areasMap, userLocationData.areas]);

//   const resolveCityName = useCallback((doctor) => {
//     const nestedCityName = (doctor && typeof doctor.city === 'object' && doctor.city)
//       ? (doctor.city.name ?? '')
//       : '';
//     return (
//       nestedCityName || doctor?.city_name || getCityNameById(doctor?.city_id) || ''
//     );
//   }, [getCityNameById]);

//   const resolveAreaName = useCallback((doctor) => {
//     const nestedAreaName = (doctor && typeof doctor.area === 'object' && doctor.area)
//       ? (doctor.area.name ?? '')
//       : '';
//     return (
//       nestedAreaName || doctor?.area_name || getAreaNameById(doctor?.area_id) || ''
//     );
//   }, [getAreaNameById]);

//   const loadLocationDataFromRedux = useCallback(async () => {
//     try {
      
//       if (userLocationData.cities.length > 0) {
//         setCities(userLocationData.citiesFormatted);
//         setAllAreas(userLocationData.areas);
        
//         userLocationData.cities.forEach((city, index) => {
//         });
        
//         userLocationData.areas.forEach((area, index) => {
//         });
//       } else {
//       }
//     } catch (error) {
//       console.error("❌ خطأ في تحميل البيانات الجغرافية:", error);
//     }
//   }, [userLocationData.cities, userLocationData.citiesFormatted, userLocationData.areas]);
  

 

//   const fetchFilteredDoctors = useCallback(
//     async (currentPage = 1, isRefresh = false) => {
//       if (currentPage === 1) {
//         setIsLoading(true);
//       }

//       try {
//         const params = {};
//         if (filters.searchTerm) params.search_term = filters.searchTerm;
//         if (filters.city_id) params.city_id = filters.city_id;
//         if (filters.area_id) params.area_id = filters.area_id;
//         if (filters.speciality_id) params.speciality_id = filters.speciality_id;
//         params.paginate = false;

//         const queryString = Object.entries(params)
//           .filter(([, v]) => v !== undefined && v !== null && v !== "")
//           .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
//           .join('&');

//         const endpoint = queryString ? `doctors/filter?${queryString}` : `doctors/filter`;


//         const response = await get(endpoint);

//         const responseData = response.data || response;
//         const newDoctors = responseData.data || responseData || [];
//         const meta = responseData.meta || {};

//         const processedDoctors = newDoctors.map((doctor) => {
//           const specialityRaw = doctor.speciality ?? doctor.specialty ?? doctor.specialty_name;
//           const specialtyName = typeof specialityRaw === 'object' && specialityRaw !== null
//             ? (specialityRaw.name ?? '')
//             : (specialityRaw ?? '');
//           const specialtyId = typeof specialityRaw === 'object' && specialityRaw !== null
//             ? (specialityRaw.id ?? doctor.speciality_id ?? null)
//             : (doctor.speciality_id ?? null);

//           return {
//             ...doctor,
//             city_id: doctor.city_id ?? null,
//             area_id: doctor.area_id ?? null,
//             speciality_id: specialtyId,
//             specialty_name: specialtyName,
//             city_name: (doctor && typeof doctor.city === 'object' && doctor.city)
//               ? (doctor.city.name ?? doctor.city_name ?? '')
//               : (doctor.city_name ?? ''),
//             area_name: (doctor && typeof doctor.area === 'object' && doctor.area)
//               ? (doctor.area.name ?? doctor.area_name ?? '')
//               : (doctor.area_name ?? ''),
//             distributor_name: doctor.distributor_name ?? "",
//             name: doctor.name ?? "",
//             phone: doctor.phone ?? "",
//             address: doctor.address ?? "",
//             classification: doctor.classification ?? "",
//             status: doctor.status ?? "inactive",
//           };
//         });

//         const hasMore = false;
//         setHasMoreData(false);

//         if (newDoctors.length === 0) {
//           setHasMoreData(false);
//         } else {
//           if (isRefresh || currentPage === 1) {
//             setAllDoctors(processedDoctors);
//             setCachedDoctors(processedDoctors);
//           } else {
//             setAllDoctors((prevDoctors) => {
//               const existingIds = prevDoctors.map((doctor) => doctor.id);
//               const filteredNewDoctors = processedDoctors.filter(
//                 (doctor) => !existingIds.includes(doctor.id)
//               );
//               const updatedDoctors = [...prevDoctors, ...filteredNewDoctors];
//               setCachedDoctors(updatedDoctors);
//               return updatedDoctors;
//             });
//           }
//         }

//       } catch (error) {
//         console.error("❌ خطأ في جلب الأطباء المفلترة:", error);
//         Alert.alert("خطأ", "فشل في جلب الأطباء المفلترة");
//         if (currentPage === 1) {
//           setAllDoctors([]);
//         }
//       } finally {
//         if (currentPage === 1) {
//           setIsLoading(false);
//         }
//       }
//     },
//     [userId, token, filters.searchTerm, filters.city_id, filters.area_id, filters.speciality_id]
//   );

//   const fetchDoctors = useCallback(
//     async (currentPage = 1, isRefresh = false) => {
//       if (currentPage === 1) {
//         setIsLoading(true);
//       }

//       try {
//         const headers = {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         };

//         if (token) {
//           headers["Authorization"] = `Bearer ${token}`;
//         }

//         const response = await get(
//           `doctors?page=${currentPage}&user_id=${userId}&limit=10`,
//           { headers }
//         );

//         const responseData = response.data || response;
//         const newDoctors = responseData.data || responseData || [];
//         const meta = responseData.meta || {};

//         const processedDoctors = newDoctors.map((doctor) => {
//           const specialityRaw = doctor.speciality ?? doctor.specialty ?? doctor.specialty_name;
//           const specialtyName = typeof specialityRaw === 'object' && specialityRaw !== null
//             ? (specialityRaw.name ?? '')
//             : (specialityRaw ?? '');
//           const specialtyId = typeof specialityRaw === 'object' && specialityRaw !== null
//             ? (specialityRaw.id ?? doctor.speciality_id ?? null)
//             : (doctor.speciality_id ?? null);

//           return {
//             ...doctor,
//             city_id: doctor.city_id ?? null,
//             area_id: doctor.area_id ?? null,
//             speciality_id: specialtyId,
//             specialty_name: specialtyName,
//             city_name: (doctor && typeof doctor.city === 'object' && doctor.city)
//               ? (doctor.city.name ?? doctor.city_name ?? '')
//               : (doctor.city_name ?? ''),
//             area_name: (doctor && typeof doctor.area === 'object' && doctor.area)
//               ? (doctor.area.name ?? doctor.area_name ?? '')
//               : (doctor.area_name ?? ''),
//             distributor_name: doctor.distributor_name ?? "",
//             name: doctor.name ?? "",
//             phone: doctor.phone ?? "",
//             address: doctor.address ?? "",
//             classification: doctor.classification ?? "",
//             status: doctor.status ?? "inactive",
//           };
//         });

//         const hasMore = meta.last_page ? currentPage < meta.last_page : newDoctors.length >= 10;
//         setHasMoreData(hasMore);

//         if (newDoctors.length === 0) {
//           setHasMoreData(false);
//         } else {
//           if (isRefresh || currentPage === 1) {
//             setAllDoctors(processedDoctors);
//             setCachedDoctors(processedDoctors);
//           } else {
//             setAllDoctors((prevDoctors) => {
//               const existingIds = prevDoctors.map((doctor) => doctor.id);
//               const filteredNewDoctors = processedDoctors.filter(
//                 (doctor) => !existingIds.includes(doctor.id)
//               );
//               const updatedDoctors = [...prevDoctors, ...filteredNewDoctors];
//               setCachedDoctors(updatedDoctors);
//               return updatedDoctors;
//             });
//           }
//         }
//       } catch (error) {
//         console.error("❌ خطأ في جلب الأطباء:", error);
//         Alert.alert("خطأ", "فشل في جلب بيانات الأطباء");
//         if (currentPage === 1) {
//           setAllDoctors([]);
//         }
//       } finally {
//         if (currentPage === 1) {
//           setIsLoading(false);
//         }
//       }
//     },
//     [userId, token]
//   );

//   const loadMoreData = useCallback(async () => {
//     const hasActiveFilters = filters.searchTerm || filters.city_id || filters.area_id || filters.speciality_id;
//     if (hasActiveFilters) {
//       return;
//     }
//     if (!isLoadingMore && hasMoreData && !isLoading) {
//       const nextPage = page + 1;
      
//       try {
//         setIsLoadingMore(true);
//         setPage(nextPage);
//         const hasActiveFilters = filters.searchTerm || filters.city_id || filters.area_id || filters.speciality_id;
//         if (hasActiveFilters) {
//           await fetchFilteredDoctors(nextPage, false);
//         } else {
//           await fetchDoctors(nextPage, false);
//         }
//       } catch (error) {
//         console.error("❌ خطأ في تحميل المزيد:", error);
//         setPage(page); // العودة للصفحة السابقة
//       } finally {
//         setIsLoadingMore(false);
//       }
//     }
//   }, [page, isLoadingMore, hasMoreData, isLoading, fetchDoctors, fetchFilteredDoctors, filters]);

//   const scrollToTop = useCallback(() => {
//     scrollViewRef.current?.scrollTo({ y: 0, animated: true });
//   }, []);

//   const handleScroll = useCallback(
//     (event) => {
//       const { layoutMeasurement, contentOffset, contentSize } =
//         event.nativeEvent;
//       const currentScrollY = contentOffset.y;
//       setScrollY(currentScrollY);

//       setShowScrollToTop(currentScrollY > 300);

//       const paddingToBottom = 200; // زيادة المساحة لتحسين الأداء
//       const isNearBottom =
//         layoutMeasurement.height + contentOffset.y >=
//         contentSize.height - paddingToBottom;

//       if (isNearBottom && hasMoreData && !isLoadingMore && !isLoading && allDoctors.length > 0) {
//         loadMoreData();
//       }
//     },
//     [loadMoreData, hasMoreData, isLoadingMore, isLoading, allDoctors.length]
//   );

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     setPage(1);
//     setHasMoreData(true);
//     setCachedDoctors([]);

//     await fetchDoctors(1, true);
//     setTimeout(async () => {
//       await fetchDoctors(2, false);
//       setPage(2);
//       setRefreshing(false);
//     }, 500);
//   }, [fetchDoctors]);

//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
        
//         if (userId && token) {
//           try {
//             const list = await fetchSpecialties();
//             if (Array.isArray(list)) {
//               list.forEach((spec, idx) => {
//               });
//             }
//             setSpecialties(list);
//           } catch (e) {
//           }

//           await loadLocationDataFromRedux();

//           if (cachedDoctors.length > 0) {
//             setAllDoctors(cachedDoctors);
//             setIsLoading(false);
//           } else {
//             setPage(1);
//             setHasMoreData(true);
//             await fetchDoctors(1, true);

//             setTimeout(async () => {
//               await fetchDoctors(2, false);
//               setPage(2);
//             }, 500);
//           }
//         } else {
//           if (!userId) {
//             Alert.alert("خطأ", "يجب تسجيل الدخول أولاً");
//           } else if (!token) {
//             Alert.alert("خطأ", "لا يوجد رمز مصادقة صالح");
//           }
//         }
//       } catch (error) {
//         console.error("❌ خطأ في تحميل البيانات:", error);
//         Alert.alert("خطأ", "فشل في تحميل البيانات");
//         setIsLoading(false);
//       }
//     };

//     loadInitialData();
//   }, [userId, token]);

//   useEffect(() => {
//     if (userLocationData.cities.length > 0) {
//       setCities(userLocationData.citiesFormatted);
//       setAllAreas(userLocationData.areas);
//     }
//   }, [userLocationData.cities.length, userLocationData.citiesFormatted, userLocationData.areas]);

//   useEffect(() => {
//     const searchTimeout = setTimeout(async () => {
//       if (filters.searchTerm && filters.searchTerm.length > 0) {
//         try {
//           setPage(1);
//           setHasMoreData(true);
//           await fetchFilteredDoctors(1, true);
//         } catch (error) {
//           console.error("❌ خطأ في البحث:", error);
//         }
//       }
//     }, 500); // انتظار 500ms بعد توقف الكتابة

//     return () => clearTimeout(searchTimeout);
//   }, [filters.searchTerm, fetchFilteredDoctors]);

//   const filteredDoctors = useMemo(() => {
//     if (isLoading && allDoctors.length === 0) return [];

//     return allDoctors.filter((doctor) => {
//       const searchTermLower = filters.searchTerm.toLowerCase();
//       const nameMatch = (doctor.name || "")
//         .toLowerCase()
//         .includes(searchTermLower);
//       const cityFilterMatch =
//         !filters.city_id || doctor.city_id === filters.city_id;
//       const areaFilterMatch =
//         !filters.area_id || doctor.area_id === filters.area_id;
//       const specialtyFilterMatch =
//         !filters.speciality_id ||
//         doctor.speciality_id === filters.speciality_id;
//       return (
//         nameMatch && cityFilterMatch && areaFilterMatch && specialtyFilterMatch
//       );
//     });
//   }, [allDoctors, filters, isLoading]);

//   const resetFilters = useCallback(async () => {
//     setFilters({
//       city_id: null,
//       area_id: null,
//       speciality_id: null,
//       searchTerm: "",
//     });
//     setAreas([]);
    
//     try {
//       setPage(1);
//       setHasMoreData(true);
//       await fetchDoctors(1, true);
//     } catch (error) {
//       console.error("❌ خطأ في إعادة تحميل البيانات:", error);
//     }
//   }, [fetchDoctors]);

//   const handleFilterChange = useCallback(async (key, value) => {
    
//     setFilters((prev) => {
//       const newFilters = { ...prev, [key]: value };
//       if (key === "city_id") {
//         newFilters.area_id = null;
//         if (value) {
//           dispatch(updateAreasForCity(value));
          
//           const filteredAreas = userLocationData.areas
//             .filter(area => area.city_id === value.toString())
//             .map(area => ({
//               value: area.id,
//               label: area.name
//             }));
          
//           setAreas(filteredAreas);
//         } else {
//           setAreas([]);
//         }
//       }
      
//       return newFilters;
//     });

//     if (key !== "searchTerm") {
//       try {
//         setPage(1);
//         setHasMoreData(true);
//         await fetchFilteredDoctors(1, true);
//       } catch (error) {
//         console.error("❌ خطأ في إعادة تحميل البيانات:", error);
//       }
//     }
//   }, [dispatch, userLocationData.areas, fetchFilteredDoctors]);

//   const onDoctorAdded = (success) => {
//     setAddDoctorModalVisible(false);
//     if (success) {
//       setSuccessModalVisible(true);
//       setPage(1);
//       setHasMoreData(true);
//       setCachedDoctors([]);

//       const reloadInitialData = async () => {
//         await fetchDoctors(1, true);
//         setTimeout(async () => {
//           await fetchDoctors(2, false);
//           setPage(2);
//         }, 500);
//       };

//       reloadInitialData();
//       setTimeout(() => setSuccessModalVisible(false), 2000);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "active":
//         return "#28A745";
//       case "inactive":
//         return "#DC3545";
//       case "pending":
//         return "#007BFF";
//       default:
//         return "#6C757D";
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor="#F8F9FA" barStyle="dark-content" />
//       {header && <GoBack text={t("clientDoctorList.headerTitle")} />}

//       <ScrollView
//         ref={scrollViewRef}
//         style={styles.container}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 100 }}
//         onScroll={handleScroll}
//         scrollEventThrottle={400}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={["#183E9F"]}
//             tintColor="#183E9F"
//             title={t("clientDoctorList.pullToRefresh")}
//           />
//         }
//       >
//         <View style={styles.filtersContainer}>
//           <View
//             style={[styles.searchContainer, isRTL && styles.rtlSearchContainer]}
//           >
//             <TextInput
//               style={[styles.searchInput, isRTL && styles.rtlText]}
//               placeholder={t("clientDoctorList.searchPlaceholder")}
//               placeholderTextColor="#888"
//               value={filters.searchTerm}
//               onChangeText={(text) => handleFilterChange("searchTerm", text)}
//             />
//             <Feather name="search" size={20} color="#888" />
//           </View>

//           <View style={styles.filterRow}>
//             <View style={styles.filterBox}>
//               <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>
//                 {t("clientDoctorList.filterByCity")}
//               </Text>
//               <Dropdown
//                 style={styles.dropdown}
//                 data={cities}
//                 labelField="label"
//                 valueField="value"
//                 placeholder={t("clientDoctorList.allCities")}
//                 value={filters.city_id}
//                 onChange={(item) => handleFilterChange("city_id", item.value)}
//                 itemTextStyle={dropdownStyles.itemTextStyle}
//                 selectedTextStyle={dropdownStyles.selectedTextStyle}
//                 placeholderStyle={dropdownStyles.placeholderStyle}
//                 containerStyle={dropdownStyles.containerStyle}
//               />
//             </View>

//             <View style={styles.filterBox}>
//               <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>
//                 {t("clientDoctorList.filterByArea")}
//               </Text>
//               <Dropdown
//                 style={styles.dropdown}
//                 data={areas}
//                 labelField="label"
//                 valueField="value"
//                 placeholder={
//                   !filters.city_id
//                     ? t("clientDoctorList.selectCityFirst")
//                     : t("clientDoctorList.allAreas")
//                 }
//                 value={filters.area_id}
//                 onChange={(item) => handleFilterChange("area_id", item.value)}
//                 disable={!filters.city_id}
//                 itemTextStyle={dropdownStyles.itemTextStyle}
//                 selectedTextStyle={dropdownStyles.selectedTextStyle}
//                 placeholderStyle={dropdownStyles.placeholderStyle}
//                 containerStyle={dropdownStyles.containerStyle}
//               />
//             </View>
//           </View>

//           <View style={styles.filterBoxFullWidth}>
//             <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>
//               {t("clientDoctorList.filterBySpecialty")}
//             </Text>
//             <Dropdown
//               style={styles.dropdown}
//               data={specialties}
//               labelField="label"
//               valueField="value"
//               placeholder={t("clientDoctorList.allSpecialties")}
//               value={filters.speciality_id}
//               onChange={(item) => {
//                 handleFilterChange("speciality_id", item.value);
//               }}
//               renderItem={renderSpecialtyItem}
//               selectedTextStyle={{ color: '#2c3e50', fontSize: 16, fontWeight: '600' }}
//               placeholderStyle={{ fontSize: 16, color: '#7f8c8d' }}
//               containerStyle={{ 
//                 borderRadius: 10, 
//                 backgroundColor: '#fff',
//                 borderWidth: 1,
//                 borderColor: '#e0e0e0',
//                 shadowColor: '#000',
//                 shadowOffset: { width: 0, height: 2 },
//                 shadowOpacity: 0.1,
//                 shadowRadius: 4,
//                 elevation: 3
//               }}
//               onFocus={() => console.log('🔽 Dropdown focused, specialties data:', specialties)}
//             />
//           </View>

//           <View style={styles.resetFiltersContainer}>
//             <TouchableOpacity 
//               style={styles.resetFiltersButton}
//               onPress={resetFilters}
//             >
//               <AntDesign name="reload1" size={16} color="#183E9F" />
//               <Text style={[styles.resetFiltersText, isRTL && styles.rtlText]}>
//                 {t("clientDoctorList.resetFilters")}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={styles.tableContainer}>
//           {isLoading && allDoctors.length === 0 ? (
//             <View style={styles.emptyContainer}>
//               <Text style={[styles.emptyText, isRTL && styles.rtlText]}>
//                 {t("clientDoctorList.loading")}
//               </Text>
//             </View>
//           ) : filteredDoctors.length > 0 ? (
//             <View style={styles.table}>
//               <View style={styles.fixedColumn}>
//                 <View style={styles.fixedHeaderCell}>
//                   <Text
//                     style={[styles.fixedHeaderText, isRTL && styles.rtlText]}
//                   >
//                     {t("clientDoctorList.doctorName")}
//                   </Text>
//                 </View>
//                 {filteredDoctors.map((item, index) => (
//                   <View
//                     key={`doctor-fixed-${item.id}-${index}`}
//                     style={[
//                       styles.fixedCell,
//                       index % 2 === 1 ? styles.oddRow : styles.evenRow,
//                     ]}
//                   >
//                     <Text style={styles.fixedCellText}>{item.name}</Text>
//                     <Text style={styles.fixedCellText}>
//                       {item.distributor_name}
//                     </Text>
//                   </View>
//                 ))}
//               </View>

//               <ScrollView horizontal showsHorizontalScrollIndicator={true}>
//                 <View style={styles.scrollablePart}>
//                   <View style={styles.scrollableHeaderRow}>
//                     <View style={styles.scrollableHeaderCell}>
//                       <Text
//                         style={[
//                           styles.scrollableHeaderText,
//                           isRTL && styles.rtlText,
//                         ]}
//                       >
//                         {t("clientDoctorList.specialty")}
//                       </Text>
//                     </View>
//                     <View style={styles.scrollableHeaderCell}>
//                       <Text
//                         style={[
//                           styles.scrollableHeaderText,
//                           isRTL && styles.rtlText,
//                         ]}
//                       >
//                         {t("clientDoctorList.city")}
//                       </Text>
//                     </View>
//                     <View style={styles.scrollableHeaderCell}>
//                       <Text
//                         style={[
//                           styles.scrollableHeaderText,
//                           isRTL && styles.rtlText,
//                         ]}
//                       >
//                         {t("clientDoctorList.area")}
//                       </Text>
//                     </View>
//                     <View style={styles.scrollableHeaderCell}>
//                       <Text
//                         style={[
//                           styles.scrollableHeaderText,
//                           isRTL && styles.rtlText,
//                         ]}
//                       >
//                         {t("clientDoctorList.phone")}
//                       </Text>
//                     </View>
//                     <View style={styles.scrollableHeaderCell}>
//                       <Text
//                         style={[
//                           styles.scrollableHeaderText,
//                           isRTL && styles.rtlText,
//                         ]}
//                       >
//                         {t("clientDoctorList.address")}
//                       </Text>
//                     </View>
//                     <View style={styles.scrollableHeaderCell}>
//                       <Text
//                         style={[
//                           styles.scrollableHeaderText,
//                           isRTL && styles.rtlText,
//                         ]}
//                       >
//                         {t("clientDoctorList.classification")}
//                       </Text>
//                     </View>
//                     <View style={styles.scrollableHeaderCell}>
//                       <Text
//                         style={[
//                           styles.scrollableHeaderText,
//                           isRTL && styles.rtlText,
//                         ]}
//                       >
//                         {t("clientDoctorList.status")}
//                       </Text>
//                     </View>
//                   </View>
//                   {filteredDoctors.map((item, index) => (
//                     <View
//                       key={`doctor-${item.id}-${index}`}
//                       style={[
//                         styles.scrollableDataRow,
//                         index % 2 === 1 ? styles.oddRow : styles.evenRow,
//                       ]}
//                     >
//                       <View style={styles.scrollableCell}>
//                         <Text style={styles.scrollableCellText}>
//                           {item.specialty_name}
//                         </Text>
//                       </View>
//                       <View style={styles.scrollableCell}>
//                         <Text style={styles.scrollableCellText}>
//                           {resolveCityName(item)}
//                         </Text>
//                       </View>
//                       <View style={styles.scrollableCell}>
//                         <Text style={styles.scrollableCellText}>
//                           {resolveAreaName(item)}
//                         </Text>
//                       </View>
//                       <View style={styles.scrollableCell}>
//                         <Text style={styles.scrollableCellText}>
//                           {item.phone}
//                         </Text>
//                       </View>
//                       <View style={styles.scrollableCell}>
//                         <Text
//                           style={styles.scrollableCellText}
//                           numberOfLines={1}
//                           ellipsizeMode="tail"
//                         >
//                           {item.address}
//                         </Text>
//                       </View>
//                       <View style={styles.scrollableCell}>
//                         <Text style={styles.scrollableCellText}>
//                           {item.classification}
//                         </Text>
//                       </View>
//                       <View style={styles.scrollableCell}>
//                         <Text
//                           style={[
//                             styles.scrollableCellText,
//                             {
//                               color: getStatusColor(item.status),
//                               fontWeight: "bold",
//                             },
//                           ]}
//                         >
//                           {item.status}
//                         </Text>
//                       </View>
//                     </View>
//                   ))}
//                 </View>
//               </ScrollView>
//             </View>
//           ) : (
//             <View style={styles.emptyContainer}>
//               <Text style={[styles.emptyText, isRTL && styles.rtlText]}>
//                 {t("clientDoctorList.noData")}
//               </Text>
//             </View>
//           )}
//         </View>

//         {isLoadingMore && (
//           <View style={styles.loadingMoreContainer}>
//             <AntDesign name="downcircleo" size={24} color="#183E9F" />
//             <Text style={[styles.loadingText, isRTL && styles.rtlText]}>
//               {t("clientDoctorList.loadingMore") || "جاري تحميل المزيد..."}
//             </Text>
//           </View>
//         )}

//         {!hasMoreData && allDoctors.length > 0 && (
//           <View style={styles.loadingMoreContainer}>
//             <Text style={[styles.noMoreDataText, isRTL && styles.rtlText]}>
//               {t("clientDoctorList.noMoreData") || "لا توجد بيانات أخرى"}
//             </Text>
//           </View>
//         )}
//       </ScrollView>

//       <TouchableOpacity
//         style={styles.addButton}
//         onPress={() => setAddDoctorModalVisible(true)}
//       >
//         <AntDesign name="plus" size={24} color="#FFF" />
//       </TouchableOpacity>

//       {showScrollToTop && (
//         <TouchableOpacity
//           style={styles.scrollButton}
//           onPress={scrollToTop}
//         >
//           <AntDesign name="upcircleo" size={24} color="#FFF" />
//         </TouchableOpacity>
//       )}

//       <AddNewDoctorModel
//         show={addDoctorModalVisible}
//         hide={() => setAddDoctorModalVisible(false)}
//         submit={onDoctorAdded}
//         cities={cities}
//         allAreas={allAreas}
//         specialties={specialties}
//       />

//       <SuccessfullyModel
//         show={successModalVisible}
//         hide={() => setSuccessModalVisible(false)}
//         message={t("clientDoctorList.addNewDoctorModal.successMessage")}
//       />
//     </SafeAreaView>
//   );
// };

// const dropdownStyles = {
//   itemTextStyle: { color: "#333", fontSize: 14, textAlign: "left" },
//   selectedTextStyle: { fontSize: 14, color: "#333" },
//   placeholderStyle: { fontSize: 14, color: "#999" },
//   containerStyle: { borderRadius: 8 },
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#F8F9FA",
//   },
//   container: {
//     flex: 1,
//   },
//   filtersContainer: {
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     backgroundColor: "#FFFFFF",
//     margin: 15,
//     borderRadius: 10,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F4F6F8",
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: "#E0E0E0",
//     height: 45,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: "#333",
//     paddingHorizontal: 5,
//   },
//   filterRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 15,
//   },
//   filterBox: {
//     flex: 1,
//     marginHorizontal: 5,
//   },
//   filterBoxFullWidth: {
//     marginHorizontal: 5,
//   },
//   filterLabel: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 8,
//     fontWeight: "600",
//   },
//   dropdown: {
//     height: 45,
//     borderColor: "#E0E0E0",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     backgroundColor: "#FFF",
//   },
//   tableContainer: {
//     marginHorizontal: 15,
//   },
//   table: {
//     flexDirection: "row",
//     borderWidth: 1,
//     borderColor: "#E0E0E0",
//     borderRadius: 8,
//     overflow: "hidden",
//   },
//   fixedColumn: {
//     width: FIXED_COLUMN_WIDTH,
//     backgroundColor: "#FFFFFF",
//     borderRightWidth: 1,
//     borderRightColor: "#E0E0E0",
//   },
//   scrollablePart: {
//     flex: 1,
//   },
//   fixedHeaderCell: {
//     height: ROW_HEIGHT,
//     justifyContent: "center",
//     paddingHorizontal: 10,
//     backgroundColor: "#F1F3F5",
//     borderBottomWidth: 1,
//     borderBottomColor: "#E0E0E0",
//   },
//   fixedHeaderText: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#183E9F",
//     textAlign: "left",
//   },
//   fixedCell: {
//     height: ROW_HEIGHT,
//     justifyContent: "center",
//     paddingHorizontal: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F0F0F0",
//   },
//   fixedCellText: {
//     fontSize: 14,
//     color: "#333",
//     textAlign: "left",
//   },
//   scrollableHeaderRow: {
//     flexDirection: "row",
//     height: ROW_HEIGHT,
//     backgroundColor: "#F1F3F5",
//     borderBottomWidth: 1,
//     borderBottomColor: "#E0E0E0",
//   },
//   scrollableDataRow: {
//     flexDirection: "row",
//     height: ROW_HEIGHT,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F0F0F0",
//   },
//   scrollableHeaderCell: {
//     width: SCROLLABLE_COLUMN_WIDTH,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 10,
//   },
//   scrollableHeaderText: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#1A46BE",
//     textAlign: "center",
//   },
//   scrollableCell: {
//     width: SCROLLABLE_COLUMN_WIDTH,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 10,
//   },
//   scrollableCellText: {
//     fontSize: 14,
//     color: "#333",
//     textAlign: "center",
//   },
//   evenRow: {
//     backgroundColor: "#FFFFFF",
//   },
//   oddRow: {
//     backgroundColor: "#FAFAFA",
//   },
//   emptyContainer: {
//     height: 200,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//     borderWidth: 1,
//     borderColor: "#E0E0E0",
//     borderRadius: 8,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: "#888",
//     textAlign: "center",
//   },
//   loadingMoreContainer: {
//     padding: 20,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "row",
//     gap: 10,
//   },
//   loadingText: {
//     fontSize: 14,
//     color: "#007BFF",
//     textAlign: "center",
//     fontWeight: "500",
//   },
//   noMoreDataText: {
//     fontSize: 14,
//     color: "#888",
//     textAlign: "center",
//     fontStyle: "italic",
//   },
//   resetFiltersContainer: {
//     marginTop: 15,
//     alignItems: "center",
//   },
//   resetFiltersButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f8f9fa",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "#183E9F",
//   },
//   resetFiltersText: {
//     marginLeft: 8,
//     color: "#183E9F",
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   addButton: {
//     position: "absolute",
//     bottom: 30,
//     right: 30,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "#183E9F",
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   scrollButton: {
//     position: "absolute",
//     bottom: 100,
//     right: 30,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "#28A745",
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   successModalOverlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.4)",
//   },
//   successModalContainer: {
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 25,
//     alignItems: "center",
//     elevation: 5,
//   },
//   successModalText: {
//     marginTop: 15,
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#333",
//   },
//   rtlText: {
//     textAlign: "right",
//   },
//   rtlSearchContainer: {
//     flexDirection: "row-reverse",
//   },
// });

// export default ClientDoctorList;
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
  Alert,
  RefreshControl,
  Animated,
  StatusBar,
} from "react-native";
import { useTranslation } from "react-i18next";

import GoBack from "../components/GoBack";
import AddNewDoctorModel from "../components/Modals/AddNewDoctorModel";

const SuccessfullyModel = ({ show, hide, message }) => (
  <Modal transparent={true} visible={show} animationType="fade">
    <View style={styles.successModalOverlay}>
      <View style={styles.successModalContainer}>
        <AntDesign name="checkcircle" size={40} color="#28A745" />
        <Text style={styles.successModalText}>{message}</Text>
      </View>
    </View>
  </Modal>
);

import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import globalConstants from "../config/globalConstants";
import { useAuth } from "../contexts/AuthContext";
import { get, post } from "../WebService/RequestBuilder";
import API from "../config/apiConfig";
import {
  getAreasForCity,
  formatCitiesForDropdown,
  formatAreasForDropdown,
  formatSpecialtiesForDropdown,
} from "../services/locationService";
import { fetchSpecialties } from "../services/specialtyService";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCitiesAndAreas, updateAreasForCity } from '../store/apps/cities';
import { useCurrentUser, useUserId } from '../hooks/useCurrentUser';

const { width, height } = Dimensions.get("window");
const FIXED_COLUMN_WIDTH = width * 0.35;
const SCROLLABLE_COLUMN_WIDTH = width * 0.3;
const ROW_HEIGHT = 60;

const ClientDoctorList = ({ navigation, header = true }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const scrollViewRef = useRef(null);
  
  // Redux
  const dispatch = useDispatch();
  const userLocationData = useSelector(state => state.cities.userLocationData);

  const [allDoctors, setAllDoctors] = useState([]);
  const [cachedDoctors, setCachedDoctors] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [allAreas, setAllAreas] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const [addDoctorModalVisible, setAddDoctorModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const [filters, setFilters] = useState({
    city_id: null,
    area_id: null,
    speciality_id: null,
    searchTerm: "",
  });

  const { user: currentUser } = useCurrentUser();
  const userId = useUserId();
  const { token } = useAuth();
  const user = currentUser; // لتوافق المراجع في useEffect
  
  // Debug: تتبع بيانات المستخدم
  useEffect(() => {
    console.log('🔍 ClientDoctorList - User Debug:');
    console.log('  - currentUser:', currentUser);
    console.log('  - user:', user);
    console.log('  - userId:', userId);
    console.log('  - token:', token ? 'موجود' : 'غير موجود');
  }, [currentUser, user, userId, token]);

  // عرض عنصر التخصص في الدروب داون بشكل صريح لضمان ظهور النص
  const renderSpecialtyItem = useCallback((item) => {
    console.log('🎨 renderSpecialtyItem called with:', item);
    return (
      <View style={{ 
        paddingVertical: 15, 
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        minHeight: 50,
        justifyContent: 'center'
      }}>
        <Text style={{ 
          color: '#2c3e50', 
          fontSize: 16, 
          fontWeight: '500',
          textAlign: 'left',
          lineHeight: 20
        }}>
          {item?.label ?? ''}
        </Text>
      </View>
    );
  }, []);

  // أدوات مساعدة لتحويل المعرفات إلى أسماء من Redux
  const getCityNameById = useCallback((cityId) => {
    if (!cityId) return '';
    // محاولة من الخرائط السريعة
    const map = userLocationData.citiesMap || {};
    if (map[cityId]) return map[cityId].name || '';
    // fallback على المصفوفة
    const found = (userLocationData.cities || []).find(c => c && (c.id === cityId || String(c.id) === String(cityId)));
    return found ? (found.name || '') : '';
  }, [userLocationData.citiesMap, userLocationData.cities]);

  const getAreaNameById = useCallback((areaId) => {
    if (!areaId) return '';
    const map = userLocationData.areasMap || {};
    if (map[areaId]) return map[areaId].name || '';
    const found = (userLocationData.areas || []).find(a => a && (a.id === areaId || String(a.id) === String(areaId)));
    return found ? (found.name || '') : '';
  }, [userLocationData.areasMap, userLocationData.areas]);

  const resolveCityName = useCallback((doctor) => {
    // التعامل مع الكائن المتداخل من الـ API: doctor.city => { id, name }
    const nestedCityName = (doctor && typeof doctor.city === 'object' && doctor.city)
      ? (doctor.city.name ?? '')
      : '';
    return (
      nestedCityName || doctor?.city_name || getCityNameById(doctor?.city_id) || ''
    );
  }, [getCityNameById]);

  const resolveAreaName = useCallback((doctor) => {
    const nestedAreaName = (doctor && typeof doctor.area === 'object' && doctor.area)
      ? (doctor.area.name ?? '')
      : '';
    return (
      nestedAreaName || doctor?.area_name || getAreaNameById(doctor?.area_id) || ''
    );
  }, [getAreaNameById]);

  // دالة لاستخدام البيانات الجغرافية المخزنة في Redux (من HomePage)
  const loadLocationDataFromRedux = useCallback(async () => {
    try {
      console.log("🗺️ استخدام البيانات الجغرافية المخزنة في Redux...");
      console.log("🏙️ عدد المدن المخزنة:", userLocationData.cities.length);
      console.log("📍 عدد المناطق المخزنة:", userLocationData.areas.length);
      
      // استخدام البيانات المخزنة في Redux مباشرة
      if (userLocationData.cities.length > 0) {
        setCities(userLocationData.citiesFormatted);
        setAllAreas(userLocationData.areas);
        console.log(`✅ تم تحميل البيانات الجغرافية من Redux: ${userLocationData.cities.length} مدن، ${userLocationData.areas.length} مناطق`);
        
        // طباعة تفاصيل المدن والمناطق
        console.log("🏙️ المدن المتاحة:");
        userLocationData.cities.forEach((city, index) => {
          console.log(`  ${index + 1}. ${city.name} (ID: ${city.id})`);
        });
        
        console.log("📍 المناطق المتاحة:");
        userLocationData.areas.forEach((area, index) => {
          console.log(`  ${index + 1}. ${area.name} (ID: ${area.id}) - مدينة: ${area.city_name || 'غير محدد'} (City ID: ${area.city_id})`);
        });
      } else {
        console.log("⚠️ لا توجد بيانات مخزنة في Redux - سيتم انتظار تحميل البيانات من HomePage");
        // لا نفعل شيئاً، سننتظر حتى يتم تحميل البيانات من HomePage
        // البيانات ستأتي عبر useEffect الذي يراقب تغييرات Redux
      }
    } catch (error) {
      console.error("❌ خطأ في تحميل البيانات الجغرافية:", error);
    }
  }, [userLocationData.cities, userLocationData.citiesFormatted, userLocationData.areas]);
  

  // دالة لجلب جميع المناطق
 

  // دالة لجلب الأطباء المفلترة من API الجديد
  const fetchFilteredDoctors = useCallback(
    async (currentPage = 1, isRefresh = false) => {
      // تعيين حالة التحميل فقط للصفحة الأولى
      if (currentPage === 1) {
        setIsLoading(true);
      }

      try {
        // بناء الاستعلام يدوياً لأن URLSearchParams غير مدعوم في React Native
        const params = {};
        if (filters.searchTerm) params.search_term = filters.searchTerm;
        if (filters.city_id) params.city_id = filters.city_id;
        if (filters.area_id) params.area_id = filters.area_id;
        if (filters.speciality_id) params.speciality_id = filters.speciality_id;
        // إلغاء الباجينيشن عند الفلترة وجلب كل النتائج
        params.paginate = false;

        const queryString = Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== null && v !== "")
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
          .join('&');

        const endpoint = queryString ? `doctors/filter?${queryString}` : `doctors/filter`;

        console.log('🔍 جلب الأطباء المفلترة:', endpoint);
        console.log('📊 الفلاتر النشطة:', { ...params });

        const response = await get(endpoint);

        const responseData = response.data || response;
        const newDoctors = responseData.data || responseData || [];
        const meta = responseData.meta || {};

        const processedDoctors = newDoctors.map((doctor) => {
          const specialityRaw = doctor.speciality ?? doctor.specialty ?? doctor.specialty_name;
          const specialtyName = typeof specialityRaw === 'object' && specialityRaw !== null
            ? (specialityRaw.name ?? '')
            : (specialityRaw ?? '');
          const specialtyId = typeof specialityRaw === 'object' && specialityRaw !== null
            ? (specialityRaw.id ?? doctor.speciality_id ?? null)
            : (doctor.speciality_id ?? null);

          return {
            ...doctor,
            city_id: doctor.city_id ?? null,
            area_id: doctor.area_id ?? null,
            speciality_id: specialtyId,
            specialty_name: specialtyName,
            city_name: (doctor && typeof doctor.city === 'object' && doctor.city)
              ? (doctor.city.name ?? doctor.city_name ?? '')
              : (doctor.city_name ?? ''),
            area_name: (doctor && typeof doctor.area === 'object' && doctor.area)
              ? (doctor.area.name ?? doctor.area_name ?? '')
              : (doctor.area_name ?? ''),
            distributor_name: doctor.distributor_name ?? "",
            name: doctor.name ?? "",
            phone: doctor.phone ?? "",
            address: doctor.address ?? "",
            classification: doctor.classification ?? "",
            status: doctor.status ?? "inactive",
          };
        });

        // تحديد ما إذا كان هناك المزيد من البيانات
        // بما أننا نلغي الباجينيشن عند الفلترة، لا يوجد المزيد
        const hasMore = false;
        setHasMoreData(false);

        if (newDoctors.length === 0) {
          setHasMoreData(false);
        } else {
          if (isRefresh || currentPage === 1) {
            setAllDoctors(processedDoctors);
            setCachedDoctors(processedDoctors);
          } else {
            setAllDoctors((prevDoctors) => {
              const existingIds = prevDoctors.map((doctor) => doctor.id);
              const filteredNewDoctors = processedDoctors.filter(
                (doctor) => !existingIds.includes(doctor.id)
              );
              const updatedDoctors = [...prevDoctors, ...filteredNewDoctors];
              setCachedDoctors(updatedDoctors);
              return updatedDoctors;
            });
          }
        }

        console.log(`✅ تم تحميل ${processedDoctors.length} طبيب من الصفحة ${currentPage}`);
        console.log(`📊 إجمالي الأطباء: ${allDoctors.length + processedDoctors.length}`);
        console.log(`📄 الفلترة بدون باجينيشن - تم جلب جميع النتائج`);
      } catch (error) {
        console.error("❌ خطأ في جلب الأطباء المفلترة:", error);
        Alert.alert("خطأ", "فشل في جلب الأطباء المفلترة");
        if (currentPage === 1) {
          setAllDoctors([]);
        }
      } finally {
        // إعادة تعيين حالة التحميل فقط للصفحة الأولى
        if (currentPage === 1) {
          setIsLoading(false);
        }
      }
    },
    [userId, token, filters.searchTerm, filters.city_id, filters.area_id, filters.speciality_id]
  );

  // دالة لجلب الأطباء (الطريقة القديمة - للاحتياط)
  const fetchDoctors = useCallback(
    async (currentPage = 1, isRefresh = false) => {
      // تعيين حالة التحميل فقط للصفحة الأولى
      if (currentPage === 1) {
        setIsLoading(true);
      }

      try {
        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await get(
          `doctors?page=${currentPage}&user_id=${userId}&limit=10`,
          { headers }
        );

        const responseData = response.data || response;
        const newDoctors = responseData.data || responseData || [];
        const meta = responseData.meta || {};

        const processedDoctors = newDoctors.map((doctor) => {
          const specialityRaw = doctor.speciality ?? doctor.specialty ?? doctor.specialty_name;
          const specialtyName = typeof specialityRaw === 'object' && specialityRaw !== null
            ? (specialityRaw.name ?? '')
            : (specialityRaw ?? '');
          const specialtyId = typeof specialityRaw === 'object' && specialityRaw !== null
            ? (specialityRaw.id ?? doctor.speciality_id ?? null)
            : (doctor.speciality_id ?? null);

          return {
            ...doctor,
            city_id: doctor.city_id ?? null,
            area_id: doctor.area_id ?? null,
            speciality_id: specialtyId,
            specialty_name: specialtyName,
            city_name: (doctor && typeof doctor.city === 'object' && doctor.city)
              ? (doctor.city.name ?? doctor.city_name ?? '')
              : (doctor.city_name ?? ''),
            area_name: (doctor && typeof doctor.area === 'object' && doctor.area)
              ? (doctor.area.name ?? doctor.area_name ?? '')
              : (doctor.area_name ?? ''),
            distributor_name: doctor.distributor_name ?? "",
            name: doctor.name ?? "",
            phone: doctor.phone ?? "",
            address: doctor.address ?? "",
            classification: doctor.classification ?? "",
            status: doctor.status ?? "inactive",
          };
        });

        // تحديد ما إذا كان هناك المزيد من البيانات
        const hasMore = meta.last_page ? currentPage < meta.last_page : newDoctors.length >= 10;
        setHasMoreData(hasMore);

        if (newDoctors.length === 0) {
          setHasMoreData(false);
        } else {
          if (isRefresh || currentPage === 1) {
            setAllDoctors(processedDoctors);
            setCachedDoctors(processedDoctors);
          } else {
            setAllDoctors((prevDoctors) => {
              const existingIds = prevDoctors.map((doctor) => doctor.id);
              const filteredNewDoctors = processedDoctors.filter(
                (doctor) => !existingIds.includes(doctor.id)
              );
              const updatedDoctors = [...prevDoctors, ...filteredNewDoctors];
              setCachedDoctors(updatedDoctors);
              return updatedDoctors;
            });
          }
        }
      } catch (error) {
        console.error("❌ خطأ في جلب الأطباء:", error);
        Alert.alert("خطأ", "فشل في جلب بيانات الأطباء");
        if (currentPage === 1) {
          setAllDoctors([]);
        }
      } finally {
        // إعادة تعيين حالة التحميل فقط للصفحة الأولى
        if (currentPage === 1) {
          setIsLoading(false);
        }
        // ملاحظة: isLoadingMore يتم التعامل معه في loadMoreData
      }
    },
    [userId, token]
  );

  // دالة تحميل المزيد
  const loadMoreData = useCallback(async () => {
    // إذا كانت هناك فلاتر نشطة، لا نحمّل المزيد لأننا نجلب كل النتائج دفعة واحدة
    const hasActiveFilters = filters.searchTerm || filters.city_id || filters.area_id || filters.speciality_id;
    if (hasActiveFilters) {
      return;
    }
    if (!isLoadingMore && hasMoreData && !isLoading) {
      const nextPage = page + 1;
      console.log(`📄 تحميل الصفحة ${nextPage}...`);
      
      try {
        setIsLoadingMore(true);
        setPage(nextPage);
        // استخدام الدالة المفلترة إذا كان هناك فلاتر نشطة
        const hasActiveFilters = filters.searchTerm || filters.city_id || filters.area_id || filters.speciality_id;
        if (hasActiveFilters) {
          await fetchFilteredDoctors(nextPage, false);
        } else {
          await fetchDoctors(nextPage, false);
        }
      } catch (error) {
        console.error("❌ خطأ في تحميل المزيد:", error);
        // إعادة تعيين الحالة في حالة الخطأ
        setPage(page); // العودة للصفحة السابقة
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [page, isLoadingMore, hasMoreData, isLoading, fetchDoctors, fetchFilteredDoctors, filters]);

  // دالة التمرير للأعلى
  const scrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  // معالجة حدث التمرير
  const handleScroll = useCallback(
    (event) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;
      const currentScrollY = contentOffset.y;
      setScrollY(currentScrollY);

      // إظهار زر العودة للأعلى عند التمرير لأسفل أكثر من 300
      setShowScrollToTop(currentScrollY > 300);

      // تحميل المزيد عند الوصول للنهاية
      const paddingToBottom = 200; // زيادة المساحة لتحسين الأداء
      const isNearBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;

      // التأكد من وجود بيانات للتحميل وأننا لسنا في حالة تحميل
      if (isNearBottom && hasMoreData && !isLoadingMore && !isLoading && allDoctors.length > 0) {
        console.log("🔄 تم الوصول للنهاية، بدء تحميل المزيد...");
        loadMoreData();
      }
    },
    [loadMoreData, hasMoreData, isLoadingMore, isLoading, allDoctors.length]
  );

  // دالة التحديث
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    setHasMoreData(true);
    setCachedDoctors([]);

    await fetchDoctors(1, true);
    setTimeout(async () => {
      await fetchDoctors(2, false);
      setPage(2);
      setRefreshing(false);
    }, 500);
  }, [fetchDoctors]);

  // تحميل البيانات الأولية
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('🚀 بدء تحميل البيانات الأولية - ClientDoctorList');
        console.log('👤 User ID:', userId);
        console.log('🔑 Token:', token ? 'موجود' : 'غير موجود');
        
        if (userId && token) {
          // تحميل التخصصات لفلترة الجدول والمودال
          try {
            const list = await fetchSpecialties();
            console.log('🔬 التخصصات المحملة:', list);
            console.log('🔬 عدد التخصصات:', list?.length || 0);
            if (Array.isArray(list)) {
              console.log('🔬 قائمة التخصصات:');
              list.forEach((spec, idx) => {
                console.log(`  ${idx + 1}. ${spec?.label ?? ''} (ID: ${spec?.value ?? ''})`);
              });
            }
            setSpecialties(list);
            console.log('✅ تم تحديث state التخصصات');
          } catch (e) {
            console.log('⚠️ فشل في جلب التخصصات:', e?.message || e);
          }

          await loadLocationDataFromRedux();

          if (cachedDoctors.length > 0) {
            setAllDoctors(cachedDoctors);
            setIsLoading(false);
          } else {
            setPage(1);
            setHasMoreData(true);
            await fetchDoctors(1, true);

            setTimeout(async () => {
              await fetchDoctors(2, false);
              setPage(2);
            }, 500);
          }
        } else {
          console.log('⚠️ لا يوجد user أو token');
          if (!userId) {
            Alert.alert("خطأ", "يجب تسجيل الدخول أولاً");
          } else if (!token) {
            Alert.alert("خطأ", "لا يوجد رمز مصادقة صالح");
          }
        }
      } catch (error) {
        console.error("❌ خطأ في تحميل البيانات:", error);
        Alert.alert("خطأ", "فشل في تحميل البيانات");
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [userId, token]);

  // مراقبة تغييرات البيانات في Redux وتحديث الدروب داون
  useEffect(() => {
    if (userLocationData.cities.length > 0) {
      console.log("🔄 تم تحديث البيانات في Redux - تحديث الدروب داون");
      setCities(userLocationData.citiesFormatted);
      setAllAreas(userLocationData.areas);
    }
  }, [userLocationData.cities.length, userLocationData.citiesFormatted, userLocationData.areas]);

  // البحث المتباطئ (debounced search)
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (filters.searchTerm && filters.searchTerm.length > 0) {
        console.log('🔍 تنفيذ البحث المتباطئ:', filters.searchTerm);
        try {
          setPage(1);
          setHasMoreData(true);
          await fetchFilteredDoctors(1, true);
        } catch (error) {
          console.error("❌ خطأ في البحث:", error);
        }
      }
    }, 500); // انتظار 500ms بعد توقف الكتابة

    return () => clearTimeout(searchTimeout);
  }, [filters.searchTerm, fetchFilteredDoctors]);

  // الأطباء المفلترة
  const filteredDoctors = useMemo(() => {
    if (isLoading && allDoctors.length === 0) return [];

    return allDoctors.filter((doctor) => {
      const searchTermLower = filters.searchTerm.toLowerCase();
      const nameMatch = (doctor.name || "")
        .toLowerCase()
        .includes(searchTermLower);
      const cityFilterMatch =
        !filters.city_id || doctor.city_id === filters.city_id;
      const areaFilterMatch =
        !filters.area_id || doctor.area_id === filters.area_id;
      const specialtyFilterMatch =
        !filters.speciality_id ||
        doctor.speciality_id === filters.speciality_id;
      return (
        nameMatch && cityFilterMatch && areaFilterMatch && specialtyFilterMatch
      );
    });
  }, [allDoctors, filters, isLoading]);

  // إعادة تعيين جميع الفلاتر
  const resetFilters = useCallback(async () => {
    console.log('🔄 إعادة تعيين جميع الفلاتر');
    setFilters({
      city_id: null,
      area_id: null,
      speciality_id: null,
      searchTerm: "",
    });
    setAreas([]);
    
    try {
      setPage(1);
      setHasMoreData(true);
      await fetchDoctors(1, true);
    } catch (error) {
      console.error("❌ خطأ في إعادة تحميل البيانات:", error);
    }
  }, [fetchDoctors]);

  // معالجة تغيير الفلاتر
  const handleFilterChange = useCallback(async (key, value) => {
    console.log(`🔧 تغيير الفلتر: ${key} = ${value}`);
    
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      if (key === "city_id") {
        newFilters.area_id = null;
        if (value) {
          // استخدام Redux لتحديث المناطق
          dispatch(updateAreasForCity(value));
          
          // فلترة المناطق حسب المدينة المختارة من البيانات المخزنة في Redux
          const filteredAreas = userLocationData.areas
            .filter(area => area.city_id === value.toString())
            .map(area => ({
              value: area.id,
              label: area.name
            }));
          
          setAreas(filteredAreas);
          console.log(`🏙️ تم تحديث المناطق للمدينة ${value}:`, filteredAreas.length, 'منطقة');
          console.log('📍 المناطق المفلترة:', filteredAreas);
        } else {
          setAreas([]);
          console.log('🗑️ تم مسح المناطق');
        }
      }
      
      console.log('📊 الفلاتر الجديدة:', newFilters);
      return newFilters;
    });

    // إعادة تحميل البيانات مع الفلاتر الجديدة (باستثناء البحث النصي)
    if (key !== "searchTerm") {
      try {
        setPage(1);
        setHasMoreData(true);
        await fetchFilteredDoctors(1, true);
      } catch (error) {
        console.error("❌ خطأ في إعادة تحميل البيانات:", error);
      }
    }
  }, [dispatch, userLocationData.areas, fetchFilteredDoctors]);

  // عند إضافة طبيب جديد
  const onDoctorAdded = (success) => {
    setAddDoctorModalVisible(false);
    if (success) {
      setSuccessModalVisible(true);
      setPage(1);
      setHasMoreData(true);
      setCachedDoctors([]);

      const reloadInitialData = async () => {
        await fetchDoctors(1, true);
        setTimeout(async () => {
          await fetchDoctors(2, false);
          setPage(2);
        }, 500);
      };

      reloadInitialData();
      setTimeout(() => setSuccessModalVisible(false), 2000);
    }
  };

  // لون الحالة
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "#28A745";
      case "inactive":
        return "#DC3545";
      case "pending":
        return "#007BFF";
      default:
        return "#6C757D";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#F8F9FA" barStyle="dark-content" />
      {header && <GoBack text={t("clientDoctorList.headerTitle")} />}

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
            colors={["#183E9F"]}
            tintColor="#183E9F"
            title={t("clientDoctorList.pullToRefresh")}
          />
        }
      >
        <View style={styles.filtersContainer}>
          <View
            style={[styles.searchContainer, isRTL && styles.rtlSearchContainer]}
          >
            <TextInput
              style={[styles.searchInput, isRTL && styles.rtlText]}
              placeholder={t("clientDoctorList.searchPlaceholder")}
              placeholderTextColor="#888"
              value={filters.searchTerm}
              onChangeText={(text) => handleFilterChange("searchTerm", text)}
            />
            <Feather name="search" size={20} color="#888" />
          </View>

          <View style={styles.filterRow}>
            <View style={styles.filterBox}>
              <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>
                {t("clientDoctorList.filterByCity")}
              </Text>
              <Dropdown
                style={styles.dropdown}
                data={cities}
                labelField="label"
                valueField="value"
                placeholder={t("clientDoctorList.allCities")}
                value={filters.city_id}
                onChange={(item) => handleFilterChange("city_id", item.value)}
                itemTextStyle={dropdownStyles.itemTextStyle}
                selectedTextStyle={dropdownStyles.selectedTextStyle}
                placeholderStyle={dropdownStyles.placeholderStyle}
                containerStyle={dropdownStyles.containerStyle}
              />
            </View>

            <View style={styles.filterBox}>
              <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>
                {t("clientDoctorList.filterByArea")}
              </Text>
              <Dropdown
                style={styles.dropdown}
                data={areas}
                labelField="label"
                valueField="value"
                placeholder={
                  !filters.city_id
                    ? t("clientDoctorList.selectCityFirst")
                    : t("clientDoctorList.allAreas")
                }
                value={filters.area_id}
                onChange={(item) => handleFilterChange("area_id", item.value)}
                disable={!filters.city_id}
                itemTextStyle={dropdownStyles.itemTextStyle}
                selectedTextStyle={dropdownStyles.selectedTextStyle}
                placeholderStyle={dropdownStyles.placeholderStyle}
                containerStyle={dropdownStyles.containerStyle}
              />
            </View>
          </View>

          <View style={styles.filterBoxFullWidth}>
            <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>
              {t("clientDoctorList.filterBySpecialty")}
            </Text>
            <Dropdown
              style={styles.dropdown}
              data={specialties}
              labelField="label"
              valueField="value"
              placeholder={t("clientDoctorList.allSpecialties")}
              value={filters.speciality_id}
              onChange={(item) => {
                console.log('🔽 تم اختيار تخصص:', item);
                handleFilterChange("speciality_id", item.value);
              }}
              renderItem={renderSpecialtyItem}
              selectedTextStyle={{ color: '#2c3e50', fontSize: 16, fontWeight: '600' }}
              placeholderStyle={{ fontSize: 16, color: '#7f8c8d' }}
              containerStyle={{ 
                borderRadius: 10, 
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#e0e0e0',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}
              onFocus={() => console.log('🔽 Dropdown focused, specialties data:', specialties)}
            />
          </View>

          {/* زر إعادة تعيين الفلاتر */}
          <View style={styles.resetFiltersContainer}>
            <TouchableOpacity 
              style={styles.resetFiltersButton}
              onPress={resetFilters}
            >
              <AntDesign name="reload1" size={16} color="#183E9F" />
              <Text style={[styles.resetFiltersText, isRTL && styles.rtlText]}>
                {t("clientDoctorList.resetFilters")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Table */}
        <View style={styles.tableContainer}>
          {isLoading && allDoctors.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, isRTL && styles.rtlText]}>
                {t("clientDoctorList.loading")}
              </Text>
            </View>
          ) : filteredDoctors.length > 0 ? (
            <View style={styles.table}>
              <View style={styles.fixedColumn}>
                <View style={styles.fixedHeaderCell}>
                  <Text
                    style={[styles.fixedHeaderText, isRTL && styles.rtlText]}
                  >
                    {t("clientDoctorList.doctorName")}
                  </Text>
                </View>
                {filteredDoctors.map((item, index) => (
                  <View
                    key={`doctor-fixed-${item.id}-${index}`}
                    style={[
                      styles.fixedCell,
                      index % 2 === 1 ? styles.oddRow : styles.evenRow,
                    ]}
                  >
                    <Text style={styles.fixedCellText}>{item.name}</Text>
                    <Text style={styles.fixedCellText}>
                      {item.distributor_name}
                    </Text>
                  </View>
                ))}
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View style={styles.scrollablePart}>
                  <View style={styles.scrollableHeaderRow}>
                    <View style={styles.scrollableHeaderCell}>
                      <Text
                        style={[
                          styles.scrollableHeaderText,
                          isRTL && styles.rtlText,
                        ]}
                      >
                        {t("clientDoctorList.specialty")}
                      </Text>
                    </View>
                    <View style={styles.scrollableHeaderCell}>
                      <Text
                        style={[
                          styles.scrollableHeaderText,
                          isRTL && styles.rtlText,
                        ]}
                      >
                        {t("clientDoctorList.city")}
                      </Text>
                    </View>
                    <View style={styles.scrollableHeaderCell}>
                      <Text
                        style={[
                          styles.scrollableHeaderText,
                          isRTL && styles.rtlText,
                        ]}
                      >
                        {t("clientDoctorList.area")}
                      </Text>
                    </View>
                    <View style={styles.scrollableHeaderCell}>
                      <Text
                        style={[
                          styles.scrollableHeaderText,
                          isRTL && styles.rtlText,
                        ]}
                      >
                        {t("clientDoctorList.phone")}
                      </Text>
                    </View>
                    <View style={styles.scrollableHeaderCell}>
                      <Text
                        style={[
                          styles.scrollableHeaderText,
                          isRTL && styles.rtlText,
                        ]}
                      >
                        {t("clientDoctorList.address")}
                      </Text>
                    </View>
                    <View style={styles.scrollableHeaderCell}>
                      <Text
                        style={[
                          styles.scrollableHeaderText,
                          isRTL && styles.rtlText,
                        ]}
                      >
                        {t("clientDoctorList.classification")}
                      </Text>
                    </View>
                    <View style={styles.scrollableHeaderCell}>
                      <Text
                        style={[
                          styles.scrollableHeaderText,
                          isRTL && styles.rtlText,
                        ]}
                      >
                        {t("clientDoctorList.status")}
                      </Text>
                    </View>
                  </View>
                  {filteredDoctors.map((item, index) => (
                    <View
                      key={`doctor-${item.id}-${index}`}
                      style={[
                        styles.scrollableDataRow,
                        index % 2 === 1 ? styles.oddRow : styles.evenRow,
                      ]}
                    >
                      <View style={styles.scrollableCell}>
                        <Text style={styles.scrollableCellText}>
                          {item.specialty_name}
                        </Text>
                      </View>
                      <View style={styles.scrollableCell}>
                        <Text style={styles.scrollableCellText}>
                          {resolveCityName(item)}
                        </Text>
                      </View>
                      <View style={styles.scrollableCell}>
                        <Text style={styles.scrollableCellText}>
                          {resolveAreaName(item)}
                        </Text>
                      </View>
                      <View style={styles.scrollableCell}>
                        <Text style={styles.scrollableCellText}>
                          {item.phone}
                        </Text>
                      </View>
                      <View style={styles.scrollableCell}>
                        <Text
                          style={styles.scrollableCellText}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.address}
                        </Text>
                      </View>
                      <View style={styles.scrollableCell}>
                        <Text style={styles.scrollableCellText}>
                          {item.classification}
                        </Text>
                      </View>
                      <View style={styles.scrollableCell}>
                        <Text
                          style={[
                            styles.scrollableCellText,
                            {
                              color: getStatusColor(item.status),
                              fontWeight: "bold",
                            },
                          ]}
                        >
                          {item.status}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, isRTL && styles.rtlText]}>
                {t("clientDoctorList.noData")}
              </Text>
            </View>
          )}
        </View>

        {isLoadingMore && (
          <View style={styles.loadingMoreContainer}>
            <AntDesign name="downcircleo" size={24} color="#183E9F" />
            <Text style={[styles.loadingText, isRTL && styles.rtlText]}>
              {t("clientDoctorList.loadingMore") || "جاري تحميل المزيد..."}
            </Text>
          </View>
        )}

        {!hasMoreData && allDoctors.length > 0 && (
          <View style={styles.loadingMoreContainer}>
            <Text style={[styles.noMoreDataText, isRTL && styles.rtlText]}>
              {t("clientDoctorList.noMoreData") || "لا توجد بيانات أخرى"}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* زر إضافة طبيب جديد */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddDoctorModalVisible(true)}
      >
        <AntDesign name="plus" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* زر العودة للأعلى فقط */}
      {showScrollToTop && (
        <TouchableOpacity
          style={styles.scrollButton}
          onPress={scrollToTop}
        >
          <AntDesign name="upcircleo" size={24} color="#FFF" />
        </TouchableOpacity>
      )}

      <AddNewDoctorModel
        show={addDoctorModalVisible}
        hide={() => setAddDoctorModalVisible(false)}
        submit={onDoctorAdded}
        cities={cities}
        allAreas={allAreas}
        specialties={specialties}
      />

      <SuccessfullyModel
        show={successModalVisible}
        hide={() => setSuccessModalVisible(false)}
        message={t("clientDoctorList.addNewDoctorModal.successMessage")}
      />
    </SafeAreaView>
  );
};

const dropdownStyles = {
  itemTextStyle: { color: "#333", fontSize: 14, textAlign: "left" },
  selectedTextStyle: { fontSize: 14, color: "#333" },
  placeholderStyle: { fontSize: 14, color: "#999" },
  containerStyle: { borderRadius: 8 },
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
  successModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  successModalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 25,
    alignItems: "center",
    elevation: 5,
  },
  successModalText: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  rtlText: {
    textAlign: "right",
  },
  rtlSearchContainer: {
    flexDirection: "row-reverse",
  },
});

export default ClientDoctorList;