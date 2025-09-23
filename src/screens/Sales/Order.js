import React, { useState, useMemo, useCallback } from "react";
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
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import SelectDropdown from "react-native-select-dropdown";
import { useTranslation } from "react-i18next";

AntDesign.loadFont();
Feather.loadFont();

const { width, height } = Dimensions.get('window');


const getFakeOrdersList = (t) => [
  {
    id: "1",
    order_status: "Delivered",
    pharmacy: t('order.pharmacies.alNahdi'),
    city: t('order.cities.riyadh'),
    total_price: "350.75",
    order_date: "2023-10-15",
    order_details: [
      {
        product: {
          name: t('order.products.aspirin'),
          barcode: "123456789012",
          price: "10.00",
          price_tax: "11.50",
          expiry_date: "2026-12-31",
        },
        units: "10",
        bonus: "2",
      },
      {
        product: {
          name: t('order.products.panadol'),
          barcode: "234567890123",
          price: "15.50",
          price_tax: "17.83",
          expiry_date: "2025-10-20",
        },
        units: "5",
        bonus: "1",
      },
    ],
  },
  {
    id: "2",
    order_status: "Pending",
    pharmacy: t('order.pharmacies.alDawa'),
    city: t('order.cities.jeddah'),
    total_price: "180.50",
    order_date: "2023-10-16",
    order_details: [
      {
        product: {
          name: t('order.products.vitaminC'),
          barcode: "345678901234",
          price: "25.00",
          price_tax: "28.75",
          expiry_date: "2027-01-15",
        },
        units: "4",
        bonus: "0",
      },
    ],
  },
  {
    id: "3",
    order_status: "Canceled",
    pharmacy: t('order.pharmacies.alMuttahida'),
    city: t('order.cities.dammam'),
    total_price: "95.00",
    order_date: "2023-10-14",
    order_details: [
      {
        product: {
          name: t('order.products.ibuprofen'),
          barcode: "456789012345",
          price: "18.20",
          price_tax: "20.93",
          expiry_date: "2026-05-01",
        },
        units: "3",
        bonus: "0",
      },
    ],
  },
];

const getFakeItemsDropdown = (t) => [
  { name: t('order.products.aspirin') },
  { name: t('order.products.panadol') },
  { name: t('order.products.vitaminC') },
];
const getFakeOffers = (t) => [
  { Offer: t('order.offers.discount10') },
  { Offer: t('order.offers.buy1Get1') },
  { Offer: t('order.offers.freeShipping') },
];

