import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const PharmacyHeaderTable = () => {
  return (
    <View style={styles.header}>
      <View style={styles.headerel}>
        <Text style={styles.headerel_tetx}>name</Text>
      </View>
      <View style={styles.verticalline} />
      <View style={styles.headerel}>
        <Text style={styles.headerel_tetx}>location</Text>
      </View>
      <View style={styles.verticalline} />
      <View style={{ ...styles.headerel }}>
        <Text style={styles.headerel_tetx}>class</Text>
      </View>
    </View>
  );
};

export default PharmacyHeaderTable;
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '98%',
    alignSelf: 'center',
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
    borderColor: '#469ED8',
  },
  headerel_tetx: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: '#000',
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
