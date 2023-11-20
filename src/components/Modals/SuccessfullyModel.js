import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';
import {GET_Areas, GET_CITY} from '../../Provider/ApiRequest';
import Input from '../Input';
import GetLocation from 'react-native-get-location';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const SuccessfullyModel = ({show, hide, message}) => {

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
              hide();
            }}>
            <AntDesign
              name="close"
              color="#469ED8"
              size={35}
              style={{alignSelf: 'flex-end'}}
            />
          </TouchableOpacity>
          <View style={{marginVertical: 10}}>
           <Text style={{textAlign: 'center', marginTop: 15, fontSize: 20, fontWeight: 'bold',color: '#469ED8'}}>{message}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessfullyModel;

const styles = StyleSheet.create({
  iconPassword: {
    position: 'absolute',
    right: '3%',
    height: 35,
    width: 35
  },
  container: {
    backgroundColor: 'white',
    width: '20%',
    marginTop: 15,
  },
  dropdown: {
    height: 50,
    borderColor: '#469ED8',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color:'#808080'
  },
  selectedTextStyle: {
    fontSize: 16,
    color:'#000000'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
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
    height: '20%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 20,
  },
  card: {
    shadowColor: '#469ED8',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    width: '99%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
    borderRadius: 7,
  },
  phname: {
    fontSize: 25,
    textTransform: 'capitalize',
    color: '#469ED8',
  },
  phlocation: {
    marginHorizontal: 15,
    marginVertical: 5,
    fontSize: 16,
  },
  item_name: {
    fontSize: 20,
    textTransform: 'capitalize',
    color: '#469ED8',
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
    backgroundColor: '#469ED8',
    height: 50,
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderRadius: 7,
    justifyContent: 'center',
    marginVertical: 20,
  },
  inputModel: {
    height: 40,
    borderColor: '#469ED8',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
  },
});
