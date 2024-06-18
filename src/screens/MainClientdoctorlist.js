import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { styles } from '../components/styles';
import GoBack from '../components/GoBack';
import { get } from '../WebService/RequestBuilder';
import Constants from '../config/globalConstants';
import { useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Clientdoctorlist from './Clientdoctorlist';
import Clientpharmalist from './Clientpharmalist';
import Icon from 'react-native-vector-icons/Feather';

const MainClientdoctorlist = ({ navigation, route }) => {

  const Tab = createMaterialTopTabNavigator();
  const pcolor = '#3A97D6'

  const [index, setindex] = useState(0);


  return (
    <SafeAreaView style={{ height: '100%', flex: 1, flexDirection: 'column', alignContent: 'space-around' }}>
      <GoBack text={'Client List'} />
      <View style={style.containerSignIn}>
        <TouchableOpacity style={index == 0 ? [style.Sal_rep_pharmButton] : [style.Sal_rep_pharmButton2]} onPress={() => { setindex(0) }}  >
          <Text style={style.reportPageText}>Doctor List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={index == 1 ? [style.Sal_rep_pharmButton] : [style.Sal_rep_pharmButton2]} onPress={() => { setindex(1) }}>
          <Text style={style.reportPageText}>Pharmacy List</Text>
        </TouchableOpacity>
      </View>
      <View style={{ width: '100%', flex: 1 }}>
        {index == 0
          ? <Clientdoctorlist header={false} />
          : <Clientpharmalist header={false} />
        }
      </View>
    </SafeAreaView >

    // <Tab.Navigator tabBarPosition="top">
    //   <Tab.Screen name="Clientdoctorlist" component={Clientdoctorlist} options={{ tabBarLabel: 'DocTors list' }} />
    //   <Tab.Screen name="Clientpharmalist" component={Clientpharmalist} options={{ tabBarLabel: 'pharmacy list' }} />
    // </Tab.Navigator>
  );
};

export default MainClientdoctorlist;

export const style = StyleSheet.create({
  containerSignIn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#E4E1E1',
    borderRadius: 25
  },
  Sal_rep_pharmButton: {
    backgroundColor: '#469ED8',
    padding: 10,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  Sal_rep_pharmButton2: {
    padding: 10,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CCD1D4',
    borderRadius: 16,
  },
  reportPageText: {
    textAlign: 'center',
    fontSize: 19,
    color: '#ffffff',
  },
  mune: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#469ED8',
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
    backgroundColor: '#469ED8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  muneheader: { fontSize: 17, color: '#000' },
  muneheader2: { fontSize: 17, color: '#fff' },
  newbtn: {
    backgroundColor: '#469ED8',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginHorizontal: 15,
  },
});
