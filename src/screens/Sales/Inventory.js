import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from '../../components/styles';
import GoBack from '../../components/GoBack';
import {salesdata} from '../../helpers/data';
import InventoryTable from '../../components/Tables/InventoryTable';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import AddNewInventoryModel from '../../components/Modals/AddNewInventoryModel';

Feather.loadFont();

const Inventory = () => {
  const [modal, setModal] = useState(false)
  const [rows, setRows] = useState([])

  useEffect(() => {
    setRows(salesdata)
  }, []);

const submit2 = (data) => {
  const testData = {
    id: 1,
    pharm_name: 'test 111',
    location: '111',
    items: [
        {
            item_id: 1,
            item_name: 'test 111',
            items_sum: 12,
            bonus: 0,
            price: 20
        }
    ]
}
  setRows([...rows,testData])
}
  // //////////////////////////////////////////////////////////
  // //////////////////////////////////////////////////////////
  // //////////////////////////////////////////////////////////

  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={'Inventory'} />

      <View >
        <TouchableOpacity
          style={style.newbtn}
          onPress={() => {
            setModal(true);
          }}>
          <Text style={{color: '#fff', fontSize: 18, paddingHorizontal: 5}}>Add</Text>
        </TouchableOpacity>
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginVertical: 10}}>
          <InventoryTable data={rows} />
        </View>
      </ScrollView>
      </View>  
      <AddNewInventoryModel show={modal} hide={() => { setModal(false) }} submit={(e) => { submit2(e) }} />
    </SafeAreaView>
  );
};

export default Inventory;

export const style = StyleSheet.create({
  newbtn: {
      backgroundColor: '#7189FF',
      // width: '25%',
      paddingVertical: 5,
      paddingHorizontal: 8,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'flex-end',
      marginHorizontal: 15,
      height:40,
  }
})
