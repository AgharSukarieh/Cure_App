import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ReturnModel from '../Modals/ReturnModel';
import moment from 'moment';

AntDesign.loadFont();

const ReturnsTable = ({data}) => {
  const [modal, setModal] = useState(false);
  const [rowdata, setrowdata] = useState('');

  const DDD = row => {
    setModal(true);
    setrowdata(row);
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>

        <View style={{...styles.headerel, width: '15%'}}>
          <Text style={styles.headerel_tetx}>Order</Text>
        </View>

        <View style={{width: 1, height: '100%', backgroundColor: '#7189FF'}} />

        <View style={{...styles.headerel, width: '25%'}}>
          <Text style={styles.headerel_tetx}>Total Price</Text>
        </View>

        <View style={{width: 1, height: '100%', backgroundColor: '#7189FF'}} />

        <View style={{...styles.headerel, width: '12%'}}>
          <Text style={styles.headerel_tetx}>Date</Text>
        </View>

        <View style={{width: 1, height: '100%', backgroundColor: '#7189FF'}} />

        <View style={{...styles.headerel, width: '12%'}}>
          <Text style={styles.headerel_tetx}>View</Text>
        </View>

      </View>

      {data ? (
        data.map((item, index) => (
          <View
            style={{
              ...styles.row,
              backgroundColor: index % 2 == 0 ? '#7189FF' : '#fff',
            }}
            key={index}>

            <View style={{...styles.rowel, width: '20%'}}>
              <Text
                style={{
                  ...styles.rowel_tetx,
                  color: index % 2 == 0 ? '#fff' : '#000',
                }}>
                {index + 1}
              </Text>
            </View>

            <View style={{...styles.rowel, width: '30.1%'}}>
              <Text
                style={{
                  ...styles.rowel_tetx,
                  color: index % 2 == 0 ? '#fff' : '#000',
                }}>
                {item?.total_price}
              </Text>
            </View>

            <View style={{...styles.rowel, width: '30.1%'}}>
              <Text
                style={{
                  ...styles.rowel_tetx,
                  color: index % 2 == 0 ? '#fff' : '#000',
                }}>
                {moment(item?.created_at).format('YYYY-MM-DD') }
              </Text>
            </View> 

            <View style={{...styles.rowel, width: '12%'}}>
              <TouchableOpacity
                onPress={() => {
                  DDD(item);
                }}>
                <AntDesign name="infocirlceo" color="gold" size={17} />
              </TouchableOpacity>
            </View>

          </View>
        ))
      ) : null }
      <ReturnModel
        show={modal}
        hide={() => {
          setModal(false);
        }}
        data={rowdata}
      />
    </View>
  );
};

export default ReturnsTable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '98%',
    alignSelf: 'center',
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
    width:40,
    paddingHorizontal: 4,
    borderColor:  'white',
    borderRadius: 7,
    borderWidth: 2,
    justifyContent: 'center',
},
});
