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
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import AddNewInventoryModel from '../../components/Modals/AddNewInventoryModel';
import { SAL_ADD_IINVENTORY,SAL_GET_IINVENTORY } from '../../Provider/ApiRequest';

Feather.loadFont();

const Inventory = ({navigation, route}) => {
  const [modal, setModal] = useState(false);
  const [rows, setRows] = useState([]);

  const getRows = () => {
    let params = {
      pharm_id: route.params.item.pharm_id.ph_id,
    };
    axios({
      method: 'GET',
      url: SAL_GET_IINVENTORY,
      params: params,
    })
      .then(response => {
        setRows(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    }

  useEffect(() => {
    getRows();
  }, []);

  const submit2 = data => {
    let dataFromModel = {
      pharm_id: route.params.item.pharm_id.ph_id,
      user_id: route.params.item.user_id,
      item_id: data.productValue,
      availability: data.availability,
      expired_date: data.date,
      batch_number: data.batchNumber,
      time_of_visit: new Date(),
    };
    axios({
      method: 'POST',
      url: SAL_ADD_IINVENTORY,
      data: dataFromModel,
    })
      .then(response => {
        getRows();
      })
      .catch(error => {
        console.log(error)
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBack text={'Inventory'} />
      <View>
        <TouchableOpacity
          style={style.newbtn}
          onPress={() => {
            setModal(true);
          }}>
          <Text style={{color: '#fff', fontSize: 18, paddingHorizontal: 5}}>
            Add
          </Text>
        </TouchableOpacity>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginVertical: 10}}>
            <InventoryTable data={rows} />
          </View>
        </ScrollView>
      </View>
      <AddNewInventoryModel
        show={modal}
        hide={() => {
          setModal(false);
        }}
        submit={e => {
          submit2(e);
        }}
      />
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
    height: 40,
  },
});
