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
import { GET_Areas, GET_CITY } from '../Provider/ApiRequest';
import axios from 'axios';

const wwidth = Dimensions.get('window').width;

const Clientpharmalist = () => {
//   const [areafilter, setarea] = useState('');
//   const [classfilter, setclassfilter] = useState('');
  //
  const [citiesData, setCitiesData] = useState([]);
  const [areasData, setAreasData] = useState([]);

  const [cityValue, setCityValue] = useState(null);
  const [isCityFocus, setIsCityFocus] = useState(false);

  const [areaValue, setAreaValue] = useState(null);
  const [isAreaFocus, setIsAreaFocus] = useState(false);

  const afterSelectCityAndArea = (area_id) => {
    console.log(cityValue, area_id);
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
  useEffect(() => {
    getCities()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={'Client List'} />

      <View style={{width: '90%', alignSelf: 'center', marginTop: 15}}>
        <View style={styles.search}>
          <TextInput
            style={styles.searchinput}
            placeholder="Search"
            onChangeText={text => {
              console.log(text);
            }}
          />
          <TouchableOpacity
            onPress={() => {}}
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
          {/* < View style={style.filterContainer}>
                        <Text style={style.calenderText}>Area</Text>
                        <SearchableDropdown
                            onItemSelect={(item) => { setarea(item) }}
                            containerStyle={{ padding: 5, width: '90%', height: 50 }}
                            itemStyle={{
                                padding: 10,
                                backgroundColor: '#fff',
                                borderColor: '#bbb',
                                borderWidth: 1,


                            }}
                            itemTextStyle={{ color: '#000', }}
                            itemsContainerStyle={{ maxHeight: 140, width: '100%' }}
                            items={areas}
                            resetValue={false}
                            textInputProps={
                                {
                                    placeholder: areafilter != '' ? areafilter.name : 'Select Area',
                                    underlineColorAndroid: "transparent",
                                    style: {
                                        padding: 12,
                                        borderWidth: 1,
                                        borderColor: areafilter != '' ? '#7189FF' : '#7189FF',
                                        borderRadius: 5,
                                    },
                                }
                            }
                        />
                    </View> */}
          {/* test */}
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
          {/* test */}

          {/* <View style={style.filterContainer}>
            <Text style={style.calenderText}>Classification</Text>
            <SearchableDropdown
              onItemSelect={item => {
                setclassfilter(item);
              }}
              onRemoveItem={(item, index) => {
                setclassfilter('');
              }}
              containerStyle={{padding: 5, width: '90%', height: 50}}
              itemStyle={{
                padding: 10,
                backgroundColor: '#fff',
                borderColor: '#bbb',
                borderWidth: 1,
              }}
              itemTextStyle={{color: '#000'}}
              itemsContainerStyle={{maxHeight: 140, width: '100%'}}
              items={classification}
              resetValue={false}
              textInputProps={{
                placeholder:
                  classfilter != '' ? classfilter.name : 'Select Specialty',
                underlineColorAndroid: 'transparent',
                style: {
                  padding: 12,
                  borderWidth: 1,
                  borderColor: classfilter != '' ? '#7189FF' : '#7189FF',
                  borderRadius: 5,
                },
              }}
            />
          </View> */}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ClientpharmaTable data={pharams} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Clientpharmalist;

export const style = StyleSheet.create({
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
  //
  container: {
    backgroundColor: 'white',
    width: '48%',
    marginTop: 15
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
