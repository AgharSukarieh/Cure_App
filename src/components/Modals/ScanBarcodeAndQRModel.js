import {
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {CameraScreen} from 'react-native-camera-kit';

const ScanBarcodeAndQRModel = ({ show, hide, submit }) => {

  const onBarcodeScan = (qrvalue) => {
    submit(qrvalue)
    hide()
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      coverScreen={false}
      onSwipeComplete={() => setModalVisible2(false)}
      >
      <View style={style.ModalContainer}>
          <TouchableOpacity onPress={() => { hide() }}>
            <AntDesign name="close" color='#469ED8' size={35} style={{ alignSelf: 'flex-end' }} />
          </TouchableOpacity>

          <View style={{ width: '100%', height: '70%', alignSelf: 'center', marginTop:20 }}>
            <CameraScreen
              onBottomButtonPressed={(event) => this.onBottomButtonPressed(event)}
              hideControls={false}
              scanBarcode={true}
              showCapturedImageCount={false}
              onReadCode={event =>
                onBarcodeScan(event.nativeEvent.codeStringValue)
              }
              showFrame={true} 
              laserColor='red'
              frameColor='white'
            />
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
