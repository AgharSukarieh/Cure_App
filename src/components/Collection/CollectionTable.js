import React from 'react';
import { View, Text, ScrollView, I18nManager } from 'react-native';
import { useTranslation } from 'react-i18next';

const CollectionTable = ({ 
  filteredCollections, 
  isLoading, 
  FIXED_COLUMN_WIDTH, 
  SCROLLABLE_COLUMN_WIDTH, 
  ROW_HEIGHT,
  getStatusColor,
  onRowPress
}) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;

  const styles = {
    tableContainer: {
      marginHorizontal: 15,
    },
    table: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: "#E0E0E0",
      borderRadius: 8,
      overflow: "hidden",
    },
    fixedColumn: {
      width: FIXED_COLUMN_WIDTH,
      backgroundColor: "#FFFFFF",
      borderRightWidth: 1,
      borderRightColor: "#E0E0E0",
    },
    scrollablePart: {
      flex: 1,
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
      color: "#183E9F",
      textAlign: "left",
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
      color: "#333",
      textAlign: "left",
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
      textAlign: "center",
    },
    evenRow: {
      backgroundColor: "#FFFFFF",
    },
    oddRow: {
      backgroundColor: "#FAFAFA",
    },
    emptyContainer: {
      height: 200,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      borderWidth: 1,
      borderColor: "#E0E0E0",
      borderRadius: 8,
    },
    emptyText: {
      fontSize: 16,
      color: "#888",
      textAlign: "center",
    },
  };

  if (isLoading && filteredCollections.length === 0) {
    return (
      <View style={styles.tableContainer}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, isRTL && { textAlign: 'right' }]}>
            {t("collection.loading")}
          </Text>
        </View>
      </View>
    );
  }

  if (filteredCollections.length === 0) {
    return (
      <View style={styles.tableContainer}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, isRTL && { textAlign: 'right' }]}>
            {t("collection.noData")}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tableContainer}>
      <View style={styles.table}>
        <View style={styles.fixedColumn}>
          <View style={styles.fixedHeaderCell}>
            <Text style={[styles.fixedHeaderText, isRTL && { textAlign: 'right' }]}>
              {t("collection.pharmacyName")}
            </Text>
          </View>
          {filteredCollections.map((item, index) => (
            <View
              key={`collection-fixed-${item.sale_id}-${index}`}
              style={[
                styles.fixedCell,
                index % 2 === 1 ? styles.oddRow : styles.evenRow,
              ]}
            >
              <Text style={styles.fixedCellText}>{item.pharmacy_name}</Text>
              <Text style={styles.fixedCellText}>
                {item.sale_name}
              </Text>
            </View>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.scrollablePart}>
            <View style={styles.scrollableHeaderRow}>
              <View style={styles.scrollableHeaderCell}>
                <Text style={[styles.scrollableHeaderText, isRTL && { textAlign: 'right' }]}>
                  {t("collection.city")}
                </Text>
              </View>
              <View style={styles.scrollableHeaderCell}>
                <Text style={[styles.scrollableHeaderText, isRTL && { textAlign: 'right' }]}>
                  {t("collection.area")}
                </Text>
              </View>
              <View style={styles.scrollableHeaderCell}>
                <Text style={[styles.scrollableHeaderText, isRTL && { textAlign: 'right' }]}>
                  {t("collection.amount")}
                </Text>
              </View>
              <View style={styles.scrollableHeaderCell}>
                <Text style={[styles.scrollableHeaderText, isRTL && { textAlign: 'right' }]}>
                  {t("collection.method")}
                </Text>
              </View>
              <View style={styles.scrollableHeaderCell}>
                <Text style={[styles.scrollableHeaderText, isRTL && { textAlign: 'right' }]}>
                  {t("collection.receivedAt")}
                </Text>
              </View>
              <View style={styles.scrollableHeaderCell}>
                <Text style={[styles.scrollableHeaderText, isRTL && { textAlign: 'right' }]}>
                  {t("collection.creditAmount")}
                </Text>
              </View>
              <View style={styles.scrollableHeaderCell}>
                <Text style={[styles.scrollableHeaderText, isRTL && { textAlign: 'right' }]}>
                  {t("collection.status")}
                </Text>
              </View>
            </View>
            {filteredCollections.map((item, index) => (
              <View
                key={`collection-${item.sale_id}-${index}`}
                style={[
                  styles.scrollableDataRow,
                  index % 2 === 1 ? styles.oddRow : styles.evenRow,
                ]}
              >
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
                  <Text style={styles.scrollableCellText}>
                    {item.method}
                  </Text>
                </View>
                <View style={styles.scrollableCell}>
                  <Text style={styles.scrollableCellText}>
                    {new Date(item.received_at).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.scrollableCell}>
                  <Text style={styles.scrollableCellText}>
                    {item.credit_amount.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.scrollableCell}>
                  <Text
                    style={[
                      styles.scrollableCellText,
                      {
                        color: getStatusColor(item.method),
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {item.settlement ? t("collection.settled") : t("collection.pending")}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default CollectionTable;
