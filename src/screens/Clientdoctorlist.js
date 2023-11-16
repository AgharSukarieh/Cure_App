import {
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { styles } from '../components/styles';
import GoBack from '../components/GoBack';
import Feather from 'react-native-vector-icons/Feather';
import { useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SuccessfullyModel from '../components/Modals/SuccessfullyModel';
import AddNewDoctorModel from '../components/Modals/AddNewDoctorModel';
import DoctorsHeaderTable from '../components/Tables/DoctorsHeaderTable';
import TableView from '../General/TableView';
import Constants from '../config/globalConstants';
import DoctorsItemTable from '../components/Tables/DoctorsItemTable';
import { useAuth } from '../contexts/AuthContext';
import { get } from '../WebService/RequestBuilder';
import globalConstants from '../config/globalConstants';
import EditDoctorprofle from '../components/Modals/EditDoctorprofle';
const getDoctorsEndpoint = Constants.doctor.allDoctors;

const Clientdoctorlist = ({ navigation, route, header = true }) => {
  // const cityArea = route?.params?.cityArea
  // const specialty = route?.params?.specialty

  const { user } = useAuth();
  const getCityAreaEndpoint = globalConstants.users.cityArea;


  const [cityArea, setCityArea] = useState(null);
  useEffect(() => {
    get(`${getCityAreaEndpoint}${user?.id}`)
      .then(response => {
        setCityArea(response.data);
      })
      .catch(err => {
        console.error(err);
      })
  }, []);

  const [specialty, setspecialityarray] = useState([]);
  useEffect(() => {
    get(Constants.doctor.speciality)
      .then(response => {
        setspecialityarray(response.speciality);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => { });
  }, [])


  const [modal, setModal] = useState(false);
  const [scModal, setScModal] = useState(false);

  const [search, setSearch] = useState(null);

  const [citiesData, setCitiesData] = useState([]);
  const [cityValue, setCityValue] = useState(null);

  const [areasData, setAreasData] = useState([]);
  const [areaValue, setAreaValue] = useState(null);

  const [specialtyData, setSpecialtyData] = useState([]);
  const [specialtyValue, setSpecialtyValue] = useState(null);

  const [filter, setFilter] = useState({ user_id: user?.id });

  const getCities = () => {
    var count = Object.keys(cityArea?.cities).length
    let cityArray = []
    for (var i = 0; i < count; i++) {
      cityArray.push({
        value: cityArea.cities[i].id,
        label: cityArea.cities[i].name
      })
    }

    var count = Object.keys(specialty).length
    let specialtyArray = []
    for (var i = 0; i < count; i++) {
      specialtyArray.push({
        value: specialty[i].id,
        label: specialty[i].name
      })
    }
    setCitiesData(cityArray)
    setSpecialtyData(specialtyArray)
  }

  const getAreas = (id) => {
    let areaArray = [];
    cityArea?.areas?.forEach((area) => {
      if (area.city_id == id) {
        areaArray.push({
          value: area.id,
          label: area.name
        });
      }
    });
    setAreasData(areaArray);
  }
  
  useEffect(() => {
    if (cityArea) getCities()
  }, [cityArea])

  const submitAddDoctor = data => {
    if (data == true) {
      setScModal(true);
      setFilter({ user_id: user?.id })
    }
  };

  return (
    <SafeAreaView style={styles.container}>
         {header == true ? < GoBack text={'Client List'} /> : ''}
      <View style={{ width: '90%', alignSelf: 'center', marginTop: 15 }}>

        <View style={styles.search}>
          <TextInput
            style={styles.searchinput}
            placeholder="Search"
            onChangeText={text => {
              setSearch(text)
              setFilter((prev) => ({
                ...prev,
                seach_term: text
              }))
            }}
            value={search}
          />
          <TouchableOpacity
            onPress={() => {
              setSearch(null)
              setFilter(null)
              setCityValue(null);
              setAreaValue(null);
              setSpecialtyValue(null);
            }}
            style={{
              width: '15%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Feather
              name="x"
              color="#000"
              size={27}
              style={{ marginHorizontal: 2 }}
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
              placeholder={!cityValue ? 'Select City' : '...'}
              searchPlaceholder="Search..."
              value={cityValue}
              onBlur={() => { }}
              onChange={item => {
                setCityValue(item.value);
                getAreas(item.value);
                setFilter((prev) => ({
                  ...prev,
                  seach_term: item.label
                }))
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
              placeholder={!areaValue ? 'Select Area' : '...'}
              searchPlaceholder="Search..."
              value={areaValue}
              onBlur={() => { }}
              onChange={item => {
                setAreaValue(item.value);
                setFilter((prev) => ({
                  ...prev,
                  seach_term: item.label
                }))
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
        </View>

        <View style={{ ...style.container, width: '100%' }}>
          <Dropdown
            style={style.dropdown}
            placeholderStyle={style.placeholderStyle}
            selectedTextStyle={style.selectedTextStyle}
            inputSearchStyle={style.inputSearchStyle}
            iconStyle={style.iconStyle}
            data={specialtyData}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!specialtyValue ? 'Select Specialty' : '...'}
            searchPlaceholder="Search..."
            value={specialtyValue}
            onBlur={() => { }}
            onChange={item => {
              setSpecialtyValue(item.value);
              setFilter((prev) => ({
                ...prev,
                seach_term: item.label
              }))
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

      </View>

      <View style={style.containerTable}>
        <DoctorsHeaderTable />
        <TableView
          apiEndpoint={getDoctorsEndpoint}
          enablePullToRefresh
          params={filter}
          renderItem={({ item }) => <DoctorsItemTable item={item} cityArea={cityArea} />}
        />
      </View>

      <View style={style.rButton}>
        <TouchableOpacity
          onPress={() => {
            setModal(true);
          }}>
          <AntDesign name="plus" size={30} color={'#fff'} />
        </TouchableOpacity>
      </View>
      {cityArea && <AddNewDoctorModel
        show={modal}
        cityArea={cityArea}
        hide={() => {
          setModal(false);
        }}
        submit={e => {
          e !== null ? submitAddDoctor(e) : null;
        }}
      />}

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
    marginTop: 10,
    width: '50%',
  },
  calenderText: {
    fontSize: 16,
    color: 'rgba(37, 50, 116, 0.6)',
    marginHorizontal: 10,
  },
  containerTable: {
    flex: 1,
    width: '98%',
    alignSelf: 'center',
  },
  rButton: {
    backgroundColor: '#469ED8',
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
    borderColor: '#617C9D',
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
