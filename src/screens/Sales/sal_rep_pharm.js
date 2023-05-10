import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {styles} from '../../components/styles';
import Moment from 'moment';
import GoBack from '../../components/GoBack';
import {useEffect} from 'react';
import axios from 'axios';
import {SAL_GET_REPORT} from '../../Provider/ApiRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Sal_rep_pharm = ({navigation, route}) => {
  
  const [user, setuser] = useState('');
  const getlogs = async () => {
    const a = await AsyncStorage.getItem('userInfo');
    setuser(JSON.parse(a));
  };
  useEffect(() => {
    getlogs();
  }, []);

  ///////////////////////////////////
  const item = route.params.item;
  const area = route.params.area;
  const [active, setactive] = useState(1);

  const invo = () => {
    return (
      <View style={{width: '100%', marginVertical: 15}}>
        <TouchableOpacity style={style.newbtn} onPress={() => {}}>
          <Text style={{color: '#fff', fontSize: 18}}>Add Inventory</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const order = () => {
    return (
      <View style={{width: '100%', marginVertical: 15}}>
        <TouchableOpacity style={style.newbtn} onPress={() => {}}>
          <Text style={{color: '#fff', fontSize: 18}}>Add Order</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const acc = () => {
    return (
      <View style={{width: '100%', marginVertical: 15}}>
        <TouchableOpacity style={style.newbtn} onPress={() => {}}>
          <Text style={{color: '#fff', fontSize: 18}}>Export PDF</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{height:'100%', flex:1, flexDirection: 'column',alignContent:'space-around' }}>
      <GoBack text={item?.pharm_id?.pharmacy_name} />
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginVertical: 30 }}>
        {/* <View style={{ marginVertical: 30 }}>
                    <View style={style.mune}>
                        <TouchableOpacity style={active == 1 ? [style.munebtn2] : [style.munebtn]} onPress={() => { setactive(1) }}>
                            <Text style={active == 1 ? [style.muneheader2] : [style.muneheader]}>Inventory</Text>
                        </TouchableOpacity>

                        <View style={{ width: 1.5, height: '100%', backgroundColor: '#7189FF' }} />

                        <TouchableOpacity style={active == 2 ? [style.munebtn2] : [style.munebtn]} onPress={() => { setactive(2) }}>
                            <Text style={active == 2 ? [style.muneheader2] : [style.muneheader]}>Order</Text>
                        </TouchableOpacity>

                        <View style={{ width: 1.5, height: '100%', backgroundColor: '#7189FF' }} />

                        <TouchableOpacity style={active == 3 ? [style.munebtn2] : [style.munebtn]} onPress={() => { setactive(3) }}>
                            <Text style={active == 3 ? [style.muneheader2] : [style.muneheader]}>ACC statement</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '100%', marginVertical: 15 }}>
                        {active == 1 && invo()}
                        {active == 2 && order()}
                        {active == 3 && acc()}
                    </View>

                </View> */}
        <View style={{...styles.containerSignIn}}>
          <TouchableOpacity
            style={styles.Sal_rep_pharmButton}
            onPress={() => navigation.navigate('Sales')}>
            <Text style={styles.reportPageText}>Account info</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Sal_rep_pharmButton}
            onPress={() => navigation.navigate('Inventory', { item: item, area: area })}>
            <Text style={styles.reportPageText}>Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Sal_rep_pharmButton}
            onPress={() => {
              navigation.navigate('Order');
            }}>
            <Text style={styles.reportPageText}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Sal_rep_pharmButton}
            onPress={() => {
              navigation.navigate('Order');
            }}>
            <Text style={styles.reportPageText}>Returns</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Sal_rep_pharm;

export const style = StyleSheet.create({
  mune: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#7189FF',
  },
  munebtn: {
    width: '33.2%',
    height: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  munebtn2: {
    width: '33.2%',
    height: '100%',
    backgroundColor: '#7189FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  muneheader: {color: '#000', fontSize: 17, color: '#000'},
  muneheader2: {color: '#000', fontSize: 17, color: '#fff'},
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
  },
});
