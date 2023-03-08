import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {styles} from '../../components/styles';
import TopView from '../../components/TopView';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {useNavigation} from '@react-navigation/native';

const SignInPharmacy = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const handleSignIn = () => {
    navigation.navigate('ConfirmProfile');
    //
  };

  return (
    <View style={styles.container}>
      <TopView text={'Sgin In To Pharmacy'} />
      <Input lable={'USERNAME'} setData={setUsername} />
      <Input lable={'PASSWORD'} setData={setPassword} isPassword={true} />
      <Button text={'Sign In'} handleClick={handleSignIn} />

      <View style={styles.checkPharmacy}>
        <Text style={styles.checkPharmacyText}>New to Pharmacy?</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignUpPharmacy')}
          activeOpacity={0.7}
          style={styles.signInPharmacyStyle}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignInPharmacy;
