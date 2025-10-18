import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
  StatusBar,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../contexts/AuthContext";
import { fetchCitiesAndAreas, updateAreasForCity } from "../store/apps/cities";
import GoBack from "../components/GoBack";
import FiltersSection from "../components/Sales/FiltersSection";
import SalesTable from "../components/Sales/SalesTable";
import useSalesFilters from "../hooks/Sales/useSalesFilters";

AntDesign.loadFont();

const globalStyles = StyleSheet.create({ 
  container: { flex: 1 } 
});

const Sales = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user, token } = useAuth();
  const user_id = user?.id;
  
  const userLocationData = useSelector(state => state.cities.userLocationData || {});
  const {
    citiesFormatted = [],
    loading: locationsLoading,
  } = userLocationData;

  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const scrollViewRef = useRef(null);
  const [paginationState, setPaginationState] = useState({
    loadMore: null,
    hasMore: false,
    isLoading: false,
    dataLength: 0
  });

  const filterProps = useSalesFilters(userLocationData, dispatch, updateAreasForCity);

  const scrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(fetchCitiesAndAreas({ token }));
    }
  }, [token, dispatch]);

  const handleLoadMoreReady = useCallback((state) => {
    setPaginationState(state);
  }, []);

  const handleScroll = useCallback(
    (event) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const currentScrollY = contentOffset.y;
      
      setShowScrollToTop(currentScrollY > 300);
      
      const isNearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
      
      if (isNearBottom && paginationState.hasMore && !paginationState.isLoading && paginationState.dataLength > 0 && paginationState.loadMore) {
        console.log("🔄 تم الوصول للنهاية، بدء تحميل المزيد...");
        paginationState.loadMore();
      }
    },
    [paginationState]
  );

  if (locationsLoading) {
    return (
      <SafeAreaView style={{ ...globalStyles.container, backgroundColor: "#F8F9FA" }}>
        <StatusBar backgroundColor="#F8F9FA" barStyle="dark-content" />
        <GoBack text={t("sales.headerTitle") || "Sales"} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#183E9F" />
          <Text style={styles.loadingText}>{t("sales.loadingLocations") || "Loading locations..."}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ ...globalStyles.container, backgroundColor: "#F8F9FA" }}>
      <StatusBar backgroundColor="#F8F9FA" barStyle="dark-content" />
      <GoBack text={t("sales.headerTitle") || "Sales"} />
      
      <ScrollView 
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <FiltersSection
          citiesFormatted={citiesFormatted}
          {...filterProps}
        />

        <View style={styles.tableSection}>
          <SalesTable 
            saleId={user_id}
            cityId={filterProps.selectedCityId}
            areaId={filterProps.selectedAreaId}
            dateFrom={filterProps.selectedDateFrom}
            dateTo={filterProps.selectedDateTo}
            onLoadMoreReady={handleLoadMoreReady}
          />
        </View>
      </ScrollView>
      
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

export default Sales;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  tableSection: { 
    flex: 1, 
    marginHorizontal: 15, 
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
});

