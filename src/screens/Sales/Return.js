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
import React, { useEffect, useState } from 'react';
import { styles } from '../../components/styles';
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
Feather.loadFont();

const Return = ({ navigation, route, item }) => {

  const [modal, setModal] = useState(false);
  const [dataForScan, setDataForScan] = useState(null);
  // const [dateEx, setDateEx] = useState('');
  const [code, setCode] = useState(null);

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [dateEx, setDateEx] = useState('');

  const endEditing = (date_) => {
    const parms = {
      batch_number_or_barcode: code, //"12332133"
      expiry_date: date_,
      pharmacy_id: item?.pharmacy_id,
    }

    if (dateEx != null && dateEx != '') {
      get(globalConstants.return.get_returns, null, parms).then((res) => {
        if ((res?.return_orders?.length > 0)) {
          setDataForScan(res.return_orders);
        } else {
          setDataForScan(null);
        }
      }).catch((err) => {
        Alert.alert(err.message || 'Error')
      }).finally(() => { });
    }
  }

  const submitAfterGetBarcode = dataforscan => {
    setCode(dataforscan)
  };



  // const checIfProductInOurStore = (data) => {
  //   const dataFromAPI = {
  //     batch_number: 1235,
  //     expired_date: '10/3/2021',
  //     amount: 4,
  //     last_order_date: '12/2/2022',
  //   };
  //   if (dataFromAPI?.batch_number === data?.batch_number || dataFromAPI?.expired_date === data?.expired_date) {
  //     setPrductInOurStore(dataFromAPI);
  //     setNotInStore(false);
  //   } else {
  //     setPrductInOurStore(null);
  //     setNotInStore(true);
  //   }
  // };

  // const addBtn = () => {
  //   const data = { ...dataForScan, notes: notes };
  //   const dd = [...returnData, data];
  //   setReturnData(dd);
  //   setDataForScan(null);
  //   setPrductInOurStore(null);
  //   setNotes('');
  // };

  // const submit = () => {
  //   setTotalReturnsStatus(true)
  // }

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
        <TouchableOpacity style={style.newbtn} onPress={() => { setModal(true) }}>
          <Text style={{ color: '#fff', fontSize: 18, paddingHorizontal: 10 }}>Scan</Text>
        </TouchableOpacity>

        <View style={{ width: '40%' , marginRight:10}}>
          <TextInput
            style={{ marginLeft: 10, width: '100%', height: 40, borderWidth: 1, borderColor: '#000', marginTop: 10, borderRadius: 5, paddingHorizontal: 10 }}
            placeholder='batch / barcode'
            onChangeText={text => setCode(text)}
            onEndEditing={() => endEditing(dateEx)}
            value={code}
          />
        </View>

      </View>

      <View style={{ width: '90%', height: 1, backgroundColor: '#000', alignSelf: 'center', marginVertical: 10, borderRadius: 22 }} />
      
      {/* <View style={{ width: '50%' }}>
        <TextInput
          style={{ marginLeft: 10, width: '100%', height: 40, borderWidth: 1, borderColor: '#000', marginTop: 10, borderRadius: 5, paddingHorizontal: 10 }}
          placeholder='YYYY-MM-DD'
          onChangeText={text => setDateEx(text)}
          onEndEditing={endEditing}
        />
      </View> */}

            <TouchableOpacity
              style={{...styles.filterbutton, width: '50%', marginHorizontal: 15, borderRadius:7, borderColor: '#000000'}}
              onPress={() => {
                setOpen(true);
              }}>
              <Text style={styles.filterbuttontext}>
                {dateEx != '' ? dateEx : 'YYYY-MM-DD'}
              </Text>
            </TouchableOpacity>

            <DatePicker
              modal
              mode="date"
              format="YYYY-MM-DD"
              open={open}
              date={date}
              onCancel={() => {
                setOpen(false)
              }}
              onConfirm={data => {
                setOpen(false);
                setDate(data);
                const formattedDate = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate();
                setDateEx(formattedDate);
                endEditing(formattedDate)
              }}
            />


      <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 40, marginHorizontal: 20 }}>


        {dataForScan && <ReturnsTable data={dataForScan} func={() => endEditing(dateEx)}/>}

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
          //         backgroundColor: '#469ED8',
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
            backgroundColor: '#469ED8',
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
                                    <Text style={{color: '#469ED8', fontWeight: 'bold'}}>Total Returns</Text>
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
    backgroundColor: '#469ED8',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginHorizontal: 15,
    height: 40,
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
    color: '#469ED8',
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
    shadowColor: "#469ED8",
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
    borderColor: '#469ED8',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginLeft: 10,
    marginRight: 10,
    width: '100%'
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
  textinput: {
    height: 60,
    borderColor: 'rgba(37, 50, 116, 0.28)',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
  }
});
