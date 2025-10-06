import React, { useState, useRef, useEffect } from 'react';
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
  Alert,
  Animated,
  ScrollView,
  Dimensions,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { I18nManager } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

const SignIn = ({ navigation }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [isSignUpPasswordVisible, setIsSignUpPasswordVisible] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const inputWidthAnim = useRef(new Animated.Value(0)).current;
  const buttonWidthAnim = useRef(new Animated.Value(0)).current;
  const logoFloatAnim = useRef(new Animated.Value(0)).current;
  const footerFloatAnim = useRef(new Animated.Value(0)).current;
  
  const cardFlipAnim = useRef(new Animated.Value(0)).current;
  
  const screenHeight = Dimensions.get('window').height;
  const isSmallScreen = screenHeight < 700;
  const isTinyScreen = screenHeight < 600;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
///==========================================

// farah@gmail.com 123456789

const { login , register } = useAuth();

const LoginPress = async () => {
  setIsLoading(true);
  
  // 1. التحقق من أن الحقول غير فارغة
  if (email === '' || password === '') {
    setIsLoading(false);
    Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني وكلمة المرور');
    return;
  }
  
  // 2. التحقق من صحة البريد الإلكتروني
  if (!regex.test(email)) {
    setIsLoading(false);
    Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
    return;
  }
  
  try {
    // 3. إرسال الطلب للـ API
    console.log('🚀 محاولة تسجيل الدخول:', { email, password: '***' });
    const result = await login(email, password);
    console.log('=======================================================Login result:', result);
    console.log('🔍 Result.success:', result.success);
    console.log('🔍 Result.message:', result.message);
    console.log('🔍 Result.error:', result.error);
    setIsLoading(false);
    
    // 4. التحقق من النتيجة
    if (result.success && result.data && result.data.user && result.data.token) {
      // 5. نجح تسجيل الدخول - الانتقال للصفحة الرئيسية
      console.log('✅ Login successful, navigating to BottomTabs');
      navigation.navigate('BottomTabs');
    } else {
      // 6. فشل تسجيل الدخول - عرض رسالة خطأ
      console.log('❌ Login failed:', result.message);
      console.log('❌ Result.error:', result.error);
      console.log('❌ Result.fullResponse:', result.fullResponse);
      Alert.alert('خطأ في تسجيل الدخول', result.message || result.error || 'فشل في تسجيل الدخول');
    }
  } catch (error) {
    setIsLoading(false);
    console.log('❌ Login error:', error);
    console.log('❌ Error.message:', error.message);
    console.log('❌ Error.stack:', error.stack);
    Alert.alert('خطأ في تسجيل الدخول', error.message || 'حدث خطأ في الاتصال بالخادم');
  }
};

///==========================================
const RegisterPress = async () => {
  setIsLoading(true);
  if (signUpEmail != '' && signUpPassword != '') {
  

    if (regex.test(signUpEmail)) {
      await register(name,signUpEmail, signUpPassword)
        .then((e) => {
          setIsLoading(false);

    if (e.data === 'success') { 
          toggleCard();
        }})
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
///==========================================
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(buttonWidthAnim, {
        toValue: 1,
        tension: 15,
        friction: 8,
        useNativeDriver: false,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoFloatAnim, {
            toValue: -10,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(logoFloatAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(footerFloatAnim, {
            toValue: -5,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(footerFloatAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    Animated.timing(inputWidthAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: false,
    }).start();

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const toggleCard = () => {
    Animated.timing(cardFlipAnim, {
      toValue: isSignUp ? 0 : 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    
    setTimeout(() => {
      setIsSignUp(!isSignUp);
    }, 300);
  };

  // const handleSignIn = async () => {
  //   if (!email || !password) {
  //     Alert.alert('Error', 'Make sure to enter Email and Password');
  //     return;
  //   }
  //   if (!regex.test(email)) {
  //     Alert.alert('Error', 'Enter a valid email');
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     console.log('Login attempt:', email);
  //     setIsLoading(false);
  //     navigation.replace('BottomTabs');
  //   } catch (err) {
  //     setIsLoading(false);
  //     Alert.alert('Login Error', err?.response?.data?.message || 'Something went wrong');
  //   }
  // };

  

  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: cardFlipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      {
        rotateY: cardFlipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
  };

  const renderSignInCard = () => (
    <View style={styles.cardContent}>
      <Text style={[styles.label, { fontSize: isSmallScreen ? 10 : 12, textAlign:  isRTL ? 'left' : 'left' }]}>{t('auth.email')}</Text>
      <Animated.View 
        style={[
          styles.inputContainer,
          {
            marginBottom: isSmallScreen ? 12 : 20,
            width: inputWidthAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              paddingVertical: isSmallScreen ? 8 : 6,
              fontSize: isSmallScreen ? 14 : 16,
              textAlign: isRTL ? 'right' : 'left',
            }
          ]}
          placeholder={t('auth.emailPlaceholder')}
          placeholderTextColor="#AC9E9E"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </Animated.View>

      <Text style={[styles.label, { fontSize: isSmallScreen ? 10 : 12, textAlign: isRTL ? 'left' : 'left' }]}>{t('auth.password')}</Text>
      <Animated.View 
        style={[
          styles.passwordContainer,
          {
            marginBottom: isSmallScreen ? 3 : 5,
            width: inputWidthAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }
        ]}
      >
        <View style={[styles.passwordInputContainer, { flexDirection: isRTL ? 'row' : 'row' }]}>
          <TextInput
            style={[
              styles.passwordInput,
              {
                paddingVertical: isSmallScreen ? 8 : 6,
                fontSize: isSmallScreen ? 14 : 16,
                textAlign: isRTL ? 'right' : 'left',
              }
            ]}
            placeholder={t('auth.passwordPlaceholder')}
            placeholderTextColor="#A9A9A9"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={{textAlign: isRTL ? 'right' : 'left'}}>
            <Icon 
              name={isPasswordVisible ? 'eye' : 'eye-off'} 
              size={isSmallScreen ? 16 : 18} 
              color="#888" 
             
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')} style={{textAlign: isRTL ? 'left' : 'right'}}>
        <Text style={[
          styles.forgotPasswordText,
          {
            fontSize: isSmallScreen ? 10 : 12,
            marginBottom: isSmallScreen ? 15 : 25,
          }
        ]}>{t('auth.forgotPassword')}</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <Animated.View
          style={[
            styles.signInButtonAnimated,
            {
              width: buttonWidthAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 270],
              }),
            }
          ]}
        >
          <TouchableOpacity style={styles.signInButton} onPress={LoginPress}>
            <Text style={styles.signInButtonText}>
              {isLoading ? t('auth.signingIn') : t('auth.signIn')}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <TouchableOpacity style={styles.signUpContainer} onPress={toggleCard}>
        <Text style={[styles.signUpText, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('auth.noAccount')}{' '}
          <Text style={styles.signUpLink}>{t('auth.signUp')}</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSignUpCard = () => (
    <View style={styles.cardContent}>
      <Text style={[styles.label, { fontSize: isSmallScreen ? 10 : 12, textAlign: isRTL ? 'left' : 'left' }]}>{t('auth.username')}</Text>
      <Animated.View 
        style={[
          styles.inputContainer,
          {
            marginBottom: isSmallScreen ? 12 : 20,
            width: inputWidthAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              paddingVertical: isSmallScreen ? 8 : 6,
              fontSize: isSmallScreen ? 14 : 16,
              textAlign: isRTL ? 'right' : 'left',
            }
          ]}
          placeholder={t('auth.usernamePlaceholder')}
          placeholderTextColor="#AC9E9E"
          autoCapitalize="none"
          value={name}
          onChangeText={setName}
        />
      </Animated.View>

      <Text style={[styles.label, { fontSize: isSmallScreen ? 10 : 12, textAlign: isRTL ? 'left' : 'left' }]}>{t('auth.email')}</Text>
      <Animated.View 
        style={[
          styles.inputContainer,
          {
            marginBottom: isSmallScreen ? 12 : 20,
            width: inputWidthAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              paddingVertical: isSmallScreen ? 8 : 6,
              fontSize: isSmallScreen ? 14 : 16,
              textAlign: isRTL ? 'right' : 'left',
            }
          ]}
          placeholder={t('auth.emailPlaceholder')}
          placeholderTextColor="#AC9E9E"
          keyboardType="email-address"
          autoCapitalize="none"
          value={signUpEmail}
          onChangeText={setSignUpEmail}
        />
      </Animated.View>

      <Text style={[styles.label, { fontSize: isSmallScreen ? 10 : 12, textAlign: isRTL ? 'left' : 'left' }]}>{t('auth.password')}</Text>
      <Animated.View 
        style={[
          styles.passwordContainer,
          {
            marginBottom: isSmallScreen ? 15 : 25,
            width: inputWidthAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }
        ]}
      >
        <View style={[styles.passwordInputContainer, { flexDirection: isRTL ? 'row' : 'row' }]}>
          <TextInput
            style={[
              styles.passwordInput,
              {
                paddingVertical: isSmallScreen ? 8 : 6,
                fontSize: isSmallScreen ? 14 : 16,
                textAlign: isRTL ? 'right' : 'left',
              }
            ]}
            placeholder={t('auth.passwordPlaceholder')}
            placeholderTextColor="#A9A9A9"
            secureTextEntry={!isSignUpPasswordVisible}
            value={signUpPassword}
            onChangeText={setSignUpPassword}
          />
          <TouchableOpacity onPress={() => setIsSignUpPasswordVisible(!isSignUpPasswordVisible)}>
            <Icon 
              name={isSignUpPasswordVisible ? 'eye' : 'eye-off'} 
              size={isSmallScreen ? 16 : 18} 
              color="#888" 
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <Animated.View
          style={[
            styles.signInButtonAnimated,
            {
              width: buttonWidthAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 270],
              }),
            }
          ]}
        >
          <TouchableOpacity style={styles.signInButton} onPress={RegisterPress}>
            <Text style={styles.signInButtonText}>
              {isSignUpLoading ? t('auth.signingUp') : t('auth.signUp')}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <TouchableOpacity style={styles.signUpContainer} onPress={toggleCard}>
        <Text style={[styles.signUpText, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('auth.haveAccount')}{' '}
          <Text style={styles.signUpLink}>{t('auth.signIn')}</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={"#E0F2FF"} />
      <LinearGradient
        colors={['#E0F2FF', '#A8D5F0', '#6DB3D9']}
        style={styles.gradientBackground}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView
              contentContainerStyle={[
                styles.scrollContainer,
                {
                  paddingBottom: isKeyboardVisible ? 10 : 20,
                  flexGrow: 1,
                }
              ]}
              showsVerticalScrollIndicator={false}
              bounces={true}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={false}
            >
            <Animated.View 
              style={[
                styles.logoContainer,
                {
                  marginTop: isKeyboardVisible ? 5 : (isSmallScreen ? 10 : 30),
                  marginBottom: isKeyboardVisible ? 5 : (isSmallScreen ? 10 : 20),
                  transform: [{ translateY: logoFloatAnim }],
                }
              ]}
            >
              <Image
                source={require('../../../assets/logo2__.png')}
                style={[
                  styles.logo,
                  {
                    width: isKeyboardVisible ? 80 : (isSmallScreen ? 120 : isTinyScreen ? 100 : 200),
                    height: isKeyboardVisible ? 80 : (isSmallScreen ? 120 : isTinyScreen ? 100 : 200),
                  }
                ]}
              />
            </Animated.View>

            <View style={[
              styles.cardContainer,
              {
                marginTop: isKeyboardVisible ? -10 : -30,
                marginBottom: isKeyboardVisible ? 10 : 30,
              }
            ]}>
              <Animated.View 
                style={[
                  styles.card,
                  styles.cardFront,
                  frontAnimatedStyle,
                  {
                    transform: [
                      { scaleY: scaleAnim },
                      { translateY: Animated.multiply(logoFloatAnim, -0.5) },
                      {
                        rotateY: cardFlipAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '180deg'],
                        }),
                      },
                    ],
                    opacity: opacityAnim,
                  }
                ]}
              >
                {!isSignUp && renderSignInCard()}
              </Animated.View>

              <Animated.View 
                style={[
                  styles.card,
                  styles.cardBack,
                  backAnimatedStyle,
                  {
                    transform: [
                      { scaleY: scaleAnim },
                      { translateY: Animated.multiply(logoFloatAnim, -0.5) },
                      {
                        rotateY: cardFlipAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['180deg', '360deg'],
                        }),
                      },
                    ],
                    opacity: opacityAnim,
                  }
                ]}
              >
                {isSignUp && renderSignUpCard()}
              </Animated.View>
            </View>

            {!isKeyboardVisible && (
              <Animated.View 
                style={[
                  styles.footer,
                  {
                    paddingBottom: isSmallScreen ? 10 : 20,
                    paddingTop: isSignUp ? 20 : 80,
                    transform: [{ translateY: footerFloatAnim }],
                  }
                ]}
              >
                <Text style={[
                  styles.footerText,
                  { fontSize: isSmallScreen ? 10 : 12, textAlign: isRTL ? 'right' : 'left' }
                ]}>
                  {t('auth.agreeText', { action: isSignUp ? t('auth.signingUp') : t('auth.signingIn') })}
                </Text>
                <View style={[styles.footerLinksContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <TouchableOpacity>
                    <Text style={[
                      styles.footerLink,
                      { fontSize: isSmallScreen ? 10 : 12 }
                    ]}>{t('auth.terms')}</Text>
                  </TouchableOpacity>
                  <Text style={[
                    styles.footerText,
                    { fontSize: isSmallScreen ? 10 : 12 }
                  ]}> {t('auth.and')} </Text>
                  <TouchableOpacity>
                    <Text style={[
                      styles.footerLink,
                      { fontSize: isSmallScreen ? 10 : 12 }
                    ]}>{t('auth.privacy')}</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            )}
            </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  gradientBackground: { flex: 1 },
  container: { flex: 1 },
  scrollContainer: { 
    flexGrow: 1, 
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoContainer: { 
    alignItems: 'center', 
    marginTop: 30,
    marginBottom: 20,
  },
  logo: { 
    width: 200, 
    height: 200, 
    resizeMode: 'contain',
  },
  cardContainer: {
    marginHorizontal: 10,
    marginTop: -30,
    marginBottom: 30,
    position: 'relative',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 15,
    paddingVertical: 40,
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    position: 'relative',
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  cardScrollView: {
    flex: 1,
  },
  cardScrollView: {
    flex: 1,
  },
  cardContent: {
    flexGrow: 1,
  },
  label: { 
    fontSize: 10, 
    color: '#555', 
    marginBottom: 5, 
    marginLeft: 5,
    textAlign: 'left',
  },
  inputContainer: {
    marginBottom: 20,
    overflow: 'hidden', 
  },
  input: {
    borderWidth: 1,
    borderColor: '#183E9F',
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 6,
    fontSize: 16,
    color: '#000',
    width: '100%',
    textAlign: 'left',
  },
  passwordContainer: {
    marginBottom: 0,
    overflow: 'hidden', 
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#183E9F',
    borderRadius: 6,
    paddingHorizontal: 15,
    width: '100%',
  },
  passwordInput: { 
    flex: 1, 
    paddingVertical: 6, 
    fontSize: 16, 
    color: '#000',
    textAlign: 'left',
  },
  forgotPasswordText: { 
    textAlign: I18nManager.isRTL ? 'left' : 'right', 
    color: '#007AFF', 
    fontSize: 12, 
    marginTop: 1, 
    marginBottom: 25 
  },
  buttonContainer: {
    alignItems: 'center', 
    marginBottom: 5,
  },
  signInButtonAnimated: {
    height: 45, 
    borderRadius: 25, 
    overflow: 'hidden',
    justifyContent: 'center',
    shadowColor: '#1D9DE5',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  signInButton: { 
    backgroundColor: '#183E9F', 
    flex: 1,
    borderRadius: 25, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  signInButtonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '800' 
  },
  signUpContainer: { 
    alignItems: 'center', 
    marginBottom: 20 
  },
  signUpText: { 
    fontSize: 12, 
    color: '#1E1E1E', 
    fontWeight: '400' 
  },
  signUpLink: { 
    color: '#1C9BE8', 
    fontWeight: 'bold' 
  },
  footer: { 
    alignItems: 'center', 
    paddingBottom: 0, 
    paddingTop: 80,
    marginTop: 'auto',
  },
  footerText: { 
    fontSize: 12, 
    color: '#000000', 
    fontWeight: '400' 
  },
  footerLinksContainer: { 
    flexDirection: 'row', 
    marginTop: 4 
  },
  footerLink: { 
    fontSize: 12, 
    color: '#15409F', 
    fontWeight: '500', 
    textDecorationLine: 'underline' 
  },
});

export default SignIn;