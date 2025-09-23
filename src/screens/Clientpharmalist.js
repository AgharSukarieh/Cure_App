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
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

// --- Mock Components ---
const GoBack = ({ text }) => (
  <View style={styles.header}>
    <Text style={styles.headerText}>{text}</Text>
  </View>
);
const SuccessfullyModel = ({ show, message }) => (
  <Modal transparent={true} visible={show} animationType="fade">
    <View style={styles.successModalOverlay}>
      <View style={styles.successModalContainer}>
        <AntDesign name="checkcircle" size={40} color="#28A745" />
        <Text style={styles.successModalText}>{message}</Text>
      </View>
    </View>
  </Modal>
);

import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { Dropdown } from "react-native-element-dropdown";
import { useTranslation } from 'react-i18next';

// --- FAKE DATA ---
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

const FAKE_SPECIALTIES = [
  { label: "Cardiology", value: 1 },
  { label: "Dermatology", value: 2 },
  { label: "Pediatrics", value: 3 },
];

let FAKE_DOCTORS = [
  {
    id: 1,
    name: "Dr. Ali Hassan",
    category: "Cardiology",
    location: "Baghdad, Karrada",
  },
  {
    id: 2,
    name: "Dr. Fatima Ahmed",
    category: "Dermatology",
    location: "Baghdad, Mansour",
  },
  {
    id: 3,
    name: "Dr. Omar Khalid",
    category: "Pediatrics",
    location: "Basra, Al-Ashar",
  },
];

const { width, height } = Dimensions.get("window");

