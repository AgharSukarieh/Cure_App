import React, { useState, useCallback, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, I18nManager } from "react-native";
import { useTranslation } from "react-i18next";
import SalesTableComponent from "./SalesTableComponent";
import OrderDetailsModal from "./OrderDetailsModal";
import useSalesData from "../../hooks/Sales/useSalesData";
import { getStatusStyle, getStatusText, formatDate } from "../../utils/salesHelpers";

const TablePlaceholder = () => {
  const PlaceholderRow = () => (
    <View style={styles.placeholderRow}>
      <View style={styles.placeholderFixedCell} />
      <View style={styles.placeholderScrollableCell} />
      <View style={styles.placeholderScrollableCell} />
      <View style={styles.placeholderScrollableCell} />
    </View>
  );

  return (
    <View style={styles.table}>
      <PlaceholderRow />
      <PlaceholderRow />
      <PlaceholderRow />
      <PlaceholderRow />
      <PlaceholderRow />
    </View>
  );
};

const SalesTable = React.memo(({ saleId, cityId, areaId, dateFrom, dateTo, onLoadMoreReady }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const {
    data,
    isLoading,
    error,
    hasMoreData,
    isLoadingMore,
    loadMoreData,
  } = useSalesData(saleId, cityId, areaId, dateFrom, dateTo, t);

  useEffect(() => {
    if (onLoadMoreReady) {
      onLoadMoreReady({
        loadMore: loadMoreData,
        hasMore: hasMoreData,
        isLoading: isLoadingMore,
        dataLength: data.length
      });
    }
  }, [onLoadMoreReady, loadMoreData, hasMoreData, isLoadingMore, data.length]);

  const handleItemPress = useCallback((item) => {
    setSelectedItem(item);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const getStatusStyleWrapper = useCallback((status) => getStatusStyle(status), []);
  const getStatusTextWrapper = useCallback((status) => getStatusText(status, t), [t]);

  if (isLoading) {
    return <TablePlaceholder />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, isRTL && styles.rtlText]}>
          {error}
        </Text>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryButtonText}>{t("sales.retry") || "إعادة المحاولة"}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image 
          style={{ width: 200, height: 200, marginBottom: 20 }} 
          resizeMode='contain' 
          source={require('../../../assets/nodata.png')} 
        />
        <Text style={styles.emptyText}>
          {t('sales.noData') || 'لا توجد بيانات مبيعات متاحة.'}
        </Text>
        <Text style={styles.emptySubText}>
          {t('sales.tryChangingFilters') || 'جرب تغيير الفلاتر أو تحقق لاحقاً.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <OrderDetailsModal
        visible={modalVisible}
        onClose={handleCloseModal}
        selectedItem={selectedItem}
        formatDate={formatDate}
        getStatusStyle={getStatusStyleWrapper}
        getStatusText={getStatusTextWrapper}
      />

      <SalesTableComponent
        data={data}
        onItemPress={handleItemPress}
        getStatusStyle={getStatusStyleWrapper}
        getStatusText={getStatusTextWrapper}
      />

      {isLoadingMore && (
        <View style={styles.loadingMoreContainer}>
          <ActivityIndicator size="small" color="#183E9F" />
          <Text style={[styles.loadingMoreText, isRTL && styles.rtlText]}>
            {t("clientDoctorList.loadingMore") || "جاري تحميل المزيد..."}
          </Text>
        </View>
      )}

      {!hasMoreData && data.length > 0 && (
        <View style={styles.loadingMoreContainer}>
          <Text style={[styles.noMoreDataText, isRTL && styles.rtlText]}>
            {t("clientDoctorList.noMoreData") || "لا توجد بيانات إضافية"}
          </Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  table: {
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18, 
    color: '#666',
    textAlign: 'center',
    marginTop: 10
  },
  emptySubText: {
    fontSize: 14, 
    color: '#999',
    textAlign: 'center',
    marginTop: 5
  },
  errorContainer: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    fontSize: 16,
    color: "#DC3545",
    textAlign: "center",
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  loadingMoreText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#183E9F',
  },
  noMoreDataText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  rtlText: {
    textAlign: I18nManager.isRTL ? "left" : "right",
    writingDirection: "rtl",
  },
});

export default SalesTable;

