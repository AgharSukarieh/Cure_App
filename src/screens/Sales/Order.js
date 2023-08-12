import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import React, { useEffect, useState } from 'react';
import GoBack from '../../components/GoBack';
// import {salesdata} from '../../helpers/data';
import OrderTable from '../../components/Tables/OrderTable';
import Feather from 'react-native-vector-icons/Feather';
import AddNewOrderModel from '../../components/Modals/AddNewOrderModel';
import Constants from '../../config/globalConstants';
import { get } from '../../WebService/RequestBuilder';
import { useAuth } from '../../contexts/AuthContext';
import moment from 'moment';
import { styles } from '../../components/styles';

Feather.loadFont();

const Order = ({ navigation, route, item, area, date }) => {
  const { user } = useAuth();


  const [modal, setModal] = useState(false)
  const [rows, setRows] = useState([])

  const getOrders = () => {
    const params = {
      user_id: user.id,
      pharmacy_id: item.pharmacy_id,
      data: moment(date, 'YYYY-M-D').format('YYYY-MM-DD'),
    }
    get(Constants.orders.get_orders, null, params).then((res) => {
      setRows(res.data)
    }).catch((res) => {

    }).finally(() => { })
  }


  useEffect(() => {
    getOrders();
  }, []);

  // const submit2 = (data) => {
  //   const testData = {
  //     id: 1,
  //     pharm_name: 'test pharm 1',
  //     location: 'Jabal Weibdeh',
  //     items: [
  //         {
  //             item_id: 1,
  //             item_name: 'test item 1',
  //             items_sum: 12,
  //             bonus: 0,
  //             price: 20
  //         }
  //     ]
  // }
  //   setRows([...rows,testData])
  // }

  return (
    <SafeAreaView style={styles.container}>
      <View  >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
          <TouchableOpacity
            style={style.newbtn}
            onPress={() => {
              setModal(true);
            }}>
            <Text style={{ color: '#fff', fontSize: 18, paddingHorizontal: 5 }}>Add</Text>
          </TouchableOpacity>
        </View >
        <View style={{ width: '90%', height: 1, backgroundColor: '#000', alignSelf: 'center', marginVertical: 10, borderRadius: 22 }} />
        <ScrollView showsVerticalScrollIndicator={false} style={{ marginVertical: 40 }}>
          <View>
            <OrderTable data={rows} />
          </View>
        </ScrollView>
      </View>

      <AddNewOrderModel show={modal} hide={() => { setModal(false) }} submit={(e) => { submit2(e) }} item={item} />
    </SafeAreaView>
  );
};

export default Order;

export const style = StyleSheet.create({
  newbtn: {
    backgroundColor: '#7189FF',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginHorizontal: 15,
    height: 40,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
})
