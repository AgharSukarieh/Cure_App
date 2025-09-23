import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import DatePicker from "react-native-date-picker";
import { useTranslation } from "react-i18next";

// --- Mock Components ---
// تم استبدال GoBack بنسخة مبسطة هنا لتشغيل المثال
const GoBack = ({ text }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  return (
    <View style={styles.header}>
      <Text style={[styles.headerText, isRTL && styles.rtlText]}>{text}</Text>
    </View>
  );
};

// --- FAKE DATA (بيانات وهمية للتحصيل والمدن) ---
const FAKE_CITIES = [
  { label: "Baghdad", value: 1 },
  { label: "Basra", value: 2 },
  { label: "Erbil", value: 3 },
];

const FAKE_AREAS = [
  { label: "Karrada", value: 101, city_id: 1 },
  { label: "Mansour", value: 102, city_id: 1 },
  { label: "Al-Ashar", value: 201, city_id: 2 },
  { label: "Ankawa", value: 301, city_id: 3 },
];

// بيانات وهمية للتحصيل لتوضيح الفكرة
const FAKE_COLLECTION_DATA = [
  {
    id: 1,
    client_name: "Al-Kindi Pharmacy",
    city_name: "Baghdad",
    area_name: "Karrada",
    amount: 150000,
    date: "2025-09-10",
    status: "Collected",
  },
  {
    id: 2,
    client_name: "Modern Lab",
    city_name: "Baghdad",
    area_name: "Mansour",
    amount: 250000,
    date: "2025-09-11",
    status: "Pending",
  },
  {
    id: 3,
    client_name: "Basra Hospital",
    city_name: "Basra",
    area_name: "Al-Ashar",
    amount: 75000,
    date: "2025-09-12",
    status: "Collected",
  },
  {
    id: 4,
    client_name: "Erbil Clinic",
    city_name: "Erbil",
    area_name: "Ankawa",
    amount: 300000,
    date: "2025-09-09",
    status: "Overdue",
  },
  {
    id: 5,
    client_name: "Central Pharmacy",
    city_name: "Baghdad",
    area_name: "Karrada",
    amount: 120000,
    date: "2025-09-12",
    status: "Pending",
  },
];

const { width } = Dimensions.get("window");

