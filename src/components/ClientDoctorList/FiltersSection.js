import React from "react";
import { View, Text, StyleSheet, I18nManager, TouchableOpacity } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useTranslation } from "react-i18next";

const FiltersSection = ({
  cities,
  cityValue,
  onCityChange,
  areas,
  areaValue,
  onAreaChange,
  specialties,
  specialtyValue,
  onSpecialtyChange,
  onResetFilters,
  renderSpecialtyItem,
}) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;

  const dropdownStyles = {
    itemTextStyle: { fontSize: 14, color: "#333" },
    selectedTextStyle: { fontSize: 14, color: "#333" },
    placeholderStyle: { fontSize: 14, color: "#999" },
    containerStyle: { backgroundColor: '#ffffff', borderRadius: 8 },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("clientDoctorList.filters") || "Filters"}</Text>
        <TouchableOpacity onPress={onResetFilters} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>
            {t("clientDoctorList.resetFilters") || "Reset All"}
          </Text>
        </TouchableOpacity>
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
            value={cityValue}
            onChange={onCityChange}
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
              !cityValue
                ? t("clientDoctorList.selectCityFirst")
                : t("clientDoctorList.allAreas")
            }
            value={areaValue}
            onChange={onAreaChange}
            disable={!cityValue}
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
          value={specialtyValue}
          onChange={onSpecialtyChange}
          renderItem={renderSpecialtyItem}
          itemTextStyle={dropdownStyles.itemTextStyle}
          selectedTextStyle={dropdownStyles.selectedTextStyle}
          placeholderStyle={dropdownStyles.placeholderStyle}
          containerStyle={dropdownStyles.containerStyle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#183E9F",
  },
  resetButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
  },
  resetButtonText: {
    color: "#183E9F",
    fontWeight: "600",
    fontSize: 14,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    gap: 10,
  },
  filterBox: {
    flex: 1,
  },
  filterBoxFullWidth: {
    width: "100%",
  },
  filterLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    fontWeight: "600",
  },
  dropdown: {
    height: 48,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F8F9FA",
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
});

export default FiltersSection;

