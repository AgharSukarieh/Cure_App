import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { styles } from '../../components/styles';
import Moment from 'moment';
import GoBack from '../../components/GoBack';
import { put } from '../../WebService/RequestBuilder';
import Constants from '../../config/globalConstants';
import { FlatList } from 'react-native';
import AccountInfo from './AccountInfo';
import Inventory from './Inventory';
import Order from './Order';
import Return from './Return';

const Sal_rep_pharm = ({ navigation, route }) => {

  const item = route.params.item;
  const area = route.params.area;
  const date = route.params.date;

  const [index, setindex] = useState(1);

  const data = [
    { id: '1', title: 'Account info' },
    { id: '2', title: 'Inventory' },
    { id: '3', title: 'Orders' },
    { id: '4', title: 'Return' },
    { id: '5', title: 'End Visit' },
  ];

  const endVisit = async () => {
    await put(Constants.visit.sales + `/${item?.id}`)
      .then((res) => {
        navigation.goBack();
      })
      .catch((err) => { })
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={{ ...style.Sal_rep_pharmButton, backgroundColor: item.id == index ? '#469ED8' : '#CCD1D4' }} onPress={() => { setindex(item.id) }}  >
      <Text style={style.reportPageText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff' }}>
      <GoBack text={item?.name} />
      {console.log(item)}
      <View style={style.containerSignIn} >
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* style={{ paddingTop: 60 }} marginBottom: 100 */}
      <View style={{flex:1}}>  
        {index == 1 && <AccountInfo item={item}/>}
        {index == 2 ? <Inventory item={item} area={area} /> : null}
        {index == 3 ? <Order item={item} area={area} date={date} /> : null}
        {index == 4 ? <Return item={item} /> : null}
        {index == 5 ?
          <>
            {!item?.end_visit ? <TouchableOpacity style={style.endVisitBtn} onPress={() => { endVisit() }}>
              <Text style={styles.reportPageText}>End Visit</Text>
            </TouchableOpacity> : null}
          </>
          : null}
      </View>

    </SafeAreaView>
  );
};

export default Sal_rep_pharm;

export const style = StyleSheet.create({
  endVisitBtn: {
    backgroundColor: '#ccc',
    padding: 10,
    width: '90%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 10,
    marginBottom: 30,
    alignSelf: 'center'
  },
  containerSignIn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#E4E1E1',
    borderRadius: 25
  },
  Sal_rep_pharmButton: {
    backgroundColor: '#469ED8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginRight: 10
  },
  reportPageText: {
    textAlign: 'center',
    fontSize: 19,
    color: '#ffffff',
  },
});
