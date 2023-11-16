import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const CollectionHeaderTable = () => {
  return (
    <View style={styles.header}>
      <View style={{ ...styles.headerel, width: '30%' }}>
        <Text style={styles.headerel_tetx}>Pharmacy Name</Text>
      </View>
      <View style={styles.verticalline} />
      <View style={styles.headerel}>
        <Text style={styles.headerel_tetx}>Credit</Text>
      </View>
      <View style={styles.verticalline} />
      <View style={styles.headerel}>
        <Text style={styles.headerel_tetx}>Payment Count</Text>
      </View>
      <View style={styles.verticalline} />
      <View style={{ ...styles.headerel, width: '12%' }}>
        <Text style={styles.headerel_tetx}>Info</Text>
      </View>
    </View>
  );
};

export default CollectionHeaderTable;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderColor: '#000',
    marginTop: 10,
    paddingVertical: 7,
    borderBottomWidth: 1.5,
    borderStyle: 'dashed'
  },
  headerel: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 1,
    borderColor: '#469ED8',
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
    borderColor: '#000',
  }
})