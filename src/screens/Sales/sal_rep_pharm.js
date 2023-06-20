import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React from 'react';
import {styles} from '../../components/styles';
import Moment from 'moment';
import GoBack from '../../components/GoBack';
import { put } from '../../WebService/RequestBuilder';
import Constants from '../../config/globalConstants';
// import { useAuth } from '../../contexts/AuthContext';

const Sal_rep_pharm = ({navigation, route}) => {
  // const {user} = useAuth();
  const item = route.params.item;
  const area = route.params.area;

  // const endVisit = async () => {
  //   await put(Constants.visit.sales + `/${''}`)
  //   .then((res) => {})
  //   .catch((err) => {})
  //   .finally(() => {})
  // }

  return (
    <SafeAreaView style={{height:'100%', flex:1, flexDirection: 'column',alignContent:'space-around' }}>
      <GoBack text={item?.name} />
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginVertical: 30 }}>
        <View style={{...styles.containerSignIn}}>
          <TouchableOpacity
            style={styles.Sal_rep_pharmButton}
            onPress={() => navigation.navigate('AccountInfo',{item: item})}>
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
              navigation.navigate('Return');
            }}>
            <Text style={styles.reportPageText}>Returns</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.endVisitBtn}
            onPress={() => {
              
            }}>
            <Text style={styles.reportPageText}>End Visit</Text>
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
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginHorizontal: 15,
  },
  endVisitBtn:{
    backgroundColor: '#ccc',
    padding: 10,
    width: '90%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 10,
    marginBottom: 20
  }
});
