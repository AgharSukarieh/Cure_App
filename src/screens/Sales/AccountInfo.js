import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  I18nManager,
  Animated,
  StatusBar,
} from "react-native";
import { useTranslation } from "react-i18next";
import CustomDatePicker from "../../components/CustomPicker";
import Input from "../../components/Input";
import ButtonWithIndicator from "../../components/ButtonWithIndicator";
import PaymentMethodModel from "../../components/Modals/PaymentMethodModel";
import Feather from "react-native-vector-icons/Feather";
import LinearGradient from "react-native-linear-gradient";
import GoBack from "../../components/GoBack";

const { width, height } = Dimensions.get("window");

const SkeletonPlaceholder = () => {
  const opacityValue = new Animated.Value(0.5);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityValue, {
          toValue: 1,
          useNativeDriver: true,
          duration: 500,
        }),
        Animated.timing(opacityValue, {
          toValue: 0.5,
          useNativeDriver: true,
          duration: 500,
        }),
      ])
    ).start();
  }, [opacityValue]);

  return (
    <View style={styles.tableWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View>
          <View style={styles.scrollableHeaderRow}>
            {[...Array(4)].map((_, i) => (
              <Animated.View
                key={i}
                style={[styles.skeletonHeaderCell, { opacity: opacityValue }]}
              />
            ))}
          </View>
          {[...Array(3)].map((_, rowIndex) => (
            <View key={rowIndex} style={styles.scrollableRow}>
              {[...Array(4)].map((_, cellIndex) => (
                <Animated.View
                  key={cellIndex}
                  style={[styles.skeletonCell, { opacity: opacityValue }]}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const StyledAccountTable = ({ data }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.tableWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={[styles.scrollableHeaderRow, styles.tableHeader]}>
            <View style={styles.scrollableHeaderCell}>
              <Text style={styles.scrollableHeaderText}>
                {t("accountInfo.tableDate")}
              </Text>
            </View>
            <View style={styles.scrollableHeaderCell}>
              <Text style={styles.scrollableHeaderText}>
                {t("accountInfo.tablePaymentMethod")}
              </Text>
            </View>
            <View style={styles.scrollableHeaderCell}>
              <Text style={styles.scrollableHeaderText}>
                {t("accountInfo.tableAmount")}
              </Text>
            </View>
            <View style={styles.scrollableHeaderCell}>
              <Text style={styles.scrollableHeaderText}>
                {t("accountInfo.tableStatus")}
              </Text>
            </View>
          </View>
          {data.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.scrollableRow,
                index % 2 === 1 ? styles.oddRow : styles.evenRow,
              ]}
            >
              <View style={styles.scrollableCell}>
                <Text style={styles.scrollableCellText}>
                  {item.payment_date}
                </Text>
              </View>
              <View style={styles.scrollableCell}>
                <Text style={styles.scrollableCellText}>
                  {item.payment_method === "Cash"
                    ? t("accountInfo.paymentMethodCash")
                    : t("accountInfo.paymentMethodCheck")}
                </Text>
              </View>
              <View style={styles.scrollableCell}>
                <Text style={styles.scrollableCellText}>
                  ${item.amount.toLocaleString()}
                </Text>
              </View>
              <View style={styles.scrollableCell}>
                <Text style={[styles.scrollableCellText, { color: "#51CF66" }]}>
                  {item.status === "Completed"
                    ? t("accountInfo.statusCompleted")
                    : t("accountInfo.statusPending")}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// Filter Modal Component
const FilterModal = ({ visible, onClose, onApply, initialFilters }) => {
  const { t } = useTranslation();
  const [filterMethod, setFilterMethod] = useState(initialFilters.method);
  const [filterStatus, setFilterStatus] = useState(initialFilters.status);
  const [filterStartDate, setFilterStartDate] = useState(initialFilters.startDate);
  const [filterEndDate, setFilterEndDate] = useState(initialFilters.endDate);
  const animatedValue = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (visible) {
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleApply = () => {
    if (filterStartDate && filterEndDate && filterStartDate > filterEndDate) {
      Alert.alert(t("accountInfo.invalidDateRange"), t("accountInfo.startDateAfterEndDate"));
      return;
    }
    onApply({
      method: filterMethod,
      status: filterStatus,
      startDate: filterStartDate,
      endDate: filterEndDate,
    });
    onClose();
  };

  const handleClear = () => {
    setFilterMethod(null);
    setFilterStatus(null);
    setFilterStartDate(null);
    setFilterEndDate(null);
    onApply({ method: null, status: null, startDate: null, endDate: null });
    onClose();
  };

  const FilterOption = ({ label, value, currentValue, setValue }) => (
    <TouchableOpacity
      style={[
        styles.filterOption,
        currentValue === value && styles.filterOptionSelected,
      ]}
      onPress={() => setValue(value)}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <Text
        style={[
          styles.filterOptionText,
          currentValue === value && styles.filterOptionTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
          accessibilityLabel={t("accountInfo.closeFilterModal")}
        />
        <Animated.View
          style={[
            styles.filterModalContainer,
            {
              transform: [
                {
                  translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [height, 0],
                  }),
                },
                { scale },
              ],
              opacity,
            },
          ]}
        >
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t("accountInfo.filterModalTitle")}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel={t("accountInfo.closeButton")}
            >
              <Feather name="x" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.filterForm}>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>{t("accountInfo.tablePaymentMethod")}</Text>
              <View style={styles.filterOptionsRow}>
                <FilterOption
                  label={t("accountInfo.all")}
                  value={null}
                  currentValue={filterMethod}
                  setValue={setFilterMethod}
                />
                <FilterOption
                  label={t("accountInfo.paymentMethodCash")}
                  value="Cash"
                  currentValue={filterMethod}
                  setValue={setFilterMethod}
                />
                <FilterOption
                  label={t("accountInfo.paymentMethodCheck")}
                  value="Check"
                  currentValue={filterMethod}
                  setValue={setFilterMethod}
                />
              </View>
            </View>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>{t("accountInfo.tableStatus")}</Text>
              <View style={styles.filterOptionsRow}>
                <FilterOption
                  label={t("accountInfo.all")}
                  value={null}
                  currentValue={filterStatus}
                  setValue={setFilterStatus}
                />
                <FilterOption
                  label={t("accountInfo.statusCompleted")}
                  value="Completed"
                  currentValue={filterStatus}
                  setValue={setFilterStatus}
                />
                <FilterOption
                  label={t("accountInfo.statusPending")}
                  value="Pending"
                  currentValue={filterStatus}
                  setValue={setFilterStatus}
                />
              </View>
            </View>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>{t("accountInfo.startDate")}</Text>
              <CustomDatePicker
                value={filterStartDate}
                onDateChange={setFilterStartDate}
                placeholder={t("accountInfo.selectStartDate")}
                accessibilityLabel={t("accountInfo.startDate")}
              />
            </View>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>{t("accountInfo.endDate")}</Text>
              <CustomDatePicker
                value={filterEndDate}
                onDateChange={setFilterEndDate}
                placeholder={t("accountInfo.selectEndDate")}
                accessibilityLabel={t("accountInfo.endDate")}
              />
            </View>
            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
                accessibilityLabel={t("accountInfo.applyFilters")}
              >
                <Text style={styles.applyButtonText}>{t("accountInfo.applyFilters")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClear}
                accessibilityLabel={t("accountInfo.clearFilters")}
              >
                <Text style={styles.clearButtonText}>{t("accountInfo.clearFilters")}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const AccountInfo = ({ item }) => {
  const { t } = useTranslation();
  const [dataLoading, setDataLoading] = useState(true);
  const [chooseMethodModalVisible, setChooseMethodModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [lastCollections, setLastCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [filters, setFilters] = useState({
    method: null,
    status: null,
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    setDataLoading(true);
    setTimeout(() => {
      const collections = [
        {
          id: 1,
          payment_date: "2024-08-15",
          payment_method: "Cash",
          amount: 500,
          status: "Completed",
        },
        {
          id: 2,
          payment_date: "2024-07-20",
          payment_method: "Check",
          amount: 1200,
          status: "Completed",
        },
        {
          id: 3,
          payment_date: "2024-06-25",
          payment_method: "Cash",
          amount: 350,
          status: "Pending",
        },
      ];
      setLastCollections(collections);
      setFilteredCollections(collections);
      setDataLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...lastCollections];
      if (filters.method) {
        filtered = filtered.filter((item) => item.payment_method === filters.method);
      }
      if (filters.status) {
        filtered = filtered.filter((item) => item.status === filters.status);
      }
      if (filters.startDate) {
        filtered = filtered.filter(
          (item) => new Date(item.payment_date) >= new Date(filters.startDate)
        );
      }
      if (filters.endDate) {
        filtered = filtered.filter(
          (item) => new Date(item.payment_date) <= new Date(filters.endDate)
        );
      }
      setFilteredCollections(filtered);
    };
    applyFilters();
  }, [filters, lastCollections]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsHorizontalScrollIndicator={false}
      >
        <StatusBar barStyle="dark-content" backgroundColor={"#E0F2FF"} />
        <GoBack />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("accountInfo.title")}</Text>
          <Text style={styles.headerSubtitle}>
            {t("accountInfo.subtitle")}
          </Text>
        </View>
        <View style={styles.summaryCards}>
          <LinearGradient
            colors={["#10B981", "#047857"]}
            style={[styles.summaryCard, styles.balanceCard]}
          >
            <View style={styles.cardIcon}>
              <Feather name="dollar-sign" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.summaryCardLabel}>
              {t("accountInfo.totalBalance")}
            </Text>
            <Text style={styles.summaryCardValue}>$2,050.00</Text>
          </LinearGradient>
          <View style={[styles.summaryCard, styles.pendingCard]}>
            <View style={styles.cardIcon}>
              <Feather name="clock" size={24} color="#D97706" />
            </View>
            <Text style={[styles.summaryCardLabel, { color: "#6B7280" }]}>
              {t("accountInfo.pendingPayments")}
            </Text>
            <Text style={[styles.summaryCardValue, { color: "#111827" }]}>
              $800.00
            </Text>
          </View>
        </View>
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              {t("accountInfo.collectionsHistory")}
            </Text>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFilterModalVisible(true)}
              accessibilityLabel={t("accountInfo.filter")}
              accessibilityRole="button"
            >
              <Feather name="filter" size={16} color="#3660CC" />
              <Text style={styles.filterButtonText}>
                {t("accountInfo.filter")}
              </Text>
            </TouchableOpacity>
          </View>
          {dataLoading ? (
            <SkeletonPlaceholder />
          ) : filteredCollections.length > 0 ? (
            <StyledAccountTable data={filteredCollections} />
          ) : (
            <View style={styles.emptyState}>
              <Feather name="file-text" size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateText}>
                {t("accountInfo.noData")}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={styles.fixedButton}
          onPress={() => setChooseMethodModalVisible(true)}
          accessibilityLabel={t("accountInfo.addNewPayment")}
          accessibilityRole="button"
        >
          <Feather name="plus" size={24} color="#FFFFFF" />
          <Text style={styles.fixedButtonText}>
            {t("accountInfo.addNewPayment")}
          </Text>
        </TouchableOpacity>
      </View>
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
      />
      <PaymentMethodModel
        show={chooseMethodModalVisible}
        hide={() => setChooseMethodModalVisible(false)}
        submit={() => {}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8F9FA" },
  scrollContainer: { paddingBottom: 120, paddingTop: 15 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#183E9F",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  summaryCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  summaryCard: {
    width: "48%",
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceCard: {
    backgroundColor: "#3660CC",
  },
  pendingCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryCardLabel: {
    fontSize: 12,
    color: "#FFFFFF",
    marginBottom: 5,
    opacity: 0.9,
  },
  summaryCardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 15,
    elevation: 3,
    shadowColor: "#99AAB5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#183E9F",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#F1F5F9",
  },
  filterButtonText: {
    fontSize: 12,
    color: "#3660CC",
    marginLeft: 5,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 10,
    textAlign: "center",
  },
  tableWrapper: { flexDirection: "row", paddingHorizontal: 15 },
  scrollableHeaderRow: { flexDirection: "row" },
  scrollableHeaderCell: {
    width: width * 0.3,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollableHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1A46BE",
    textAlign: "center",
  },
  scrollableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  scrollableCell: {
    width: width * 0.3,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollableCellText: { fontSize: 14, color: "#333", textAlign: "center" },
  tableHeader: { backgroundColor: "#F1F5F9" },
  evenRow: { backgroundColor: "#FFFFFF" },
  oddRow: { backgroundColor: "#FAFAFA" },
  skeletonHeaderCell: {
    height: 50,
    width: width * 0.3,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
    margin: 8,
  },
  skeletonCell: {
    height: 52,
    width: width * 0.3,
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
    margin: 8,
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  fixedButton: {
    flexDirection: "row",
    backgroundColor: "#3660CC",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  fixedButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  // Filter Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  filterModalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    width: "100%",
    maxHeight: height * 0.75,
    minHeight: height * 0.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
  },
  modalHandle: {
    width: 48,
    height: 5,
    backgroundColor: "#D1D5DB",
    borderRadius: 2.5,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  filterForm: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 10,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  filterOptionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  filterOptionSelected: {
    backgroundColor: "#3660CC",
    borderColor: "#3660CC",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#374151",
  },
  filterOptionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  filterButtons: {
    flexDirection: "row",
   
    gap: 10,
    marginTop: 20,
  },
  applyButton: {
    paddingHorizontal: 20,
    width: '50%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#3660CC",
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    width: '45%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AccountInfo;