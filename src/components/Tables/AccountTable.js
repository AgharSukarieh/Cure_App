import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

AntDesign.loadFont();
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const AccountTable = ({data}) => {

  
  return (
    <View style={styles.container}>
          <View style={styles.header}>
            <View style={{...styles.headerel, width: '25%'}}>
              <Text style={styles.headerel_tetx}>Pharmacy Amount</Text>
            </View>
            <View
              style={{width: 1, height: '100%', backgroundColor: '#7189FF'}}
            />
            <View style={{...styles.headerel, width: '25%'}}>
              <Text style={styles.headerel_tetx}>Last Payment</Text>
            </View>
            <View
              style={{width: 1, height: '100%', backgroundColor: '#7189FF'}}
            />
            <View style={{...styles.headerel, width: '25%'}}>
              <Text style={styles.headerel_tetx}>Payment Method</Text>
            </View>
            <View
              style={{width: 1, height: '100%', backgroundColor: '#7189FF'}}
            />
            <View style={{...styles.headerel, width: '25%'}}>
              <Text style={styles.headerel_tetx}>Limit</Text>
            </View>
          </View>

          <View
            style={{
              ...styles.row,
              backgroundColor:'#7189FF' ,
            }}>
            <View style={{...styles.rowel, width: '25%'}}>
              <Text
                style={{
                  ...styles.rowel_tetx,
                  color: '#fff',
                }}>
                {'-'}
              </Text>
            </View>
            <View
              style={{width: 1, height: '80%', backgroundColor: '#fff',marginVertical:3}}
            />
            <View style={{...styles.rowel, width: '25%'}}>
              <Text
                style={{
                  ...styles.rowel_tetx,
                  color:'#fff' ,
                }}>
                {'-'}
              </Text>
            </View>
            <View
              style={{width: 1, height: '80%', backgroundColor: '#fff',marginVertical:3}}
            />
            <View style={{...styles.rowel, width: '25%'}}>
              <Text
                style={{
                  ...styles.rowel_tetx,
                  color:'#fff',
                }}>
                {'-'}
              </Text>
            </View>
            <View
              style={{width: 1, height: '80%', backgroundColor: '#fff',marginVertical:3}}
            />
            <View style={{...styles.rowel, width: '25%'}}>
              <Text
                style={{
                  ...styles.rowel_tetx,
                  color:'#fff',
                }}>
                {'-'}
              </Text>
            </View>
          </View>
    </View>
  );
};

export default AccountTable;

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
    borderColor: '#7189FF',
    // borderWidth: 1,
    marginTop: 10,
    borderRadius: 7,
    paddingVertical: 7,
  },
  headerel: {
    width: '29%',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 0.6,
    paddingHorizontal: 1,
    borderColor: '#7189FF',
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
    borderWidth: 1,
    borderColor: '#7189FF',
    marginTop: 10,
    borderRadius: 7,
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
});
