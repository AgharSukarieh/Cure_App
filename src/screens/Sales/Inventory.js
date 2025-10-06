import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator, 
  ScrollView,
  I18nManager,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import InventoryTable from '../../components/Tables/InventoryTable';
import AddNewInventoryModel from '../../components/Modals/AddNewInventoryModel';
import ScanBarcodeAndQRModel from '../../components/Modals/ScanBarcodeAndQRModel';
import { get } from '../../WebService/RequestBuilder';
import Constants from '../../config/globalConstants';
import { Dimensions } from 'react-native';
import GoBack from '../../components/GoBack';
import { useTranslation } from 'react-i18next';
const { height } = Dimensions.get('window');
Feather.loadFont();

const Inventory = ({ navigation, item }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isScanModalVisible, setScanModalVisible] = useState(false);
  const [inventoryData, setInventoryData] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const fetchInventoryById = (productId) => {
    if (!item?.pharmacy_id || !productId) return;

    setIsLoading(true);
    setError(null);
    setInventoryData(null); 

    const params = {
      pharmacy_id: item.pharmacy_id,
      product_id: productId, 
    };

    get(Constants.inventory.get_inventory, null, params)
      .then((res) => {
        if (res.pharamcy_last_order && res.pharamcy_last_order.order_details?.length > 0) {
          setInventoryData(res.pharamcy_last_order);
        } else {
          setError(t('inventory.noProduct'));
        }
      })
      .catch((apiError) => {
        console.error("API Error fetching inventory:", apiError);
        setError(t('inventory.errorLoading'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSearch = (searchValue) => {
    if (!searchValue) return;

    setIsLoading(true);
    setError(null);
    setInventoryData(null);

    const params = {
      seach_term: searchValue,
    };

    get(Constants.product.products, null, params)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const foundProductId = res.data[0]?.id;
          fetchInventoryById(foundProductId);
        } else {
          setError(t('inventory.productNotFound'));
          setIsLoading(false);
        }
      })
      .catch((apiError) => {
        console.error("API Error searching products:", apiError);
        setError(t('inventory.searchError'));
        setIsLoading(false);
      });
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#0A2540" style={styles.centeredMessage} />;
    }
    if (error) {
      return <Text style={[styles.centeredMessage, styles.errorText, isRTL && styles.rtlText]}>{error}</Text>;
    }
    if (inventoryData) {
      return <InventoryTable data={inventoryData} />;
    }
    return (
      <View style={styles.emptyStateContainer}>
        <Feather name="search" size={40} color="#a0a0a0" />
        <Text style={[styles.emptyStateText, isRTL && styles.rtlText]}>{t('inventory.emptyState')}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{}}>
        <GoBack text={t('inventory.headerTitle')} />
      </View>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, isRTL && styles.rtlText]}
            placeholder={t('inventory.searchPlaceholder')}
            placeholderTextColor="#888"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={() => handleSearch(searchTerm)} 
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.scanButton} onPress={() => setScanModalVisible(true)}>
          <Feather name="maximize" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentScrollView}>
        {renderContent()}
      </ScrollView>

      <AddNewInventoryModel
        show={isAddModalVisible}
        hide={() => setAddModalVisible(false)}
        submit={(e) => {
          console.log('Data to submit:', e);
        }}
      />
      <ScanBarcodeAndQRModel
        show={isScanModalVisible}
        hide={() => setScanModalVisible(false)}
        submit={(scannedValue) => {
          setSearchTerm(scannedValue); 
          handleSearch(scannedValue); 
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F5',
    borderRadius: 12,
    height: 45,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  scanButton: {
    marginLeft: 10,
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#0A2540', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentScrollView: {
    flexGrow: 1,
    padding: 15,
  },
  centeredMessage: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#D93025', 
    fontWeight: '500',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: height * 0.15,
  },
  emptyStateText: {
    marginTop: 15,
    fontSize: 17,
    color: '#a0a0a0',
    textAlign: 'center',
    lineHeight: 24,
  },
  // أنماط RTL
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});



export default Inventory;
