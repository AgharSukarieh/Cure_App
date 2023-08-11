import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const DoctorsHeaderTable = () => {
  return (
    <View style={styles.header}>
      <View style={{ ...styles.headerel, width: '38%' }}>
        <Text style={styles.headerel_tetx}>name</Text>
      </View>
      <View style={styles.verticalline} />
      <View style={{ ...styles.headerel, width: '24%' }}>
        <Text style={styles.headerel_tetx}>Specialty</Text>
      </View>
      <View style={styles.verticalline} />
      <View style={{ ...styles.headerel, width: '38%' }}>
        <Text style={styles.headerel_tetx}>Area</Text>
      </View>
    </View>
  );
};

export default DoctorsHeaderTable;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '98%',
    alignSelf: 'center',
    borderColor: '#7189FF',
    marginTop: 10,
    paddingVertical: 7,
    borderColor: '#000',
    borderBottomWidth: 1.5,
    borderStyle: 'dashed'
  },
  headerel: {
    width: '33%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 1,
    borderColor: '#7189FF',
  },
  headerel_tetx: {
    textAlign: 'center',
    fontSize: 17,
    textTransform: 'capitalize',
    color: '#000'
  },

  verticalline: {
    width: 1,
    height: '100%',
    borderWidth: 1,
    alignSelf: 'center',
    borderStyle: 'dashed',
    borderColor: '#000'
  }
});
