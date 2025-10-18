import React from 'react';
import { View, Text, TouchableOpacity, I18nManager } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';

const FiltersSection = ({
  filters,
  cities,
  areas,
  onFilterChange,
  onDateFromPress,
  onDateToPress,
  onClearFilters,
  isRTL
}) => {
  const { t } = useTranslation();

  const dropdownStyles = {
    containerStyle: {
      backgroundColor: '#FFF',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 8,
      marginTop: 5,
    },
    itemTextStyle: {
      fontSize: 14,
      color: '#333',
      textAlign: isRTL ? 'right' : 'left',
    },
    selectedTextStyle: {
      fontSize: 14,
      color: '#183E9F',
      fontWeight: '500',
      textAlign: isRTL ? 'right' : 'left',
    },
    placeholderStyle: {
      fontSize: 14,
      color: '#999',
      textAlign: isRTL ? 'right' : 'left',
    },
  };

  const styles = {
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
    filterRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 15,
    },
    filterBox: {
      flex: 1,
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
    dateButtonText: { 
      fontSize: 14, 
      color: "#333" 
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
  };

  return (
    <View style={styles.filtersContainer}>
      <View style={styles.filterRow}>
        <View style={styles.filterBox}>
          <Text style={[styles.filterLabel, isRTL && { textAlign: 'right' }]}>
            {t("collection.selectCity")}
          </Text>
          <Dropdown
            style={styles.dropdown}
            data={cities}
            labelField="label"
            valueField="value"
            placeholder={t("collection.selectCity")}
            value={filters.city_id}
            onChange={(item) => onFilterChange("city_id", item.value)}
            itemTextStyle={dropdownStyles.itemTextStyle}
            selectedTextStyle={dropdownStyles.selectedTextStyle}
            placeholderStyle={dropdownStyles.placeholderStyle}
            containerStyle={dropdownStyles.containerStyle}
          />
        </View>
        <View style={styles.filterBox}>
          <Text style={[styles.filterLabel, isRTL && { textAlign: 'right' }]}>
            {t("collection.selectArea")}
          </Text>
          <Dropdown
            style={styles.dropdown}
            data={areas}
            labelField="label"
            valueField="value"
            placeholder={
              !filters.city_id ? t("collection.selectCity") : t("collection.selectArea")
            }
            value={filters.area_id}
            onChange={(item) => onFilterChange("area_id", item.value)}
            disable={!filters.city_id}
            itemTextStyle={dropdownStyles.itemTextStyle}
            selectedTextStyle={dropdownStyles.selectedTextStyle}
            placeholderStyle={dropdownStyles.placeholderStyle}
            containerStyle={dropdownStyles.containerStyle}
          />
        </View>
      </View>
      <View style={styles.filterRow}>
        <View style={styles.filterBox}>
          <Text style={[styles.filterLabel, isRTL && { textAlign: 'right' }]}>
            {t("collection.from")}
          </Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={onDateFromPress}
          >
            <Text style={[styles.dateButtonText, isRTL && { textAlign: 'right' }]}>
              {filters.dateFrom ? filters.dateFrom : "YYYY-MM-DD"}
            </Text>
            <Feather name="calendar" size={18} color="#555" />
          </TouchableOpacity>
        </View>
        <View style={styles.filterBox}>
          <Text style={[styles.filterLabel, isRTL && { textAlign: 'right' }]}>
            {t("collection.to")}
          </Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={onDateToPress}
          >
            <Text style={[styles.dateButtonText, isRTL && { textAlign: 'right' }]}>
              {filters.dateTo ? filters.dateTo : "YYYY-MM-DD"}
            </Text>
            <Feather name="calendar" size={18} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.resetFiltersContainer}>
        <TouchableOpacity 
          style={styles.resetFiltersButton}
          onPress={onClearFilters}
        >
          <AntDesign name="reload1" size={16} color="#183E9F" />
          <Text style={[styles.resetFiltersText, isRTL && { textAlign: 'right' }]}>
            {t("collection.clearFilters")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FiltersSection;
