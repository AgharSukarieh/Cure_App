import { View, Dimensions, Text, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, TextInput, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { styles } from '../../components/styles';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import Constants from '../../config/globalConstants';
import { get } from '../../WebService/RequestBuilder';
import LoadingScreen from '../../components/LoadingScreen';
import HomeHeader from '../../components/homeHeader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const wheight = Dimensions.get('window').height

const getCityAreaEndpoint = Constants.users.cityArea;

const ReportPage = () => {
  const navigation = useNavigation();
  const { role, user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);

  const [cityArea, setCityArea] = useState(null);

  useEffect(() => {
    get(`${getCityAreaEndpoint}${user?.id}`)
      .then(response => {
        setCityArea(response.data);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={{ ...styles.container, backgroundColor: '#ebebeb96' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HomeHeader username={user?.name} supervisorname={'Waleed'} />
        <View style={style.mainview}>
          <View style={style.searchView}>
            <TextInput placeholder='Search ....' />
            <FontAwesome name="search" size={26} color="grey" />
          </View>
          <View style={style.cardsView}>
            <TouchableOpacity style={style.card} onPress={() => { navigation.navigate('Sales', { cityArea: cityArea, user_id: user?.id }); }}>
              <Image source={require('../../../assets/sales.png')} style={{ ...style.cardimage, marginLeft: 15 }} resizeMode='contain' />
              <Text style={style.cardtext}>Sales</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.card} onPress={() => navigation.navigate('Monthly', { cityArea: cityArea })}>
              <Image source={require('../../../assets/Fill.png')} style={{ ...style.cardimage, marginLeft: 0 }} resizeMode='contain' />
              <Text style={style.cardtext}>Monthly Plan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.card} onPress={() => { role == 'sales' ? navigation.navigate('Clientlist-sales', { cityArea: cityArea }) : navigation.navigate('Clientlist-medical', { cityArea: cityArea }) }}>
              <Image source={require('../../../assets/Icon.png')} style={{ ...style.cardimage, marginLeft: 0 }} resizeMode='contain' />
              <Text style={style.cardtext}>Client List</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.card} onPress={() => { navigation.navigate('ChatPage', { user: user }) }}>
              <Image source={require('../../../assets/chat.png')} style={{ ...style.cardimage, marginLeft: 0 }} resizeMode='contain' />
              <Text style={style.cardtext}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.card} onPress={() => navigation.navigate('Reports')}>
              <Image source={require('../../../assets/Group.png')} style={{ ...style.cardimage, marginLeft: 15 }} resizeMode='contain' />
              <Text style={style.cardtext}>Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.card} onPress={() => role == 'sales' ? navigation.navigate('Collection') : navigation.navigate('FrequencyReport') }>
              <Image source={require('../../../assets/soc.png')} style={{ ...style.cardimage, marginLeft: 0 }} resizeMode='contain' />
              <Text style={{...style.cardtext, textAlign: 'center'}}>Frequency Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {isLoading && <LoadingScreen />}
    </SafeAreaView >
  )
};

const style = StyleSheet.create({
  mainview: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    top: -20,
  },
  searchView: {
    width: '90%',
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'grey',
    height:45
  },
  cardsView: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  card: {
    width: '45%',
    height: 130,
    backgroundColor: '#F6F9FE',
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#a8d7f1',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardimage: { width: '50%', height: '50%', },
  cardtext: { color: '#000', fontWeight: '600', marginTop: 10, fontSize: 17 }
})

export default ReportPage;
