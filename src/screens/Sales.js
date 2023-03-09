import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {styles} from '../components/styles';
import GoBack from '../components/GoBack';

const Sales = () => {
  const [filterValue, setFilterValue] = useState('Select');
  const [calenderFrom, setCalenderFrom] = useState(' - - - ');
  const [calenderTo, setCalenderTo] = useState(' - - - ');
  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={'Sales'} />

      <View style={styles.filterContainer}>
        <Text style={styles.calenderText}>Filter</Text>
        <TouchableOpacity style={styles.filterbutton}>
          <Text style={styles.filterbuttontext}>{filterValue}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calenderContainer}>
        <View style={styles.calenderSubContainer}>
          <Text style={styles.calenderText}>Calender From</Text>
          <TouchableOpacity style={styles.filterbutton}>
            <Text style={styles.filterbuttontext}>{calenderFrom}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.calenderSubContainer}>
          <Text style={styles.calenderText}>Calender To</Text>
          <TouchableOpacity style={styles.filterbutton}>
            <Text style={styles.filterbuttontext}>{calenderTo}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Sales;
