import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import { styles } from '../components/styles';
  import GoBack from '../components/GoBack';
  import DatePicker from 'react-native-date-picker';
  import Feather from 'react-native-vector-icons/Feather';
  import { Dropdown } from 'react-native-element-dropdown';
  import AntDesign from 'react-native-vector-icons/AntDesign';
  import TableView from '../General/TableView';
  import Constants from '../config/globalConstants';
  import { get } from '../WebService/RequestBuilder';
  import { useAuth } from '../contexts/AuthContext';
  import FrequencyVisitHeaderTable from '../components/Tables/FrequencyVisitHeaderTable';
  import FrequencyVisitItemTable from '../components/Tables/FrequencyVisitItemTable';
  Feather.loadFont();
  
  const FrequencyReport = ({ navigation }) => {
    const getFrequencyReportEndpoint = Constants.medical.frequncy_visits
    const { user } = useAuth();
    const user_id = user.id
    const getCityAreaEndpoint = Constants.users.cityArea;
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
  
    const [citiesData, setCitiesData] = useState([]);
    const [cityValue, setCityValue] = useState(null);
    const [areasData, setAreasData] = useState([]);
    const [areaValue, setAreaValue] = useState(null);
    const [filter, setFilter] = useState({ sale_id: user_id });
  
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [calenderFrom, setCalenderFrom] = useState('');
  
    const [open2, setOpen2] = useState(false);
    const [date2, setDate2] = useState(new Date());
    const [calenderTo, setCalenderTo] = useState('');
  
    const getCities = () => {
      var count = Object.keys(cityArea.cities).length
      let cityArray = []
      for (var i = 0; i < count; i++) {
        cityArray.push({
          value: cityArea.cities[i].id,
          label: cityArea.cities[i].name
        })
      }
      setCitiesData(cityArray)
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
  
    return (
      <SafeAreaView style={{ ...styles.container, backgroundColor: '#ebebeb96' }}>
        <GoBack text={'Frequency Visit'} />
        <View
          style={{
            width: '90%',
            // flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <View style={{ ...style.container, backgroundColor: 'white', width: '100%' }}>
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
                  cityId: item.value
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
  
          <View style={{ ...style.container, backgroundColor: 'white', width: '100%' }}>
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
                  areaId: item.value
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
  
        <View style={{ width: '90%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', marginBottom: 6, }}>
          <View style={{ ...style.container, marginTop: 0 }}>
            <Text style={{ ...styles.calenderText, marginBottom: 5 }}>From</Text>
            <TouchableOpacity
              style={styles.filterbutton}
              onPress={() => {
                setOpen(true);
              }}>
              <Text style={styles.filterbuttontext}>
                {calenderFrom != '' ? calenderFrom : 'YYYY-MM-DD'}
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
                setFilter((prev) => ({
                  ...prev,
                  dateFrom: formattedDate
                }))
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </View>
  
          <View style={{ ...style.container, marginTop: 0 }}>
            <Text style={{ ...styles.calenderText, marginBottom: 5 }}>To</Text>
            <TouchableOpacity style={styles.filterbutton} onPress={() => { setOpen2(true); }}>
              <Text style={styles.filterbuttontext}>
                {calenderTo != '' ? calenderTo : 'YYYY-MM-DD'}
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
                setFilter((prev) => ({
                  ...prev,
                  dateTo: formattedDate
                }))
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </View>
  
        </View>
  
        <View style={style.tableContainer}>
          <FrequencyVisitHeaderTable />
          <TableView
            apiEndpoint={getFrequencyReportEndpoint}
            enablePullToRefresh
            params={filter}
            renderItem={({ item }) => <FrequencyVisitItemTable item={item} />}
          />
        </View>
  
      </SafeAreaView>
    );
  };
  
  export default FrequencyReport;
  
  export const style = StyleSheet.create({
    container: {
      width: '48%',
      marginTop: 15,
      borderRadius: 20,
    },
    dropdown: {
      height: 50,
      borderColor: '#A5BECC',
      borderWidth: 1,
      borderRadius: 15,
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
  