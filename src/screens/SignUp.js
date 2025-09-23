import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../contexts/AuthContext'; // ✅ لوجيك التسجيل

const SignUp = ({ navigation }) => {
  const { register } = useAuth(); // ✅ استخدم register من الـ context
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (!regex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    setIsLoading(true);
    try {
      await register(username, email, password); // ✅ تسجيل المستخدم
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('SignIn'); // بعد التسجيل اذهب لصفحة تسجيل الدخول
    } catch (error) {
      Alert.alert('Registration Error', error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={"#E0F2FF"} />
      <LinearGradient
        colors={['#E0F2FF', '#A8D5F0', '#6DB3D9']}
        style={styles.gradientBackground}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/logo2__.png')} 
                style={styles.logo}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                placeholderTextColor="#AC9E9E"
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#AC9E9E"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="**************"
                  placeholderTextColor="#A9A9A9"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <Icon 
                    name={isPasswordVisible ? 'eye' : 'eye-off'} 
                    size={18} 
                    color="#888" 
                  />
                </TouchableOpacity>
              </View>

              <View style={{height: 20}} />

              <TouchableOpacity style={styles.signInButton} onPress={handleRegister}>
                <Text style={styles.signInButtonText}>
                  {isLoading ? 'Signing Up...' : 'Sign Up'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.signUpContainer} onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.signUpText}>
                  Already have an account?{' '}
                  <Text style={styles.signUpLink}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By Signing up you Agree to Our {'\n'} 
                <Text style={styles.footerLink} onPress={() => alert('Terms Pressed!')}>
                  Terms & Conditions
                </Text>
                {' and '}
                <Text style={styles.footerLink} onPress={() => alert('Privacy Pressed!')}>
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  gradientBackground: { flex: 1 },
  container: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 20 },
  logoContainer: { alignItems: 'center', marginTop: 30 },
  logo: { width: 200, height: 200, resizeMode: 'contain' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 25,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    marginTop: -50,
    paddingVertical: 40
  },
  label: { fontSize: 12, color: '#555', marginBottom: 5, marginLeft: 5 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#000000ff', borderRadius: 6, paddingHorizontal: 15, paddingVertical: 6, fontSize: 16, marginBottom: 20 },
  passwordInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#000000ff', borderRadius: 6, paddingHorizontal: 15 },
  passwordInput: { flex: 1, paddingVertical: 6, fontSize: 16 },
  signInButton: { backgroundColor: '#1D9DE5', paddingVertical: 15, borderRadius: 25, alignItems: 'center', marginBottom: 5 },
  signInButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  signUpContainer: { alignItems: 'center', marginBottom: 20 },
  signUpText: { fontSize: 12, color: '#1E1E1E', fontWeight: '400' },
  signUpLink: { color: '#1C9BE8', fontWeight: 'bold' },
  footer: { alignItems: 'center', paddingBottom: 20, paddingTop: 10 },
  footerText: { fontSize: 12, color: '#000000', fontWeight: '400', textAlign: 'center' },
  footerLink: { fontSize: 12, color: '#15409F', fontWeight: '500', textDecorationLine: 'underline' },
});

export default SignUp;
