import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
  TextInput,
  Linking,
  TouchableHighlight,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SelectDropdown from 'react-native-select-dropdown';
import {pharams} from '../../helpers/data';
import Feather from 'react-native-vector-icons/Feather';
import {styles} from '../styles';
import Moment from 'moment';
import DatePicker from 'react-native-date-picker';
import {GET_PHARMACY, SAL_ADD_REPORT} from '../../Provider/ApiRequest';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '../Input';

import {CameraScreen} from 'react-native-camera-kit';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ScanBarcodeAndQRModel = ({show, hide, submit}) => {

  const onBarcodeScan = (qrvalue) => {
    // Called after te successful scanning of QRCode/Barcode
    submit(qrvalue)
    hide()
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      coverScreen={false}
      onSwipeComplete={() => setModalVisible2(false)}>
      <View style={style.ModalContainer}>
        <View style={style.ModalView}>
            <TouchableOpacity onPress={() => { hide() }}>
                <AntDesign name="close" color='#7189FF' size={35} style={{ alignSelf: 'flex-end' }} />
                </TouchableOpacity>
            <View style={{flex: 1}}>
            <CameraScreen
              showFrame={false}
              // Show/hide scan frame
              scanBarcode={true}
              // Can restrict for the QR Code only
              laserColor={'blue'}
              // Color can be of your choice
              frameColor={'yellow'}
              // If frame is visible then frame color
              colorForScannerFrame={'black'}
              // Scanner Frame color
              onReadCode={event =>
                onBarcodeScan(event.nativeEvent.codeStringValue)
              }
            />
          </View>

        </View>
      </View>
    </Modal>
  );
};

export default ScanBarcodeAndQRModel;

const style = StyleSheet.create({
  ModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0707078c',
  },
  ModalView: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '95%',
    height: '70%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 20,
  },
});
