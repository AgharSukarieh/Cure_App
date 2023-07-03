import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from '../../components/styles';
import GoBack from '../../components/GoBack';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import ScanBarcodeAndQRModel from '../../components/Modals/ScanBarcodeAndQRModel';
import Input from '../../components/Input';
import ReturnsAfterAddTable from '../../components/Tables/ReturnsAfterAddTable';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {SAL_GET_PRODUCT_BY_BARCODE } from '../../Provider/ApiRequest';
import { get } from '../../WebService/RequestBuilder';
import globalConstants from '../../config/globalConstants';
import { TextInput } from 'react-native';
import ReturnsTable from '../../components/Tables/ReturnsTable';

Feather.loadFont();

const Return = ({navigation, route}) => {
  const item = route.params.item;

  const [modal, setModal] = useState(false);
  const [dataForScan, setDataForScan] = useState(null);
  const [notes, setNotes] = useState('');
  const [prductInOurStore, setPrductInOurStore] = useState(null);
  const [returnData, setReturnData] = useState([]);
  const [notInStore, setNotInStore] = useState(false);
  const [totalReturnsStatus, setTotalReturnsStatus] = useState(false);

  // const [productsData, setProductsData] = useState([])
  // const [productValue, setProductValue] = useState(null)
  // const [productsArray, setProductsArray] = useState([])

  const [dateEx, setDateEx] = useState('');

  const [code, setCode] = useState(null);

  // const getProducts = async() => {
  //   get(globalConstants.product.products, null, {limit: 10000})
  //   .then((res) => { 
  //     // setProductsArray(res.data);
  //       // var count = Object.keys(res.data).length
  //       // let productsArray = []
  //       // for (var i = 0; i < count; i++ ) {
  //       //     productsArray.push({
  //       //      value: res.data[i].id,
  //       //      label: res.data[i].name
  //       //     })
  //       // }
  //       // setProductsData(productsArray);
  //   })
  //   .catch((err) => {})
  //   .finally(() => {
  //   })
  // }

  const endEditing = () => {
    // const product = productsArray.find(product => product.id === productValue);
    const parms = {
      batch_number_or_barcode: code, //'FGT78954G',
      expiry_date: dateEx, //'2027-06-01',
      pharmacy_id: item?.pharmacy_id, //2
    }

    if (dateEx != null && dateEx != '') {
      get(globalConstants.return.get_returns, null, parms).then((res) => {
        if ((res.return_orders.length > 0)) {
          setDataForScan(res.return_orders);
        } else {
          setDataForScan(null);
        }
      }).catch((err) => {
        Alert.alert(err.message || 'Error')
      }).finally(() => {});
    }
  }

  // useEffect(() => {
  //   // getProducts();
  // }, [])

  const scan = () => {
    // To Start Scanning
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs permission for camera access',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // If CAMERA Permission is granted
            // setCode('');
            // setOpneScanner(true);
            setModal(true);
          } else {
            alert('CAMERA permission denied');
          }
        } catch (err) {
          alert('Camera permission err', err);
          console.warn(err);
        }
      }
      // Calling the camera permission function
      requestCameraPermission();
    } else {
      setDataForScan(null);
      // setOpneScanner(true);
      setModal(true);
    }
  };

  const submitAfterGetBarcode = dataforscan => {
    setCode(dataforscan)

    // // setDataForScan(dataforscan);
    // const data = {
    //   batch_number: 1234,
    //   expired_date: '10/3/2023',
    //   amount: 4,
    // };
    // setDataForScan(data);
    // checIfProductInOurStore(data);
    // console.log(`Api for: ${dataforscan}`);
    //   axios({
    //     method: 'GET',
    //     url: SAL_GET_PRODUCT_BY_BARCODE,
    //     params: {barcode: dataforscan},
    //   })
    //     .then(response => {
    //       console.log(response.data);
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });

  };

  const checIfProductInOurStore = (data) => {
    // API for chech...
    const dataFromAPI = {
      batch_number: 1235,
      expired_date: '10/3/2021',
      amount: 4,
      last_order_date: '12/2/2022',
    };
    if (
      dataFromAPI?.batch_number === data?.batch_number || dataFromAPI?.expired_date === data?.expired_date
    ) {
      setPrductInOurStore(dataFromAPI);
      setNotInStore(false);
    } 
    else {
      setPrductInOurStore(null);
      setNotInStore(true);
    }
  };

  const addBtn = () => {
    const data = {...dataForScan, notes: notes};
    const dd = [...returnData, data];
    setReturnData(dd);
    setDataForScan(null);
    setPrductInOurStore(null);
    setNotes('');
  };

