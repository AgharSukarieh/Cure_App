import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {styles} from '../components/styles';
import GoBack from '../components/GoBack';
// import SearchableDropdown from 'react-native-searchable-dropdown';
import {areas, classification, pharams} from '../helpers/data';
import ClientpharmaTable from '../components/Tables/ClientpharmaTable';
import Feather from 'react-native-vector-icons/Feather';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { GET_Areas, GET_CITY, SAL_GET_PHARMACY } from '../Provider/ApiRequest';
import axios from 'axios';
import AddNewPharmacyModel from '../components/Modals/AddNewPharmacyModel';
import SuccessfullyModel from '../components/Modals/SuccessfullyModel';

const wwidth = Dimensions.get('window').width;

const Clientpharmalist = ({ navigation, route }) => {
  const title = route?.params?.title

  const [citiesData, setCitiesData] = useState([]);
  const [areasData, setAreasData] = useState([]);
  const [cityValue, setCityValue] = useState(null);
  const [isCityFocus, setIsCityFocus] = useState(false);
  const [areaValue, setAreaValue] = useState(null);
  const [isAreaFocus, setIsAreaFocus] = useState(false);
  const [modal, setModal] = useState(false);
  const [scModal, setScModal] = useState(false);
  const [pharmacyArray, setPharmacyArray] = useState([])

  const [pharmacyArraySearch, setPharmacyArraySearch] = useState([])
  // const [clearSearch, setClearSearch] = useState('')

  const afterSelectCityAndArea = (area_id) => {
    console.log(cityValue, area_id);
    if (area_id !== null) {
      const arr = pharmacyArray.filter((item) => item.area_code == area_id);
      setPharmacyArraySearch(arr)
      }else {
        setPharmacyArraySearch([])
      }
  }

   const submitAddPharmacy = (data) => {
    console.log(data);
    // API ...
    setScModal(true)
   }

   const getPharmacy = () => {
    axios({
      method: 'GET',
      url: SAL_GET_PHARMACY,
      params: {},
    })
      .then(response => {
        setPharmacyArray(response.data.data);
        //
        setPharmacyArraySearch(response.data.data);
        //
        console.log(response.data.data);
      })
      .catch(error => {
        console.log(error);
      });
    }

  const getCities = () => {
    axios({
      method: "POST",
      url: GET_CITY,
    }).then((response) => {
        var count = Object.keys(response.data).length
        let cityArray = []
        for (var i = 0; i < count; i++ ){
            cityArray.push({
                value: response.data[i].city_id,
                label: response.data[i].city_name
            })
        }
        setCitiesData(cityArray)
    }).catch((error) => { console.log("🚀 ~ file: Sales.js ~ line 26 ~ getdoctors ~ error", error) })
  }

  const getareas = (city_id) => {
    let data = {
      city_id: city_id
    }
    axios({
      method: "POST",
      url: GET_Areas,
      data: data
    }).then((response) => {
        var count = Object.keys(response.data).length
        let areaArray = []
        for (var i = 0; i < count; i++ ){
            areaArray.push({
                value: response.data[i].area_id,
                label: response.data[i].area_name
            })
        }
        setAreasData(areaArray)
    }).catch((error) => { console.log("🚀 ~ file: Sales.js ~ line 39 ~ getarea ~ error", error) })
  }

const [search, setSearch] = useState('');

const updateSearch = (search) => {
  setSearch(search);
  if (search !== '') {
    const arr = pharmacyArray.filter((item) => item.pharmacy_name.includes(search));
    setPharmacyArraySearch(arr)
    }else {
      setPharmacyArraySearch(pharmacyArray)
      //
      // setPharmacyArraySearch([])
      //
    }
};

  useEffect(() => {
    getPharmacy()
    getCities()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={title || 'Client List'} />

      <View style={{width: '90%', alignSelf: 'center', marginTop: 15}}>
        <View style={styles.search}>
          <TextInput
            style={styles.searchinput}
            placeholder="Search"
            onChangeText={text => {
              updateSearch(text)
            }}
            value={search}
          />
          <TouchableOpacity
            onPress={() => {
              updateSearch('')
            }}
            style={{
              width: '15%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Feather
              name="x"
              color="#7189FF"
              size={27}
              style={{marginHorizontal: 2}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'space-between',
            marginBottom:10
          }}>
          <View style={style.container}>
            <Dropdown
              style={style.dropdown}
              placeholderStyle={style.placeholderStyle}
              selectedTextStyle={style.selectedTextStyle}
              inputSearchStyle={style.inputSearchStyle}
              iconStyle={style.iconStyle}
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
                getareas(item.value)
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

          <View style={style.container}>
            <Dropdown
              style={style.dropdown}
              placeholderStyle={style.placeholderStyle}
              selectedTextStyle={style.selectedTextStyle}
              inputSearchStyle={style.inputSearchStyle}
              iconStyle={style.iconStyle}
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
                afterSelectCityAndArea(item.value)
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
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <ClientpharmaTable data={pharmacyArraySearch.length > 0 ? pharmacyArraySearch : pharmacyArray} /> */}
        <ClientpharmaTable data={pharmacyArraySearch} />
      </ScrollView>

      <View style={style.rButton}>
              <TouchableOpacity
                onPress={() => {
                  setModal(true);
                }}>
                <AntDesign name="plus" size={30} color= {'#fff'} />
              </TouchableOpacity>
      </View>

      <AddNewPharmacyModel
        showM={modal}
        hideM={() => {
          setModal(false);
        }}
        submit={e => {
          (e !== null) ? submitAddPharmacy(e) : null
        }}
      />
      
      <SuccessfullyModel
        show={scModal}
        hide={() => {
          setScModal(false);
        }}
        message= {'The pharmacy has been added successfully.'}
      />

    </SafeAreaView>
  );
};

export default Clientpharmalist;

export const style = StyleSheet.create({
  filterContainer: {
    justifyContent: 'center',
    marginTop: 10,
    width: '50%',
  },
  calenderText: {
    fontSize: 16,
    color: 'rgba(37, 50, 116, 0.6)',
    marginHorizontal: 10,
  },
  container: {
    backgroundColor: 'white',
    width: '48%',
    marginTop: 15
  },
  rButton: {
    backgroundColor: '#7189FF', 
    height: 50, 
    width: 50, 
    justifyContent:'center', 
    alignItems:'center', 
    borderRadius: 25, 
    position: 'absolute',
    bottom: 70, 
    right: 50,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 15,
    shadowOffset: {
    height: 1,
    width: 1
    }
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
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
