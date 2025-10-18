import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, I18nManager } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import DatePicker from "react-native-date-picker";
import { useTranslation } from "react-i18next";

const FiltersSection = ({
  citiesFormatted,
  cityValue,
  handleCityChange,
  areas,
  areaValue,
  handleAreaChange,
  calenderFrom,
  openFrom,
  setOpenFrom,
  dateFrom,
  handleDateFromConfirm,
  calenderTo,
  openTo,
  setOpenTo,
  dateTo,
  handleDateToConfirm,
  handleResetFilters,
}) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;

  return (
    <View style={styles.filtersSection}>
      <View style={styles.filtersHeader}>
        <Text style={styles.filtersTitle}>{t("sales.filters") || "Filters"}</Text>
        <TouchableOpacity onPress={handleResetFilters} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>{t("sales.resetAll") || "Reset All"}</Text>
        </TouchableOpacity>
      </View>

      <View style={{
        flexDirection: isRTL ? "row" : "row-reverse",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 10,
      }}>
        <View style={styles.dropdownContainer}>
          <Dropdown
            data={citiesFormatted}
            labelField="label"
            valueField="value"
            placeholder={t("sales.selectCity") || "Select City"}
            value={cityValue}
            onChange={handleCityChange}
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.itemTextStyle}
          />
        </View>

        <View style={styles.dropdownContainer}>
          <Dropdown
            data={areas}
            labelField="label"
            valueField="value"
            placeholder={
              !cityValue
                ? t("clientDoctorList.selectCityFirst") || "Select city first"
                : t("sales.selectArea") || "Select Area"
            }
            value={areaValue}
            disable={!cityValue}
            onChange={handleAreaChange}
            style={[styles.dropdown, !cityValue && styles.disabledDropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={styles.itemTextStyle}
          />
        </View>
      </View>

      <View style={{
        flexDirection: isRTL ? "row" : "row-reverse",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 15,
      }}>
        <View style={styles.dateContainer}>
          <Text style={[styles.dateLabel, isRTL && styles.rtlText]}>
            {t("sales.from") || "From"}
          </Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setOpenFrom(true)}
          >
            <Text style={[styles.dateButtonText, isRTL && styles.rtlText]}>
              {calenderFrom || "YYYY-MM-DD"}
            </Text>
          </TouchableOpacity>
          <DatePicker
            modal
            mode="date"
            open={openFrom}
            date={dateFrom}
            onConfirm={handleDateFromConfirm}
            onCancel={() => setOpenFrom(false)}
          />
        </View>

        <View style={styles.dateContainer}>
          <Text style={[styles.dateLabel, isRTL && styles.rtlText]}>
            {t("sales.to") || "To"}
          </Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setOpenTo(true)}
          >
            <Text style={[styles.dateButtonText, isRTL && styles.rtlText]}>
              {calenderTo || "YYYY-MM-DD"}
            </Text>
          </TouchableOpacity>
          <DatePicker
            modal
            mode="date"
            open={openTo}
            date={dateTo}
            onConfirm={handleDateToConfirm}
            onCancel={() => setOpenTo(false)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filtersSection: {
    backgroundColor: "#FFFFFF",
    margin: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    
  },
  filtersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#183E9F",
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#6C757D",
    borderRadius: 5,
  },
  resetButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  dropdownContainer: { 
    width: "48%" 
  },
  dropdown: {
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F8F9FA",
  },
  disabledDropdown: {
    backgroundColor: "#F5F5F5",
    opacity: 0.6,
  },
  placeholderStyle: { 
    fontSize: 16, 
    color: "#808080" 
  },
  selectedTextStyle: { 
    fontSize: 16, 
    color: "#000000" 
  },
  itemTextStyle: { 
    color: "#333", 
    fontSize: 14, 
    textAlign: "left" 
  },
  dateContainer: { 
    width: "48%" 
  },
  dateLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    fontWeight: "600",
  },
  dateButton: {
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
  },
  dateButtonText: { 
    fontSize: 16, 
    color: "#808080" 
  },
  rtlText: {
    textAlign: I18nManager.isRTL ? "left" : "right",
    writingDirection: "rtl",
  },
  table: {
    marginTop: 10,
  },
  placeholderRow: {
    flexDirection: "row",
    height: 55,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#FFF",
  },
  placeholderFixedCell: {
    width: 140,
    backgroundColor: "#EAEAEA",
    borderRightWidth: 1,
    borderRightColor: "#F0F0F0",
  },
  placeholderScrollableCell: {
    width: 120,
    backgroundColor: "#F5F5F5",
    marginLeft: 10,
  },
});

export default FiltersSection;

