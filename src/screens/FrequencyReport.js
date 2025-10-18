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
  ActivityIndicator,
  Image,
  Modal,
  Animated,
  StatusBar,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../contexts/AuthContext";
import { fetchCitiesAndAreas, updateAreasForCity } from "../store/apps/cities";
import Moment from 'moment';
import GoBack from '../components/GoBack';
import Constants from "../config/globalConstants";
import { get, post } from "../WebService/RequestBuilder";
import FiltersSection from "../components/Sales/FiltersSection";
import { FrequencyTable } from "../components/FrequencyReport";

const { width } = Dimensions.get('window');

Feather.loadFont();

const globalStyles = StyleSheet.create({ 
  container: { flex: 1 } 
});

const FrequencyReport = ({ navigation }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const dispatch = useDispatch();
  const { user, token } = useAuth();

  const user_id = user?.id;
  
  const userLocationData = useSelector(state => state.cities.userLocationData || {});
  const {
    citiesFormatted = [],
    areas: allAreas = [],
    loading: locationsLoading,
  } = userLocationData;

  const [cityValue, setCityValue] = useState(null);
  const [areaValue, setAreaValue] = useState(null);
  const [areas, setAreas] = useState([]);
  const [classificationValue, setClassificationValue] = useState(null);
  
  const [paginationState, setPaginationState] = useState({
    loadMore: null,
    hasMore: false,
    isLoading: false,
    dataLength: 0
  });
  
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedClassification, setSelectedClassification] = useState(null);
  const [selectedDateFrom, setSelectedDateFrom] = useState(null);
  const [selectedDateTo, setSelectedDateTo] = useState(null);

  const classifications = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
  ];

  const [openFrom, setOpenFrom] = useState(false);
  const [dateFrom, setDateFrom] = useState(new Date());
  const [calenderFrom, setCalenderFrom] = useState("");
  const [openTo, setOpenTo] = useState(false);
  const [dateTo, setDateTo] = useState(new Date());
  const [calenderTo, setCalenderTo] = useState("");

  const scrollViewRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const [isLocationModalVisible, setLocationModalVisible] = useState(false);
  const [selectedCityForModal, setSelectedCityForModal] = useState(null);
  const [selectedAreaForModal, setSelectedAreaForModal] = useState(null);
  const [currentArea, setCurrentArea] = useState("");

  const formatDate = useCallback((date) => {
    return date.toISOString().split("T")[0];
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(fetchCitiesAndAreas({ token }));
    }
  }, [token, dispatch]);

  const handleCityChange = useCallback((item) => {
    setCityValue(item.value);
    setAreaValue(null);
    setSelectedAreaId(null);
    
    dispatch(updateAreasForCity(item.value));
    
    const filteredAreas = (userLocationData.areas || [])
      .filter(area => String(area.city_id) === String(item.value))
      .map(area => ({
        value: area.id,
        label: area.name
      }));
    
    setAreas(filteredAreas);
    console.log(`📍 تم تحديث المناطق للمدينة ${item.value}:`, filteredAreas.length, 'منطقة');
  }, [dispatch, userLocationData.areas]);

  const handleAreaChange = useCallback((item) => {
    setAreaValue(item.value);
    setSelectedAreaId(item.value);
  }, []);

  const handleClassificationChange = useCallback((item) => {
    setClassificationValue(item.value);
    setSelectedClassification(item.value);
  }, []);

  const handleDateFromConfirm = useCallback((date) => {
    setOpenFrom(false);
    setDateFrom(date);
    const formattedDate = formatDate(date);
    setCalenderFrom(formattedDate);
    setSelectedDateFrom(formattedDate);
  }, [formatDate]);

  const handleDateToConfirm = useCallback((date) => {
    setOpenTo(false);
    setDateTo(date);
    const formattedDate = formatDate(date);
    setCalenderTo(formattedDate);
    setSelectedDateTo(formattedDate);
  }, [formatDate]);

  const scrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const updateAreaInBackend = useCallback(async () => {
    if (!selectedCityForModal || !selectedAreaForModal) {
      alert(t("frequencyReport.selectCityAndArea") || "يرجى اختيار المدينة والمنطقة");
      return;
    }

    try {
      console.log('📡 تحديث المنطقة في Backend...');
      console.log('   - City ID:', selectedCityForModal);
      console.log('   - Area ID:', selectedAreaForModal);

      const cityName = citiesFormatted.find(c => c.value === selectedCityForModal)?.label || '';
      const areaName = allAreas.find(a => a.id === selectedAreaForModal)?.name || '';

      const body = {
        user_id: user_id,
        area: selectedAreaForModal,
        cityName: cityName,
        areaName: areaName
      };

      await post(Constants.plans.update_area, body, null);
      
      console.log('✅ تم تحديث المنطقة بنجاح');
      setCurrentArea(areaName);
      setAreaValue(selectedAreaForModal);
      setSelectedAreaId(selectedAreaForModal);
      setLocationModalVisible(false);
    } catch (err) {
      console.error('❌ خطأ في تحديث المنطقة:', err);
      alert(t("frequencyReport.updateError") || "فشل في تحديث المنطقة");
    }
  }, [selectedCityForModal, selectedAreaForModal, user_id, citiesFormatted, allAreas, t]);

  const loadCitiesAndAreas = useCallback(() => {
    if (citiesFormatted.length > 0 && allAreas.length > 0) {
      return;
    }
    dispatch(fetchCitiesAndAreas({ token }));
  }, [citiesFormatted.length, allAreas.length, dispatch, token]);

  const handleResetFilters = useCallback(() => {
    setCityValue(null);
    setAreaValue(null);
    setAreas([]);
    setClassificationValue(null);
    setSelectedAreaId(null);
    setSelectedClassification(null);
    setSelectedDateFrom(null);
    setSelectedDateTo(null);
    setCalenderFrom("");
    setCalenderTo("");
  }, []);

  const handleLoadMoreReady = useCallback((state) => {
    setPaginationState(state);
  }, []);

  const handleScroll = useCallback(
    (event) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const offsetY = contentOffset.y;
      
      if (offsetY > 300 && !showScrollTop) {
        setShowScrollTop(true);
      } else if (offsetY <= 300 && showScrollTop) {
        setShowScrollTop(false);
      }
      
      const isNearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
      
      if (isNearBottom && paginationState.hasMore && !paginationState.isLoading && paginationState.dataLength > 0 && paginationState.loadMore) {
        console.log("🔄 تم الوصول للنهاية، بدء تحميل المزيد...");
        paginationState.loadMore();
      }
    },
    [paginationState, showScrollTop]
  );

  useEffect(() => {
    if (isLocationModalVisible) {
      loadCitiesAndAreas();
    }
  }, [isLocationModalVisible, loadCitiesAndAreas]);

  if (locationsLoading) {
    return (
      <SafeAreaView style={{ ...globalStyles.container, backgroundColor: "#F8F9FA" }}>
        <StatusBar backgroundColor="#F8F9FA" barStyle="dark-content" />
        <GoBack text={t("frequencyReport.headerTitle") || "Frequency Report"} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#183E9F" />
          <Text style={styles.loadingText}>{t('frequencyReport.loadingLocations') || 'Loading locations...'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ ...globalStyles.container, backgroundColor: "#F8F9FA" }}>
      <StatusBar backgroundColor="#F8F9FA" barStyle="dark-content" />
      <GoBack text={t("frequencyReport.headerTitle") || "Frequency Report"} />
      
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <FiltersSection
          citiesFormatted={citiesFormatted}
          cityValue={cityValue}
          handleCityChange={handleCityChange}
          areas={areas}
          areaValue={areaValue}
          handleAreaChange={handleAreaChange}
          calenderFrom={calenderFrom}
          openFrom={openFrom}
          setOpenFrom={setOpenFrom}
          dateFrom={dateFrom}
          handleDateFromConfirm={handleDateFromConfirm}
          calenderTo={calenderTo}
          openTo={openTo}
          setOpenTo={setOpenTo}
          dateTo={dateTo}
          handleDateToConfirm={handleDateToConfirm}
          handleResetFilters={handleResetFilters}
        />

        {currentArea && (
          <View style={styles.currentAreaBadge}>
            <Feather name="map-pin" size={14} color="#28A745" />
            <Text style={styles.currentAreaText}>{currentArea}</Text>
            <TouchableOpacity 
              onPress={() => setLocationModalVisible(true)}
              style={styles.editAreaButton}
            >
              <Feather name="edit-2" size={12} color="#28A745" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.classificationContainer}>
          <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>
            {t("frequencyReport.classification") || "Classification"}
          </Text>
          <Dropdown
            data={classifications}
            labelField="label"
            valueField="value"
            placeholder={t("frequencyReport.selectClassification") || "Select Classification"}
            value={classificationValue}
            onChange={handleClassificationChange}
            style={styles.classificationDropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.itemTextStyle}
          />
        </View>

        <View style={styles.tableSection}>
          <FrequencyTable 
            userId={user_id}
            areaId={selectedAreaId}
            classification={selectedClassification}
            dateFrom={selectedDateFrom}
            dateTo={selectedDateTo}
            onLoadMoreReady={handleLoadMoreReady}
          />
        </View>
      </ScrollView>

      {showScrollTop && (
        <TouchableOpacity
          style={styles.scrollToTopButton}
          onPress={scrollToTop}
          activeOpacity={0.7}
        >
          <AntDesign name="upcircleo" size={24} color="#FFF" />
        </TouchableOpacity>
      )}

      <Modal
        visible={isLocationModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t("frequencyReport.changeArea") || "تغيير المنطقة"}
              </Text>
              <TouchableOpacity
                onPress={() => setLocationModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>
                {t("frequencyReport.city") || "المدينة"}
              </Text>
              <Dropdown
                data={citiesFormatted}
                labelField="label"
                valueField="value"
                placeholder={t("frequencyReport.selectCity") || "اختر المدينة"}
                value={selectedCityForModal}
                onChange={(item) => {
                  setSelectedCityForModal(item.value);
                  const filteredAreas = allAreas
                    .filter(area => area.city_id === item.value)
                    .map(area => ({
                      label: area.name,
                      value: area.id,
                    }));
                  setAreas(filteredAreas);
                  setSelectedAreaForModal(null);
                }}
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                itemTextStyle={styles.itemTextStyle}
              />

              <Text style={[styles.modalLabel, { marginTop: 20 }]}>
                {t("frequencyReport.area") || "المنطقة"}
              </Text>
              <Dropdown
                data={areas}
                labelField="label"
                valueField="value"
                placeholder={
                  !selectedCityForModal
                    ? t("frequencyReport.selectCityFirst") || "اختر المدينة أولاً"
                    : t("frequencyReport.selectArea") || "اختر المنطقة"
                }
                value={selectedAreaForModal}
                disable={!selectedCityForModal}
                onChange={(item) => setSelectedAreaForModal(item.value)}
                style={[styles.dropdown, !selectedCityForModal && styles.disabledDropdown]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                itemTextStyle={styles.itemTextStyle}
              />

              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={updateAreaInBackend}
              >
                <Text style={styles.modalSaveButtonText}>
                  {t("frequencyReport.save") || "حفظ"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#888",
  },
  currentAreaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    gap: 8,
  },
  currentAreaText: {
    fontSize: 14,
    color: '#28A745',
    fontWeight: '600',
    flex: 1,
  },
  editAreaButton: {
    padding: 6,
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
  },
  classificationContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    fontWeight: "600",
  },
  classificationDropdown: {
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F8F9FA",
    marginTop: 5,
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "#333",
  },
  itemTextStyle: {
    fontSize: 14,
    color: "#333",
  },
  dropdown: {
    height: 48,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
  },
  disabledDropdown: {
    backgroundColor: "#F5F5F5",
  },
  tableSection: { 
    flex: 1, 
    marginBottom: 15 
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    backgroundColor: '#183E9F',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#183E9F',
  },
  modalCloseButton: {
    padding: 5,
  },
  modalBody: {
    width: '100%',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  modalSaveButton: {
    backgroundColor: '#183E9F',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  modalSaveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  rtlText: {
    textAlign: I18nManager.isRTL?"left": "right",
    writingDirection: "rtl",
  },
});

export default FrequencyReport;
