import { Alert, View, SafeAreaView, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../components/styles';
import TopView from '../components/TopView';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignIn = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  // hussein@gmail.com  hussienSale@gmail.com
  const [email, setemail] = useState('medformAdmin@admin.com');
  const [password, setPassword] = useState('123456789');
  const { login } = useAuth();

  const LoginPress = async () => {
    setIsLoading(true);
    if (email != '' && password != '') {
      if (regex.test(email)) {
        await login(email, password)
          .then(() => {
            setIsLoading(false);
            navigation.navigate('BottomTabs');
          })
          .catch(err => {
            setIsLoading(false);
            Alert.alert('login error', err.response.data.message);
          });
      } else {
        setIsLoading(false);
        Alert.alert('Make sure to enter a valid email');
      }
    } else {
      setIsLoading(false);
      Alert.alert('Make sure to enter Email and Password');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={style.content}>
        <View style={style.imagediv}>
          <Image source={require('../../assets/logo.png')} style={style.image} resizeMode='contain' />
        </View>
        <View style={style.inputContainer}>
          <Text style={style.inputheader}>Sign In to Continue</Text>
          <Input lable={'Email'} setData={setemail} placeholder={'Email'} />
          <Input lable={'PASSWORD'} setData={setPassword} isPassword={true} placeholder={'PASSWORD'} />
          <Button text={'Sign In'} handleClick={() => LoginPress()} />
          <View style={{ width: '85%', alignSelf: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 16, color: '#808080', lineHeight:25 }}>
              By Signing in you Agree to Our{' '}
                <Text onPress={() => console.log('Terms pressed')} style={{ textDecorationLine: 'underline', marginHorizontal: 2, textAlign: 'center', fontSize: 16, color: 'red' }}>Terms & Conditions</Text>
                {' '}and{' '}
                <Text onPress={() => console.log('Privacy Policy')} style={{ textDecorationLine: 'underline', marginHorizontal: 2, textAlign: 'center', fontSize: 16, color: 'red' }}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </View>

      {isLoading && <LoadingScreen />}

      {/* <View style={styles.checkPharmacy}>
        <Text style={styles.checkPharmacyText}>Are you a pharmacy?</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignInPharmacy')}
          activeOpacity={0.7}
          style={styles.signInPharmacyStyle}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

export default SignIn;

const style = StyleSheet.create({
  content: { flex: 1, justifyContent: 'flex-start', backgroundColor: '#ebebeb96' },
  imagediv: { width: '100%', height: '35%', },
  image: { width: '100%', height: '100%', },
  inputContainer: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    width: '95%',
    borderRadius: 15,
    paddingVertical: 12
  },
  inputheader: { fontSize: 17, fontWeight: '600', marginHorizontal: 10, color: '#000' }
});