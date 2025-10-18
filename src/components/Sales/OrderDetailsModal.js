import React from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";

const OrderDetailsModal = ({ visible, onClose, selectedItem, formatDate, getStatusStyle, getStatusText }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, isRTL && styles.rtlModal]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, isRTL && styles.rtlText]}>
              {t("sales.orderDetails") || "تفاصيل الطلب"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {selectedItem && (
              <>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, isRTL && styles.rtlText]}>
                    {t("sales.orderId") || "رقم الطلب"}:
                  </Text>
                  <Text style={[styles.detailValue, isRTL && styles.rtlText]}>
                    #{selectedItem.order_id || "N/A"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, isRTL && styles.rtlText]}>
                    {t("sales.client") || "العميل"}:
                  </Text>
                  <Text style={[styles.detailValue, isRTL && styles.rtlText]}>
                    {selectedItem.client_name || "N/A"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, isRTL && styles.rtlText]}>
                    {t("sales.units") || "الوحدات"}:
                  </Text>
                  <Text style={[styles.detailValue, isRTL && styles.rtlText]}>
                    {selectedItem.units || "0"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, isRTL && styles.rtlText]}>
                    {t("sales.totalPrice") || "السعر الإجمالي"}:
                  </Text>
                  <Text style={[styles.detailValue, isRTL && styles.rtlText, styles.priceText]}>
                    ${parseFloat(selectedItem.total_price || "0").toFixed(2)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, isRTL && styles.rtlText]}>
                    {t("sales.status") || "الحالة"}:
                  </Text>
                  <Text style={[styles.detailValue, isRTL && styles.rtlText, getStatusStyle(selectedItem.status)]}>
                    {getStatusText(selectedItem.status)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, isRTL && styles.rtlText]}>
                    {t("sales.paymentMethod") || "طريقة الدفع"}:
                  </Text>
                  <Text style={[styles.detailValue, isRTL && styles.rtlText]}>
                    {selectedItem.payment_method || "N/A"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, isRTL && styles.rtlText]}>
                    {t("sales.city") || "المدينة"}:
                  </Text>
                  <Text style={[styles.detailValue, isRTL && styles.rtlText]}>
                    {selectedItem.city || "N/A"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, isRTL && styles.rtlText]}>
                    {t("sales.area") || "المنطقة"}:
                  </Text>
                  <Text style={[styles.detailValue, isRTL && styles.rtlText]}>
                    {selectedItem.area || "N/A"}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, isRTL && styles.rtlText]}>
                    {t("sales.createdAt") || "تاريخ الإنشاء"}:
                  </Text>
                  <Text style={[styles.detailValue, isRTL && styles.rtlText]}>
                    {formatDate(selectedItem.created_at)}
                  </Text>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#183E9F',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  priceText: {
    fontWeight: 'bold',
    color: '#28A745',
    fontSize: 16,
  },
  rtlModal: {
    direction: 'rtl',
  },
  rtlText: {
    textAlign: I18nManager.isRTL ? "left" : "right",
    writingDirection: "rtl",
  },
});

export default OrderDetailsModal;