const Collection = ({ navigation }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [allCollections, setAllCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [allAreas, setAllAreas] = useState([]);

  const [filters, setFilters] = useState({
    city_id: null,
    area_id: null,
    dateFrom: null,
    dateTo: null,
  });

  // States for Date Pickers
  const [dateFrom, setDateFrom] = useState(new Date());
  const [openDateFrom, setOpenDateFrom] = useState(false);
  const [dateTo, setDateTo] = useState(new Date());
  const [openDateTo, setOpenDateTo] = useState(false);

  // --- Fetching Data ---
  const fetchData = useCallback(() => {
    setIsLoading(true);
    // محاكاة جلب البيانات من API
    setTimeout(() => {
      setCities(FAKE_CITIES);
      setAllAreas(FAKE_AREAS);
      setAllCollections(FAKE_COLLECTION_DATA);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Filtering Logic ---
  const filteredCollections = useMemo(() => {
    if (isLoading) return [];
    return allCollections.filter((item) => {
      const cityFilterMatch =
        !filters.city_id ||
        FAKE_CITIES.find((c) => c.value === filters.city_id)?.label ===
          item.city_name;
      const areaFilterMatch =
        !filters.area_id ||
        FAKE_AREAS.find((a) => a.value === filters.area_id)?.label ===
          item.area_name;
      const dateFromMatch =
        !filters.dateFrom || new Date(item.date) >= new Date(filters.dateFrom);
      const dateToMatch =
        !filters.dateTo || new Date(item.date) <= new Date(filters.dateTo);
      return cityFilterMatch && areaFilterMatch && dateFromMatch && dateToMatch;
    });
  }, [allCollections, filters, isLoading]);

  // --- Handlers ---
  const handleFilterChange = useCallback(
    (key, value) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [key]: value };
        if (key === "city_id") {
          newFilters.area_id = null; // إعادة تعيين المنطقة عند تغيير المدينة
          setAreas(allAreas.filter((area) => area.city_id == value));
        }
        return newFilters;
      });
    },
    [allAreas]
  );

  const handleRowPress = (item) => {
    Alert.alert(
      "Collection Item Selected",
      `Client: ${item.client_name}\nAmount: ${item.amount}`
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "collected":
        return "#28A745";
      case "pending":
        return "#007BFF";
      case "overdue":
        return "#DC3545";
      default:
        return "#6C757D";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoBack text={t("collection.headerTitle")} />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Filters Section */}
        <View style={styles.filtersContainer}>
          {/* City and Area Filters */}
          <View style={styles.filterRow}>
            <View style={styles.filterBox}>
              <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>{t("collection.selectCity")}</Text>
              <Dropdown
                style={styles.dropdown}
                data={cities}
                labelField="label"
                valueField="value"
                placeholder={t("collection.selectCity")}
                value={filters.city_id}
                onChange={(item) => handleFilterChange("city_id", item.value)}
                {...dropdownStyles}
              />
            </View>
            <View style={styles.filterBox}>
              <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>{t("collection.selectArea")}</Text>
              <Dropdown
                style={styles.dropdown}
                data={areas}
                labelField="label"
                valueField="value"
                placeholder={
                  !filters.city_id ? t("collection.selectCity") : t("collection.selectArea")
                }
                value={filters.area_id}
                onChange={(item) => handleFilterChange("area_id", item.value)}
                disable={!filters.city_id}
                {...dropdownStyles}
              />
            </View>
          </View>
          {/* Date Filters */}
          <View style={styles.filterRow}>
            <View style={styles.filterBox}>
              <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>{t("collection.from")}</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setOpenDateFrom(true)}
              >
                <Text style={[styles.dateButtonText, isRTL && styles.rtlText]}>
                  {filters.dateFrom ? filters.dateFrom : "YYYY-MM-DD"}
                </Text>
                <Feather name="calendar" size={18} color="#555" />
              </TouchableOpacity>
            </View>
            <View style={styles.filterBox}>
              <Text style={[styles.filterLabel, isRTL && styles.rtlText]}>{t("collection.to")}</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setOpenDateTo(true)}
              >
                <Text style={styles.dateButtonText}>
                  {filters.dateTo ? filters.dateTo : "YYYY-MM-DD"}
                </Text>
                <Feather name="calendar" size={18} color="#555" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Table */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeaderRow}>
            <View style={styles.fixedHeaderCell}>
              <Text style={styles.fixedHeaderText}>Client Name</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              style={styles.scrollableContent}
            >
              <View style={styles.scrollableHeaderRowContent}>
                <View style={styles.scrollableHeaderCell}>
                  <Text style={styles.scrollableHeaderText}>City</Text>
                </View>
                <View style={styles.scrollableHeaderCell}>
                  <Text style={styles.scrollableHeaderText}>Area</Text>
                </View>
                <View style={styles.scrollableHeaderCell}>
                  <Text style={styles.scrollableHeaderText}>Amount (IQD)</Text>
                </View>
                <View style={styles.scrollableHeaderCell}>
                  <Text style={styles.scrollableHeaderText}>Date</Text>
                </View>
                <View style={styles.scrollableHeaderCell}>
                  <Text style={styles.scrollableHeaderText}>Status</Text>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Table Data */}
          {isLoading ? (
            <Text style={styles.emptyText}>Loading...</Text>
          ) : filteredCollections.length > 0 ? (
            filteredCollections.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.tableDataRow,
                  index % 2 === 1 ? styles.oddRow : styles.evenRow,
                ]}
                onPress={() => handleRowPress(item)}
              >
                <View style={styles.fixedCell}>
                  <Text style={styles.fixedCellText}>{item.client_name}</Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={true}
                  style={styles.scrollableContent}
                >
                  <View style={styles.scrollableDataRowContent}>
                    <View style={styles.scrollableCell}>
                      <Text style={styles.scrollableCellText}>
                        {item.city_name}
                      </Text>
                    </View>
                    <View style={styles.scrollableCell}>
                      <Text style={styles.scrollableCellText}>
                        {item.area_name}
                      </Text>
                    </View>
                    <View style={styles.scrollableCell}>
                      <Text style={styles.scrollableCellText}>
                        {item.amount.toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.scrollableCell}>
                      <Text style={styles.scrollableCellText}>{item.date}</Text>
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
                </ScrollView>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No collection data found.</Text>
          )}
        </View>
      </ScrollView>

      {/* Date Picker Modals */}
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

const dropdownStyles = {
  itemTextStyle: { color: "#333", fontSize: 14, textAlign: "left" },
  selectedTextStyle: { fontSize: 14, color: "#333" },
  placeholderStyle: { fontSize: 14, color: "#999" },
  containerStyle: { borderRadius: 8 },
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    padding: 15,
    backgroundColor: "#FFF",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  headerText: { fontSize: 18, fontWeight: "bold", color: "#183E9F" },
  container: { flex: 1 },
  filtersContainer: {
    padding: 15,
    backgroundColor: "#FFFFFF",
    margin: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  filterBox: { flex: 1, marginHorizontal: 5 },
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
  dateButton: {
    height: 45,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateButtonText: { fontSize: 14, color: "#333" },
  tableContainer: { marginHorizontal: 15 },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#F1F3F5",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: "hidden",
  },
  tableDataRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  fixedHeaderCell: {
    width: width * 0.35,
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  fixedHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#183E9F",
    textAlign: "center",
  },
  fixedCell: {
    width: width * 0.35,
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: "center",
    borderRightWidth: I18nManager.isRTL ? 0 : 1,
    borderLeftWidth: I18nManager.isRTL ? 1 : 0,
    borderColor: "#E0E0E0",
  },
  fixedCellText: { fontSize: 14, color: "#333", textAlign: "center" },
  scrollableContent: { flex: 1 },
  scrollableHeaderRowContent: { flexDirection: "row", minWidth: width * 1.5 },
  scrollableDataRowContent: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: width * 1.5,
  },
  scrollableHeaderCell: {
    width: width * 0.3,
    paddingVertical: 16,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollableHeaderText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1A46BE",
    textAlign: "center",
  },
  scrollableCell: {
    width: width * 0.3,
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollableCellText: { fontSize: 14, color: "#333", textAlign: "center" },
  evenRow: { backgroundColor: "#FFFFFF" },
  oddRow: { backgroundColor: "#FAFAFA" },
  emptyText: { fontSize: 16, color: "#888", padding: 20, textAlign: "center" },
  // أنماط RTL
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default Collection;
