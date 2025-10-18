import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
  Dimensions,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");
const FIXED_COLUMN_WIDTH = width * 0.35;
const SCROLLABLE_COLUMN_WIDTH = width * 0.3;
const ROW_HEIGHT = 55;

const SalesTableComponent = ({ data, onItemPress, getStatusStyle, getStatusText }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;

  return (
    <View style={styles.table}>
      <View style={styles.fixedColumn}>
        <View style={styles.fixedHeaderCell}>
          <Text style={[styles.fixedHeaderText, isRTL && styles.rtlText]}>
            {t("sales.client") || "العميل"}
          </Text>
        </View>
        {data.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.fixedCell,
              index % 2 === 1 ? styles.oddRow : styles.evenRow,
            ]}
          >
            <Text
              style={[styles.fixedCellText, isRTL && styles.rtlText]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.client_name || "N/A"}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View>
          <View style={styles.scrollableHeaderRow}>
            <View style={styles.scrollableHeaderCell}>
              <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                {t("sales.totalPrice") || "السعر الإجمالي"}
              </Text>
            </View>
            <View style={styles.scrollableHeaderCell}>
              <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                {t("sales.status") || "الحالة"}
              </Text>
            </View>
            <View style={[styles.scrollableHeaderCell, { width: SCROLLABLE_COLUMN_WIDTH * 0.8 }]}>
              <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                {t("sales.details") || "التفاصيل"}
              </Text>
            </View>
          </View>

          {data.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.scrollableDataRow,
                index % 2 === 1 ? styles.oddRow : styles.evenRow,
              ]}
            >
              <View style={styles.scrollableCell}>
                <Text style={styles.scrollableCellText}>
                  ${parseFloat(item.total_price || "0").toFixed(2)}
                </Text>
              </View>
              <View style={styles.scrollableCell}>
                <Text
                  style={[
                    styles.scrollableCellText,
                    getStatusStyle(item.status),
                    isRTL && styles.rtlText,
                  ]}
                >
                  {getStatusText(item.status)}
                </Text>
              </View>
              <View style={[styles.scrollableCell, { width: SCROLLABLE_COLUMN_WIDTH * 0.8 }]}>
                <TouchableOpacity
                  onPress={() => onItemPress(item)}
                  style={styles.detailsButton}
                >
                  <MaterialIcons name="info-outline" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  fixedColumn: {
    width: FIXED_COLUMN_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
  },
  fixedHeaderCell: {
    height: ROW_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: "#F1F3F5",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    
  },
  fixedHeaderText: { 
    fontSize: 14, 
    fontWeight: "bold", 
    color: "#183E9F" ,
    textAlign: "center",
  },
  fixedCell: {
    height: ROW_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    
  },
  fixedCellText: { 
    fontSize: 14, 
    color: "#333" 
  },
  scrollableHeaderRow: {
    flexDirection: "row",
    height: ROW_HEIGHT,
    backgroundColor: "#F1F3F5",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  scrollableDataRow: {
    flexDirection: "row",
    height: ROW_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  scrollableHeaderCell: {
    width: SCROLLABLE_COLUMN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  scrollableHeaderText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1A46BE",
    textAlign: "center",
  },
  scrollableCell: {
    width: SCROLLABLE_COLUMN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  scrollableCellText: { 
    fontSize: 14, 
    color: "#333", 
    textAlign: "center" 
  },
  evenRow: { 
    backgroundColor: "#FFFFFF" 
  },
  oddRow: { 
    backgroundColor: "#FAFAFA" 
  },
  detailsButton: {
    padding: 8,
    backgroundColor: '#183E9F',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rtlText: {
    textAlign: "center",
    writingDirection: "rtl",
  },
});

export default SalesTableComponent;

