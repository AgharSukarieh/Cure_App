import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SAL_GET_LAST_ORDER } from '../../Provider/ApiRequest';
import axios from 'axios';
import moment from 'moment';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const InventoryModel = ({show, hide, data}) => {

  const [lastOrder, setLastOrder] = useState({});
  // const [lastOrder, setLastOrder] = useState({});

  const getLastOrder = () => {
    let params = {
      pharm_id: data.pharm_id.ph_id,
      product_id: data.item_id.pro_id,
    };
    axios({
      method: 'GET',
      url: SAL_GET_LAST_ORDER,
      params: params,
    })
      .then(response => {
        setLastOrder(response.data);
        // console.log("MM-MM",response.data);
      })
      .catch(error => {
        console.log(error);
      });
    }

  useEffect(() => {
    getLastOrder();
  }, []);

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
              color="#7189FF"
              size={35}
              style={{alignSelf: 'flex-end'}}
            />
          </TouchableOpacity>
          <ScrollView showsVerticalScrollIndicator={false}>
          {
          data && 
          <>
          <View style={styles.viewInfo}>
            <Text style={styles.titleInfo}>SKU Name :  </Text>
            <Text style={styles.phname}>{data.item_id.product_name}</Text>
          </View>
          <View style={styles.viewInfo}>
            <Text style={styles.titleInfo}>Batch # :  </Text>
            <Text style={styles.phname}>{!data.batch_number ? '-' : data.batch_number}</Text>
          </View>
          <View style={styles.viewInfo}>
            <Text style={styles.titleInfo}>Barcode :  </Text>
            <Text style={styles.phname}>{!data.item_id.barcode ? '-' : data.item_id.barcode}</Text>
          </View>
          <View style={styles.viewInfo}>
            <Text style={styles.titleInfo}>Amount :  </Text>
            <Text style={styles.phname}>{data.availability}</Text>
          </View>
          <View style={styles.viewInfo}>
            <Text style={styles.titleInfo}>Expired Date :  </Text>
            <Text style={styles.phname}>{ moment(data.expired_date).format('DD /MM/ Y')}</Text>
          </View>
          <View style={{ width: '99%', height: 0.5, backgroundColor: '#7189FF', alignSelf: 'center', marginTop: 20, borderRadius: 22 }} />
          </>
          }
          { 
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
          }
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
    color: '#7189FF',
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
    shadowColor: '#7189FF',
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
    color: '#7189FF',
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
