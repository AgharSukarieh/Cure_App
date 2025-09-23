import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Dimensions,
  I18nManager,
} from 'react-native';
import React, { useState } from 'react';
import { styles } from '../components/styles';
import GoBack from '../components/GoBack';
import { get } from '../WebService/RequestBuilder';
import Constants from '../config/globalConstants';
import { useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTranslation } from 'react-i18next';

import Clientdoctorlist from './Clientdoctorlist';
import Clientpharmalist from './Clientpharmalist';
import Icon from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');

const MainClientdoctorlist = ({ navigation, route }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const Tab = createMaterialTopTabNavigator();
  const pcolor = '#3A97D6';
  const [index, setindex] = useState(0);

  return (
    <SafeAreaView style={style.safeArea}>
      <GoBack text={t('mainClientDoctorList.headerTitle')} />
      <View style={[style.containerSignIn, isRTL && style.rtlContainer]}>
        <TouchableOpacity 
          style={index == 0 ? [style.Sal_rep_pharmButton] : [style.Sal_rep_pharmButton2]} 
          onPress={() => { setindex(0) }}
        >
          <Text style={[style.reportPageText, isRTL && style.rtlText]}>
            {t('mainClientDoctorList.doctorList')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={index == 1 ? [style.Sal_rep_pharmButton] : [style.Sal_rep_pharmButton2]} 
          onPress={() => { setindex(1) }}
        >
          <Text style={[style.reportPageText, isRTL && style.rtlText]}>
            {t('mainClientDoctorList.pharmacyList')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={style.contentContainer}>
        {index == 0
          ? <Clientdoctorlist navigation={navigation} header={false} />
          : <Clientpharmalist navigation={navigation} header={false} />
        }
      </View>
    </SafeAreaView>
  );
};

export default MainClientdoctorlist;

export const style = StyleSheet.create({
  safeArea: { 
    height: '100%', 
    flex: 1, 
    flexDirection: 'column', 
    alignContent: 'space-around',
    backgroundColor: '#FFFFFF'
  },
  containerSignIn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.03,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#E4E1E1',
    borderRadius: 10,
    marginVertical: height * 0.01,
  },
  Sal_rep_pharmButton: {
    backgroundColor: '#183E9F',
    padding: width * 0.025,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    minHeight: height * 0.05,
  },
  Sal_rep_pharmButton2: {
    padding: width * 0.025,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CCD1D4',
    borderRadius: 16,
    minHeight: height * 0.05,
  },
  reportPageText: {
    textAlign: 'center',
    fontSize: width < 375 ? 16 : width < 414 ? 17 : 19,
    color: '#ffffff',
    fontWeight: '600',
  },
  contentContainer: { 
    width: '100%', 
    flex: 1 
  },
  rtlContainer: {
    flexDirection: 'row-reverse',
  },
  rtlText: {
    textAlign: 'center',
  },
  mune: {
    width: '100%',
    height: height * 0.06,
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
  muneheader: { 
    fontSize: width < 375 ? 15 : 17, 
    color: '#000' 
  },
  muneheader2: { 
    fontSize: width < 375 ? 15 : 17, 
    color: '#fff' 
  },
  newbtn: {
    backgroundColor: '#469ED8',
    paddingVertical: height * 0.006,
    paddingHorizontal: width * 0.02,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginHorizontal: width * 0.04,
  },
});