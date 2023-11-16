import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../../components/styles';
import GoBack from '../../components/GoBack';
import Feather from 'react-native-vector-icons/Feather';
import ScanBarcodeAndQRModel from '../../components/Modals/ScanBarcodeAndQRModel';
import Input from '../../components/Input';
import AccountTable from '../../components/Tables/AccountTable';
import PaymentMethodModel from '../../components/Modals/PaymentMethodModel';
import DatePicker from 'react-native-date-picker';
import TableView from '../../General/TableView';
import globalConstants from '../../config/globalConstants';
import CollectMoneyItemTable from '../../components/Tables/CollectMoneyItemTable';
import { get, post } from '../../WebService/RequestBuilder';
import ButtonWithIndicator from '../../components/ButtonWithIndicator';

Feather.loadFont();
const getPharmacyCollectMoney = globalConstants.sales.collection;

const AccountInfo = ({ item }) => {
  const [modal, setModal] = useState(false);
  const [statusMethod, setStatusMethod] = useState(null);
  const [open, setOpen] = useState(false);
  const [openD, setOpenD] = useState(false);

  const [cashPaymentValue, setCashPaymentValue] = useState(0);
  const [date, setDate] = useState(new Date());
  const [calenderPaymentDate, setCalenderPaymentDate] = useState('');

  const [checkNumber, setCheckNumber] = useState(null);

  const [dateOfCheck, setDateOfCheck] = useState(new Date());
  const [calenderDateOfCheck, setCalenderDateOfCheck] = useState('');

  const [dateOfDueCheck, setDateOfDueCheck] = useState(new Date());
  const [calenderDateOfDueCheck, setCalenderDateOfDueCheck] = useState('');

  const [lastCollect, setLastCollect] = useState(null);

  const [clickable, setClickable] = useState(false);

  const collect_money = async (data) => {
    setClickable(false)
    await post(globalConstants.sales.collection, data, null).then((res) => { }).catch((err) => {}).finally(() => {
      setClickable(false);
      setCashPaymentValue(0);
      setCheckNumber(null)
      setStatusMethod(null)
      setCalenderDateOfDueCheck('')
      setDateOfDueCheck('')
    })
  }

  const submitCashMethod = async () => {
    const data = {
      payment: cashPaymentValue,
      payment_method: 'cash',
      pharmacy_id: item?.pharmacy_id,
    }
    await collect_money(data);
  };

  const submitCheckMethod = async () => {
    const data = {
      payment: cashPaymentValue,
      payment_method: 'check',
      pharmacy_id: item?.pharmacy_id,
      received_at: calenderDateOfDueCheck,
      settlement: calenderDateOfCheck,
      check_number: checkNumber,
    }
    await collect_money(data);
  };

  const getLastPayment = async () => {
    await get(getPharmacyCollectMoney, null, {limit: 1, pharmacy_id: item?.pharmacy_id}).then((res)=>{
      if (res?.data?.length > 0 ) {
        setLastCollect(res.data[0]);
      }
    }).catch((err) => {}).finally(() => {})
  }

  const validateCheckValue = (cashPaymentValue, checkNumber, calenderDateOfDueCheck, calenderDateOfCheck) => {
    console.log(cashPaymentValue, calenderDateOfDueCheck, calenderDateOfCheck, checkNumber);
    if (cashPaymentValue != null && cashPaymentValue != '' && calenderDateOfDueCheck != '' && calenderDateOfCheck != '' && checkNumber != null && checkNumber != null) {
      setClickable(true)
    }else {
      setClickable(false)
    }
  }

  useEffect(() => {
    getLastPayment()
  }, []);

  return (
    <View style={{ height:'100%'}}>
          <View style={{ width: '99%', height: 1, backgroundColor: '#000', alignSelf: 'center', marginVertical: 10, borderRadius: 22 }} />
          <AccountTable item={lastCollect}/>
          <ScrollView showsVerticalScrollIndicator={false}>
            
            <View style={{...style.container, justifyContent: 'center', marginTop: 30}}>
              <TouchableOpacity style={style.newbtn} onPress={() => { setModal(true) }} >
                <Text style={{ color: '#fff', fontSize: 18, paddingHorizontal: 50 }}>Payment Method</Text>
              </TouchableOpacity>
            </View>

            <View>
              {statusMethod === 1 && (
                <>
                  <Input
                    lable={'Payment value'}
                    isNumeric
                    setData={(txt) => {
                      setCashPaymentValue(txt);
                      if (txt != null && txt != '') {
                        setClickable(true)
                      }else {
                        setClickable(false)
                      }
                      }
                    }
                    style={{ ...styles.inputModel, backgroundColor: 'white' }}
                    value={cashPaymentValue}
                  />
                  <ButtonWithIndicator text={'Submit'} clickable={clickable} onClick={submitCashMethod} style={{marginTop: 30, width: '70%', alignSelf:'center'}}/>
                </>
              )}

              {statusMethod === 2 && <>
                <Input
                    lable={'Payment value'}
                    isNumeric
                    setData={(txt) => {
                      setCashPaymentValue(txt) 
                      validateCheckValue(txt, checkNumber, calenderDateOfDueCheck, calenderDateOfCheck)
                    }}
                    style={{ ...styles.inputModel, backgroundColor: 'white' }}
                    value={cashPaymentValue}
                />

                <Input
                  lable={'Check Number'}
                  setData={(txt) => {
                    setCheckNumber(txt) 
                    validateCheckValue(cashPaymentValue, txt, calenderDateOfDueCheck, calenderDateOfCheck)
                  }}
                  style={{ ...styles.inputModel, backgroundColor: 'white' }}
                  value={checkNumber}
                />

                <View style={styles.inbutContainer}>
                  <Text style={styles.label}>Check Date</Text>
                  <TouchableOpacity
                    style={styles.filterbutton}
                    onPress={() => {
                      setOpen(true);
                    }}>
                    <Text style={styles.filterbuttontext}>
                      {calenderDateOfCheck != '' ? calenderDateOfCheck : '-- -- -- -- --'}
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
                      setDateOfCheck(data);
                      const formattedDate =
                        data.getFullYear() +
                        '-' +
                        (data.getMonth() + 1) +
                        '-' +
                        data.getDate();
                      setCalenderDateOfCheck(formattedDate);
                      validateCheckValue(cashPaymentValue, checkNumber, calenderDateOfDueCheck, formattedDate)
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
                </View>

                <View style={styles.inbutContainer}>
                  <Text style={styles.label}>Due Date</Text>
                  <TouchableOpacity
                    style={styles.filterbutton}
                    onPress={() => {
                      setOpenD(true);
                    }}>
                    <Text style={styles.filterbuttontext}>
                      {calenderDateOfDueCheck != '' ? calenderDateOfDueCheck : '-- -- -- -- --'}
                    </Text>
                  </TouchableOpacity>
                  <DatePicker
                    modal
                    mode="date"
                    format="YYYY-MM-DD"
                    open={openD}
                    date={date}
                    onConfirm={data => {
                      setOpenD(false);
                      setDateOfDueCheck(data);
                      const formattedDate =
                        data.getFullYear() +
                        '-' +
                        (data.getMonth() + 1) +
                        '-' +
                        data.getDate();
                      setCalenderDateOfDueCheck(formattedDate);
                      validateCheckValue(cashPaymentValue, checkNumber, formattedDate, calenderDateOfCheck)
                    }}
                    onCancel={() => {
                      setOpenD(false);
                    }}
                  />
                </View>

                <ButtonWithIndicator text={'Submit'} clickable={clickable} onClick={submitCheckMethod} style={{marginTop: 30, width: '70%', alignSelf:'center'}}/>

              </>}
            </View>

          </ScrollView>

          <PaymentMethodModel
            show={modal}
            hide={() => {
              setModal(false);
            }}
            submit={e => {
              setStatusMethod(e);
            }}
          />

    </View>
  );
};

export default AccountInfo;

export const style = StyleSheet.create({
  newbtn: {
    backgroundColor: '#469ED8',
    height: 40,
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderRadius: 7,
    justifyContent: 'center',
    marginHorizontal: 7,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'flex-end',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  containerTable: {
    flex: 1,
    width: '95%',
    height:200,
    alignSelf: 'center',
    marginTop: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 4,
    // paddingBottom: 4,
  },
});
