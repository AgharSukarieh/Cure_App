import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import OrderModel from '../Modals/OrderModel';
import AddNewOfferModel from '../Modals/AddNewOfferModel';

AntDesign.loadFont();
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const OrderTable = ({data}) => {
  const [modal, setModal] = useState(false);
  const [offersModal, setOffersModal] = useState(false);
  const [rowdata, setrowdata] = useState('');
  const [item, setItem] = useState(null);

  const DDD = row => {
    setModal(true);
    setrowdata(row);
  };
  const submitBtn = (data) => {

  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{...styles.headerel, width: '30%'}}>
          <Text style={styles.headerel_tetx}>Items</Text>
        </View>
        <View style={{width: 1, height: '100%', backgroundColor: '#7189FF'}} />
        <View style={styles.headerel}>
          <Text style={styles.headerel_tetx}>Cost</Text>
        </View>
        <View style={{width: 1, height: '100%', backgroundColor: '#7189FF'}} />
        <View style={styles.headerel}>
          <Text style={styles.headerel_tetx}>Offers</Text>
        </View>
        <View style={{width: 1, height: '100%', backgroundColor: '#7189FF'}} />
        <View style={{...styles.headerel, width: '12%'}}>
          <Text style={styles.headerel_tetx}>Info</Text>
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
                {item.pharm_name}
              </Text>
            </View>
            <View style={styles.rowel}>
              {item?.items?.slice(0, 3).map((row, index2) => (
                <Text
                  key={index2}
                  style={{
                    ...styles.rowel_tetx,
                    color: index % 2 == 0 ? '#fff' : '#000',
                  }}>
                  {row.item_name}
                </Text>
              ))}
            </View>
            <View style={styles.rowel}>
              <TouchableOpacity
                style={{
                    ...styles.newbtn,
                    borderColor: index % 2 != 0 ? '#7189FF' : '#fff',
                  }}
                onPress={() => {
                setOffersModal(true);
                setItem(item)
                }}>
                <AntDesign name="plus" size={30} color= {index % 2 != 0 ? '#7189FF' : '#fff'} />
              </TouchableOpacity>
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
      <OrderModel
        show={modal}
        hide={() => {
          setModal(false);
        }}
        data={rowdata}
      />
      <AddNewOfferModel show={offersModal} hide={() => { setOffersModal(false) }} submit={(e) => { submitBtn(e) }} item={item}/>
    </View>
  );
};

export default OrderTable;

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
