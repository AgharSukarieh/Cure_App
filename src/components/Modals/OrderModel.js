import React, { useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

// بيانات وهمية للاختبار والتطوير
const FAKE_DATA = {
  pharmacy: 'صيدلية النهدي',
  city: 'الرياض',
  total_price: '350.75',
  order_details: [
    {
      product: { name: 'Aspirin 100mg', barcode: '123456789012', price: '10.00', price_tax: '11.50', expiry_date: '2026-12-31' },
      units: '10',
      bonus: '2',
    },
    {
      product: { name: 'Panadol Extra', barcode: '234567890123', price: '15.50', price_tax: '17.83', expiry_date: '2025-10-20' },
      units: '5',
      bonus: '1',
    },
    {
      product: { name: 'Vitamin C 500mg', barcode: '345678901234', price: '25.00', price_tax: '28.75', expiry_date: '2027-01-15' },
      units: '4',
      bonus: '0',
    },
  ],
};

// مكون لعرض تفاصيل كل منتج في الطلب
const OrderItemCard = ({ item }) => {
  // حساب التكلفة مع وبدون ضريبة لكل عنصر
  const cost = (parseFloat(item.units) * parseFloat(item.product.price)).toFixed(2);
  const costWithTax = (parseFloat(item.units) * parseFloat(item.product.price_tax)).toFixed(2);

  return (
    <View style={styles.card}>
      <Text style={styles.itemName}>{item.product.name}</Text>
      <View style={styles.divider} />
      
      <View style={styles.detailsGrid}>
        <InfoItem title="الكمية" value={item.units} />
        <InfoItem title="بونص" value={item.bonus} />
        <InfoItem title="التكلفة" value={`${cost} JOD`} />
        <InfoItem title="مع الضريبة" value={`${costWithTax} JOD`} isHighlight={true} />
        <InfoItem title="تاريخ الانتهاء" value={item.product.expiry_date} />
        <InfoItem title="الباركود" value={item.product.barcode} />
      </View>
    </View>
  );
};

// مكون صغير لعرض معلومة (عنوان وقيمة)
const InfoItem = ({ title, value, isHighlight = false }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoTitle}>{title}</Text>
    <Text style={[styles.infoValue, isHighlight && styles.highlightValue]}>{value}</Text>
  </View>
);

const OrderModel = ({ show, hide, data = FAKE_DATA }) => {
  // استخدام useMemo لحساب السعر الإجمالي مرة واحدة فقط عند تغير البيانات
  const totalPrice = useMemo(() => {
    if (!data?.order_details) return '0.00';
    
    const total = data.order_details.reduce((sum, item) => {
      const itemTotal = parseFloat(item.units) * parseFloat(item.product.price_tax);
      return sum + (isNaN(itemTotal) ? 0 : itemTotal);
    }, 0);
    
    return total.toFixed(2);
  }, [data?.order_details]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onRequestClose={hide} // لإغلاق المودال عند الضغط على زر الرجوع في أندرويد
    >
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* رأس المودال */}
          <View style={styles.header}>
            <View>
              <Text style={styles.pharmacyName}>{data?.pharmacy}</Text>
              <Text style={styles.pharmacyLocation}>{data?.city}</Text>
            </View>
            <TouchableOpacity onPress={hide} style={styles.closeButton}>
              <AntDesign name="close" color='#555' size={24} />
            </TouchableOpacity>
          </View>

          {/* قائمة المنتجات */}
          <FlatList
            data={data?.order_details || []}
            renderItem={({ item }) => <OrderItemCard item={item} />}
            keyExtractor={(item, index) => `${item.product.barcode}-${index}`}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />

          {/* قسم السعر الإجمالي */}
          <View style={styles.footer}>
            <Text style={styles.totalLabel}>المجموع الكلي (شامل الضريبة)</Text>
            <Text style={styles.totalPrice}>{totalPrice} JOD</Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    padding: 5,
  },
  pharmacyName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  pharmacyLocation: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#469ED8',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 10,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%', // عرض العنصر ليأخذ نصف المساحة تقريبًا
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  highlightValue: {
    color: '#28A745', // لون أخضر للقيمة المميزة
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#469ED8',
  },
});

export default OrderModel;
