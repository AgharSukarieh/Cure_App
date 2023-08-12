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

Feather.loadFont();

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

  const submitCashMethod = () => {
    console.log('---', date, cashPaymentValue, calenderPaymentDate);
  };

  const submitCheckMethod = () => {

  };

  return (
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginHorizontal: 20 }}>
        <>
          <View style={{ width: '99%', height: 1, backgroundColor: '#000', alignSelf: 'center', marginVertical: 10, borderRadius: 22 }} />
          <AccountTable data={''} />
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
                setModal(true);
              }}>
              <Text
                style={{ color: '#fff', fontSize: 18, paddingHorizontal: 50 }}>
                Payment Method
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            {statusMethod === 1 && (
              <>
                {/* Cash */}
                <Input
                  lable={'Payment value'}
                  setData={setCashPaymentValue}
                  style={{ ...styles.inputModel, backgroundColor: 'white' }}
                  value={cashPaymentValue}
                />
                {/*  */}
                <View style={styles.inbutContainer}>
                  <Text style={styles.label}>Payment Date</Text>
                  <TouchableOpacity
                    style={styles.filterbutton}
                    onPress={() => {
                      setOpen(true);
                    }}>
                    <Text style={styles.filterbuttontext}>
                      {calenderPaymentDate != '' ? calenderPaymentDate : '-- -- -- -- --'}
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
                      setCalenderPaymentDate(formattedDate);
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
                </View>
                {/*  */}
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
                      submitCashMethod();
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 18,
                        paddingHorizontal: 50,
                      }}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            {statusMethod === 2 && <>
              {/* Check */}
              <Input
                lable={'Check Number'}
                setData={setCheckNumber}
                style={{ ...styles.inputModel, backgroundColor: 'white' }}
                value={checkNumber}
              />

              {/*  */}
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
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
              </View>
              {/*  */}
              {/*  */}
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
                  }}
                  onCancel={() => {
                    setOpenD(false);
                  }}
                />
              </View>
              {/*  */}
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
                    submitCheckMethod();
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 18,
                      paddingHorizontal: 50,
                    }}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </>}
          </View>
        </>
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
    </SafeAreaView>
  );
};

export default AccountInfo;

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
  container: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'flex-end',
    marginVertical: 10,
    marginHorizontal: 20,
  },
});
