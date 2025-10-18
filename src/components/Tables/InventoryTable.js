import { 
  TouchableOpacity, 
  Text, 
  View, 
  StyleSheet, 
  Dimensions,
  ScrollView,
  I18nManager 
} from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import InventoryModel from '../Modals/InventoryModel';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

AntDesign.loadFont();
Feather.loadFont();

const { width } = Dimensions.get('window');
const FIXED_COLUMN_WIDTH = width * 0.35;
const SCROLLABLE_COLUMN_WIDTH = width * 0.28;
const ROW_HEIGHT = 70;

const InventoryTable = ({ data }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [modal, setModal] = useState(false);
  const [rowdata, setrowdata] = useState('');
  const [lastOrder, setLastOrder] = useState({});

  const handleShowDetails = (row) => {
    setrowdata(row);
    setLastOrder({});
    setModal(true);
  };

  if (!data || !data.order_details || data.order_details.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, isRTL && styles.rtlText]}>
          {t('inventory.noData') || 'لا توجد بيانات'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.table}>
        {/* Fixed Column - Product Name */}
        <View style={styles.fixedColumn}>
          <View style={styles.fixedHeaderCell}>
            <Text style={[styles.fixedHeaderText, isRTL && styles.rtlText]}>
              {t('inventory.productName') || 'اسم المنتج'}
            </Text>
          </View>
          {data.order_details.map((item, index) => (
            <View
              key={`inventory-fixed-${item.id}-${index}`}
              style={[
                styles.fixedCell,
                index % 2 === 1 ? styles.oddRow : styles.evenRow,
              ]}
            >
              <Text style={styles.fixedCellText}>
                {item?.product?.name || '-'}
              </Text>
            </View>
          ))}
        </View>

        {/* Scrollable Columns */}
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.scrollablePart}>
            {/* Header Row */}
            <View style={styles.scrollableHeaderRow}>
              <View style={styles.scrollableHeaderCell}>
                <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                  {t('inventory.availability') || 'الكمية'}
                </Text>
              </View>
              <View style={styles.scrollableHeaderCell}>
                <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                  {t('inventory.lastOrder') || 'آخر طلب'}
                </Text>
              </View>
              <View style={styles.scrollableHeaderCell}>
                <Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>
                  {t('inventory.info') || 'التفاصيل'}
                </Text>
              </View>
            </View>

            {/* Data Rows */}
            {data.order_details.map((item, index) => (
              <View
                key={`inventory-data-${item.id}-${index}`}
                style={[
                  styles.scrollableDataRow,
                  index % 2 === 1 ? styles.oddRow : styles.evenRow,
                ]}
              >
                {/* Availability */}
                <View style={styles.scrollableCell}>
                  <Text style={[styles.scrollableCellText, isRTL && styles.rtlText]}>
                    {parseFloat(item?.units || 0) + parseFloat(item?.bonus || item?.bonuse || 0)}
                  </Text>
                </View>
                
                {/* Last Order Date */}
                <View style={styles.scrollableCell}>
                  <Text style={[styles.scrollableCellText, isRTL && styles.rtlText]}>
                    {item?.created_at ? moment(item.created_at).format('YYYY-MM-DD') : '-'}
                  </Text>
                </View>
                
                {/* Info Button */}
                <View style={styles.scrollableCell}>
                  <TouchableOpacity
                    onPress={() => handleShowDetails(item)}
                    style={styles.infoButton}
                  >
                    <Feather name="info" size={18} color="#469ED8" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {modal && (
        <InventoryModel
          show={modal}
          hide={() => setModal(false)}
          data={rowdata}
          lastOrder={lastOrder}
        />
      )}
    </View>
  );
};

export default InventoryTable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '98%',
    alignSelf: 'center',
  },
  table: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  fixedColumn: {
    width: FIXED_COLUMN_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  scrollablePart: {
    flex: 1,
  },
  fixedHeaderCell: {
    height: ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#F1F3F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  fixedHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#183E9F',
    textAlign: 'left',
  },
  fixedCell: {
    height: ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  fixedCellText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'left',
  },
  scrollableHeaderRow: {
    flexDirection: 'row',
    height: ROW_HEIGHT,
    backgroundColor: '#F1F3F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  scrollableDataRow: {
    flexDirection: 'row',
    height: ROW_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  scrollableHeaderCell: {
    width: SCROLLABLE_COLUMN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  scrollableHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A46BE',
    textAlign: 'center',
  },
  scrollableCell: {
    width: SCROLLABLE_COLUMN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  scrollableCellText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  evenRow: {
    backgroundColor: '#FFFFFF',
  },
  oddRow: {
    backgroundColor: '#FAFAFA',
  },
  emptyContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  infoButton: {
    padding: 5,
  },
  rtlText: {
    textAlign: 'right',
  },
});