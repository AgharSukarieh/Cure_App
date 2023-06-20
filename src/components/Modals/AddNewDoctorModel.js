import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Dropdown} from 'react-native-element-dropdown';
import Input from '../Input';
import GetLocation from 'react-native-get-location';
import { get, post } from '../../WebService/RequestBuilder';
import Constants from '../../config/globalConstants';

const AddNewDoctorModel = ({show, hide, submit, cityArea}) => {

  const [doctorName, setDoctorName] = useState('');
  const [classification, setClassification] = useState('');
  const [address, setAddress] = useState('');
  
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [citiesData, setCitiesData] = useState([]);
  const [cityValue, setCityValue] = useState(null);
  const [areasData, setAreasData] = useState([]);
  const [areaValue, setAreaValue] = useState(null);
  const [specialtyData, setSpecialtyData] = useState([]);
  const [specialtyValue, setSpecialtyValue] = useState(null);

  const submitData = async () => {
    const body = {
      name: doctorName,
      activate_status: 1,
      city_id: cityValue,
      area_id: areaValue,
      speciality_id: specialtyValue,
      address: address,
      classification: classification,
      longitude: longitude,
      latitude: latitude 
    }
    await post(Constants.doctor.allDoctors,body)
    .then((res) => {
      submit(true)
      hide();
    })
    .catch((err) => {
      Alert.alert('Error', err.message || '')
      submit(false)
      hide();
    })
    .finally(() => {})
  }

  const getCurrentLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        setLatitude(location.latitude);
        setLongitude(location.longitude);
      })
      .catch(error => {
        console.log( error);
      });
  };

  const getCities = () => {
    var count = Object.keys(cityArea.cities).length
        let cityArray = []
        for (var i = 0; i < count; i++ ){
            cityArray.push({
                value: cityArea.cities[i].id,
                label: cityArea.cities[i].name
            })
        }  
        setCitiesData(cityArray)
  }
 
  const getArea = (id) => {
    const arr = [];
    cityArea.areas.forEach((area) => {
        if (area.city_id == id) {
            arr.push(area);
        }
    });
      var count = Object.keys(arr).length
        let areaArray = []
        for (var i = 0; i < count; i++ ){
          areaArray.push({
                value: arr[i].id,
                label: arr[i].name
            })
        }
        setAreasData(areaArray)
}

  const getSpeciality = async () => {
    await get(Constants.doctor.speciality)
    .then((res) => {
      console.log(res);
      var count = Object.keys(res.speciality).length
        let specialtyArray = []
        for (var i = 0; i < count; i++ ){
          specialtyArray.push({
                value: res.speciality[i].id,
                label: res.speciality[i].name
            })
        }   
        setSpecialtyData(specialtyArray)
    })
    .catch((err) => {
      Alert.alert('Error', err.message || '')
    })
    .finally(() => {})
  }

  useEffect(() => {
    getCities();
    getSpeciality();
  }, [])
  
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

                <Input
                  lable={'Doctor Name'}
                  setData={setDoctorName}
                  style={{...styles.inputModel, backgroundColor: 'white'}}
                  value={doctorName}
                  viewStyle={{width: '90%'}}
                />

                <View style={{...styles.container, marginTop: 40}}>
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
              placeholder={!cityValue ? 'Select City' : '...'}
              searchPlaceholder="Search..."
              value={cityValue}
              onBlur={() => {}}
              onChange={item => {
                setCityValue(item.value);
                getArea(item.value)
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={cityValue ? 'blue' : 'black'}
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
              placeholder={!areaValue ? 'Select Area' : '...'}
              searchPlaceholder="Search..."
              value={areaValue}
              onBlur={() => {}}
              onChange={item => {
                setAreaValue(item.value);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={areaValue ? 'blue' : 'black'}
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
              data={specialtyData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!specialtyValue ? 'Select Specialty' : '...'}
              searchPlaceholder="Search..."
              value={specialtyValue}
              onBlur={() => {}}
              onChange={item => {
                setSpecialtyValue(item.value);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color={specialtyValue ? 'blue' : 'black'}
                  name="Safety"
                  size={20}
                />
              )}
            />
                </View>

                <Input
                  lable={'Classification'}
                  setData={setClassification}
                  style={{...styles.inputModel, backgroundColor: 'white'}}
                  value={classification}
                  viewStyle={{width: '90%'}}
                />
                <Input
                  lable={'Address'}
                  setData={setAddress}
                  style={{...styles.inputModel, backgroundColor: 'white'}}
                  value={address}
                  viewStyle={{width: '90%'}}
                />

                <TouchableOpacity style={{marginTop: 40, width: '90%',height: 50, backgroundColor: latitude ? '#7189FF' : '#fff', borderWidth:2,borderColor: '#7189FF',borderRadius:5, justifyContent:'center'}} onPress={() => {getCurrentLocation()}}>
                  <Text style={{marginBottom: 5, color: latitude ? '#fff' : '#7189FF', textAlign:'center', fontSize:17, fontWeight:'bold'}}>
                    Location
                  </Text>
                </TouchableOpacity>

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

export default AddNewDoctorModel;

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
