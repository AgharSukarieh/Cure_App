import React from "react";
import { View, TextInput, StyleSheet, I18nManager, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useTranslation } from "react-i18next";

const SearchBar = ({ searchTerm, onSearchChange, onAddPress }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;

  return (
    <View style={[styles.searchContainer, isRTL && styles.rtlSearchContainer]}>
      <TextInput
        style={[styles.searchInput, isRTL && styles.rtlText]}
        placeholder={t("clientDoctorList.searchPlaceholder")}
        placeholderTextColor="#888"
        value={searchTerm}
        onChangeText={onSearchChange}
      />
      <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
      
      {onAddPress && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddPress}
          activeOpacity={0.7}
        >
          <Feather name="plus" size={24} color="#FFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 15,
    height: 50,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  rtlSearchContainer: {
    flexDirection: "row-reverse",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 10,
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  searchIcon: {
    marginLeft: 10,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#183E9F",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    elevation: 3,
    shadowColor: "#183E9F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default SearchBar;

