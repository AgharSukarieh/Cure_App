import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Linking,
  I18nManager,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import GoBack from '../../../components/GoBack';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function ForgotPasswordScreen({ navigation }) {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;

  const handleEmailPress = () => {
    const email = 'ramikhreishat@gmail.com';
    const subject = 'طلب تغيير كلمة المرور - تطبيق الصيدلية';
    const body = 'السلام عليكم،\n\nأحتاج إلى تغيير كلمة المرور لحسابي في تطبيق الصيدلية.\n\nشكراً لكم.';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(mailtoUrl).catch(() => {
      // إذا فشل فتح التطبيق، انسخ الإيميل
      console.log('Email:', email);
    });
  };

  const handlePhonePress = () => {
    const phoneNumber = '+962791234567'; // رقم وهمي للتوضيح
    const phoneUrl = `tel:${phoneNumber}`;
    
    Linking.openURL(phoneUrl).catch(() => {
      console.log('Phone:', phoneNumber);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <GoBack />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#183E9F', '#4A90E2']}
              style={styles.iconGradient}
            >
              <Feather name="lock" size={32} color="#FFFFFF" />
            </LinearGradient>
          </View>
          
          <Text style={[styles.title, isRTL && styles.rtlText]}>
            نسيت كلمة المرور؟
          </Text>
          
          <Text style={[styles.subtitle, isRTL && styles.rtlText]}>
            لا تقلق! يمكنك التواصل مع المسؤول لتغيير كلمة المرور
          </Text>
        </View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            تواصل مع المسؤول
          </Text>
          
          <Text style={[styles.instructionText, isRTL && styles.rtlText]}>
            يرجى التواصل مع المسؤول عبر أحد الطرق التالية لتغيير كلمة المرور:
          </Text>

          {/* Email Contact */}
          <TouchableOpacity 
            style={[styles.contactCard, isRTL && styles.rtlCard]} 
            onPress={handleEmailPress}
            activeOpacity={0.8}
          >
            <View style={styles.contactIcon}>
              <MaterialIcons name="email" size={24} color="#183E9F" />
            </View>
            
            <View style={styles.contactInfo}>
              <Text style={[styles.contactTitle, isRTL && styles.rtlText]}>
                البريد الإلكتروني
              </Text>
              <Text style={[styles.contactValue, isRTL && styles.rtlText]}>
                ramikhreishat@gmail.com
              </Text>
            </View>
            
            <View style={styles.contactArrow}>
              <Feather name="chevron-right" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          {/* Phone Contact */}
          <TouchableOpacity 
            style={[styles.contactCard, isRTL && styles.rtlCard]} 
            onPress={handlePhonePress}
            activeOpacity={0.8}
          >
            <View style={styles.contactIcon}>
              <Feather name="phone" size={24} color="#183E9F" />
            </View>
            
            <View style={styles.contactInfo}>
              <Text style={[styles.contactTitle, isRTL && styles.rtlText]}>
                الهاتف
              </Text>
              <Text style={[styles.contactValue, isRTL && styles.rtlText]}>
                +962 79 123 4567
              </Text>
            </View>
            
            <View style={styles.contactArrow}>
              <Feather name="chevron-right" size={20} color="#666" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Feather name="info" size={20} color="#4A90E2" />
            </View>
            <Text style={[styles.infoText, isRTL && styles.rtlText]}>
              سيتم الرد على طلبك خلال 24 ساعة
            </Text>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Feather name="shield" size={20} color="#4A90E2" />
            </View>
            <Text style={[styles.infoText, isRTL && styles.rtlText]}>
              سيتم التحقق من هويتك قبل تغيير كلمة المرور
            </Text>
          </View>
        </View>

        {/* Back to Login */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={[styles.backButtonText, isRTL && styles.rtlText]}>
            العودة لتسجيل الدخول
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#183E9F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  contactSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rtlCard: {
    flexDirection: 'row-reverse',
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: '#183E9F',
    fontWeight: '500',
  },
  contactArrow: {
    marginLeft: 8,
  },
  infoSection: {
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#183E9F',
  },
});
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
//   I18nManager,
//   StatusBar,
// } from 'react-native';
// import { useTranslation } from 'react-i18next';
// import GoBack from '../../../components/GoBack';

// export default function ForgotPasswordScreen({ navigation }) {
//   const { t } = useTranslation();
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const isRTL = I18nManager.isRTL;

//   const handleSendOtp = () => {
//     if (phoneNumber.trim() !== '') {
//       navigation.navigate('ChooseVerificationMethodScreen', { phone: phoneNumber });
//     } else {
//       Alert.alert(t('common.error'), t('auth.forgotPasswordScreen.emptyPhoneAlert'));
//     }
//   };

//   const styles = getStyles();

//   return (
//     <SafeAreaView style={styles.container}>

//       <StatusBar barStyle="dark-content" backgroundColor={"#ffffff"} />
//      <GoBack />
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardAvoidingContainer}
//       >
//         <View style={styles.innerContainer}>
//           <View>
//             <Text style={[styles.title, isRTL && styles.rtlText]}>
//               {t('auth.forgotPasswordScreen.title')}
//             </Text>
//             <Text style={[styles.subtitle, isRTL && styles.rtlText]}>
//               {t('auth.forgotPasswordScreen.subtitle')}
//             </Text>
//             <TextInput
//               placeholder={t('auth.forgotPasswordScreen.phonePlaceholder')}
//               placeholderTextColor="#999"
//               style={[styles.input, isRTL && styles.rtlInput]}
//               keyboardType="phone-pad"
//               value={phoneNumber}
//               onChangeText={setPhoneNumber}
//               textAlign={isRTL ? 'right' : 'left'}
//             />
//           </View>

//           <TouchableOpacity style={styles.sendButton} onPress={handleSendOtp}>
//             <Text style={styles.sendButtonText}>{t('auth.forgotPasswordScreen.sendOtpButton')}</Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const getStyles = () => StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: 20,
//   },
//   keyboardAvoidingContainer: {
//     flex: 1,
//   },
//   innerContainer: {
//     flex: 1,
//     justifyContent: 'space-between',
//     paddingBottom: 15,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '500',
//     marginBottom: 20,
//     color: '#2A2A2A',
//     marginTop: 0,
//   },
//   rtlText: {
//     textAlign: 'right',
//     writingDirection: 'rtl',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#A0A0A0',
//     marginBottom: 25,
//     fontWeight: '400',
//   },
//   input: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#D0D0D0',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     marginBottom: 25,
//     fontSize: 16,
//     color: '#333',
//   },
//   rtlInput: {
//     textAlign: 'right',
//     writingDirection: 'rtl',
//   },
//   sendButton: {
//     backgroundColor: '#183E9F',
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   sendButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '700',
//   },
// });
