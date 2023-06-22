import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SelectDropdown from 'react-native-select-dropdown';
import Feather from 'react-native-vector-icons/Feather';
import {styles} from '../styles';
import moment from 'moment';
import Constants from '../../config/globalConstants';
import { put } from '../../WebService/RequestBuilder';

const SkueditModel = ({show, hide, submit, data}) => {
  // const [docname, setdocname] = useState('');
  // const [drug1, setdrug1] = useState('');
  // const [drug2, setdrug2] = useState('');
  // const [drug3, setdrug3] = useState('');
  // const [note, setnote] = useState('');
  // const [user, setuser] = useState('');

  // const [doctorslist, setdoctorslist] = useState([]);
  // const [Productslist, setdProductslist] = useState([]);
  // const [textInputHeight, setTextInputHeight] = useState(40);

  // const doctorindex = doctorslist?.findIndex(
  //   item => item?.doc_id === data?.doctor_id?.doc_id,
  // );
  // const peoduct1index = Productslist?.findIndex(
  //   item => item?.pro_id === data?.product1?.pro_id,
  // );
  // const peoduct2index = Productslist?.findIndex(
  //   item => item?.pro_id === data?.product2?.pro_id,
  // );
  // const peoduct3index = Productslist?.findIndex(
  //   item => item?.pro_id === data?.product3?.pro_id,
  // );

  // const handleContentSizeChange = event => {
  //   const {height} = event.nativeEvent.contentSize;
  //   setTextInputHeight(height);
  // };

  // const currentTime = new Date().toLocaleString('en-US', {
  //   hour: 'numeric',
  //   minute: 'numeric',
  //   hour12: false,
  // });

  // const submit2 = () => {
  //   let nwedata = {
  //     report_id: data.report_id,
  //     user_id: user.id,
  //     doctor: data?.doctor_id?.doc_id,
  //     drug1: data?.product1?.pro_id,
  //     drug2: data?.product2?.pro_id,
  //     drug3: data?.product3.pro_id,
  //     note: note ? note : data.note,
  //   };
  //   // console.log('nwedata', nwedata);
  //   axios({
  //     method: 'POST',
  //     url: MED_EDIT_DAILY,
  //     data: nwedata,
  //   })
  //     .then(response => {
  //       if (response.data.message == 'done') {
  //         submit(data);
  //         hide();
  //       }
  //     })
  //     .catch(error => {
  //       console.log(
  //         '🚀 ~ file: DailyaddModel.js ~ line 26 ~ getdoctors ~ error',
  //         error,
  //       );
  //     });
  // };

  const endVisit = async () => {
    await put(Constants.visit.medical + `/${data?.id}`)
    .then((res) => {
      hide();
    })
    .catch((err) => {})
    .finally(() => {})
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

          {/* <Text style={style.maintitle}>Add new</Text> */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{marginVertical: 10}}>
              
              {/* <View style={style.card}>
                <Text style={style.lable}>Doctor name</Text>
                
                <SelectDropdown 
                  buttonStyle={{...styles.drop, flexDirection: 'row'}}
                  buttonTextStyle={{
                    color: '#000',
                    fontSize: 15,
                    fontWeight: '600',
                    marginTop: 0,
                  }}
                  defaultButtonText="Select"
                  data={doctorslist}
                  onSelect={(selectedItem, index) => {
                    setdocname(selectedItem);
                  }}
                  rowTextForSelection={(item, index) => { 
                    return (
                      <>
                        <Text
                          style={{
                            fontSize: 16,
                            paddingHorizontal: 0,
                            color: '#000',
                            fontWeight: '600',
                          }}>
                          {item.doc_name}
                        </Text>
                      </>
                    );
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return (
                      <>
                        <Text
                          style={{
                            fontSize: 16,
                            paddingHorizontal: 0,
                            color: '#000',
                            fontWeight: '600',
                          }}>
                          {selectedItem.doc_name}
                        </Text>
                      </>
                    );
                  }}
                  renderDropdownIcon={isOpened => {
                    return (
                      <Feather
                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                        color="#000"
                        size={13}
                        style={{marginLeft: 0}}
                      />
                    );
                  }}
                  dropdownStyle={{backgroundColor: '#fff', borderRadius: 10}}
                  defaultValueByIndex={doctorindex}
                />
              </View> */}

              {/* <View style={style.card}>
                <Text style={style.lable}>item 1</Text>
                <SelectDropdown
                  disabled
                  buttonStyle={{...styles.drop, flexDirection: 'row'}}
                  buttonTextStyle={{
                    color: '#000',
                    fontSize: 15,
                    fontWeight: '600',
                    marginTop: 0,
                  }}
                  defaultButtonText="Select"
                  data={Productslist}
                  onSelect={(selectedItem, index) => {
                    setdrug1(selectedItem);
                  }}
                  rowTextForSelection={(item, index) => {
                    return (
                      <>
                        <Text
                          style={{
                            fontSize: 16,
                            paddingHorizontal: 0,
                            color: '#000',
                            fontWeight: '600',
                          }}>
                          {item.product_name}
                        </Text>
                      </>
                    );
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return (
                      <>
                        <Text
                          style={{
                            fontSize: 16,
                            paddingHorizontal: 0,
                            color: '#000',
                            fontWeight: '600',
                          }}>
                          {selectedItem.product_name}
                        </Text>
                      </>
                    );
                  }}
                  renderDropdownIcon={isOpened => {
                    return (
                      <Feather
                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                        color="#000"
                        size={13}
                        style={{marginLeft: 0}}
                      />
                    );
                  }}
                  dropdownStyle={{backgroundColor: '#fff', borderRadius: 10}}
                  defaultValueByIndex={peoduct1index}
                />
              </View> */}
{/* 
              <View style={style.card}>
                <Text style={style.lable}>item 2</Text>
                <SelectDropdown
                  disabled
                  buttonStyle={{...styles.drop, flexDirection: 'row'}}
                  buttonTextStyle={{
                    color: '#000',
                    fontSize: 15,
                    fontWeight: '600',
                    marginTop: 0,
                  }}
                  defaultButtonText="Select"
                  data={Productslist}
                  onSelect={(selectedItem, index) => {
                    setdrug2(selectedItem);
                  }}
                  rowTextForSelection={(item, index) => {
                    return (
                      <>
                        <Text
                          style={{
                            fontSize: 16,
                            paddingHorizontal: 0,
                            color: '#000',
                            fontWeight: '600',
                          }}>
                          {item.product_name}
                        </Text>
                      </>
                    );
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return (
                      <>
                        <Text
                          style={{
                            fontSize: 16,
                            paddingHorizontal: 0,
                            color: '#000',
                            fontWeight: '600',
                          }}>
                          {selectedItem.product_name}
                        </Text>
                      </>
                    );
                  }}
                  renderDropdownIcon={isOpened => {
                    return (
                      <Feather
                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                        color="#000"
                        size={13}
                        style={{marginLeft: 0}}
                      />
                    );
                  }}
                  dropdownStyle={{backgroundColor: '#fff', borderRadius: 10}}
                  defaultValueByIndex={peoduct2index}
                />
              </View>

              <View style={style.card}>
                <Text style={style.lable}>item 3</Text>
                <SelectDropdown
                  disabled
                  buttonStyle={{...styles.drop, flexDirection: 'row'}}
                  buttonTextStyle={{
                    color: '#000',
                    fontSize: 15,
                    fontWeight: '600',
                    marginTop: 0,
                  }}
                  defaultButtonText="Select"
                  data={Productslist}
                  onSelect={(selectedItem, index) => {
                    setdrug3(selectedItem);
                  }}
                  rowTextForSelection={(item, index) => {
                    return (
                      <>
                        <Text
                          style={{
                            fontSize: 16,
                            paddingHorizontal: 0,
                            color: '#000',
                            fontWeight: '600',
                          }}>
                          {item.product_name}
                        </Text>
                      </>
                    );
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return (
                      <>
                        <Text
                          style={{
                            fontSize: 16,
                            paddingHorizontal: 0,
                            color: '#000',
                            fontWeight: '600',
                          }}>
                          {selectedItem.product_name}
                        </Text>
                      </>
                    );
                  }}
                  renderDropdownIcon={isOpened => {
                    return (
                      <Feather
                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                        color="#000"
                        size={13}
                        style={{marginLeft: 0}}
                      />
                    );
                  }}
                  dropdownStyle={{backgroundColor: '#fff', borderRadius: 10}}
                  defaultValueByIndex={peoduct3index}
                />
              </View>

              <View style={style.card}>
                <Text style={style.lable}>note</Text>
                <TextInput
                  placeholder="Note"
                  value={note}
                  onChangeText={text => {
                    setnote(text);
                  }}
                  style={{
                    ...styles.drop,
                    height: textInputHeight,
                    paddingHorizontal: 10,
                  }}
                  maxLength={300}
                  multiline
                  numberOfLines={10}
                  textAlignVertical="top"
                  onContentSizeChange={handleContentSizeChange}
                />
              </View>

              <View style={style.card}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => {
                    submit2();
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
              </View> */}

              {
                !data?.end_visit ? 
                <TouchableOpacity
                  style={style.endVisitBtn}
                  onPress={() => {
                    endVisit()
                  }}>
                  <Text style={styles.reportPageText}>End Visit</Text>
                </TouchableOpacity>
                :
                 null
              } 
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default SkueditModel;

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
    height: '90%',
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
  card: {
    marginVertical: 15,
    width: '100%',
  },
  lable: {
    marginBottom: 5,
    fontSize: 16,
    color: '#000',
    textTransform: 'capitalize',
  },
  endVisitBtn:{
    backgroundColor: '#ccc',
    padding: 10,
    width: '90%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 10,
    marginBottom: 20
  }
});
