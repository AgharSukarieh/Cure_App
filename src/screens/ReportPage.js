import {View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import {styles} from '../components/styles';
import TopView from '../components/TopView';
import {useNavigation} from '@react-navigation/native';

const ReportPage = () => {
  const [name, setName] = useState('Mahammed Farhan');
  const date = new Date().toLocaleDateString();

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <TopView text={'Report Page'} />

      <View style={styles.nameDateContainer}>
        <Text style={styles.leftText}>{name}</Text>
        <Text style={styles.rightText}>{date}</Text>
      </View>
      <View style={styles.nameDateContainer}>
        <Text style={styles.leftText}>Jabale AlWeibdeh</Text>
      </View>
      <View style={styles.nameDateContainer}>
        <Text style={styles.leftText}>supervisor Waleed</Text>
      </View>

      <View style={styles.reportPageContainer}>
        <View style={styles.reportPageRow}>
          <TouchableOpacity
            style={styles.reportPageButton}
            onPress={() => navigation.navigate('Sales')}>
            <Text style={styles.reportPageText}>Sales</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportPageButton}>
            <Text style={styles.reportPageText}>Monthly Plan</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.reportPageButton}>
          <Text style={styles.reportPageText}>Client List</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ReportPage;
