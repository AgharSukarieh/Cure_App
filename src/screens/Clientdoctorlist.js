import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {styles} from '../components/styles';
import GoBack from '../components/GoBack';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {areas, classification, pharams, Specialty} from '../helpers/data';
import ClientdoctorTable from '../components/Tables/ClientdoctorTable';
import Feather from 'react-native-vector-icons/Feather';
import {useEffect} from 'react';
import axios from 'axios';
import {
  GET_Areas,
  GET_CITY,
  GET_MED_CLIENT,
  GET_SPECIALTIES,
  GET_CLIENT_DOCTOR,
} from '../Provider/ApiRequest';
import {Dropdown} from 'react-native-element-dropdown';
import SelectDropdown from 'react-native-select-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SuccessfullyModel from '../components/Modals/SuccessfullyModel';
import AddNewDoctorModel from '../components/Modals/AddNewDoctorModel';

const wwidth = Dimensions.get('window').width;

const Clientdoctorlist = () => {
  const [userinfo, setuserinfo] = useState([]);
  const getlogs = async () => {
    const a = await AsyncStorage.getItem('userInfo');
    setuserinfo(JSON.parse(a));
  };
  useEffect(() => {
    getlogs();
  }, []);

  const [clientslist, setclientslist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [modal, setModal] = useState(false);
  const [scModal, setScModal] = useState(false);

  const submitAddDoctor = data => {
    console.log(data);
    // API ...
    setScModal(true);
  };

  const [citiesData, setCitiesData] = useState([]);
  const [areasData, setAreasData] = useState([]);
  const [specialtiesData, setspecialtiesData] = useState([]);

  const [cityValue, setCityValue] = useState(null);
  const [isCityFocus, setIsCityFocus] = useState(false);

  const [areaValue, setAreaValue] = useState(null);
  const [isAreaFocus, setIsAreaFocus] = useState(false);

  const [specialtiesValue, setSpecialtiesValue] = useState(null);
  const [isSpecialtiesFocus, setIsSpecialtiesFocus] = useState(false);

  const [search, setSearch] = useState('');
  const [doctorArraySearch, setDoctorArraySearch] = useState([]);
  let [page, setPage] = useState(1);

  const updateSearch = search => {
    setSearch(search);
    if (search !== '') {
      const arr = clientslist.filter(item => item.doc_name.includes(search));
      setDoctorArraySearch(arr);
    } else {
      // setDoctorArraySearch([])
      //
      setDoctorArraySearch(clientslist);
      //
    }
  };

  const updateSearchByArea = area => {
    if (area !== null) {
      const arr = clientslist.filter(item => item.area_code == area);
      setDoctorArraySearch(arr);
    } else {
      setDoctorArraySearch([]);
    }
  };

  const updateSearchBySpecialty = specialty => {
    if (specialty !== null) {
      const arr = clientslist.filter(item => item.speciality == specialty);
      console.log(arr);
      setDoctorArraySearch(arr);
    } else {
      setDoctorArraySearch([]);
    }
  };

  const getDoctor = () => {
    setIsLoading(true)
    axios({
      method: 'GET',
      url: `${GET_CLIENT_DOCTOR}?page=${page}`,
      params: {},
    })
      .then(response => {
        console.log('====================================');
        console.log(response.data.data.data);
        console.log('====================================');
        setclientslist(prevState => [...prevState, ...response.data.data.data]);
        //
        setDoctorArraySearch(prevState => [
          ...prevState,
          ...response.data.data.data,
        ]);
        setIsLoading(false);
        //
      })
      .catch(error => {
        console.log(error.response.data.message);
      });
  };

  const handleScroll = ({layoutMeasurement, contentOffset, contentSize}) => {
    const isScrolledToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isScrolledToBottom) {
      setPage(page + 1);
      getDoctor(page);
      setIsLoading(true);
    }
  };

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

  const getspecialties = () => {
    axios({
      method: 'POST',
      url: GET_SPECIALTIES,
    })
      .then(response => {
        var count = Object.keys(response.data).length;
        let pecialtiesArray = [];
        for (var i = 0; i < count; i++) {
          pecialtiesArray.push({
            value: response.data[i].sp_id,
            label: response.data[i].sp_name,
          });
        }
        setspecialtiesData(pecialtiesArray);
      })
      .catch(error => {
        console.log(
          '🚀 ~ file: Sales.js ~ line 26 ~ getdoctors ~ error',
          error,
        );
      });
  };

  useEffect(() => {
    getDoctor();
    getCities();
    getspecialties();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={'Doctor List'} />
      <View style={{width: '90%', alignSelf: 'center'}}>
        <View style={styles.search}>
          <TextInput
            style={styles.searchinput}
            placeholder="Search"
            onChangeText={text => {
              updateSearch(text);
            }}
            value={search}
          />
          <TouchableOpacity
            onPress={() => {
              updateSearch('');
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
            marginBottom: 10,
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
                updateSearchByArea(item.label);
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
        <View style={{...style.container, width: '100%'}}>
          <Dropdown
            style={style.dropdown}
            placeholderStyle={style.placeholderStyle}
            selectedTextStyle={style.selectedTextStyle}
            inputSearchStyle={style.inputSearchStyle}
            iconStyle={style.iconStyle}
            data={specialtiesData}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isSpecialtiesFocus ? 'Select Specialty' : '...'}
            searchPlaceholder="Search..."
            value={specialtiesValue}
            onFocus={() => setIsSpecialtiesFocus(true)}
            onBlur={() => setIsSpecialtiesFocus(false)}
            onChange={item => {
              setSpecialtiesValue(item.value);
              setIsSpecialtiesFocus(false);
              updateSearchBySpecialty(item.label);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color={isSpecialtiesFocus ? 'blue' : 'black'}
                name="Safety"
                size={20}
              />
            )}
          />
        </View>
      </View>

      <ScrollView
        onScroll={({nativeEvent}) => {
          handleScroll(nativeEvent);
        }}
        scrollEventThrottle={0}>
        {isLoading && (
          <View style={{alignItems: 'center', paddingVertical: 10}}>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        )}
        {/* <ClientdoctorTable data={doctorArraySearch.length > 0 ? doctorArraySearch : clientslist} /> */}
        <ClientdoctorTable data={doctorArraySearch} />
      </ScrollView>
      {isLoading && (
        <View style={{alignItems: 'center', paddingVertical: 10}}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      )}

      <View style={style.rButton}>
        <TouchableOpacity
          onPress={() => {
            setModal(true);
          }}>
          <AntDesign name="plus" size={30} color={'#fff'} />
        </TouchableOpacity>
      </View>

      <AddNewDoctorModel
        show={modal}
        hide={() => {
          setModal(false);
        }}
        submit={e => {
          e !== null ? submitAddDoctor(e) : null;
        }}
      />

      <SuccessfullyModel
        show={scModal}
        hide={() => {
          setScModal(false);
        }}
        message={'Doctor has been added successfully.'}
      />
    </SafeAreaView>
  );
};

export default Clientdoctorlist;

export const style = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '48%',
    marginTop: 15,
  },
  filterContainer: {
    justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 10,
    width: '50%',
  },
  calenderText: {
    fontSize: 16,
    color: 'rgba(37, 50, 116, 0.6)',
    marginHorizontal: 10,
  },
  rButton: {
    backgroundColor: '#7189FF',
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    position: 'absolute',
    bottom: 70,
    right: 50,
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 15,
    shadowOffset: {
      height: 1,
      width: 1,
    },
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
});
