import {Alert, View, SafeAreaView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from '../components/styles';
import TopView from '../components/TopView';
import Input from '../components/Input';
import Button from '../components/Button';
import {useAuth} from '../contexts/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignIn = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setemail] = useState('mosale@gamil.com'); //testhello@gmail.com
  const [password, setPassword] = useState('123');
  const {login} = useAuth();

  const LoginPress = async () => {
    setIsLoading(true);
    if (email != '' && password != '') {
      if (regex.test(email)) {
        await login(email, password)
          .then(() => {
            setIsLoading(false);
            navigation.navigate('ReportPage');
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
        <TopView text={'Sgin in'} />
        <Input lable={'Email'} setData={setemail} />
        <Input lable={'PASSWORD'} setData={setPassword} isPassword={true} />
        <Button text={'Sign In'} handleClick={() => LoginPress()} />
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
  content:{flex: 1, justifyContent: 'flex-start'},
});