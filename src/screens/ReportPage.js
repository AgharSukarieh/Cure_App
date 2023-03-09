import {View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import {styles} from '../components/styles';
import TopView from '../components/TopView';

const ReportPage = () => {
  const [name, setName] = useState('Waleed');
  const date = new Date().toLocaleDateString();

  return (
    <SafeAreaView style={styles.container}>
      <TopView text={'Report Page'} />

      <View style={styles.nameDateContainer}>
        <Text style={styles.leftText}><Text style={styles.helloText}>Hello,</Text> {name}</Text>
        <Text style={styles.rightText}>{date}</Text>
      </View>

      <View style={styles.reportPageContainer}>
        <View style={styles.reportPageRow}>
          <TouchableOpacity style={styles.reportPageButton}>
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
