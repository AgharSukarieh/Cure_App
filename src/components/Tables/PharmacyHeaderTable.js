import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const PharmacyHeaderTable = () => {
  return (
    <View style={styles.header}>
      <View style={styles.headerel}>
        <Text style={styles.headerel_tetx}>name</Text>
      </View>
      <View style={{width: 1, height: '100%', backgroundColor: '#7189FF'}} />
      <View style={styles.headerel}>
        <Text style={styles.headerel_tetx}>location</Text>
      </View>
      <View style={{width: 1, height: '100%', backgroundColor: '#7189FF'}} />
      <View style={{...styles.headerel}}>
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
    borderColor: '#7189FF',
    borderBottomWidth: 1,
    marginTop: 10,
    paddingVertical: 7,
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
    color: '#000',
  },
});
