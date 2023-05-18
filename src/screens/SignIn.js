import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../components/styles';
import TopView from '../components/TopView';
import Input from '../components/Input';
import Button from '../components/Button';
import { Alert } from 'react-native';
import axios from 'axios';
import { LOGIN, MED_GET_DAILY } from '../Provider/ApiRequest';
// import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = ({ navigation }) => {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');

  const getlogs = async () => {
    const a = await AsyncStorage.getItem('userInfo')
    console.log(a);
  }
  useEffect(() => {
    getlogs()
  }, []);

  const handleSignIn = () => {
    // 
    if (email != '' && password != '') {
      let data = {
        email: email,
        password: password
      }
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (regex.test(email)) {
        axios({
          method: "POST",
          url: LOGIN,
          data: data
        }).then(async (response) => {
          if (response.data.message == 'email') {
            Alert.alert('The Email you Entered isn\'t valid')
          }
          if (response.data.message == 'pass') {
            Alert.alert('The Password you Entered is wrong')
          }
          if (response.data.message == 'done') {
            await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.data))
            navigation.navigate('ReportPage')
          }
        }).catch((error) => { console.log("🚀 ~ file: DailyaddModel.js ~ line 26 ~ getdoctors ~ error", error) })
      } else {
        Alert.alert('Make sure to enter a valid email')
      }
    } else {
      Alert.alert('Make sure to enter Email and Password')
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopView text={'Sgin in'} />
      <Input lable={'Email'} setData={setemail} />
      <Input lable={'PASSWORD'} setData={setPassword} isPassword={true} />
      <Button text={'Sign In'} handleClick={handleSignIn} />

      <View style={styles.checkPharmacy}>
        <Text style={styles.checkPharmacyText}>Are you a pharmacy?</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignInPharmacy')}
          activeOpacity={0.7}
          style={styles.signInPharmacyStyle}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
