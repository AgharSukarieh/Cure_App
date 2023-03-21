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
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SelectDropdown from 'react-native-select-dropdown';
import {
  classification,
  doctors,
  drugs,
  Specialty,
  Offers,
} from '../helpers/data';
import Feather from 'react-native-vector-icons/Feather';
import {styles} from './styles'; 

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const OrderModel = ({show, hide, data, submit, id}) => {
  const [docname, setdocname] = useState('');
  const [docSpecialty, setdocSpecialty] = useState('');
  const [docclass, setdocclass] = useState('');
  const [drug1, setdrug1] = useState('');
  const [drug2, setdrug2] = useState('');
  const [drug3, setdrug3] = useState('');
  const [note, setnote] = useState('');

  const [textInputHeight, setTextInputHeight] = useState(40);

  const handleContentSizeChange = event => {
    const {height} = event.nativeEvent.contentSize;
    setTextInputHeight(height);
  };

  const submit2 = () => {
    let data = {
      docname: docname,
      docSpecialty: docSpecialty,
      docclass: docclass,
      drug1: drug1,
      drug2: drug2,
      drug3: drug3,
      note: note,
    };
    submit(data);
    hide();

    const handleOffer = id => {};
  };
  const handleCost = text => {
    console.log(text);
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
          {/* <QRCode value="Hello World!"/> */}

          <Text style={style.maintitle}>Orders</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{marginVertical: 10}}>
              <View style={style.card}>
                <Text style={style.lable}>Items</Text>

                <SelectDropdown
                  buttonStyle={{...styles.drop, flexDirection: 'row'}}
                  buttonTextStyle={{
                    color: '#000',
                    fontSize: 15,
                    fontWeight: '600',
                    marginTop: 0,
                  }}
                  defaultButtonText="Select"
                  data={doctors}
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
                          {item.docname} test2323
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
                          {selectedItem.docname}
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
                />

                <Text style={{...style.lable, marginTop: 20}}>Offers</Text>

                <View style={{...style.row}}>
                  <>
                    {Offers &&
                      Offers.map((item, index) => (
                        <View style={{...style.filtterel, width: '24%'}}>
                          <TouchableOpacity key={index}>
                            <Text style={style.filtterbtntext}>
                              {item.Offer}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                  </>
                </View>
              </View>

              <Text style={{...style.lable, marginTop: 20}}>
                Cost And Public
              </Text>

              <TextInput
                style={{...styles.drop, padding: 16}}
                onChangeText={text => handleCost(text)}
              />
              <View
                style={{
                  ...style.filtterel,
                  width: '30%',
                  marginTop: 40,
                  margin: 'auto',
                }}>
                <TouchableOpacity>
                  <Text style={style.filtterbtntext}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default OrderModel;

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
    height: '80%%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 20,
  },
  filtterbtntext: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    color: '#fff',
  },
  offersContainer: {
    display: 'flex',
    marginTop: 15,
  },
  offerText: {
    color: '#ffffff',
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
  filtterrow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '98%',
    alignSelf: 'center',
    borderColor: '#7189FF',
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 7,
    paddingVertical: 7,
  },
  filtterrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '98%',
    alignSelf: 'center',
    borderColor: '#7189FF',
    borderBottomWidth: 1,
    marginTop: 10,
    paddingVertical: 7,
    borderRadius: 7,
  },
  filtterel: {
    borderRadius: 10,
    backgroundColor: '#7189FF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: '100%',
    marginTop: 10,
    borderRadius: 7,
  },
});
