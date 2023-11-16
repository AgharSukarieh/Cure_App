import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
AntDesign.loadFont();

const AccountTable = ({item}) => {
  
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View style={{ ...styles.headerel, width: '25%' }}>
          <Text style={styles.headerel_tetx}>Pharmacy Amount</Text>
        </View>
        <View style={styles.varLine} />
        <View style={{ ...styles.headerel, width: '25%' }}>
          <Text style={styles.headerel_tetx}>Last Payment</Text>
        </View>
        <View style={styles.varLine} />
        <View style={{ ...styles.headerel, width: '25%' }}>
          <Text style={styles.headerel_tetx}>Payment Method</Text>
        </View>
        <View style={styles.varLine} />
        <View style={{ ...styles.headerel, width: '25%' }}>
          <Text style={styles.headerel_tetx}>Limit</Text>
        </View>
      </View>

      <View style={styles.row}>
            <View style={{ ...styles.rowel, width: '25%' }}>
            <Text style={styles.rowel_tetx}>{item?.amount}</Text>
            </View>
            <View style={styles.varLine} />
            <View style={{ ...styles.rowel, width: '25%' }}>
            {item?.created_at && <Text style={{...styles.rowel_tetx, fontSize:13}}>{new Intl.DateTimeFormat("en-US", { year: "numeric", month: "numeric", day: "numeric" }).format(new Date(item?.created_at))}</Text>}
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

    </View>
      
  );
};

export default AccountTable;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: '95%',
    // height:200,
    alignSelf: 'center',
    marginTop: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 4,
    // paddingBottom: 4,
    marginBottom:10
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
    // borderBottomWidth: 1,
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
