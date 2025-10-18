import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  TextInput,
  StatusBar,
  Dimensions,
  I18nManager,
} from "react-native";
import moment from "moment";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import SelectDropdown from "react-native-select-dropdown";
import { useTranslation } from "react-i18next";
import { useAlert } from "../../components/Alert";
import Constants from "../../config/globalConstants";
import { get } from "../../WebService/RequestBuilder";
import { useAuth } from "../../contexts/AuthContext";
import AddNewOrderModel from "../../components/Modals/AddNewOrderModel";

AntDesign.loadFont();
Feather.loadFont();

const { width, height } = Dimensions.get('window');
const FIXED_COLUMN_WIDTH = width * 0.35;
const SCROLLABLE_COLUMN_WIDTH = width * 0.25;
const ROW_HEIGHT = 70;



const OrderDetailsPopup = ({ show, hide, data }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  if (!data) return null; 

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onRequestClose={hide}
    >
      <SafeAreaView style={detailsStyles.modalOverlay}>
        <View style={detailsStyles.modalContainer}>
          <View style={detailsStyles.header}>
            <View style={detailsStyles.headerInfo}>
              <Text style={detailsStyles.pharmacyName}>{data.pharmacy}</Text>
              <View style={detailsStyles.locationContainer}>
                <Feather name="map-pin" size={14} color="#666" />
                <Text style={detailsStyles.pharmacyLocation}>{data.city}</Text>
              </View>
              <Text style={detailsStyles.orderDate}>{data.order_date}</Text>
            </View>
            <TouchableOpacity onPress={hide} style={detailsStyles.closeButton}>
              <AntDesign name="close" color="#555" size={24} />
            </TouchableOpacity>
          </View>

          <View style={detailsStyles.statusContainer}>
            <View style={[
              detailsStyles.statusBadge,
              { backgroundColor: getStatusColor(data.order_status).bg }
            ]}>
              <Text style={[
                detailsStyles.statusText,
                { color: getStatusColor(data.order_status).text }
              ]}>
                {data.order_status?.toLowerCase() === "delivered" || data.order_status?.toLowerCase() === "completed" ? t('order.deliveredStatus') : 
                 data.order_status?.toLowerCase() === "pending" || data.order_status?.toLowerCase() === "processing" ? t('order.pendingStatus') : t('order.canceledStatus')}
              </Text>
            </View>
          </View>

          <FlatList
            data={data.order_details || []}
            keyExtractor={(item, index) => `product-${item.id || index}`}
            renderItem={({ item }) => <OrderItemCard item={item} />}
            contentContainerStyle={detailsStyles.listContainer}
          />

          <View style={detailsStyles.footer}>
            <Text style={detailsStyles.totalLabel}>{t('order.totalAmount')}</Text>
            <Text style={detailsStyles.totalPrice}>{data.total_price} {t('order.currency')}</Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const OrderItemCard = ({ item }) => {
  const { t } = useTranslation();
  
  return (
    <View style={detailsStyles.card}>
      <View style={detailsStyles.cardHeader}>
        <Text style={detailsStyles.itemName}>{item.name || item.product?.name || '-'}</Text>
      </View>
      <View style={detailsStyles.divider} />
      <View style={detailsStyles.detailsGrid}>
        <InfoItem title={t('order.quantity')} value={item.units || '0'} />
        <InfoItem title={t('order.bonus')} value={item.bonuse || item.bonus || '0'} />
        <InfoItem title={t('order.price')} value={`${item.price || item.product?.price || '0'} ${t('order.currency')}`} />
        <InfoItem
          title={t('order.priceWithTax')}
          value={`${item.price_tax || item.product?.price_tax || '0'} ${t('order.currency')}`}
          isHighlight
        />
        <InfoItem 
          title={t('order.publicPrice')} 
          value={`${item.public_price || item.product?.public_price || '0'} ${t('order.currency')}`} 
        />
        {(item.batch_number || item.product?.batch_number) && (
          <InfoItem 
            title={t('order.batchNumber')} 
            value={item.batch_number || item.product?.batch_number} 
            fullWidth 
          />
        )}
        {(item.expiry_date || item.product?.expiry_date) && (
          <InfoItem 
            title={t('order.expiryDate')} 
            value={item.expiry_date || item.product?.expiry_date} 
            fullWidth 
          />
        )}
      </View>
    </View>
  );
};

const InfoItem = ({ title, value, isHighlight = false, fullWidth = false }) => (
  <View style={[detailsStyles.infoItem, fullWidth && detailsStyles.fullWidth]}>
    <Text style={detailsStyles.infoTitle}>{title}</Text>
    <Text
      style={[
        detailsStyles.infoValue,
        isHighlight && detailsStyles.highlightValue,
      ]}
    >
      {value}
    </Text>
  </View>
);

const OrdersTable = ({ data, onViewDetails }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  const getStatusStyle = (status) => {
    // ✅ تحويل الحالة لحروف صغيرة للمقارنة
    const normalizedStatus = status?.toLowerCase();
    
    switch (normalizedStatus) {
      case "delivered":
      case "completed":
        return { backgroundColor: "#D4EDDA", color: "#155724" };
      case "pending":
      case "processing":
        return { backgroundColor: "#FFF3CD", color: "#856404" };
      case "canceled":
      case "cancelled":
        return { backgroundColor: "#F8D7DA", color: "#721C24" };
      default:
        return { backgroundColor: "#E2E3E5", color: "#383D41" };
    }
  };

  if (!data || data.length === 0) {
    return (
      <View style={tableStyles.emptyContainer}>
        <Text style={[tableStyles.emptyText, isRTL && tableStyles.rtlText]}>
          {t('order.noOrders')}
        </Text>
      </View>
    );
  }

  return (
    <View>
      <View style={tableStyles.table}>
        {/* Fixed Column - Order Info */}
        <View style={tableStyles.fixedColumn}>
          <View style={tableStyles.fixedHeaderCell}>
            <Text style={[tableStyles.fixedHeaderText, isRTL && tableStyles.rtlText]}>
              {t('order.orderInfo')}
            </Text>
          </View>
          <View>
            {data.map((item, index) => (
              <View
                key={`order-fixed-${item.id}-${index}`}
                style={[
                  tableStyles.fixedCell,
                  index % 2 === 1 ? tableStyles.oddRow : tableStyles.evenRow,
                ]}
              >
                <Text style={tableStyles.fixedCellText}>
                 {t('order.orderNumber')} #{item.id}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Scrollable Columns */}
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={tableStyles.scrollablePart}>
            {/* Header Row */}
            <View style={tableStyles.scrollableHeaderRow}>
              <View style={tableStyles.scrollableHeaderCell}>
                <Text style={[tableStyles.scrollableHeaderText, isRTL && tableStyles.rtlText]}>
                  {t('order.status')}
                </Text>
              </View>
              <View style={tableStyles.scrollableHeaderCell}>
                <Text style={[tableStyles.scrollableHeaderText, isRTL && tableStyles.rtlText]}>
                  {t('order.products')}
                </Text>
              </View>
              <View style={tableStyles.scrollableHeaderCell}>
                <Text style={[tableStyles.scrollableHeaderText, isRTL && tableStyles.rtlText]}>
                  {t('order.totalPrice')}
                </Text>
              </View>
              <View style={tableStyles.scrollableHeaderCell}>
                <Text style={[tableStyles.scrollableHeaderText, isRTL && tableStyles.rtlText]}>
                  {t('order.details')}
                </Text>
              </View>
            </View>

            {/* Data Rows */}
            <View>
              {data.map((item, index) => {
                const statusStyle = getStatusStyle(item.order_status);
                return (
                  <View
                    key={`order-data-${item.id}-${index}`}
                    style={[
                      tableStyles.scrollableDataRow,
                      index % 2 === 1 ? tableStyles.oddRow : tableStyles.evenRow,
                    ]}
                  >
                    {/* Status */}
                    <View style={tableStyles.scrollableCell}>
                      <View
                        style={[
                          tableStyles.statusBadge,
                          { backgroundColor: statusStyle.backgroundColor },
                        ]}
                      >
                        <Text style={[tableStyles.statusText, { color: statusStyle.color }]}>
                          {item.order_status?.toLowerCase() === "delivered" || item.order_status?.toLowerCase() === "completed" ? t('order.deliveredStatus') : 
                           item.order_status?.toLowerCase() === "pending" || item.order_status?.toLowerCase() === "processing" ? t('order.pendingStatus') : t('order.canceledStatus')}
                        </Text>
                      </View>
                    </View>
                    
                    {/* Products */}
                    <View style={tableStyles.scrollableCell}>
                      <Text style={[tableStyles.scrollableCellText, isRTL && tableStyles.rtlText]}>
                        {item.order_details_count || item.order_details?.length || 0} {t('order.items')}
                      </Text>
                    </View>
                    
                    {/* Total Price */}
                    <View style={tableStyles.scrollableCell}>
                      <Text style={[tableStyles.scrollableCellText, isRTL && tableStyles.rtlText]}>
                        {item.total_price || '0'} {t('order.currency')}
                      </Text>
                    </View>
                    
                    {/* Details Button */}
                    <View style={tableStyles.scrollableCell}>
                      <TouchableOpacity
                        onPress={() => onViewDetails(item)}
                        style={tableStyles.detailsButton}
                      >
                        <Feather name="eye" size={18} color="#007BFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const OrderScreen = ({ navigation, route, item }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const { user } = useAuth();
  const alert = useAlert();
  
  // ✅ استقبال البيانات من route.params أو props (نفس AccountInfo)
  const visitData = route?.params?.item || item;
  const visitId = route?.params?.visit_id;
  
  // ✅ Console log للتحقق من البيانات الواردة
  useEffect(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 OrderScreen - البيانات الواردة:');
    console.log('   - pharmacy_id:', visitData?.pharmacy_id);
    console.log('   - pharmacy_name:', visitData?.pharmacy_name || visitData?.name);
    console.log('   - visit_id:', visitId || visitData?.id);
    console.log('   - من route.params:', !!route?.params?.item);
    console.log('   - من props:', !!item);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }, [visitData, visitId, route, item]);
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddPopupVisible, setAddPopupVisible] = useState(false);
  const [isDetailsPopupVisible, setDetailsPopupVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ✅ حساب الإحصائيات من البيانات الحقيقية
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.order_status === "Pending").length;
  const deliveredOrders = orders.filter(order => order.order_status === "Delivered").length;

  // ✅ جلب الطلبات من API
  const getOrders = () => {
    if (!visitData?.pharmacy_id) {
      console.error('❌ pharmacy_id مفقود');
      alert.showError(
        t('order.error') || 'خطأ',
        t('order.errorMissingPharmacy') || 'معرف الصيدلية مفقود'
      );
      return;
    }
    
    setLoading(true);
    
    // ✅ جلب التاريخ من visitData
    const dateToUse = visitData?.startVisit || visitData?.start_visit || visitData?.visitDate || visitData?.created_at;
    const visitDate = dateToUse 
      ? (typeof dateToUse === 'object' && dateToUse?.date 
          ? moment(dateToUse.date).format('YYYY-MM-DD')
          : moment(dateToUse).format('YYYY-MM-DD'))
      : moment().format('YYYY-MM-DD');
    
    const params = {
      user_id: user?.id,
      pharmacy_id: visitData.pharmacy_id,
      date: visitDate,
    };
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📤 جلب الطلبات...');
    console.log('   - user_id:', params.user_id);
    console.log('   - pharmacy_id:', params.pharmacy_id);
    console.log('   - date:', params.date);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    get(Constants.orders.get_orders, null, params)
      .then((res) => {
        console.log('✅ استجابة API:', res);
        console.log('   - عدد الطلبات:', res.data?.length || 0);
        console.log('   - meta:', res.meta);
        
        if (res.data && res.data.length > 0) {
          // عرض أول 3 طلبات
          console.log('📦 عينة من الطلبات:');
          res.data.slice(0, 3).forEach((order, idx) => {
            console.log(`   ${idx + 1}. Order #${order.id}:`);
            console.log(`      - pharmacy: ${order.pharmacy}`);
            console.log(`      - status: ${order.order_status}`);
            console.log(`      - total: ${order.total_price} JOD`);
            console.log(`      - date: ${order.created_at}`);
            console.log(`      - products: ${order.order_details_count}`);
          });
        }
        
        setOrders(res.data || []);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      })
      .catch((err) => {
        console.error('❌ خطأ في جلب الطلبات:', err);
        console.error('   - Message:', err.message);
        console.error('   - Response:', err.response?.data);
        
        alert.showError(
          t('order.error') || 'خطأ',
          err.response?.data?.message || err.message || t('order.errorLoadingOrders') || 'حدث خطأ في تحميل الطلبات'
        );
        
        setOrders([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // ✅ جلب الطلبات عند فتح الصفحة
  useEffect(() => {
    if (visitData?.pharmacy_id) {
      getOrders();
    }
  }, [visitData?.pharmacy_id]);

  const handleViewDetails = (order) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👁️ عرض تفاصيل الطلب #' + order.id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // جلب تفاصيل الطلب من API
    get(`order-details/${order.id}`, null, null)
      .then((res) => {
        console.log('✅ تفاصيل الطلب:', res);
        
        // معالجة Response
        const products = Array.isArray(res) ? res : (res?.data || []);
        
        console.log('   - عدد المنتجات:', products.length);
        
        if (products.length > 0) {
          console.log('📦 المنتجات:');
          products.forEach((product, idx) => {
            console.log(`   ${idx + 1}. ${product.name} - ${product.units} وحدة - ${product.price_tax} دينار`);
          });
        }
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // تحديث الطلب المحدد مع التفاصيل
        const orderWithDetails = {
          ...order,
          order_details: products
        };
        
        setSelectedOrder(orderWithDetails);
        setDetailsPopupVisible(true);
      })
      .catch((err) => {
        console.error('❌ خطأ في جلب تفاصيل الطلب:', err);
        console.error('   - Message:', err.message);
        console.error('   - Response:', err.response?.data);
        
        // عرض رسالة خطأ للمستخدم
        alert.showError(
          t('order.error') || 'خطأ',
          t('order.errorLoadingDetails') || 'حدث خطأ في تحميل تفاصيل الطلب',
          { duration: 4000 }
        );
        
        // في حالة الخطأ، افتح الـ Modal بالبيانات الموجودة
        setSelectedOrder(order);
        setDetailsPopupVisible(true);
      });
  };

  const handleAddOrder = (newOrderData) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Order Added Successfully!');
    console.log('Order ID:', newOrderData?.id);
    console.log('Order Status:', newOrderData?.order_status);
    console.log('Payment Method:', newOrderData?.payment_method);
    console.log('Total Price:', newOrderData?.total_price);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // ✅ إظهار alert نجاح
    alert.showSuccess(
      t('order.success') || 'نجح',
      t('order.orderAddedSuccess') || 'تم إضافة الطلب بنجاح!'
    );
    
    setAddPopupVisible(false);
    
    // ✅ إعادة جلب الطلبات لتحديث القائمة وإظهار الطلب الجديد
    getOrders();
  };

  return (
    <SafeAreaView style={screenStyles.container}>
      <StatusBar backgroundColor="#3498db" barStyle="light-content" />
      
      <View style={screenStyles.header}>
        <TouchableOpacity style={screenStyles.backButton} onPress={() => navigation.goBack()}>
          <Feather name={I18nManager.isRTL ? "chevron-right" : "chevron-left"} size={28} color="#FFF" />
        </TouchableOpacity>
        <View>
          <Text style={[screenStyles.headerTitle, isRTL && screenStyles.rtlText]}>{t('order.headerTitle')}</Text>
          <Text style={[screenStyles.headerSubtitle, isRTL && screenStyles.rtlText]}>{t('order.headerSubtitle')}</Text>
        </View>
        <View style={screenStyles.headerIcons}>
          {/* <TouchableOpacity style={screenStyles.iconButton}>
            <Feather name="search" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={screenStyles.iconButton}>
            <Feather name="bell" size={20} color="#fff" />
          </TouchableOpacity> */}
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={screenStyles.scrollContent}
      >
        <View style={screenStyles.statsContainer}>
          <View style={screenStyles.statCard}>
            <Text style={screenStyles.statNumber}>{totalOrders}</Text>
            <Text style={[screenStyles.statLabel, isRTL && screenStyles.rtlText]}>{t('order.totalOrders')}</Text>
          </View>
          <View style={screenStyles.statCard}>
            <Text style={screenStyles.statNumber}>{pendingOrders}</Text>
            <Text style={[screenStyles.statLabel, isRTL && screenStyles.rtlText]}>{t('order.pending')}</Text>
          </View>
          <View style={screenStyles.statCard}>
            <Text style={screenStyles.statNumber}>{deliveredOrders}</Text>
            <Text style={[screenStyles.statLabel, isRTL && screenStyles.rtlText]}>{t('order.delivered')}</Text>
          </View>
        </View>

        <View style={screenStyles.tableContainer}>
          {loading && orders.length === 0 ? (
            <View style={tableStyles.emptyContainer}>
              <Text style={[tableStyles.emptyText, isRTL && tableStyles.rtlText]}>
                {t('order.loading')}
              </Text>
            </View>
          ) : (
            <OrdersTable data={orders} onViewDetails={handleViewDetails} />
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={screenStyles.floatingButton}
        onPress={() => setAddPopupVisible(true)}
        activeOpacity={0.8}
      >
        <AntDesign name="plus" size={24} color="#fff" />
        <Text style={[screenStyles.floatingButtonText, isRTL && screenStyles.rtlText]}>{t('order.newOrder')}</Text>
      </TouchableOpacity>

  
      <AddNewOrderModel
        show={isAddPopupVisible}
        hide={() => setAddPopupVisible(false)}
        submit={handleAddOrder}
        item={visitData}
        func={getOrders}
      />
      <OrderDetailsPopup
        show={isDetailsPopupVisible}
        hide={() => setDetailsPopupVisible(false)}
        data={selectedOrder}
      />
    </SafeAreaView>
  );
};

const getStatusColor = (status) => {
  // ✅ تحويل الحالة لحروف صغيرة للمقارنة
  const normalizedStatus = status?.toLowerCase();
  
  switch (normalizedStatus) {
    case "delivered":
    case "completed":
      return { bg: "#D4EDDA", text: "#155724" };
    case "pending":
    case "processing":
      return { bg: "#FFF3CD", text: "#856404" };
    case "canceled":
    case "cancelled":
      return { bg: "#F8D7DA", text: "#721C24" };
    default:
      return { bg: "#E2E3E5", text: "#383D41" };
  }
};


const screenStyles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8F9FA" 
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#3498db",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingTop: 40,
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#fff",
    marginBottom: 4 
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)"
  },
  headerIcons: {
    flexDirection: "row"
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 15
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    width: "30%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 5
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center"
  },
  tableContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: '#183E9F',

    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 1000,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

const tableStyles = StyleSheet.create({
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
    marginHorizontal: 15,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
  },
  detailsButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#F0F8FF",
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  }
});

const detailsStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "90%",
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerInfo: {
    flex: 1
  },
  closeButton: { 
    padding: 5 
  },
  pharmacyName: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#2c3e50",
    marginBottom: 5 
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5
  },
  pharmacyLocation: { 
    fontSize: 14, 
    color: "#666",
    marginLeft: 5 
  },
  orderDate: {
    fontSize: 12,
    color: "#95a5a6"
  },
  statusContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold"
  },
  listContainer: { 
    padding: 15 
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  itemName: { 
    fontSize: 18, 
    fontWeight: "600", 
    color: "#3498db",
    flex: 1,
    textAlign: I18nManager.isRTL ? "left" : "right"
  },
  barcode: {
    fontSize: 12,
    color: "#95a5a6"
  },
  divider: { 
    height: 1, 
    backgroundColor: "#F0F0F0", 
    marginVertical: 10 
  },
  detailsGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap" 
  },
  infoItem: { 
    width: "50%", 
    marginBottom: 15 
  },
  fullWidth: {
    width: "100%"
  },
  infoTitle: { 
    fontSize: 12, 
    color: "#7f8c8d", 
    marginBottom: 4,
    fontWeight: "500" 
  },
  infoValue: { 
    fontSize: 14, 
    fontWeight: "500", 
    color: "#2c3e50",
    textAlign: I18nManager.isRTL ? "left" : "right"
  },
  highlightValue: { 
    color: "#27ae60", 
    fontWeight: "bold" 
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  totalLabel: { 
    fontSize: 16, 
    color: "#555", 
    fontWeight: "500" 
  },
  totalPrice: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#3498db" 
  },
});

const popupStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 20
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "100%",
    maxHeight: "80%",
    padding: 0,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  scrollContent: {
    padding: 20
  },
  closeButton: { 
    padding: 5 
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  inputGroup: {
    marginBottom: 20
  },
  label: { 
    fontSize: 16, 
    color: "#2c3e50", 
    marginBottom: 10, 
    fontWeight: "500" 
  },
  dropdown: {
    width: "100%",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    height: 50
  },
  dropdownText: { 
    fontSize: 16, 
    color: "#333", 
    textAlign: "left" 
  },
  offersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  offerButton: {
    backgroundColor: "#F8F9FA",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    borderWidth: 1,
    borderColor: "#ddd"
  },
  selectedOffer: { 
    backgroundColor: "#3498db",
    borderColor: "#3498db" 
  },
  offerText: { 
    color: "#333", 
    fontSize: 14 
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#F8F9FA",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5
  },
  cancelButton: {
    backgroundColor: "#e0e0e0"
  },
  saveButton: {
    backgroundColor: "#3498db"
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600"
  },
  saveButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "600" 
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default OrderScreen;