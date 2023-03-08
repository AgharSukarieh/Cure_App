import { View, SafeAreaView, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../components/styles';
import TopView from '../components/TopView';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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
    <SafeAreaView>
      <ScrollView>
        <KeyboardAwareScrollView>
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
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConfirmProfile;
