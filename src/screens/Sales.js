import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from '../components/styles';
import GoBack from '../components/GoBack';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {salesdata} from '../helpers/data';
import DatePicker from 'react-native-date-picker';
import SalesTable from '../components/Tables/salesTable';
import SelectDropdown from 'react-native-select-dropdown';
import axios from 'axios';
import {GET_Areas, GET_CITY} from '../Provider/ApiRequest';
import Feather from 'react-native-vector-icons/Feather';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
Feather.loadFont();

const Sales = () => {
  //
  const [citiesData, setCitiesData] = useState([]);
  const [areasData, setAreasData] = useState([]);

  const [cityValue, setCityValue] = useState(null);
  const [isCityFocus, setIsCityFocus] = useState(false);

  const [areaValue, setAreaValue] = useState(null);
  const [isAreaFocus, setIsAreaFocus] = useState(false);

  const afterSelectCityAndArea = area_id => {
    console.log(cityValue, area_id);
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
  useEffect(() => {
    getCities();
  }, []);
  //

  // const [citylist, setcitylist] = useState([])
  // const [selectedcity, setselectedcity] = useState('');
  // const [arealist, setarealist] = useState([])
  // const [selectedarea, setselectedarea] = useState()

  // const getdoctors = () => {
  //   axios({
  //     method: "POST",
  //     url: GET_CITY,
  //   }).then((response) => {
  //     // console.log(response);
  //     setcitylist(response.data)
  //   }).catch((error) => { console.log("🚀 ~ file: Sales.js ~ line 26 ~ getdoctors ~ error", error) })
  // }

  // const getarea = () => {
  //   let data = {
  //     city_id: selectedcity
  //   }
  //   axios({
  //     method: "POST",
  //     url: GET_Areas,
  //     data: data
  //   }).then((response) => {
  //     // console.log(response.data);
  //     setarealist(response.data)
  //   }).catch((error) => { console.log("🚀 ~ file: Sales.js ~ line 39 ~ getarea ~ error", error) })
  // }

  // useEffect(() => {
  //   getdoctors()
  //   getarea()
  // }, [selectedcity])

  // //////////////////////////////////////////////////////////
  // //////////////////////////////////////////////////////////
  // //////////////////////////////////////////////////////////

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [calenderFrom, setCalenderFrom] = useState('');

  const [open2, setOpen2] = useState(false);
  const [date2, setDate2] = useState(new Date());
  const [calenderTo, setCalenderTo] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      {/* <KeyboardAwareScrollView> */}
      <GoBack text={'Sales'} />

      {/* <View style={styles.filterContainer}>
        <Text style={styles.calenderText}>Filter</Text>
        <SearchableDropdown
          onItemSelect={(item) => { setFilterValue(item) }}
          onRemoveItem={(item, index) => {
            setFilterValue('')
          }}
          containerStyle={{ padding: 5, width: '90%', }}
          itemStyle={{
            padding: 10,
            backgroundColor: '#fff',
            borderColor: '#bbb',
            borderWidth: 1,

          }}
          itemTextStyle={{ color: '#000' }}
          itemsContainerStyle={{ maxHeight: 140, width: '100%', }}
          items={areas}
          resetValue={false}
          textInputProps={
            {
              placeholder: filterValue != '' ? filterValue.name : 'Select Area',
              underlineColorAndroid: "transparent",
              style: {
                padding: 12,
                borderWidth: 1,
                borderColor: filterValue != '' ? '#7189FF' : '#7189FF',
                borderRadius: 5,
              },
            }
          }
        />
      </View> */}

      {/* test */}
      <View
          style={{
            width: '90%',
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
      {/* test */}

      {/* <View style={styles.calenderContainer}>
        <View style={styles.calenderSubContainer}>
          <Text style={{ ...styles.calenderText, marginBottom: 5 }}>City</Text>
          <SelectDropdown
            buttonStyle={{ ...styles.drop, flexDirection: 'row' }}
            buttonTextStyle={{ color: "#000", fontSize: 15, fontWeight: '600', marginTop: 0 }}
            defaultButtonText='Select'
            data={citylist}
            onSelect={(selectedItem, index) => {
              setselectedcity(selectedItem.city_id)
            }}
            rowTextForSelection={(item, index) => {
              return (
                <>
                  <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                    {item.city_name}
                  </Text>
                </>
              );
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return (
                <>
                  <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                    {selectedItem.city_name}
                  </Text>
                </>
              );
            }}
            renderDropdownIcon={isOpened => {
              return <Feather name={isOpened ? 'chevron-up' : 'chevron-down'} color="#000" size={13} style={{ marginLeft: 0 }} />;
            }}
            dropdownStyle={{ backgroundColor: '#fff', borderRadius: 10 }}
          />
        </View>

        <View style={styles.calenderSubContainer}>
          <Text style={{ ...styles.calenderText, marginBottom: 5 }}>Area</Text>
          <SelectDropdown
            disabled={selectedcity ? false : true}
            buttonStyle={{ ...styles.drop, flexDirection: 'row' }}
            buttonTextStyle={{ color: "#000", fontSize: 15, fontWeight: '600', marginTop: 0 }}
            defaultButtonText='Select'
            data={arealist}
            onSelect={(selectedItem, index) => {
              setselectedarea(selectedItem.city_id)
            }}
            rowTextForSelection={(item, index) => {
              return (
                <>
                  <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                    {item.area_name}
                  </Text>
                </>
              );
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return (
                <>
                  <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                    {selectedItem.area_name}
                  </Text>
                </>
              );
            }}
            renderDropdownIcon={isOpened => {
              return <Feather name={isOpened ? 'chevron-up' : 'chevron-down'} color="#000" size={13} style={{ marginLeft: 0 }} />;
            }}
            dropdownStyle={{ backgroundColor: '#fff', borderRadius: 10 }}
          />
        </View>

      </View> */}

      <View style={{
            width: '90%',
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'space-between',
            marginBottom:6,
          }}>
        <View style={{...style.container, marginTop: 0}}>
          <Text style={{...styles.calenderText, marginBottom: 5}}>From</Text>
          <TouchableOpacity
            style={styles.filterbutton}
            onPress={() => {
              setOpen(true);
            }}>
            <Text style={styles.filterbuttontext}>
              {calenderFrom != '' ? calenderFrom : '-- -- -- -- --'}
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
              setCalenderFrom(formattedDate);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </View>

        <View style={{...style.container, marginTop: 0}}>
          <Text style={{...styles.calenderText, marginBottom: 5}}>To</Text>
          <TouchableOpacity
            style={styles.filterbutton}
            onPress={() => {
              setOpen2(true);
            }}>
            <Text style={styles.filterbuttontext}>
              {calenderTo != '' ? calenderTo : '-- -- -- -- --'}
            </Text>
          </TouchableOpacity>
          <DatePicker
            modal
            mode="date"
            format="YYYY-MM-DD"
            open={open2}
            date={date2}
            minimumDate={date}
            onConfirm={data => {
              setOpen2(false);
              setDate2(data);
              const formattedDate =
                data.getFullYear() +
                '-' +
                (data.getMonth() + 1) +
                '-' +
                data.getDate();
              setCalenderTo(formattedDate);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View >
          <SalesTable data={salesdata} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Sales;
export const style = StyleSheet.create({
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