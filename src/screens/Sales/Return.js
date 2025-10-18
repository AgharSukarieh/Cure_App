import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  I18nManager,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { styles as globalStyles } from '../../components/styles'; 
import GoBack from '../../components/GoBack';
import Feather from 'react-native-vector-icons/Feather';
import ScanBarcodeAndQRModel from '../../components/Modals/ScanBarcodeAndQRModel';
import { get } from '../../WebService/RequestBuilder';
import globalConstants from '../../config/globalConstants';
import { TextInput } from 'react-native';
import ReturnsTable from '../../components/Tables/ReturnsTable';
import DatePicker from 'react-native-date-picker';
import { useTranslation } from 'react-i18next';
Feather.loadFont();

const Return = ({ navigation, route, item }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  // ✅ استقبال البيانات من route.params أو props (نفس AccountInfo)
  const visitData = route?.params?.item || item;
  const visitId = route?.params?.visit_id;
  
  // ✅ Console log للتحقق من البيانات الواردة
  useEffect(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 Return - البيانات الواردة:');
    console.log('   - pharmacy_id:', visitData?.pharmacy_id);
    console.log('   - pharmacy_name:', visitData?.pharmacy_name || visitData?.name);
    console.log('   - visit_id:', visitId || visitData?.id);
    console.log('   - من route.params:', !!route?.params?.item);
    console.log('   - من props:', !!item);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }, [visitData, visitId, route, item]);
  
  const [modal, setModal] = useState(false);
  const [dataForScan, setDataForScan] = useState(null);
  const [code, setCode] = useState(null);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dateEx, setDateEx] = useState('');

  const endEditing = (date_) => {
    // ✅ التحقق من pharmacy_id
    if (!visitData?.pharmacy_id) {
      Alert.alert('خطأ', 'معلومات الصيدلية غير متوفرة');
      console.error('❌ pharmacy_id مفقود في visitData');
      return;
    }
    
    if (!code || code.trim() === '') {
      Alert.alert('تنبيه', 'يرجى إدخال رقم التشغيلة أو الباركود');
      return;
    }
    
    if (!date_ || date_ === '') {
      Alert.alert('تنبيه', 'يرجى اختيار تاريخ انتهاء الصلاحية');
      return;
    }
    
    const parms = {
      batch_number_or_barcode: code,
      expiry_date: date_,
      pharmacy_id: visitData.pharmacy_id,  // ✅ من visitData
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 البحث عن منتج مرتجع:');
    console.log('   - batch/barcode:', code);
    console.log('   - expiry_date:', date_);
    console.log('   - pharmacy_id:', visitData.pharmacy_id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    if (dateEx !== null && dateEx !== '') {
      get(globalConstants.return.get_returns, null, parms)
        .then((res) => {
          console.log('✅ Response من API:', res);
          console.log('   - return_orders:', res?.return_orders?.length || 0);
          
          if (res?.return_orders?.length > 0) {
            console.log('📦 تم العثور على منتجات مرتجعة:', res.return_orders.length);
            setDataForScan(res.return_orders);
          } else {
            console.log('⚠️ لم يتم العثور على منتجات مرتجعة');
            setDataForScan(null);
            Alert.alert('تنبيه', 'لم يتم العثور على منتجات مرتجعة بهذه البيانات');
          }
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        })
        .catch((err) => {
          console.error('❌ خطأ في جلب المرتجعات:', err);
          Alert.alert('خطأ', err.message || 'فشل البحث عن المنتج');
        })
        .finally(() => {});
    }
  };

  const submitAfterGetBarcode = (dataforscan) => {
    setCode(dataforscan);
  };

  return (
    <SafeAreaView style={localStyles.container}>
      <View style={localStyles.header}>
      <GoBack text={t('return.headerTitle')} /> 

      </View>
   

      <View style={localStyles.headerRow}>
        <TouchableOpacity style={localStyles.scanButton} onPress={() => setModal(true)}>
          <Feather name="camera" size={20} color="#fff" style={localStyles.icon} />
          <Text style={localStyles.buttonText}>{t('return.scan')}</Text>
        </TouchableOpacity>

        <TextInput
          style={[localStyles.codeInput, isRTL && localStyles.rtlText]}
          placeholder={t('return.batchBarcode')}
          placeholderTextColor="#808080"
          onChangeText={(text) => setCode(text)}
          onEndEditing={() => endEditing(dateEx)}
          value={code}
        />
      </View>

      <View style={localStyles.divider} />

      <TouchableOpacity
        style={localStyles.dateButton}
        onPress={() => setOpen(true)}>
        <Feather name="calendar" size={18} color="#469ED8" style={localStyles.icon} />
        <Text style={[localStyles.dateText, isRTL && localStyles.rtlText]}>
          {dateEx !== '' ? dateEx : 'YYYY-MM-DD'}
        </Text>
      </TouchableOpacity>

      <DatePicker
        modal
        mode="date"
        open={open}
        date={date}
        onConfirm={(data) => {
          setOpen(false);
          setDate(data);
          const formattedDate = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`;
          setDateEx(formattedDate);
          endEditing(formattedDate);
        }}
        onCancel={() => setOpen(false)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={localStyles.scrollView}
        contentContainerStyle={localStyles.scrollContent}>
        {dataForScan && (
          <ReturnsTable
            data={dataForScan}
            func={() => endEditing(dateEx)}
          />
        )}
      </ScrollView>

      <ScanBarcodeAndQRModel
        show={modal}
        hide={() => setModal(false)}
        submit={(e) => submitAfterGetBarcode(e)}
      />
    </SafeAreaView>
  );
};

export default Return;

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', 
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#469ED8',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  codeInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginLeft: 10,
    backgroundColor: '#fff',
    color: '#000',
    elevation: 1,
  },
  divider: {
    width: '90%',
    height: 1,
    backgroundColor: '#ddd',
    alignSelf: 'center',
    marginVertical: 15,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    elevation: 1,
  },
  dateText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
    flex: 1,
  },
  icon: {
    marginRight: 5,
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 15,
  },
  scrollContent: {
    paddingBottom: 80, 
  },
  // أنماط RTL
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },

});