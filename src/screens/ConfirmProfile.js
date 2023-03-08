import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {styles} from '../components/styles';
import TopView from '../components/TopView';
import Input from '../components/Input';
import Button from '../components/Button';
import {useNavigation} from '@react-navigation/native';

const ConfirmProfile = () => {
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phne, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('');

  const navigation = useNavigation();

  const handleConfirm = () => {
    navigation.navigate("ReportPage")
    //
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <TopView text={'Confirm your profile'} />
        <Input lable={'USERNAME'} setData={setUsername} />
        <Input lable={'FIRSTNAME'} setData={setFirstname} />
        <Input lable={'LASTNAME'} setData={setLastname} />
        <Input lable={'EMAIL'} setData={setEmail} />
        <Input
          lable={'NEW PASSWORD'}
          setData={setNewPassword}
          isPassword={true}
        />
        <Input
          lable={'CONFIRM PASSWORD'}
          setData={setConfirmPassword}
          isPassword={true}
        />
        <Input lable={'PHONE'} setData={setPhone} />
        <Input lable={'ADDRESS'} setData={setAddress} />
        <Input lable={'STATUS'} setData={setStatus} />

        <Button text={'Confirm'} handleClick={handleConfirm} />

        {/* <View style={styles.mageButton}>
        <Image source={require('../../assets/images/bottomImage.png')} />
      </View> */}
      </View>
    </ScrollView>
  );
};

export default ConfirmProfile;
