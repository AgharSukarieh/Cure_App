import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const SalesHeaderTable = () => {
  return (
    <View style={styles.header}>
      <View style={{...styles.headerel, width: '30%'}}>
        <Text style={styles.headerel_tetx}>Name</Text>
      </View>
      <View style={{width: 1, height: '100%', backgroundColor: '#7189FF'}} />
      <View style={styles.headerel}>
        <Text style={styles.headerel_tetx}>Item</Text>
      </View>
      <View style={{width: 1, height: '100%', backgroundColor: '#7189FF'}} />
      <View style={styles.headerel}>
        <Text style={styles.headerel_tetx}>units</Text>
      </View>
      <View style={{width: 1, height: '100%', backgroundColor: '#7189FF'}} />
      <View style={{...styles.headerel, width: '12%'}}>
        <Text style={styles.headerel_tetx}>Info</Text>
      </View>
    </View>
  );
};

export default SalesHeaderTable;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        borderColor: '#7189FF',
        marginTop: 10,
        borderRadius: 7,
        paddingVertical: 7
    },
    headerel: {
        width: '29%',
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
})