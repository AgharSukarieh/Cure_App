import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Modal,
  ScrollView,
  I18nManager,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const InfoRow = ({ title, value, icon }) => {
  const isRTL = I18nManager.isRTL;
  
  if (!value || value === 'null' || value === 'undefined') return null;
  
  return (
    <View style={styles.viewInfo}>
      <View style={styles.titleContainer}>
        {icon && <Feather name={icon} size={16} color="#183E9F" style={{ marginRight: 8 }} />}
        <Text style={[styles.titleInfo, isRTL && styles.rtlText]}>{title}</Text>
      </View>
      <Text style={[styles.phname, isRTL && styles.rtlText]}>{value}</Text>
    </View>
  );
};

const InventoryModel = ({ show, hide, data }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  const product = data?.product;
  const units = parseFloat(data?.units || 0);
  const bonus = parseFloat(data?.bonus || data?.bonuse || 0);
  const totalQuantity = units + bonus;
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      coverScreen={false}>
      <View style={styles.ModalContainer}>
        <View style={styles.ModalView}>
          <TouchableOpacity
            onPress={hide}
            style={styles.closeBtn}>
            <AntDesign
              name="close"
              color="#183E9F"
              size={32}
            />
          </TouchableOpacity>

          <Text style={[styles.modalTitle, isRTL && styles.rtlText]}>
            {t('inventory.productDetails') || 'تفاصيل المنتج'}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
            {data && product && (
              <>
                {/* Product Name */}
                <InfoRow 
                  title={t('inventory.productName') || 'اسم المنتج'} 
                  value={product.name}
                  icon="package"
                />

                {/* Company */}
                <InfoRow 
                  title={t('inventory.company') || 'الشركة المصنعة'} 
                  value={product.company?.name}
                  icon="briefcase"
                />

                {/* Barcode */}
                <InfoRow 
                  title={t('inventory.barcode') || 'الباركود'} 
                  value={product.barcode}
                  icon="hash"
                />

                {/* Batch Number */}
                <InfoRow 
                  title={t('order.batchNumber') || 'رقم الدفعة'} 
                  value={product.batch_number}
                  icon="tag"
                />

                <View style={styles.divider} />

                {/* Quantities */}
                <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
                  {t('inventory.quantityInfo') || 'معلومات الكمية'}
                </Text>

                <InfoRow 
                  title={t('inventory.orderQuantity') || 'الكمية في الطلب'} 
                  value={`${units} ${t('order.items') || 'منتج'}`}
                  icon="shopping-cart"
                />

                {bonus > 0 && (
                  <InfoRow 
                    title={t('order.bonus') || 'بونص'} 
                    value={`${bonus} ${t('order.items') || 'منتج'}`}
                    icon="gift"
                  />
                )}

                <InfoRow 
                  title={t('inventory.totalQuantity') || 'الكمية الإجمالية'} 
                  value={`${totalQuantity} ${t('order.items') || 'منتج'}`}
                  icon="package"
                />

                <InfoRow 
                  title={t('inventory.stockQuantity') || 'المخزون الكلي'} 
                  value={`${product.quantity || 0} ${t('order.items') || 'منتج'}`}
                  icon="database"
                />

                <InfoRow 
                  title={t('inventory.soldQuantity') || 'الكمية المباعة'} 
                  value={`${product.quantity_sold || 0} ${t('order.items') || 'منتج'}`}
                  icon="trending-up"
                />

                <View style={styles.divider} />

                {/* Prices */}
                <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
                  {t('inventory.priceInfo') || 'معلومات السعر'}
                </Text>

                <InfoRow 
                  title={t('order.price') || 'السعر الأساسي'} 
                  value={`${product.price || 0} ${t('order.currency') || 'دينار'}`}
                  icon="dollar-sign"
                />

                <InfoRow 
                  title={t('order.priceWithTax') || 'السعر بالضريبة'} 
                  value={`${product.price_tax || 0} ${t('order.currency') || 'دينار'}`}
                  icon="percent"
                />

                <InfoRow 
                  title={t('order.publicPrice') || 'السعر العام'} 
                  value={`${product.public_price || 0} ${t('order.currency') || 'دينار'}`}
                  icon="tag"
                />

                <InfoRow 
                  title={t('inventory.tax') || 'الضريبة'} 
                  value={`${(product.tax * 100) || 0}%`}
                  icon="percent"
                />

                <View style={styles.divider} />

                {/* Dates */}
                <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
                  {t('inventory.dateInfo') || 'معلومات التواريخ'}
                </Text>

                <InfoRow 
                  title={t('inventory.manufactureDate') || 'تاريخ التصنيع'} 
                  value={product.manufacture_date ? moment(product.manufacture_date).format('DD/MM/YYYY') : '-'}
                  icon="calendar"
                />

                <InfoRow 
                  title={t('order.expiryDate') || 'تاريخ الصلاحية'} 
                  value={product.expiry_date ? moment(product.expiry_date).format('DD/MM/YYYY') : '-'}
                  icon="alert-circle"
                />

                <InfoRow 
                  title={t('inventory.orderDate') || 'تاريخ الطلب'} 
                  value={data.created_at ? moment(data.created_at).format('DD/MM/YYYY') : '-'}
                  icon="clock"
                />
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default InventoryModel;

const styles = StyleSheet.create({
  ModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  ModalView: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '93%',
    maxHeight: '85%',
    elevation: 8,
    padding: 20,
    shadowColor: '#183E9F',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#EAF0FF',
    borderRadius: 50,
    padding: 6,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#183E9F',
    marginBottom: 15,
    textAlign: 'center',
  },
  scrollContent: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#469ED8',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'left',
  },
  viewInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E8E8E8',
    paddingBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleInfo: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  phname: {
    fontSize: 15,
    color: '#183E9F',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginVertical: 20,
    borderRadius: 10,
  },
  rtlText: {
    textAlign: 'right',
  },
});