// --- Add New Doctor Modal Component (Simplified) ---
const AddNewDoctorModel = ({ show, hide, submit }) => {
  const { t } = useTranslation();
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    speciality_id: null,
    city_id: null,
    area_id: null,
  });
  const [availableAreas, setAvailableAreas] = useState([]);
  const [errors, setErrors] = useState({});

  const handleInputChange = (key, value) => {
    setNewDoctor((prev) => ({ ...prev, [key]: value }));
    if (key === "city_id") {
      setAvailableAreas(FAKE_AREAS.filter((area) => area.city_id === value));
      setNewDoctor((prev) => ({ ...prev, area_id: null }));
    }
  };

  const validate = () => {
    let valid = true;
    let newErrors = {};
    if (!newDoctor.name) {
      newErrors.name = t('clientPharmacyList.addNewPharmacyModal.nameRequired');
      valid = false;
    }
    if (!newDoctor.speciality_id) {
      newErrors.speciality_id = t('clientPharmacyList.addNewPharmacyModal.categoryRequired');
      valid = false;
    }
    if (!newDoctor.city_id) {
      newErrors.city_id = t('clientPharmacyList.addNewPharmacyModal.cityRequired');
      valid = false;
    }
    if (!newDoctor.area_id) {
      newErrors.area_id = t('clientPharmacyList.addNewPharmacyModal.areaRequired');
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (validate()) {
      const newId = Math.max(...FAKE_DOCTORS.map((d) => d.id)) + 1;
      const city = FAKE_CITIES.find((c) => c.value === newDoctor.city_id);
      const area = FAKE_AREAS.find((a) => a.value === newDoctor.area_id);
      const specialty = FAKE_SPECIALTIES.find(
        (s) => s.value === newDoctor.speciality_id
      );

      const doctorToAdd = {
        id: newId,
        name: newDoctor.name,
        category: specialty?.label,
        location: `${city?.label}, ${area?.label}`,
      };
      FAKE_DOCTORS.push(doctorToAdd);
      submit(true);
      resetForm();
    }
  };

  const resetForm = () => {
    setNewDoctor({
      name: "",
      speciality_id: null,
      city_id: null,
      area_id: null,
    });
    setAvailableAreas([]);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    hide();
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={show}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('clientPharmacyList.addNewPharmacyModal.title')}</Text>
              <TouchableOpacity onPress={handleClose}>
                <AntDesign name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('clientPharmacyList.addNewPharmacyModal.pharmacyName')}</Text>
                <TextInput
                  style={[styles.modalInput, errors.name && styles.errorInput]}
                  placeholder={t('clientPharmacyList.addNewPharmacyModal.pharmacyNamePlaceholder')}
                  value={newDoctor.name}
                  onChangeText={(text) => handleInputChange("name", text)}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('clientPharmacyList.addNewPharmacyModal.category')}</Text>
                <Dropdown
                  style={[
                    styles.dropdown,
                    errors.speciality_id && styles.errorInput,
                  ]}
                  data={FAKE_SPECIALTIES}
                  labelField="label"
                  valueField="value"
                  placeholder={t('clientPharmacyList.addNewPharmacyModal.chooseCategory')}
                  value={newDoctor.speciality_id}
                  onChange={(item) =>
                    handleInputChange("speciality_id", item.value)
                  }
                  {...dropdownStyles}
                />
                {errors.speciality_id && (
                  <Text style={styles.errorText}>{errors.speciality_id}</Text>
                )}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('clientPharmacyList.addNewPharmacyModal.location')}</Text>
                <Dropdown
                  style={[styles.dropdown, errors.city_id && styles.errorInput]}
                  data={FAKE_CITIES}
                  labelField="label"
                  valueField="value"
                  placeholder={t('clientPharmacyList.addNewPharmacyModal.chooseCity')}
                  value={newDoctor.city_id}
                  onChange={(item) => handleInputChange("city_id", item.value)}
                  {...dropdownStyles}
                />
                {errors.city_id && (
                  <Text style={styles.errorText}>{errors.city_id}</Text>
                )}
                <View style={{ height: 10 }} />
                <Dropdown
                  style={[styles.dropdown, errors.area_id && styles.errorInput]}
                  data={availableAreas}
                  labelField="label"
                  valueField="value"
                  placeholder={
                    !newDoctor.city_id
                      ? t('clientPharmacyList.selectCityFirst')
                      : t('clientPharmacyList.addNewPharmacyModal.chooseArea')
                  }
                  value={newDoctor.area_id}
                  onChange={(item) => handleInputChange("area_id", item.value)}
                  disable={!newDoctor.city_id}
                  {...dropdownStyles}
                />
                {errors.area_id && (
                  <Text style={styles.errorText}>{errors.area_id}</Text>
                )}
              </View>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.modalButtonText}>{t('clientPharmacyList.addNewPharmacyModal.submit')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleClose}
              >
                <Text style={[styles.modalButtonText, { color: "#333" }]}>
                  {t('clientPharmacyList.addNewPharmacyModal.cancel')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// --- Main Component ---
const Clientpharmalist = ({ header = true }) => {
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState(FAKE_DOCTORS);
  const [isLoading, setIsLoading] = useState(true);
  const [addDoctorModalVisible, setAddDoctorModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: "",
    city_id: null,
    area_id: null,
  });
  const [areasData, setAreasData] = useState([]);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setDoctors([...FAKE_DOCTORS]);
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const city = FAKE_CITIES.find((c) => c.value === filters.city_id);
      const area = FAKE_AREAS.find((a) => a.value === filters.area_id);
      const nameMatch = doctor.name
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());
      const locationMatch = doctor.location
        .toLowerCase()
        .includes(
          `${city?.label || ""}${
            area?.label ? `, ${area.label}` : ""
          }`.toLowerCase()
        );
      return nameMatch && locationMatch;
    });
  }, [doctors, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      if (key === "city_id") {
        newFilters.area_id = null;
        setAreasData(FAKE_AREAS.filter((area) => area.city_id === value));
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({ searchTerm: "", city_id: null, area_id: null });
    setAreasData([]);
  };

  const onDoctorAdded = (success) => {
    setAddDoctorModalVisible(false);
    if (success) {
      setSuccessModalVisible(true);
      fetchData();
      setTimeout(() => setSuccessModalVisible(false), 2000);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {header && <GoBack text={t('clientPharmacyList.headerTitle')} />}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.filtersContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={t('clientPharmacyList.searchPlaceholder')}
              value={filters.searchTerm}
              onChangeText={(text) => handleFilterChange("searchTerm", text)}
            />
            <TouchableOpacity onPress={clearFilters}>
              <Feather name="x" color="#888" size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.filterRow}>
            <View style={styles.filterBox}>
              <Text style={styles.filterLabel}>{t('clientPharmacyList.filterByCity')}</Text>
              <Dropdown
                style={styles.dropdown}
                data={FAKE_CITIES}
                labelField="label"
                valueField="value"
                placeholder={t('clientPharmacyList.allCities')}
                value={filters.city_id}
                onChange={(item) => handleFilterChange("city_id", item.value)}
                {...dropdownStyles}
              />
            </View>
            <View style={styles.filterBox}>
              <Text style={styles.filterLabel}>{t('clientPharmacyList.filterByArea')}</Text>
              <Dropdown
                style={styles.dropdown}
                data={areasData}
                labelField="label"
                valueField="value"
                placeholder={
                  !filters.city_id ? t('clientPharmacyList.selectCityFirst') : t('clientPharmacyList.allAreas')
                }
                value={filters.area_id}
                onChange={(item) => handleFilterChange("area_id", item.value)}
                disable={!filters.city_id}
                {...dropdownStyles}
              />
            </View>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableWrapper}>
            <View style={styles.fixedColumn}>
              <View style={[styles.fixedHeaderCell, styles.tableHeader]}>
                <Text style={styles.fixedHeaderText}>{t('clientPharmacyList.pharmacyName')}</Text>
              </View>
              {isLoading ? (
                <Text style={styles.emptyText}>{t('clientPharmacyList.loading')}</Text>
              ) : (
                filteredDoctors.map((item, index) => (
                  <View
                    key={item.id}
                    style={[styles.fixedCell, index % 2 === 1 && styles.oddRow]}
                  >
                    <Text style={styles.fixedCellText}>{item.name}</Text>
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
                    <Text style={styles.scrollableHeaderText}>{t('clientPharmacyList.location')}</Text>
                  </View>
                  <View style={styles.scrollableHeaderCell}>
                    <Text style={styles.scrollableHeaderText}>{t('clientPharmacyList.category')}</Text>
                  </View>
                </View>
                {!isLoading &&
                  filteredDoctors.map((item, index) => (
                    <View
                      key={item.id}
                      style={[
                        styles.scrollableRow,
                        index % 2 === 1 && styles.oddRow,
                      ]}
                    >
                      <View style={styles.scrollableCell}>
                        <Text style={styles.scrollableCellText}>
                          {item.location}
                        </Text>
                      </View>
                      <View style={styles.scrollableCell}>
                        <Text style={styles.scrollableCellText}>
                          {item.category}
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
            </ScrollView>
          </View>
          {!isLoading && filteredDoctors.length === 0 && (
            <Text style={styles.emptyText}>
              {t('clientPharmacyList.noData')}
            </Text>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddDoctorModalVisible(true)}
      >
        <AntDesign name="plus" size={24} color="#FFF" />
      </TouchableOpacity>
      <AddNewDoctorModel
        show={addDoctorModalVisible}
        hide={() => setAddDoctorModalVisible(false)}
        submit={onDoctorAdded}
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
  filterRow: { flexDirection: "row", justifyContent: "space-between" },
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
  tableContainer: { flex: 1, marginHorizontal: 15 },
  tableWrapper: { flexDirection: "row" },
  fixedColumn: { width: width * 0.4 }, // Increased width for name
  fixedHeaderCell: {
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
  scrollableContent: { flex: 1 },
  scrollableHeaderRow: { flexDirection: "row" },
  scrollableHeaderCell: {
    width: width * 0.4,
    paddingVertical: 16,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  }, // Adjusted width
  scrollableHeaderText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1A46BE",
    textAlign: "center",
  },
  tableHeader: { backgroundColor: "#F1F3F5" },
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
    borderRightWidth: I18nManager.isRTL ? 0 : 1,
    borderLeftWidth: I18nManager.isRTL ? 1 : 0,
    borderColor: "#E0E0E0",
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
  emptyText: { fontSize: 16, color: "#888", padding: 20, textAlign: "center" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
    marginBottom: 15,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#183E9F" },
  modalBody: { marginBottom: 20 },
  inputGroup: { marginBottom: 15 },
  inputLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    fontWeight: "600",
  },
  modalInput: {
    height: 45,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F8F9FA",
    fontSize: 16,
  },
  errorInput: { borderColor: "#DC3545" },
  errorText: { color: "#DC3545", fontSize: 12, marginTop: 4 },
  modalFooter: { marginTop: 10 },
  modalButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  submitButton: { backgroundColor: "#007BFF" },
  cancelButton: { backgroundColor: "#E9ECEF" },
  modalButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
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
});

export default Clientpharmalist;
