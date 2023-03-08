import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {styles} from '../components/styles';
import TopView from '../components/TopView';

const ReportPage = () => {
  return (
    <View style={styles.container}>
      <TopView text={'Report Page'} />

      <View style={styles.reportPageContainer}>
        <View style={styles.reportPageRow}>
          <TouchableOpacity style={styles.reportPageButton}>
            <Text>Button 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportPageButton}>
            <Text>Button 2</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.reportPageButton}>
          <Text>Button 3</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReportPage;
