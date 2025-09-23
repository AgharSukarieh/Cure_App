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
import { styles as globalStyles } from '../../components/styles'; 
import GoBack from '../../components/GoBack';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import ScanBarcodeAndQRModel from '../../components/Modals/ScanBarcodeAndQRModel';
import Input from '../../components/Input';
import ReturnsAfterAddTable from '../../components/Tables/ReturnsAfterAddTable';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SAL_GET_PRODUCT_BY_BARCODE } from '../../Provider/ApiRequest';
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
  const [modal, setModal] = useState(false);
  const [dataForScan, setDataForScan] = useState(null);
  const [code, setCode] = useState(null);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dateEx, setDateEx] = useState('');

  const endEditing = (date_) => {
    const parms = {
      batch_number_or_barcode: code,
      expiry_date: date_,
      pharmacy_id: item?.pharmacy_id,
    };

    if (dateEx !== null && dateEx !== '') {
      get(globalConstants.return.get_returns, null, parms)
        .then((res) => {
          if (res?.return_orders?.length > 0) {
            setDataForScan(res.return_orders);
          } else {
            setDataForScan(null);
          }
        })
        .catch((err) => {
          Alert.alert(err.message || t('return.error'));
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