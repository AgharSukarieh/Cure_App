import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { styles } from '../../components/styles';
import TopView from '../../components/TopView';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import Constants from '../../config/globalConstants';
import { get } from '../../WebService/RequestBuilder';
import LoadingScreen from '../../components/LoadingScreen';
const getCityAreaEndpoint = Constants.users.cityArea;

const ReportPage = () => {
  const navigation = useNavigation();
  const {logout , role, user} = useAuth();
  const date = new Date().toLocaleDateString();

  const [isLoading, setIsLoading] = useState(true);
  const [cityArea, setCityArea] = useState(null);

  const LogoutPress = async () => {
    await logout()
      .then(() => {
        navigation.navigate('SignIn');
      })
      .catch(err => {
        console.log(err);
      });
  };

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
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TopView text={'Report Page'} />

        <View style={styles.nameDateContainer}>
          <Text style={styles.leftText}>{user?.name}</Text>
          <Text style={styles.rightText}>{date}</Text>
        </View>
        {/* <View style={styles.nameDateContainer}>
          <Text style={styles.leftText}>Location : Jabale AlWeibdeh</Text>
        </View> */}
        <View style={styles.nameDateContainer}>
          <Text style={styles.leftText}>supervisor : Waleed</Text>
        </View>

        <View style={styles.reportPageContainer}>
          <TouchableOpacity style={styles.reportPageButton} onPress={() => {
              get(`${getCityAreaEndpoint}${user?.id}`)
              .then(response => {
                  navigation.navigate('Sales', {cityArea: response.data, user_id: user?.id});
                })
                .catch(err => {
                  console.error(err);
                })
                .finally(() => {});
            }}>
            <Text style={styles.reportPageText}>Sales</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.reportPageButton} onPress={() => navigation.navigate('Monthly', {cityArea: cityArea})}>
            <Text style={styles.reportPageText}>Monthly Plan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.reportPageButton} onPress={() => {
            role == 'sales' ? navigation.navigate('Clientlist-sales', {cityArea: cityArea}) : navigation.navigate('Clientlist-medical', {cityArea: cityArea})
            }}>
            <Text style={styles.reportPageText}>Client List</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.reportPageButton} onPress={() => {navigation.navigate('ChatPage', {user: user}) }}>
            <Text style={styles.reportPageText}>ChatPage</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.reportPageButton} onPress={() => { }}>
            <Text style={styles.reportPageText}>Test</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.reportPageButton} onPress={() => { }}>
            <Text style={styles.reportPageText}>Test</Text>
          </TouchableOpacity> */}
        </View>
        
        <TouchableOpacity style={styles.logoutbtn} onPress={() => LogoutPress()}>
          <Text style={styles.reportPageText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      {isLoading && <LoadingScreen />}
    </SafeAreaView>
  )
};

export default ReportPage;
