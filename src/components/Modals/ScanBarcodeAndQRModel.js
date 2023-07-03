import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Modal,
  AppRegistry,
  TextInput,
  Linking,
  TouchableHighlight,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SelectDropdown from 'react-native-select-dropdown';
import { pharams } from '../../helpers/data';
import Feather from 'react-native-vector-icons/Feather';
import { styles } from '../styles';
import Moment from 'moment';
import DatePicker from 'react-native-date-picker';
import Input from '../Input';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import {CameraScreen} from 'react-native-camera-kit';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ScanBarcodeAndQRModel = ({ show, hide, submit }) => {

  const onBarcodeScan = (qrvalue) => {
    // Called after te successful scanning of QRCode/Barcode
    submit(qrvalue)
    console.log('code', qrvalue);
    hide()
  };

  const onSuccess = (e) => {
    // Handle the scanned QR code data
    console.log(e.data);
    submit(e.data)
    hide()
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      coverScreen={false}
      onSwipeComplete={() => setModalVisible2(false)}
      >
      <View style={style.ModalContainer}>
        {/* <View style={style.MosdalView}> */}

          <TouchableOpacity onPress={() => { hide() }}>
            <AntDesign name="close" color='#7189FF' size={35} style={{ alignSelf: 'flex-end' }} />
          </TouchableOpacity>

          {/* <View style={{ width: '90%', height: '20%', alignSelf: 'flex-start' }}> */}
            {/* <CameraScreen
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
            /> */}
            <CameraScreen
  actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
  onBottomButtonPressed={(event) => this.onBottomButtonPressed(event)}
  hideControls={false}
  scanBarcode={true}
  showCapturedImageCount={false}
  onReadCode={event =>
    onBarcodeScan(event.nativeEvent.codeStringValue)
  }
  showFrame={true} //(default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
  laserColor='red' // (default red) optional, color of laser in scanner frame
  frameColor='white'
/>
            
             {/* <QRCodeScanner
              style={{height: 50}}
              onRead={onSuccess}
              flashMode={RNCamera.Constants.FlashMode.torch}
              topContent={
                <Text style={style.centerText}>
                  Go to{' '}
                  <Text style={style.textBold}>wikipedia.org/wiki/QR_code</Text> on
                  your computer and scan the QR code.
                </Text>
              }
              bottomContent={
                <TouchableOpacity style={styles.buttonTouchable}>
                  {/* <Text style={style.buttonText}>OK. Got it!</Text> */}
                {/* </TouchableOpacity> */}
              {/* } */}
            {/* /> */}



          </View>

        {/* </View> */}
      {/* </View> */}
    </Modal>
  );
};

export default ScanBarcodeAndQRModel;

const style = StyleSheet.create({
  ModalContainer: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#0707078c',
  },
  ModalView: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '95%',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // padding: 20,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});
