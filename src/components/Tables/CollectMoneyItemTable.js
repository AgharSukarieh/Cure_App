import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const CollectMoneyItemTable = ({ item }) => {

    return (
        <View style={styles.row}>
            <View style={{ ...styles.rowel, width: '25%' }}>
            <Text style={styles.rowel_tetx}>{item?.amount}</Text>
            </View>
            <View style={styles.varLine} />
            <View style={{ ...styles.rowel, width: '25%' }}>
            <Text style={styles.rowel_tetx}>{item?.created_at}</Text>
            </View>
            <View style={styles.varLine} />
            <View style={{ ...styles.rowel, width: '25%' }}>
            <Text style={styles.rowel_tetx}>{item?.method}</Text>
            </View>
            <View style={styles.varLine} />
            <View style={{ ...styles.rowel, width: '25%' }}>
            <Text style={styles.rowel_tetx}>{item?.price_ceiling}</Text>
            </View>
        </View>
    )
}

export default CollectMoneyItemTable


const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      alignSelf: 'center',
      marginTop: 20,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 4,
      paddingBottom: 4,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      borderColor: '#000',
      borderBottomWidth: 1,
      marginTop: 10,
      borderStyle: 'dashed',
      paddingVertical: 7,
    },
    headerel: {
      width: '29%',
      justifyContent: 'center',
      alignItems: 'center',
      // borderWidth: 0.6,
      paddingHorizontal: 1,
      borderColor: '#469ED8',
    },
    headerel_tetx: {
      textAlign: 'center',
      fontSize: 17,
      textTransform: 'capitalize',
      color: '#000',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 10,
      borderBottomWidth: 1,
      borderStyle: 'dashed',
      marginBottom: 3
    },
    rowel: {
      width: '29%',
      justifyContent: 'center',
      alignItems: 'center',
      // borderWidth: 1,
      paddingVertical: 10,
      paddingHorizontal: 4,
    },
    rowel_tetx: {
      textAlign: 'center',
      fontSize: 15,
      textTransform: 'capitalize',
      color: '#000',
      height: 20,
    },
    rowel_tetx2: {
      textAlign: 'center',
      fontSize: 15,
      textTransform: 'capitalize',
      color: '#fff',
      height: 20,
    },
    newbtn: {
      width: 40,
      paddingHorizontal: 4,
      borderColor: 'white',
      borderRadius: 7,
      borderWidth: 2,
      justifyContent: 'center',
    },
    varLine: {
      width: 1,
      height: '100%',
      borderWidth: 1,
      borderStyle: 'dashed'
    }
  });