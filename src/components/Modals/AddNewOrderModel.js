import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SelectDropdown from 'react-native-select-dropdown';
import {pharams} from '../../helpers/data';
import Feather from 'react-native-vector-icons/Feather';
import {styles} from '../styles';
import Moment from 'moment';
import DatePicker from 'react-native-date-picker';
import {
  GET_PHARMACY,
  SAL_ADD_REPORT,
  GET_Products,
} from '../../Provider/ApiRequest';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '../Input';
import {Dropdown} from 'react-native-element-dropdown';
import OrdersAfterAddTable from '../../components/Tables/OrdersAfterAddTable';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const AddNewOrderModel = ({show, hide, submit}) => {
  // const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');
  const [bouns, setBouns] = useState('');
  // const [offers, setOffers] = useState('');
  // const [expiredDate, setExpiredDate] = useState('');

  const [productsData, setProductsData] = useState([]);
  const [productValue, setProductValue] = useState(null);
  const [productLabel, setProductLabel] = useState(null);
  const [isProductFocus, setIsProductFocus] = useState(false);

  const [orderData, setOrderData] = useState([]);

  const data = {productValue, amount, bouns};

  const getProducts = () => {
    axios({
      method: 'POST',
      url: GET_Products,
    })
      .then(response => {
        var count = Object.keys(response.data).length;
        let productArray = [];
        for (var i = 0; i < count; i++) {
          productArray.push({
            value: response.data[i].pro_id,
            label: response.data[i].product_name,
          });
        }
        setProductsData(productArray);
      })
      .catch(error => {});
  };

  useEffect(() => {
    getProducts();
  }, []);

  const submitBtn = () => {
    if (orderData.length > 0) {
      submit(data);
      console.log('z',orderData);
      hide();
      setOrderData([])
    }
  };

  const addBtn = () => {
    if (productValue != '' && amount != '') {
        const data = {
            productValue,
            productLabel,
            amount,
            bouns
        }
        const dd = [...orderData, data]
        setOrderData(dd)
        setProductValue(null);
        setProductLabel(null);
        setAmount('');
        setBouns('');
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      coverScreen={false}
      onSwipeComplete={() => setModalVisible2(false)}>
      <View style={style.ModalContainer}>
        <View style={style.ModalView}>
          <TouchableOpacity
            onPress={() => {
              hide();
            }}>
            <AntDesign
              name="close"
              color="#7189FF"
              size={35}
              style={{alignSelf: 'flex-end'}}
            />
          </TouchableOpacity>

          <Text style={{...style.maintitle, paddingHorizontal:10}}>Add new </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{marginVertical: 0, paddingHorizontal:10}}>
              <View style={style.card}>
                {/* <Input lable={'Item'} setData={setItem} style= {styles.inputModel}/> */}
                <Dropdown
                  style={style.dropdown}
                  placeholderStyle={style.placeholderStyle}
                  selectedTextStyle={style.selectedTextStyle}
                  inputSearchStyle={style.inputSearchStyle}
                  iconStyle={style.iconStyle}
                  data={productsData}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isProductFocus ? 'Select Product' : '...'}
                  searchPlaceholder="Search..."
                  value={productValue}
                  onFocus={() => setIsProductFocus(true)}
                  onBlur={() => setIsProductFocus(false)}
                  onChange={item => {
                    setProductValue(item.value);
                    setProductLabel(item.label)
                    setIsProductFocus(false);
                  }}
                  renderLeftIcon={() => (
                    <AntDesign
                      style={styles.icon}
                      color={isProductFocus ? 'blue' : 'black'}
                      name="Safety"
                      size={20}
                    />
                  )}
                />
                <Input
                  lable={'Amount'}
                  setData={setAmount}
                  style={styles.inputModel}
                  value={amount}
                />
                {/* <Input lable={'Expired Date'} setData={setExpiredDate}  style= {styles.inputModel} /> */}
                <Input
                  lable={'Bouns'}
                  setData={setBouns}
                  style={styles.inputModel}
                  value={bouns}
                />
                {/* <Input lable={'Offers'} setData={setOffers} style= {styles.inputModel}/> */}
              </View>
              {/* <View style={style.card}>
                                <TouchableOpacity style={{ ...styles.btn, backgroundColor: '#7189FF', height: 45 }} onPress={() => { submitBtn() }}>
                                    <Text style={{ fontSize: 18, fontWeight: '700', textTransform: 'capitalize', color: '#fff' }}>submit</Text>
                                </TouchableOpacity>
                            </View> */}
              <View style={style.btnContainer}>
                <TouchableOpacity
                  style={{
                    ...style.btn,
                    backgroundColor: '#7189FF',
                    height: 45,
                    marginRight: 40,
                  }}
                  onPress={() => {
                    submitBtn();
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      textTransform: 'capitalize',
                      color: '#fff',
                    }}>
                    submit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    ...style.btn,
                    backgroundColor: '#7189FF',
                    height: 45,
                    paddingHorizontal: 25,
                  }}
                  onPress={() => {
                    addBtn();
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      textTransform: 'capitalize',
                      color: '#fff',
                    }}>
                    Add
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <OrdersAfterAddTable data={orderData} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddNewOrderModel;

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
    padding: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  btn: {
    backgroundColor: '#7189FF',
    alignSelf: 'center',
    borderRadius: 7,
    padding: 7,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    // width:'47%'
  },
  maintitle: {
    fontSize: 25,
    textTransform: 'capitalize',
    color: '#7189FF',
  },
  newbtn: {
    backgroundColor: '#7189FF',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  card: {
    // marginVertical: 10,
    width: '100%',
  },
  lable: {
    marginBottom: 5,
    fontSize: 16,
    color: '#000',
    textTransform: 'capitalize',
  },
  dropdown: {
    height: 42,
    borderColor: '#7189FF',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
