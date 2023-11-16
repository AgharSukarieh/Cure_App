import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';

const InventoryModel = ({show, hide, data}) => {

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      coverScreen={false}
      onSwipeComplete={() => setModalVisible2(false)}>
      <View style={styles.ModalContainer}>
        <View style={styles.ModalView}>
          <TouchableOpacity
            onPress={() => {
              hide();
            }}>
            <AntDesign
              name="close"
              color="#469ED8"
              size={35}
              style={{alignSelf: 'flex-end'}}
            />
          </TouchableOpacity>
          <ScrollView showsVerticalScrollIndicator={false}>
          {
          data && 
          <>
          <View style={styles.viewInfo}>
            <Text style={styles.titleInfo}>Name :  </Text>
            <Text style={styles.phname}>{data?.product?.name}</Text>
          </View>
          <View style={styles.viewInfo}>
            <Text style={styles.titleInfo}>Batch # :  </Text>
            <Text style={styles.phname}>{!data?.product?.batch_number ? '-' : data?.product?.batch_number}</Text>
          </View>
          <View style={styles.viewInfo}>
            <Text style={styles.titleInfo}>Barcode :  </Text>
            <Text style={styles.phname}>{!data?.product?.barcode ? '-' : data?.product?.barcode}</Text>
          </View>
          <View style={styles.viewInfo}>
            <Text style={styles.titleInfo}>Amount :  </Text>
            <Text style={styles.phname}>{ parseFloat(data?.units) + parseFloat(data?.bouns)}</Text>
          </View>
          <View style={styles.viewInfo}>
            <Text style={styles.titleInfo}>Expired Date :  </Text>
            <Text style={styles.phname}>{ moment(data?.product?.expiry_date).format('DD /MM/ YYYY')}</Text>
          </View>
          <View style={{ width: '99%', height: 0.5, backgroundColor: '#469ED8', alignSelf: 'center', marginTop: 20, borderRadius: 22 }} />
          </>
          }

          {/* { 
          lastOrder ? 
          <> 
          <View style={{marginTop: 10}}>
            <Text style={{fontSize: 22,color: 'black',textAlign:'center'}}>{moment(lastOrder?.created_at).startOf('day').fromNow()}</Text>
          </View>
          <View style={styles.viewInfo}>
            <Text style={styles.titleInfo}>Last Order :  </Text>
            <Text style={styles.phname}>{ moment(lastOrder?.created_at).format('DD/ MM/ Y')}</Text>
          </View>
          <View style={styles.viewInfo}>
            <Text style={styles.titleInfo}>Amount :  </Text>
            <Text style={styles.phname}>{lastOrder?.quantity}</Text>
          </View>
          <View style={styles.viewInfo}>
            <Text style={styles.titleInfo}>Bonus :  </Text>
            <Text style={styles.phname}>{lastOrder?.bouns}</Text>
          </View>
          <View style={styles.viewInfo}>
            <Text style={styles.titleInfo}>Expired Date :  </Text>
            <Text style={styles.phname}>{moment(lastOrder?.product_id?.expiry_date).format('DD/ MM/ Y')}</Text>
          </View>
          <View style={styles.viewInfo}>
            <Text style={styles.titleInfo}>Batch # :  </Text>
            <Text style={styles.phname}>{lastOrder?.batch_number}</Text>
          </View>
          </> : null
          } */}
          </ScrollView>  
        </View>
      </View>
    </Modal>
  );
};

export default InventoryModel;

const styles = StyleSheet.create({
  viewInfo:{
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  },
  titleInfo:{
    fontSize: 22,
    color: 'black',
    fontWeight: 'bold',
    width: '60%'
  },
  phname: {
    fontSize: 18,
    textTransform: 'capitalize',
    color: '#469ED8',
    justifyContent: 'center',
    width: '50%'
  },
  ValueContainer: {
    justifyContent:'flex-start'
  },

  ModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0707078c',
  },
  ModalView: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '95%',
    height: '70%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 20,
  },
  card: {
    shadowColor: '#469ED8',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    width: '99%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 15,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // paddingBottom: 10,
    // borderStyle: 'dashed',
    marginTop: 10,
    borderRadius: 7,
  },
 
  phlocation: {
    marginHorizontal: 15,
    marginVertical: 5,
    fontSize: 16,
  },
  item_name: {
    fontSize: 20,
    textTransform: 'capitalize',
    color: '#469ED8',
  },
  item_info: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  item_itemtitle: {
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  item_item: {},
});
