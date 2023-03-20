import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../../components/styles';
import TopView from '../../components/TopView';
import { useNavigation } from '@react-navigation/native';

// doctor id is 1 and pharma 2
const keyid = 1

const ReportPageSales = () => {
  const [name, setName] = useState('Mahammed Farhan');
  const date = new Date().toLocaleDateString();

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TopView text={'Report Page'} />

        <View style={styles.nameDateContainer}>
          <Text style={styles.leftText}>{name}</Text>
          <Text style={styles.rightText}>{date}</Text>
        </View>
        <View style={styles.nameDateContainer}>
          <Text style={styles.leftText}>Location : Jabale AlWeibdeh</Text>
        </View>
        <View style={styles.nameDateContainer}>
          <Text style={styles.leftText}>supervisor : Waleed</Text>
        </View>

        <View style={styles.reportPageContainer}>
          <TouchableOpacity style={styles.reportPageButton} onPress={() => navigation.navigate('')}>
            <Text style={styles.reportPageText}>Sales</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportPageButton} onPress={() => navigation.navigate('Monthly')}>
            <Text style={styles.reportPageText}>Monthly Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportPageButton} onPress={() => { keyid == 1 ? navigation.navigate('Clientdoctorlist') : navigation.navigate('Clientpharmalist') }}>
            <Text style={styles.reportPageText}>Client List</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportPageButton} onPress={() => { navigation.navigate('Daily', { title: "Test", date: "20-11-2020" }) }}>
            <Text style={styles.reportPageText}>Test</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportPageButton} onPress={() => { }}>
            <Text style={styles.reportPageText}>Test</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportPageButton} onPress={() => { }}>
            <Text style={styles.reportPageText}>Test</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.reportPageButton} onPress={() => { }}>
            <Text style={styles.reportPageText}>Test</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportPageSales;
