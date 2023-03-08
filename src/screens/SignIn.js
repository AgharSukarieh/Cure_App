import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {styles} from '../components/styles';
import TopView from '../components/TopView';
import Input from '../components/Input';
import Button from '../components/Button';
import {useNavigation} from '@react-navigation/native';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const handleSignIn = () => {
    //
  };

  return (
    <View style={styles.container}>
      <TopView text={'Sgin in To representative'} />
      <Input lable={'USERNAME'} setData={setUsername} />
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

      <View style={styles.imageButtonStyle}>
        <Image
          source={require('../../assets/images/bottomImage.png')}
          style={styles.bottomImage}
        />
      </View>
    </View>
  );
};

export default SignIn;
