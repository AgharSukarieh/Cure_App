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

const ReturnsAfterAddTable = ({data}) => {
  const [modal, setModal] = useState(false);
  const [offersModal, setOffersModal] = useState(false);
  const [rowdata, setrowdata] = useState('');
  const [item, setItem] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{...styles.headerel, width: '30%'}}>
          <Text style={styles.headerel_tetx}>Batch #</Text>
        </View>
        <View style={{width: 1, height: '100%', backgroundColor: '#7189FF'}} />
        <View style={styles.headerel}>
          <Text style={styles.headerel_tetx}>Expired Date</Text>
        </View>
        <View style={{width: 1, height: '100%', backgroundColor: '#7189FF'}} />
        <View style={styles.headerel}>
          <Text style={styles.headerel_tetx}>Amount</Text>
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
            <View style={{...styles.rowel, width: '30.1%'}}>
              <Text
                style={{
                  ...styles.rowel_tetx,
                  color: index % 2 == 0 ? '#fff' : '#000',
                }}>
                {item?.batch_number}
              </Text>
            </View>
            <View style={styles.rowel}>
                <Text
                  style={{
                    ...styles.rowel_tetx,
                    color: index % 2 == 0 ? '#fff' : '#000',
                  }}>
                  {item?.expired_date}
                </Text>
            </View>
            <View style={styles.rowel}>
                <Text
                  style={{
                    ...styles.rowel_tetx,
                    color: index % 2 == 0 ? '#fff' : '#000',
                  }}>
                  {item?.amount}
                </Text>
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
          <Text style={{textTransform: 'capitalize', fontSize: 25}}>
            no available data
          </Text>
        </View>
      )}
    </View>
  );
};

export default ReturnsAfterAddTable;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    marginTop: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius:10,
    paddingHorizontal: 4,
    paddingBottom:4
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
