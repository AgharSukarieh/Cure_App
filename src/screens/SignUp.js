import { Alert, View, SafeAreaView, KeyboardAvoidingView,StyleSheet, Image, Text, TouchableOpacity, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../components/styles';
import TopView from '../components/TopView';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignUp = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  // farah@gmail.com 123456789
  const [email, setemail] = useState('asemsmadi1122@gmail.com');
  const [name, setName] = useState('asem alsmadi');
  const [password, setPassword] = useState('test12343');
  const { register } = useAuth();

  const RegisterPress = async () => {
    setIsLoading(true);
    if (email != '' && password != '') {
      if (regex.test(email)) {
        await register(name,email, password)
          .then((e) => {
            setIsLoading(false);
            console.table(e);
          })
          .catch(err => {
            setIsLoading(false);
            console.table(err.response);
            Alert.alert('login error', err);
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
  

    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}>
      <View style={style.content}>
        <View style={style.imagediv}>
          <Image source={require('../../assets/logo__.png')} style={style.image} resizeMode="contain" />
        </View>
        <View style={style.inputContainer}>
          <Text style={style.inputheader}>Sign Up to Continue</Text>
          <Input lable={'Full Name'} setData={setName}  placeholder={'Full Name'} />
          <Input lable={'Email'} setData={setemail}  placeholder={'Email'} />
          <Input lable={'PASSWORD'} setData={setPassword}  isPassword={true} placeholder={'PASSWORD'} />
          <Button text={'Sign Up'} handleClick={() => RegisterPress()} />
          <View style={{ width: '85%', alignSelf: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 16, color: '#808080', lineHeight:25 }}>
              By Signing in you Agree to Our{' '}
                <Text onPress={() => Linking.openURL('https://cure.dev2.prodevr.com/terms.php')}
                 style={{ textDecorationLine: 'underline', marginHorizontal: 2, textAlign: 'center', fontSize: 16, color: 'red' }}>Terms & Conditions</Text>
                {' '}and{' '}
                <Text onPress={() => Linking.openURL('https://cure.dev2.prodevr.com/privacy_policy.php')}
                   style={{ textDecorationLine: 'underline', marginHorizontal: 2, textAlign: 'center', fontSize: 16, color: 'red' }}>Privacy Policy</Text>
            </Text>
          </View>


          {<View style={{ width: '85%', alignSelf: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 16, color: '#808080', lineHeight:25 }}>
             Have An Account ? <Text onPress={()=>{
              navigation.navigate('SignIn')
             }} style={{color:'#469ED8'}}>Sign In</Text>
            </Text>
          </View> }

          
        </View>
      </View>

      {isLoading && <LoadingScreen />}

    

    </KeyboardAvoidingView>

  );
};

export default SignUp;

const style = StyleSheet.create({
  content: { flex: 1, justifyContent: 'flex-start', backgroundColor: '#ebebeb96' },
  imagediv: { width: 200, height: '30%', justifyContent:"center", alignItems:"center",  alignSelf: 'center'},
  image: { width: 200, height: 200, }, 
  inputContainer: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    width: '95%',
    borderRadius: 15,
    paddingVertical: 12
  },
  inputheader: { fontSize: 17, fontWeight: '600', marginHorizontal: 10, color: '#000' }
});