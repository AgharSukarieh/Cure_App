import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from '../components/styles';
import GoBack from '../components/GoBack';
import {salesdata} from '../helpers/data';
import DatePicker from 'react-native-date-picker';
import SalesTable from '../components/Tables/salesTable';
import axios from 'axios';
import {GET_Areas, GET_CITY} from '../Provider/ApiRequest';
import Feather from 'react-native-vector-icons/Feather';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SalesHeaderTable from '../components/Tables/SalesHeaderTable';
import TableView from '../General/TableView';
import SalesItemTable from '../components/Tables/SalesItemTable';
import { useAuth } from '../contexts/AuthContext';
Feather.loadFont();

const Sales = () => {
  const {role} = useAuth();

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

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [calenderFrom, setCalenderFrom] = useState('');

  const [open2, setOpen2] = useState(false);
  const [date2, setDate2] = useState(new Date());
  const [calenderTo, setCalenderTo] = useState('');

  const apiEndpoint = `users`;
  const params = {
    // sortBy: 'price',
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={'Sales'} />
      <View
        style={{
          width: '90%',
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
              afterSelectCityAndArea(item.value);
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
      <View
        style={{
          width: '90%',
          flexDirection: 'row',
          alignSelf: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
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

      <View style={style.tableContainer}>
        <SalesHeaderTable />
        <TableView 
          apiEndpoint={apiEndpoint} 
          params={params} 
          renderItem={({ item }) => <SalesItemTable item={item} />} 
        />
      </View>

      {/* <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <SalesTable data={salesdata} />
        </View>
      </ScrollView> */}
    </SafeAreaView>
  );
};

export default Sales;

export const style = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '48%',
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
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  tableContainer: {
    flex: 1,
    width: '98%',
    alignSelf: 'center',
  },
});
