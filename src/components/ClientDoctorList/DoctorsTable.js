import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  I18nManager,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");
const FIXED_COLUMN_WIDTH = width * 0.35;
const SCROLLABLE_COLUMN_WIDTH = width * 0.3;
const ROW_HEIGHT = 60;

const DoctorsTable = ({
  doctors,
  isLoading,
  isLoadingMore,
  onDoctorPress,
  resolveCityName,
  resolveAreaName,
  getClassificationColor,
  getStatusColor,
}) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;

  if (isLoading && doctors.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="#183E9F" />
        <Text style={[styles.emptyText, isRTL && styles.rtlText]}>
          {t("clientDoctorList.loading")}
        </Text>
      </View>
    );
  }

  if (doctors.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, isRTL && styles.rtlText]}>
          {t("clientDoctorList.noDoctorsFound")}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.tableContainer}>
      <View style={styles.table}>
        <View style={styles.fixedColumn}>
          <View style={styles.fixedHeaderCell}>
            <Text style={[styles.fixedHeaderText, isRTL && styles.rtlText]}>
              {t("clientDoctorList.doctorName")}
            </Text>
          </View>
          {doctors.map((item, index) => (
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
                <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                  {t("clientDoctorList.specialty")}
                </Text>
              </View>
              <View style={styles.scrollableHeaderCell}>
                <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                  {t("clientDoctorList.city")}
                </Text>
              </View>
              <View style={styles.scrollableHeaderCell}>
                <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                  {t("clientDoctorList.area")}
                </Text>
              </View>
              <View style={styles.scrollableHeaderCell}>
                <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                  {t("clientDoctorList.phone")}
                </Text>
              </View>
              <View style={styles.scrollableHeaderCell}>
                <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                  {t("clientDoctorList.address")}
                </Text>
              </View>
              <View style={styles.scrollableHeaderCell}>
                <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                  {t("clientDoctorList.classification")}
                </Text>
              </View>
              <View style={styles.scrollableHeaderCell}>
                <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                  {t("clientDoctorList.status")}
                </Text>
              </View>
              <View style={styles.scrollableHeaderCell}>
                <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                  {t("clientDoctorList.details")}
                </Text>
              </View>
            </View>
            {doctors.map((item, index) => (
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
                  <Text style={styles.scrollableCellText}>{item.phone}</Text>
                </View>
                <View style={styles.scrollableCell}>
                  <Text
                    style={styles.scrollableCellText}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {item.address}
                  </Text>
                </View>
                <View style={styles.scrollableCell}>
                  <View
                    style={[
                      styles.classificationBadge,
                      { backgroundColor: getClassificationColor(item.classification) },
                    ]}
                  >
                    <Text style={styles.classificationText}>
                      {item.classification}
                    </Text>
                  </View>
                </View>
                <View style={styles.scrollableCell}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {item.status === "1" || item.status === 1
                        ? t("clientDoctorList.active")
                        : t("clientDoctorList.inactive")}
                    </Text>
                  </View>
                </View>
                <View style={styles.scrollableCell}>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => onDoctorPress(item)}
                  >
                    <Feather name="eye" size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {isLoadingMore && (
        <View style={styles.loadingMoreContainer}>
          <ActivityIndicator size="small" color="#183E9F" />
          <Text style={[styles.loadingMoreText, isRTL && styles.rtlText]}>
            {t("clientDoctorList.loadingMore")}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    backgroundColor: "#FFF",
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: "hidden",
  },
  table: {
    flexDirection: "row",
  },
  fixedColumn: {
    width: FIXED_COLUMN_WIDTH,
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
  },
  fixedHeaderCell: {
    height: ROW_HEIGHT,
    backgroundColor: "#F1F3F5",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#E0E0E0",
  },
  fixedHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#183E9F",
    textAlign: "center",
  },
  fixedCell: {
    height: ROW_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  fixedCellText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  scrollablePart: {
    flexDirection: "column",
  },
  scrollableHeaderRow: {
    flexDirection: "row",
    height: ROW_HEIGHT,
    backgroundColor: "#F1F3F5",
    borderBottomWidth: 2,
    borderBottomColor: "#E0E0E0",
  },
  scrollableHeaderCell: {
    width: SCROLLABLE_COLUMN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  scrollableHeaderText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#183E9F",
    textAlign: "center",
  },
  scrollableDataRow: {
    flexDirection: "row",
    height: ROW_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  scrollableCell: {
    width: SCROLLABLE_COLUMN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  scrollableCellText: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
  },
  evenRow: {
    backgroundColor: "#F8F9FA",
  },
  oddRow: {
    backgroundColor: "#FFFFFF",
  },
  classificationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  classificationText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFF",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFF",
  },
  detailsButton: {
    backgroundColor: "#183E9F",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    marginTop: 10,
  },
  loadingMoreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
  },
  loadingMoreText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
});

export default DoctorsTable;

