import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
  TextInput,
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
import {
  GET_PHARMACY,
  SAL_ADD_REPORT,
  GET_Products,
} from '../../Provider/ApiRequest';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '../Input';
import ScanBarcodeAndQRModel from './ScanBarcodeAndQRModel';
import {Dropdown} from 'react-native-element-dropdown';
// import {request, PERMISSIONS} from 'react-native-permissions';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const AddNewInventoryModel = ({show, hide, submit}) => {
  // const [item, setItem] = useState('');
  const [availability, setAvailability] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [modal, setModal] = useState(false);
  const [dataForScan, setDataForScan] = useState('');

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [calenderFrom, setCalenderFrom] = useState('');

  const [productsData, setProductsData] = useState([]);
  const [productValue, setProductValue] = useState(null);
  const [isProductFocus, setIsProductFocus] = useState(false);

  const askForPermission = (permission) => {
    // request(permission).then((result) => {
    //   console.log(result);
    // });
  }

  const getProducts = () => {
    axios({
      method: 'POST',
      url: GET_Products,
    })
      .then(response => {
        var count = Object.keys(response.data).length;
        let cityArray = [];
        for (var i = 0; i < count; i++) {
          cityArray.push({
            value: response.data[i].pro_id,
            label: response.data[i].product_name,
          });
        }
        setProductsData(cityArray);
      })
      .catch(error => {
        
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  const data = {productValue, availability, date, batchNumber};

  const submitBtn = () => {
    if (productValue != null && availability != '' && date != '') {
      submit(data);
      hide();
      setProductValue(null);
      setAvailability('');
      setBatchNumber('');
    }
  };
  const submitAfterGetBarcode = dataforscan => {
    setDataForScan(dataforscan);
    console.log(`Api for: ${dataforscan}`);
  };

  const scan = () => {
    // if (Platform.OS == 'ios') {
    //   request(PERMISSIONS.IOS.CAMERA).then((result) => {
    //     setModal(true);
    //   });
    // } else {
    //   request(PERMISSIONS.ANDROID.CAMERA).then((result) => {
    //     setModal(true);
    //   });
    // }
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
          <TouchableOpacity
            style={style.newbtn}
            onPress={() => {
              scan();
            }}>
            <Text style={{color: 'white', fontSize: 18, paddingHorizontal: 10}}>
              Scan
            </Text>
          </TouchableOpacity>
          <Text style={style.maintitle}>Add new </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{marginVertical: 0}}>
              <View style={style.card}>
                {/* <View style={style.container}> */}
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
                {/* </View> */}
                <Input
                  lable={'Availability'}
                  setData={setAvailability}
                  style={
                    styles.inputModel /*availability ? styles.input : styles.inputError} */
                  }
                />

                {/*  */}
                <View style={styles.inbutContainer}>
                  <Text style={styles.label}>Expired</Text>
                  <TouchableOpacity
                    style={styles.filterbutton}
                    onPress={() => {
                      setOpen(true);
                    }}>
                    <Text style={styles.filterbuttontext}>
                      {calenderFrom != '' ? calenderFrom : '-- -- -- -- --'}
                    </Text>
                  </TouchableOpacity>
                  <DatePicker
                    modal
                    mode="date"
                    format="YYYY-MM-DD"
                    open={open}
                    date={date}
                    onConfirm={data => {
                      setOpen(false);
                      setDate(data);
                      const formattedDate =
                        data.getFullYear() +
                        '-' +
                        (data.getMonth() + 1) +
                        '-' +
                        data.getDate();
                      setCalenderFrom(formattedDate);
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
                </View>
                {/*  */}
                <Input
                  lable={'BatchNumber'}
                  setData={setBatchNumber}
                  style={styles.inputModel}
                />
              </View>
              <View style={style.card}>
                <TouchableOpacity
                  style={{
                    ...styles.btn,
                    backgroundColor: '#7189FF',
                    height: 45,
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
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
      <></>
      <ScanBarcodeAndQRModel
        show={modal}
        hide={() => {
          setModal(false);
        }}
        submit={e => {
          submitAfterGetBarcode(e);
        }}
      />
    </Modal>
  );
};

export default AddNewInventoryModel;

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
    marginVertical: 10,
    width: '100%',
  },
  lable: {
    marginBottom: 5,
    fontSize: 16,
    color: '#000',
    textTransform: 'capitalize',
  },
  container: {
    backgroundColor: 'white',
    width: '48%',
    marginTop: 15,
  },
  dropdown: {
    height: 42,
    borderColor: '#7189FF',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginLeft: 10,
    marginRight: 10,
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
