import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from '../../components/styles';
import GoBack from '../../components/GoBack';
import InventoryTable from '../../components/Tables/InventoryTable';
import Feather from 'react-native-vector-icons/Feather';
import AddNewInventoryModel from '../../components/Modals/AddNewInventoryModel';
import { get } from '../../WebService/RequestBuilder';
import Constants from '../../config/globalConstants';

Feather.loadFont();

const Inventory = ({navigation, route}) => {
  const item = route.params.item;
  const area = route.params.area;

  const [modal, setModal] = useState(false);
  const [rows, setRows] = useState(null);

  console.log(item.pharmacy_id);
  const getInventory = () => {
    const parms = {
      pharmacy_id: item.pharmacy_id,
    }
    get(Constants.inventory.get_inventory,null,parms).then((res) => {
      setRows(res.pharamcy_last_order)
    }).catch(() => {

    }).finally(() => {

    });
  }

  useEffect(() => {
    getInventory()
  }, [])

  const submit2 = data => {
    // let dataFromModel = {
    //   pharm_id: route.params.item.pharm_id.ph_id,
    //   user_id: route.params.item.user_id,
    //   item_id: data.productValue,
    //   availability: data.availability,
    //   expired_date: data.date,
    //   batch_number: data.batchNumber,
    //   time_of_visit: new Date(),
    // };
    // axios({
    //   method: 'POST',
    //   url: SAL_ADD_IINVENTORY,
    //   data: dataFromModel,
    // })
    //   .then(response => {
    //     getRows();
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   });
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={'Inventory'} />

      <View>

        {/* <TouchableOpacity
          style={style.newbtn}
          onPress={() => {
            setModal(true);
          }}>
          <Text style={{color: '#fff', fontSize: 18, paddingHorizontal: 5}}>
            Add
          </Text>
        </TouchableOpacity> */}

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginVertical: 10}}>
            <InventoryTable data={rows} />
          </View>
        </ScrollView>

      </View>

      {/* <AddNewInventoryModel
        show={modal}
        hide={() => {
          setModal(false);
        }}
        submit={e => {
          submit2(e);
        }}
      /> */}
    </SafeAreaView>
  );
};

export default Inventory;

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
});
