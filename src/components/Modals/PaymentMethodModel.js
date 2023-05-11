import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const PaymentMethodModel = ({show, hide, submit}) => {

  const submitBtn = (method) => {
    submit(method)
    hide();
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      coverScreen={false}
      onSwipeComplete={() => setModalVisible2(false)}>
      <View style={styles.ModalContainer}>
        <View style={styles.ModalView}>
          <TouchableOpacity
            onPress={() => {
                submit(null)
              hide();
            }}>
            <AntDesign
              name="close"
              color="#7189FF"
              size={35}
              style={{alignSelf: 'flex-end'}}
            />
          </TouchableOpacity>
            <View style={{marginVertical: 10}}>
              <View
                style={{
                  justifyContent: 'center',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  style={styles.newbtn}
                  onPress={() => {
                    submitBtn(1);
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 18,
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}>
                    Cash
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.newbtn}
                  onPress={() => {
                    submitBtn(2);
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 18,
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}>
                    Check
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentMethodModel;

const styles = StyleSheet.create({
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
    height: '40%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 20,
  },
  card: {
    shadowColor: '#7189FF',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,

    width: '99%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 15,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // paddingBottom: 10,
    // borderStyle: 'dashed',
    marginTop: 10,
    borderRadius: 7,
  },
  phname: {
    fontSize: 25,
    textTransform: 'capitalize',
    color: '#7189FF',
  },
  phlocation: {
    marginHorizontal: 15,
    marginVertical: 5,
    fontSize: 16,
  },
  item_name: {
    fontSize: 20,
    textTransform: 'capitalize',
    color: '#7189FF',
  },
  item_info: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  item_itemtitle: {
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  newbtn: {
    backgroundColor: '#7189FF',
    height: 50,
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderRadius: 7,
    justifyContent: 'center',
    marginVertical: 20,
  },
});
