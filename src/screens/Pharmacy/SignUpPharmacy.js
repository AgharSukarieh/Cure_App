import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import {styles} from '../../components/styles';
import TopView from '../../components/TopView';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {useNavigation} from '@react-navigation/native';

const SignUpPharmacy = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const navigation = useNavigation();

  const handleSignIn = () => {
    //
  };

  return (
    <View style={styles.container}>
      <TopView text={'Sgin Up To Pharmacy'} />
      <Input lable={'USERNAME'} setData={setUsername} />
      <Input lable={'EMAIL'} setData={setEmail} />
      <Input lable={'PASSWORD'} setData={setPassword} isPassword={true} />

      <Button text={'Create an account'} handleClick={handleSignIn} />

      <View style={styles.checkPharmacy}>
        <Text style={styles.checkPharmacyText}>Existing Member?</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignInPharmacy')}
          activeOpacity={0.7}
          style={styles.signInPharmacyStyle}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
      </View>

      {/* <View style={styles.mageButton}>
        <Image source={require('../../assets/images/bottomImage.png')} />
      </View> */}
    </View>
  );
};

export default SignUpPharmacy;