const submit = () => {
  // API
    setTotalReturnsStatus(true)
}

  return (
    <SafeAreaView>
      <GoBack text={'Return'} />
      
      <View style={{width:100, marginBottom:10}}>
        <TouchableOpacity
          style={style.newbtn}
          onPress={() => {
            scan();
          }}>
          <Text style={{color: '#fff', fontSize: 18, paddingHorizontal: 10}}>
            Scan
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{width:'50%'}}>
          {/* <Dropdown
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
                  placeholder={!productValue ? 'Select Product' : '...'}
                  searchPlaceholder="Search..."
                  value={productValue}
                  onBlur={() => {}}
                  onChange={item => {
                    setProductValue(item.value);
                  }}
                  renderLeftIcon={() => (
                    <AntDesign
                      style={styles.icon}
                      color={productValue ? 'blue' : 'black'}
                      name="Safety"
                      size={20}
                    />
            )}
          /> */}
        <TextInput
          style={{marginLeft: 10,width:'100%', height: 40, borderWidth:1, borderColor: 'blue', marginTop: 10, borderRadius: 5, paddingHorizontal: 10}}
          placeholder='YYYY-MM-DD'
          onChangeText={text => setDateEx(text)}
          onEndEditing={endEditing}
        />
      </View>
      

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{marginBottom: 40, marginHorizontal: 20}}>
          {/*  */}
          <View>
            {dataForScan && <ReturnsTable data={dataForScan} />}
          </View>
          {/*  */}



        {
        // dataForScan && (
        //   <>
        //     <View style={style.viewInfo}>
        //       <Text style={style.titleInfo}>Batch # : </Text>
        //       <Text style={style.phname}>
        //         {dataForScan?.product?.batch_number || '-'}
        //       </Text>
        //     </View>
        //     <View style={style.viewInfo}>
        //       <Text style={style.titleInfo}>Expired Date : </Text>
        //       <Text style={style.phname}>
        //         {dataForScan?.product?.expiry_date || '-'}
        //       </Text>
        //     </View>
        //     <View style={style.viewInfo}>
        //       <Text style={style.titleInfo}>Amount : </Text>
        //       <Text style={style.phname}>{dataForScan?.units || '-'}</Text>
        //     </View>
        //     {/* <Input
        //       viewStyle={{marginLeft: 0, marginTop: 15}}
        //       labelStyle={{
        //         fontSize: 20,
        //         color: 'black',
        //         fontWeight: 'bold',
        //         marginBottom: 10,
        //       }}
        //       lable={'Notes'}
        //       setData={setNotes}
        //       style={{...styles.inputModel, height: 100}}
        //       value={notes}
        //       multiline={true}
        //       numberOfLines={4}
        //       placeholder={'If you have any comments, write them here.'}
        //     /> */}
        //     <View
        //       style={{
        //         width: '99%',
        //         height: 1,
        //         backgroundColor: '#7189FF',
        //         alignSelf: 'center',
        //         marginTop: 20,
        //         borderRadius: 22,
        //       }}
        //     />
        //   </>
        // )
        }


        {/* {prductInOurStore ? (
          <View style={{marginBottom: 10}}>
            <View style={{...style.viewInfo}}>
              <Text style={style.titleInfo}>Batch # : </Text>
              <Text style={style.phname}>
                {prductInOurStore?.batch_number || '-'}
              </Text>
            </View>
            <View style={style.viewInfo}>
              <Text style={style.titleInfo}>Expired Date : </Text>
              <Text style={style.phname}>
                {prductInOurStore?.expired_date || '-'}
              </Text>
            </View>
            <View style={style.viewInfo}>
              <Text style={style.titleInfo}>Amount : </Text>
              <Text style={style.phname}>
                {prductInOurStore?.amount || '-'}
              </Text>
            </View>
            <View style={style.viewInfo}>
              <Text style={style.titleInfo}>Last order Date : </Text>
              <Text style={style.phname}>
                {prductInOurStore?.last_order_date || '-'}
              </Text>
            </View>
            <View
              style={{
                ...style.container,
                justifyContent: 'center',
                marginTop: 30,
                marginBottom: 0,
              }}>
              <TouchableOpacity
                style={style.newbtn}
                onPress={() => {
                  addBtn();
                }}>
                <Text
                  style={{color: '#fff', fontSize: 18, paddingHorizontal: 50}}>
                  Add To Table
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          notInStore && (
            <View style={{marginVertical: 10}}>
              <Text style={{fontSize: 17, fontWeight: '600', color: 'red'}}>
                Sorry, this product is not among our products.
              </Text>
              <View style={{
                ...style.container,
                justifyContent: 'center',
                marginTop: 30,
                marginBottom: 0,
              }}>
                <TouchableOpacity
                  style={style.newbtn}
                  onPress={() => {
                    setDataForScan(null);
                    setNotInStore(false);
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 18,
                      paddingHorizontal: 10,
                    }}>
                    Back
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        )} */}

        {/* <View
          style={{
            width: '99%',
            height: 1,
            backgroundColor: '#7189FF',
            alignSelf: 'center',
            marginTop: 10,
            borderRadius: 22,
          }}
        /> */}

        {/* {returnData.length > 0 && (
          <>
            <ReturnsAfterAddTable data={returnData} />
            <View
              style={{
                ...style.container,
                justifyContent: 'center',
                marginTop: 30,
                marginBottom: 70,
              }}>
              <TouchableOpacity
                style={style.newbtn}
                onPress={() => {
                  submit();
                }}>
                <Text
                  style={{color: '#fff', fontSize: 18, paddingHorizontal: 50}}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )} */}

      </ScrollView>

      {/* { totalReturnsStatus && <View style={{ marginTop: 20, width: '90%', marginHorizontal: '5%'}}>
                        <View style={{...style.card, backgroundColor: '#cccccf' }}>
                                    <Text style={{color: '#7189FF', fontWeight: 'bold'}}>Total Returns</Text>
                                    <View style={{ width: '99%', height: 0.5, backgroundColor: 'black', alignSelf: 'center', marginVertical: 10, borderRadius: 22 }} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 15 }}>  
                                        <View style={styles.item_info}>
                                            <Text style={{fontSize: 20, fontWeight:'bold', color: 'black'}}>20.0 JOD</Text>
                                        </View> 
                                    </View>
                        </View>
      </View>} */}

      <ScanBarcodeAndQRModel
        show={modal}
        hide={() => {
          setModal(false);
        }}
        submit={e => {
          submitAfterGetBarcode(e);
        }}
      />

    </SafeAreaView>
  );
};

export default Return;

export const style = StyleSheet.create({
  newbtn: {
    backgroundColor: '#7189FF',
    height: 40,
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderRadius: 7,
    justifyContent: 'center',
    marginHorizontal: 7,
  },
  viewInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  titleInfo: {
    fontSize: 22,
    color: 'black',
    fontWeight: 'bold',
    width: '60%',
  },
  phname: {
    fontSize: 18,
    textTransform: 'capitalize',
    color: '#7189FF',
    justifyContent: 'center',
    width: '50%',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'flex-end',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  card: {
    shadowColor: "#7189FF",
    shadowOffset: { width: 0, height: 1, },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
    borderRadius: 7
  },
  dropdown: {
  height: 42,
  borderColor: '#7189FF',
  borderWidth: 1,
  borderRadius: 5,
  paddingHorizontal: 8,
  marginLeft: 10,
  marginRight: 10,
  width:'100%'
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
  textinput:{
  height: 60,
  borderColor: 'rgba(37, 50, 116, 0.28)',
  borderWidth: 1,
  paddingLeft: 10,
  borderRadius: 5,
  }
});
