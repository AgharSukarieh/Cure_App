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

const AddNewPharmacyModel = ({show, hide, submit}) => {
  const [citiesData, setCitiesData] = useState([]);
  const [areasData, setAreasData] = useState([]);

  const [cityValue, setCityValue] = useState(null);
  const [isCityFocus, setIsCityFocus] = useState(false);

  const [areaValue, setAreaValue] = useState(null);
  const [isAreaFocus, setIsAreaFocus] = useState(false);

  const [pharmacyName, setPharmacyName] = useState('');
  const [classification, setClassification] = useState('');

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [location, setLocation] = useState('');

  const submitData = () => {
    submit({
      cityValue,
      areaValue,
      pharmacyName,
      classification,
      latitude,
      longitude
    })

    hide();
    setCityValue(null)
    setAreaValue(null)
    setLatitude('')
    setLongitude('')
    setLocation('')
    setPharmacyName('')
    setClassification('')
  }

  const getCities = () => {
    axios({
      method: 'POST',
      url: GET_CITY,
    })
      .then(response => {
        var count = Object.keys(response.data).length;
        let cityArray = [];
        for (var i = 0; i < count; i++) {
          cityArray.push({
            value: response.data[i].city_id,
            label: response.data[i].city_name,
          });
        }
        setCitiesData(cityArray);
      })
      .catch(error => {
        console.log(
          '🚀 ~ file: Sales.js ~ line 26 ~ getdoctors ~ error',
          error,
        );
      });
  };

  const getareas = city_id => {
    let data = {
      city_id: city_id,
    };
    axios({
      method: 'POST',
      url: GET_Areas,
      data: data,
    })
      .then(response => {
        var count = Object.keys(response.data).length;
        let areaArray = [];
        for (var i = 0; i < count; i++) {
          areaArray.push({
            value: response.data[i].area_id,
            label: response.data[i].area_name,
          });
        }
        setAreasData(areaArray);
      })
      .catch(error => {
        console.log('🚀 ~ file: Sales.js ~ line 39 ~ getarea ~ error', error);
      });
  };

  const getCurrentLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        setLatitude(location.latitude);
        setLongitude(location.longitude);
        setLocation(`${location.latitude}, ${location.longitude}`);
      })
      .catch(error => {
        console.warn(code, message);
      });
  };

  

  useEffect(() => {
    getCities();
  }, []);

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
              submit(null);
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
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={styles.container}>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={citiesData}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isCityFocus ? 'Select City' : '...'}
                    searchPlaceholder="Search..."
                    value={cityValue}
                    onFocus={() => setIsCityFocus(true)}
                    onBlur={() => setIsCityFocus(false)}
                    onChange={item => {
                      setCityValue(item.value);
                      setIsCityFocus(false);
                      getareas(item.value);
                    }}
                    renderLeftIcon={() => (
                      <AntDesign
                        style={styles.icon}
                        color={isCityFocus ? 'blue' : 'black'}
                        name="Safety"
                        size={20}
                      />
                    )}
                  />
                </View>

                <View style={{...styles.container, marginTop: 40}}>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={areasData}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isAreaFocus ? 'Select Area' : '...'}
                    searchPlaceholder="Search..."
                    value={areaValue}
                    onFocus={() => setIsAreaFocus(true)}
                    onBlur={() => setIsAreaFocus(false)}
                    onChange={item => {
                      setIsAreaFocus(false);
                      setAreaValue(item.value);
                    }}
                    renderLeftIcon={() => (
                      <AntDesign
                        style={styles.icon}
                        color={isAreaFocus ? 'blue' : 'black'}
                        name="Safety"
                        size={20}
                      />
                    )}
                  />
                </View>
                <Input
                  lable={'Pharmacy Name'}
                  setData={setPharmacyName}
                  style={{...styles.inputModel, backgroundColor: 'white'}}
                  value={pharmacyName}
                  viewStyle={{width: '90%'}}
                />
                <Input
                  lable={'Classification'}
                  setData={setClassification}
                  style={{...styles.inputModel, backgroundColor: 'white'}}
                  value={classification}
                  viewStyle={{width: '90%'}}
                />
                <View style={{marginTop: 40, width: '90%'}}>
                  <Text style={{marginBottom: 5, color: '#253274'}}>
                    location
                  </Text>
                  <View
                    style={{...styles.inputModel, backgroundColor: 'white'}}>
                    <TouchableOpacity
                      onPress={() => getCurrentLocation()}
                      style={{...styles.iconPassword, justifyContent:'center',textAlign: 'center'}}>
                      <AntDesign
                        style={styles.icon}
                        color={location ? 'black' : 'blue'}
                        name="enviromento"
                        size={25}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        textAlign: 'center',
                        justifyContent: 'center',
                        marginTop: 8,
                      }}>
                      {location}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    ...styles.container,
                    justifyContent: 'center',
                    marginTop: 30,
                    marginBottom: 70,
                  }}>
                  <TouchableOpacity style={styles.newbtn} onPress={() => {
                    submitData()
                  }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 18,
                        paddingHorizontal: 50,
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddNewPharmacyModel;

const styles = StyleSheet.create({
  iconPassword: {
    position: 'absolute',
    right: '3%',
    height: 35,
    width: 35
  },
  container: {
    backgroundColor: 'white',
    width: '90%',
    marginTop: 15,
  },
  dropdown: {
    height: 50,
    borderColor: '#7189FF',
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
  },
  selectedTextStyle: {
    fontSize: 16,
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
    height: '70%',
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
  inputModel: {
    height: 40,
    borderColor: '#7189FF',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
  },
});