const AddNewOrderPopup = ({ show, hide, submit }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [cost, setCost] = useState("");

  const handleSave = () => {
    if (!selectedItem || !cost) {
      alert(t('order.selectProductAndPrice'));
      return;
    }
    const newOrderData = {
      item: selectedItem,
      offer: selectedOffer,
      cost: cost,
    };
    submit(newOrderData);
    setSelectedItem(null);
    setSelectedOffer(null);
    setCost("");
    hide();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onRequestClose={hide}
    >
      <View style={popupStyles.modalOverlay}>
        <View style={popupStyles.modalContainer}>
          <View style={popupStyles.modalHeader}>
            <Text style={[popupStyles.title, isRTL && popupStyles.rtlText]}>{t('order.addNewOrder')}</Text>
            <TouchableOpacity onPress={hide} style={popupStyles.closeButton}>
              <AntDesign name="close" color="#555" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={popupStyles.scrollContent}
          >
            <View style={popupStyles.inputGroup}>
              <Text style={[popupStyles.label, isRTL && popupStyles.rtlText]}>{t('order.products')}</Text>
              <SelectDropdown
                data={getFakeItemsDropdown(t)}
                onSelect={(item) => setSelectedItem(item.name)}
                buttonTextAfterSelection={(selectedItem) => selectedItem.name}
                rowTextForSelection={(item) => item.name}
                buttonStyle={popupStyles.dropdown}
                buttonTextStyle={[popupStyles.dropdownText, isRTL && popupStyles.rtlText]}
                defaultButtonText={t('order.selectProduct')}
                renderDropdownIcon={(isOpened) => (
                  <Feather
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    color="#555"
                    size={18}
                  />
                )}
              />
            </View>

            <View style={popupStyles.inputGroup}>
              <Text style={[popupStyles.label, isRTL && popupStyles.rtlText]}>{t('order.availableOffers')}</Text>
              <View style={popupStyles.offersContainer}>
                {getFakeOffers(t).map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      popupStyles.offerButton,
                      selectedOffer === item.Offer && popupStyles.selectedOffer,
                    ]}
                    onPress={() => setSelectedOffer(item.Offer)}
                  >
                    <Text
                      style={[
                        popupStyles.offerText,
                        selectedOffer === item.Offer && { color: "#fff" },
                      ]}
                    >
                      {item.Offer}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={popupStyles.inputGroup}>
              <Text style={[popupStyles.label, isRTL && popupStyles.rtlText]}>{t('order.costAndPrice')}</Text>
              <TextInput
                style={[popupStyles.input, isRTL && popupStyles.rtlText]}
                placeholder={t('order.enterPrice')}
                keyboardType="numeric"
                value={cost}
                onChangeText={setCost}
              />
            </View>

            <View style={popupStyles.buttonContainer}>
              <TouchableOpacity
                style={[popupStyles.button, popupStyles.cancelButton]}
                onPress={hide}
              >
                <Text style={[popupStyles.cancelButtonText, isRTL && popupStyles.rtlText]}>{t('order.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[popupStyles.button, popupStyles.saveButton]}
                onPress={handleSave}
              >
                <Text style={[popupStyles.saveButtonText, isRTL && popupStyles.rtlText]}>{t('order.save')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const OrderDetailsPopup = ({ show, hide, data }) => {
  if (!data) return null; // لا تعرض شيئًا إذا لم تكن هناك بيانات

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
                {data.order_status === "Delivered" ? "تم التوصيل" : 
                 data.order_status === "Pending" ? "قيد المعالجة" : "ملغي"}
              </Text>
            </View>
          </View>

          <FlatList
            data={data.order_details || []}
            keyExtractor={(item, index) => `${item.product.barcode}-${index}`}
            renderItem={({ item }) => <OrderItemCard item={item} />}
            contentContainerStyle={detailsStyles.listContainer}
          />

          <View style={detailsStyles.footer}>
            <Text style={detailsStyles.totalLabel}>المجموع الكلي</Text>
            <Text style={detailsStyles.totalPrice}>{data.total_price} ر.س</Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const OrderItemCard = ({ item }) => (
  <View style={detailsStyles.card}>
    <View style={detailsStyles.cardHeader}>
      <Text style={detailsStyles.itemName}>{item.product.name}</Text>
      <Text style={detailsStyles.barcode}>{item.product.barcode}</Text>
    </View>
    <View style={detailsStyles.divider} />
    <View style={detailsStyles.detailsGrid}>
      <InfoItem title="الكمية" value={item.units} />
      <InfoItem title="بونص" value={item.bonus} />
      <InfoItem title="السعر" value={`${item.product.price} ر.س`} />
      <InfoItem
        title="السعر بالضريبة"
        value={`${item.product.price_tax} ر.س`}
        isHighlight
      />
      <InfoItem 
        title="تاريخ الصلاحية" 
        value={item.product.expiry_date} 
        fullWidth 
      />
    </View>
  </View>
);

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
    switch (status) {
      case "Delivered":
        return { backgroundColor: "#D4EDDA", color: "#155724" };
      case "Pending":
        return { backgroundColor: "#FFF3CD", color: "#856404" };
      case "Canceled":
        return { backgroundColor: "#F8D7DA", color: "#721C24" };
      default:
        return { backgroundColor: "#E2E3E5", color: "#383D41" };
    }
  };

  const renderItem = ({ item, index }) => {
    const statusStyle = getStatusStyle(item.order_status);
    return (
      <View style={tableStyles.row}>
        <View style={[tableStyles.cell, { flex: 3, alignItems: "flex-start" }]}>
          <Text style={[tableStyles.pharmacyName, isRTL && tableStyles.rtlText]}>{item.pharmacy}</Text>
          <Text style={[tableStyles.city, isRTL && tableStyles.rtlText]}>{item.city}</Text>
          
          {item.order_details.slice(0, 2).map((detail, i) => (
            <Text key={i} style={[tableStyles.cellText, isRTL && tableStyles.rtlText]} numberOfLines={1}>
              • {detail.product.name}
            </Text>
          ))}
          {item.order_details.length > 2 && (
            <Text style={[tableStyles.moreItemsText, isRTL && tableStyles.rtlText]}>+{item.order_details.length - 2} {t('order.moreProducts')}</Text>
          )}
        </View>
        <View style={[tableStyles.cell, { flex: 2 }]}>
          <View
            style={[
              tableStyles.statusBadge,
              { backgroundColor: statusStyle.backgroundColor },
            ]}
          >
            <Text
              style={[tableStyles.statusText, { color: statusStyle.color }, isRTL && tableStyles.rtlText]}
            >
              {item.order_status === "Delivered" ? t('order.deliveredStatus') : 
               item.order_status === "Pending" ? t('order.pendingStatus') : t('order.canceledStatus')}
            </Text>
          </View>
          <Text style={[tableStyles.totalText, isRTL && tableStyles.rtlText]}>{item.total_price} {t('order.currency')}</Text>
        </View>
        <View style={[tableStyles.cell, { flex: 1 }]}>
          <TouchableOpacity 
            onPress={() => onViewDetails(item)}
            style={tableStyles.detailsButton}
          >
            <AntDesign name="eye" color="#fff" size={18} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={() => (
        <View style={tableStyles.header}>
          <Text
            style={[tableStyles.headerText, { flex: 3, textAlign: isRTL ? "right" : "left" }]}
          >
            {t('order.orders')}
          </Text>
          <Text style={[tableStyles.headerText, { flex: 2 }]}>{t('order.status')}</Text>
          <Text style={[tableStyles.headerText, { flex: 1 }]}>{t('order.details')}</Text>
        </View>
      )}
      renderItem={renderItem}
      contentContainerStyle={tableStyles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const OrderScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [orders, setOrders] = useState(getFakeOrdersList(t));
  const [isAddPopupVisible, setAddPopupVisible] = useState(false);
  const [isDetailsPopupVisible, setDetailsPopupVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsPopupVisible(true);
  };

  const handleAddOrder = (newOrderData) => {
    console.log("New Order to be added:", newOrderData);
    setAddPopupVisible(false);
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

      <View style={screenStyles.statsContainer}>
        <View style={screenStyles.statCard}>
          <Text style={screenStyles.statNumber}>3</Text>
          <Text style={[screenStyles.statLabel, isRTL && screenStyles.rtlText]}>{t('order.totalOrders')}</Text>
        </View>
        <View style={screenStyles.statCard}>
          <Text style={screenStyles.statNumber}>1</Text>
          <Text style={[screenStyles.statLabel, isRTL && screenStyles.rtlText]}>{t('order.pending')}</Text>
        </View>
        <View style={screenStyles.statCard}>
          <Text style={screenStyles.statNumber}>1</Text>
          <Text style={[screenStyles.statLabel, isRTL && screenStyles.rtlText]}>{t('order.delivered')}</Text>
        </View>
      </View>

      <View style={screenStyles.tableContainer}>
        <OrdersTable data={orders} onViewDetails={handleViewDetails} />
      </View>

    
      <TouchableOpacity
        style={screenStyles.floatingButton}
        onPress={() => setAddPopupVisible(true)}
        activeOpacity={0.8}
      >
        <AntDesign name="plus" size={24} color="#fff" />
        <Text style={[screenStyles.floatingButtonText, isRTL && screenStyles.rtlText]}>{t('order.newOrder')}</Text>
      </TouchableOpacity>

  
      <AddNewOrderPopup
        show={isAddPopupVisible}
        hide={() => setAddPopupVisible(false)}
        submit={handleAddOrder}
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
  switch (status) {
    case "Delivered":
      return { bg: "#D4EDDA", text: "#155724" };
    case "Pending":
      return { bg: "#FFF3CD", text: "#856404" };
    case "Canceled":
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
    flex: 1,
    paddingHorizontal: 15,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#FF6B35",
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
  container: { 
    paddingBottom: 100, 
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#3498db",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cell: { 
    justifyContent: "center", 
    alignItems: "center" 
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4
  },
  city: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 8
  },
  cellText: { 
    fontSize: 13, 
    color: "#34495e",
    marginBottom: 2 
  },
  moreItemsText: { 
    fontSize: 12, 
    color: "#3498db",
    fontStyle: "italic" 
  },
  statusBadge: { 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 15,
    marginBottom: 8
  },
  statusText: { 
    fontSize: 12, 
    fontWeight: "bold" 
  },
  totalText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50"
  },
  detailsButton: {
    backgroundColor: "#3498db",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center"
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