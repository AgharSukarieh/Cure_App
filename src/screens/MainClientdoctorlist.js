import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    ScrollView,
  } from 'react-native';
  import React, {useState} from 'react';
  import {styles} from '../components/styles';
  import GoBack from '../components/GoBack';
  import { get } from '../WebService/RequestBuilder';
  import Constants from '../config/globalConstants';

  const MainClientdoctorlist = ({navigation, route}) => {
    const cityArea = route?.params?.cityArea

    return (
      <SafeAreaView style={{height:'100%', flex:1, flexDirection: 'column',alignContent:'space-around' }}>
        <GoBack text={'Client List'} />
        <ScrollView showsVerticalScrollIndicator={false} style={{ marginVertical: 30 }}>
          <View style={{...styles.containerSignIn}}>
            <TouchableOpacity
              style={styles.Sal_rep_pharmButton}
              onPress={() => {
                get(Constants.doctor.speciality)
                .then(response => { 
                  navigation.navigate('Clientdoctorlist', {cityArea: cityArea, specialty: response.speciality});
               })
              .catch(err => {
                   console.error(err);
               })
              .finally(() => {});
              }}
              >
              <Text style={styles.reportPageText}>Doctor List</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.Sal_rep_pharmButton}
              onPress={() => navigation.navigate('Clientlist-sales', { title:'Pharmacy List', cityArea: cityArea})}>
              <Text style={styles.reportPageText}>Pharmacy List</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default MainClientdoctorlist;
  
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
  });
  