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
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const OrdersAfterAddTable = ({ data }) => {

  const [modal, setModal] = useState(false);
  const [offersModal, setOffersModal] = useState(false);
  const [rowdata, setrowdata] = useState('');
  const [item, setItem] = useState(null);

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View style={{ ...styles.headerel, width: '30%' }}>
          <Text style={styles.headerel_tetx}>Items</Text>
        </View>
        <View style={styles.varLine} />
        <View style={styles.headerel}>
          <Text style={styles.headerel_tetx}>Amount</Text>
        </View>
        <View style={styles.varLine} />
        <View style={styles.headerel}>
          <Text style={styles.headerel_tetx}>Bouns</Text>
        </View>
      </View>

      {data ? (
        data.map((item, index) => (
          <View style={styles.row} key={index}>
            <View style={{ ...styles.rowel, width: '30.1%' }}>
              <Text style={styles.rowel_tetx}> {item?.product_name} </Text>
            </View>
            <View style={styles.varLine} />
            <View style={styles.rowel}>
              <Text style={styles.rowel_tetx}> {item?.units}  </Text>
            </View>
            <View style={styles.varLine} />
            <View style={styles.rowel}>
              <Text style={styles.rowel_tetx}>  {item?.bonus}  </Text>
            </View>
          </View>
        ))
      ) : (
        <View
          style={{
            width: '100%',
            height: 70,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
          }}>
          <Text style={{ textTransform: 'capitalize', fontSize: 25 }}>
            no available added
          </Text>
        </View>
      )}
    </View>
  );
};

export default OrdersAfterAddTable;

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
    paddingBottom: 4
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#000',
    marginTop: 10,
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
    borderBottomWidth: 1,
    marginTop: 10,
    borderStyle: 'dashed'
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
