import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { styles } from '../../components/styles';
import TopView from '../../components/TopView';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';

// doctor id is 1 and pharma 2
const keyid = 1

const ReportPage = () => {

  const date = new Date().toLocaleDateString();
  const navigation = useNavigation();
  const [user, setuser] = useState('');

  const getlogs = async () => {
    const a = await AsyncStorage.getItem('userInfo')
    setuser(JSON.parse(a))
  }
  useEffect(() => {
    getlogs()
  }, []);


  const logout = async () => {
    // AsyncStorage.removeItem('userInfo')
    // AsyncStorage.clear()

    try {
      await AsyncStorage.removeItem('userInfo');
      console.log(`Item with key userInfo has been removed from storage.`);
      RNRestart.Restart();
    } catch (error) {
      console.log(`Error removing item with key userInfo from storage: ${error}`);
    }
  }
  const scan = async () => {
    
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TopView text={'Report Page'} />

        <View style={styles.nameDateContainer}>
          <Text style={styles.leftText}>{user?.name}</Text>
          <Text style={styles.rightText}>{date}</Text>
        </View>
        <View style={styles.nameDateContainer}>
          <Text style={styles.leftText}>Location : Jabale AlWeibdeh</Text>
        </View>
        <View style={styles.nameDateContainer}>
          <Text style={styles.leftText}>supervisor : Waleed</Text>
        </View>

        <View style={styles.reportPageContainer}>
          <TouchableOpacity style={styles.reportPageButton} onPress={() => navigation.navigate('Sales')}>
            <Text style={styles.reportPageText}>Sales</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportPageButton} onPress={() => navigation.navigate('Monthly')}>
            <Text style={styles.reportPageText}>Monthly Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportPageButton} onPress={() => { navigation.navigate('Clientlist') }}>
            <Text style={styles.reportPageText}>Client List</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportPageButton} onPress={() => {navigation.navigate('ChatPage', {user: user}) }}>
            <Text style={styles.reportPageText}>ChatPage</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reportPageButton} onPress={() => { }}>
            <Text style={styles.reportPageText}>Test</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.reportPageButton} onPress={() => { navigation.navigate('Chat') }}>
            <Text style={styles.reportPageText}>Chat</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.reportPageButton} onPress={() => { }}>
            <Text style={styles.reportPageText}>Test</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.logoutbtn} onPress={() => { logout() }}>
          <Text style={styles.reportPageText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
};

export default ReportPage;
