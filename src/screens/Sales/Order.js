import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import React, {useEffect, useState} from 'react';
import GoBack from '../../components/GoBack';
// import {salesdata} from '../../helpers/data';
import OrderTable from '../../components/Tables/OrderTable';
import Feather from 'react-native-vector-icons/Feather';
import AddNewOrderModel from '../../components/Modals/AddNewOrderModel';
import Constants from '../../config/globalConstants';
import { get } from '../../WebService/RequestBuilder';
import { useAuth } from '../../contexts/AuthContext';
import moment from 'moment';

Feather.loadFont();

const Order = ({navigation, route}) => {
  const {user} = useAuth();
  const item = route.params.item;
  const area = route.params.area;
  const date = route.params.date;

  const [modal, setModal] = useState(false)
  const [rows, setRows] = useState([])

  const getOrders = () => {
    const params = {
      user_id: 8,//user.id,
      pharmacy_id: 2,//item.pharmacy_id,
      data: '2023-06-15'// moment(date, 'YYYY-M-D').format('YYYY-MM-DD'), 
    }
    get(Constants.orders.get_orders, null, params).then((res) => {
      setRows(res.data)
    }).catch((res) => {

    }).finally(() => {})
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
    <SafeAreaView>
      <GoBack text={'Orders'} />

      <View style={style.container}>

          {/* <TouchableOpacity
           style={style.newbtn}
           onPress={() => {
             setModal(true);
            }}>
            <Text style={{color: '#fff', fontSize: 18, paddingHorizontal: 5}}>Export PDF</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={style.newbtn}
            onPress={() => {
             setModal(true);
           }}>
            <Text style={{color: '#fff', fontSize: 18, paddingHorizontal: 5}}>Add</Text>
          </TouchableOpacity>

      </View >
      
      <ScrollView showsVerticalScrollIndicator={false} style={{marginVertical: 40}}>
        <View>
          <OrderTable data={rows} />
        </View>
      </ScrollView> 

      <AddNewOrderModel show={modal} hide={() => { setModal(false) }} submit={(e) => { submit2(e) }} item={item}/>
    </SafeAreaView>
  );
};

export default Order;

export const style = StyleSheet.create({
  newbtn: {
      backgroundColor: '#7189FF',
      height: 40,
      paddingVertical: 5,
      paddingHorizontal: 4,
      borderRadius: 7,
      justifyContent: 'center',
      marginHorizontal: 7,
  },
  container: {
    flex:1,
    flexDirection: 'row',
    height:40,
    justifyContent: 'flex-end',
    marginVertical: 10
  },
})
