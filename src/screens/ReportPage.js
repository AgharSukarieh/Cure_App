import {View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import React from 'react';
import {styles} from '../components/styles';
import TopView from '../components/TopView';

const ReportPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TopView text={'Report Page'} />

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
