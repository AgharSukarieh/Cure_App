import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  I18nManager,
  Image,
  Dimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import Constants from "../../config/globalConstants";
import { get } from "../../WebService/RequestBuilder";
import TablePlaceholder from "./TablePlaceholder";

const { width } = Dimensions.get('window');

const FrequencyTable = React.memo(({ 
  userId, 
  areaId, 
  classification, 
  dateFrom, 
  dateTo, 
  onLoadMoreReady 
}) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rowHeights, setRowHeights] = useState({});
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchData = useCallback(async (currentPage = 1, isLoadMore = false) => {
    if (!userId) {
      console.log('⚠️ لا يوجد userId - لن يتم جلب البيانات');
      setIsLoading(false);
      setData([]);
      return;
    }

    console.log('🚀 بدء جلب البيانات - الصفحة:', currentPage, '- Load More:', isLoadMore);

    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setError(null);
      setPage(1);
      setHasMoreData(true);
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('_page', currentPage.toString());
      queryParams.append('per_page', '15');
      
      if (areaId && areaId !== 'all') queryParams.append('area_id', areaId);
      if (classification && classification !== 'all') {
        console.log('✅ إضافة فلتر التصنيف:', classification);
        queryParams.append('classification', classification);
      }
      if (dateFrom) queryParams.append('dateFrom', dateFrom);
      if (dateTo) queryParams.append('dateTo', dateTo);

      const url = `${Constants.medical.frequncy_visits}?${queryParams.toString()}`;
      console.log('📡 جلب frequency reports من:', url);

      const response = await get(url);
      console.log('📦 استجابة API:', response ? 'موجود' : 'غير موجود');

      let reports = [];
      if (response?.data) {
        reports = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        reports = response;
      }

      console.log(`✅ تم استخراج ${reports.length} تقرير`);

      const meta = {
        current_page: response.current_page || currentPage,
        last_page: response.last_page || 1,
        total: response.total || reports.length
      };
      
      const hasMore = meta.last_page ? currentPage < meta.last_page : reports.length >= 15;
      setHasMoreData(hasMore);
      
      console.log(`✅ الصفحة ${meta.current_page} من ${meta.last_page}`);
      console.log(`📊 عدد التقارير في هذه الصفحة: ${reports.length}`);

      if (isLoadMore) {
        setData(prevData => {
          const newTotal = prevData.length + reports.length;
          console.log(`➕ تمت إضافة ${reports.length} تقرير - الإجمالي الجديد: ${newTotal}`);
          return [...prevData, ...reports];
        });
        setPage(currentPage);
      } else {
        setData(reports);
        console.log(`🔄 تم تعيين بيانات جديدة: ${reports.length} تقرير`);
      }

      console.log('✅ انتهى جلب البيانات بنجاح\n');

    } catch (error) {
      console.error("❌ خطأ في جلب البيانات:", error);
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      "فشل في تحميل تقارير التكرار. حاول مرة أخرى.";
      setError(errorMsg);
      
      if (!isLoadMore) {
        setData([]);
      }
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [userId, areaId, classification, dateFrom, dateTo]);

  useEffect(() => {
    console.log('🔄 تغيير في الفلاتر، جلب البيانات...');
    fetchData(1, false);
  }, [fetchData]);

  const loadMoreData = useCallback(async () => {
    if (!isLoadingMore && hasMoreData && !isLoading) {
      const nextPage = page + 1;
      console.log(`📄 تحميل الصفحة ${nextPage}...`);
      await fetchData(nextPage, true);
    }
  }, [page, isLoadingMore, hasMoreData, isLoading, fetchData]);

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

  const handleRowLayout = (event, index) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && (!rowHeights[index] || Math.abs(rowHeights[index] - height) > 1)) {
      setRowHeights(prev => ({ ...prev, [index]: height }));
    }
  };

  if (isLoading) {
    return <TablePlaceholder />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, isRTL && styles.rtlText]}>
          {error}
        </Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => fetchData(1, false)}
        >
          <Text style={styles.retryButtonText}>
            {t('frequencyReport.retry') || 'إعادة المحاولة'}
          </Text>
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
          {t('frequencyReport.noReports') || 'لا توجد تقارير متاحة.'}
        </Text>
        <Text style={styles.emptySubText}>
          {t('frequencyReport.tryChangingFilters') || 'جرب تغيير الفلاتر أو تحقق لاحقاً.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tableContainer}>
        <View style={styles.tableWrapper}>
          <View style={styles.fixedColumn}>
            <View style={[styles.fixedHeaderCell, styles.tableHeader]}>
              <Text style={[styles.fixedHeaderText, isRTL && styles.rtlText]}>
                {t('frequencyReport.doctorName') || 'اسم الطبيب'}
              </Text>
            </View>
            {data.map((item, index) => (
              <View
                key={`${item.doctorId}-${index}`}
                onLayout={(event) => handleRowLayout(event, index)}
                style={[
                  styles.fixedCell,
                  index % 2 === 1 ? styles.oddRow : styles.evenRow,
                  { height: rowHeights[index] || undefined }
                ]}
              >
                <Text style={styles.fixedCellText} numberOfLines={2}>
                  {item.doctor_name || 'N/A'}
                </Text>
              </View>
            ))}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.scrollableContent}>
            <View style={styles.scrollableTable}>
              <View style={[styles.scrollableHeaderRow, styles.tableHeader]}>
                <View style={styles.scrollableHeaderCell}>
                  <Text style={styles.scrollableHeaderText}>
                    {t('frequencyReport.classification') || 'التصنيف'}
                  </Text>
                </View>
                <View style={styles.scrollableHeaderCell}>
                  <Text style={styles.scrollableHeaderText}>
                    {t('frequencyReport.visitCount') || 'عدد الزيارات'}
                  </Text>
                </View>
                <View style={styles.scrollableHeaderCell}>
                  <Text style={styles.scrollableHeaderText}>
                    {t('frequencyReport.percentage') || 'النسبة المئوية'}
                  </Text>
                </View>
              </View>
              {data.map((item, index) => (
                <View
                  key={`${item.doctorId}-${index}`}
                  style={[
                    styles.scrollableRow,
                    index % 2 === 1 ? styles.oddRow : styles.evenRow,
                    { height: rowHeights[index] || undefined }
                  ]}
                >
                  <View style={styles.scrollableCell}>
                    <Text style={styles.scrollableCellText}>
                      {item.classification || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.scrollableCell}>
                    <Text style={styles.scrollableCellText}>
                      {item.visitCount || 0}
                    </Text>
                  </View>
                  <View style={styles.scrollableCell}>
                    <Text style={[
                      styles.scrollableCellText,
                      item.targetMet ? styles.targetMetText : styles.targetNotMetText
                    ]}>
                      {item.percentage || '0%'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {isLoadingMore && (
        <View style={styles.loadingMoreContainer}>
          <ActivityIndicator size="small" color="#183E9F" />
          <Text style={[styles.loadingMoreText, isRTL && styles.rtlText]}>
            {t('frequencyReport.loadingMore') || 'جاري تحميل المزيد...'}
          </Text>
        </View>
      )}

      {!hasMoreData && data.length > 0 && (
        <View style={styles.loadingMoreContainer}>
          <Text style={[styles.noMoreDataText, isRTL && styles.rtlText]}>
            {t('frequencyReport.noMoreData') || 'لا توجد بيانات إضافية'}
          </Text>
        </View>
      )}
    </View>
  );
});

const FIXED_COLUMN_WIDTH = width * 0.4;
const SCROLLABLE_COLUMN_WIDTH = 120;
const ROW_HEIGHT = 60;

const styles = StyleSheet.create({
  tableContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: "hidden",
  },
  tableWrapper: {
    flexDirection: "row",
  },
  fixedColumn: {
    width: FIXED_COLUMN_WIDTH,
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
  },
  fixedHeaderCell: {
    height: ROW_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
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
    minHeight: ROW_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  fixedCellText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  scrollableContent: {
    flex: 1,
  },
  scrollableTable: {
    flexDirection: "column",
  },
  scrollableHeaderRow: {
    flexDirection: "row",
    height: ROW_HEIGHT,
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
  scrollableRow: {
    flexDirection: "row",
    minHeight: ROW_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  scrollableCell: {
    width: SCROLLABLE_COLUMN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  scrollableCellText: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
  },
  tableHeader: {
    backgroundColor: "#F8F9FA",
  },
  evenRow: {
    backgroundColor: "#F8F9FA",
  },
  oddRow: {
    backgroundColor: "#FFFFFF",
  },
  targetMetText: {
    color: "#28A745",
    fontWeight: "600",
  },
  targetNotMetText: {
    color: "#DC3545",
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#DC3545",
    textAlign: "center",
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: "#183E9F",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 30,
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
  noMoreDataText: {
    fontSize: 14,
    color: "#888",
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
});

export default FrequencyTable;

