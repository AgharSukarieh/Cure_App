import { Alert, View, SafeAreaView,Dimensions, KeyboardAvoidingView,StyleSheet, Image, Text, TouchableOpacity, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../components/styles';
import TopView from '../components/TopView';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import GoBack from '../components/GoBack';
const wwidth = Dimensions.get('window').width
const wheight = Dimensions.get('window').height
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignUp = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  // farah@gmail.com 123456789
  const [email, setemail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();

  const RegisterPress = async () => {
    setIsLoading(true);
    if (email != '' && password != '') {
      if (regex.test(email)) {
        await register(name,email, password)
          .then((e) => {
            setIsLoading(false);
           
          })
          .catch(err => {
            setIsLoading(false);
      
          });
      } else {
        setIsLoading(false);
        Alert.alert('Make sure to enter a valid email');
      }
    } else {
      setIsLoading(false);
      Alert.alert('Make sure to enter Email and Name and Password');
    }
  };

  return (
  
<SafeAreaView style={styles.container}>

    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
  <GoBack style="" text="Sign in" />
  <View style={{ width: '100%', height: '100%',backgroundColor:"#ebebeb96" }}>
    
        <View style={style.imagediv}>
          <Image source={require('../../assets/logo__.png')} style={style.image} resizeMode="contain" />
        </View>
        <View style={style.inputContainer}>
          <Text style={style.inputheader}>Sign Up to Continue</Text>
          <Input lable={'Full Name'} setData={setName}   placeholder={'Full Name'} />
          <Input lable={'Email'} setData={setemail}  placeholder={'Email'} />
          <Input lable={'PASSWORD'} setData={setPassword}    isPassword={true} placeholder={'PASSWORD'} />
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
    </SafeAreaView>

  );
};

export default SignUp;

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: wwidth,
    height: wheight,
    backgroundColor: "#fff",
    // paddingBottom: 75
  },
  content: { flex: 1, justifyContent: 'flex-start', backgroundColor: '#ebebeb96' },
  imagediv: { width: 200, height: '20%', justifyContent:"center", alignItems:"center",  alignSelf: 'center'},
  image: { width: 100, height: 100, }, 
  inputContainer: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    width: '95%',
    borderRadius: 15,
    paddingVertical: 12
  },
  inputheader: { fontSize: 17, fontWeight: '600', marginHorizontal: 10, color: '#000' }
});