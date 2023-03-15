import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../components/styles';
import GoBack from '../components/GoBack';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { areas, salesdata } from '../helpers/data';
import DatePicker from 'react-native-date-picker'
import SalesTable from '../components/salesTable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const Sales = () => {

  const [filterValue, setFilterValue] = useState('');

  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(new Date())
  const [calenderFrom, setCalenderFrom] = useState('');

  const [open2, setOpen2] = useState(false)
  const [date2, setDate2] = useState(new Date())
  const [calenderTo, setCalenderTo] = useState('');

  return (
    <SafeAreaView style={styles.container}>

      {/* <KeyboardAwareScrollView> */}
      <GoBack text={'Sales'} />

      <View style={styles.filterContainer}>
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
      </View>

      <View style={styles.calenderContainer}>
        <View style={styles.calenderSubContainer}>
          <Text style={{ ...styles.calenderText, marginBottom: 5 }}>From</Text>
          <TouchableOpacity style={styles.filterbutton} onPress={() => { setOpen(true) }}>
            <Text style={styles.filterbuttontext}>{calenderFrom != '' ? calenderFrom : '-- -- -- -- --'}</Text>
          </TouchableOpacity>
          <DatePicker
            modal
            mode="date"
            format="YYYY-MM-DD"
            open={open}
            date={date}
            onConfirm={(data) => {
              setOpen(false)
              setDate(data)
              const formattedDate = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate()
              setCalenderFrom(formattedDate)
            }}

            onCancel={() => {
              setOpen(false)
            }}
          />
        </View>

        <View style={styles.calenderSubContainer}>
          <Text style={{ ...styles.calenderText, marginBottom: 5 }}>To</Text>
          <TouchableOpacity style={styles.filterbutton} onPress={() => { setOpen2(true) }}>
            <Text style={styles.filterbuttontext}>{calenderTo != '' ? calenderTo : '-- -- -- -- --'}</Text>
          </TouchableOpacity>
          <DatePicker
            modal
            mode="date"
            format="YYYY-MM-DD"
            open={open2}
            date={date2}
            minimumDate={date}
            onConfirm={(data) => {
              setOpen2(false)
              setDate2(data)
              const formattedDate = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate()
              setCalenderTo(formattedDate)
            }}

            onCancel={() => {
              setOpen(false)
            }}
          />
        </View>

      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginVertical: 30 }}>
          <SalesTable data={salesdata} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Sales;
