import {View, Text} from 'react-native';
import React from 'react';
import {styles} from '../components/styles';
import TopView from '../components/TopView';

const ReportPage = () => {
  return (
    <View style={styles.container}>
      <TopView text={"Report Page"}/>
    </View>
  );
};

export default ReportPage;
