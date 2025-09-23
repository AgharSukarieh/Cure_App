import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  I18nManager,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import GoBack from '../../../components/GoBack';

export default function ForgotPasswordScreen({ navigation }) {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const isRTL = I18nManager.isRTL;

  const handleSendOtp = () => {
    if (phoneNumber.trim() !== '') {
      navigation.navigate('ChooseVerificationMethodScreen', { phone: phoneNumber });
    } else {
      Alert.alert(t('common.error'), t('auth.forgotPasswordScreen.emptyPhoneAlert'));
    }
  };

  const styles = getStyles();

  return (
    <SafeAreaView style={styles.container}>
     <GoBack />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingContainer}
      >
        <View style={styles.innerContainer}>
          <View>
            <Text style={[styles.title, isRTL && styles.rtlText]}>
              {t('auth.forgotPasswordScreen.title')}
            </Text>
            <Text style={[styles.subtitle, isRTL && styles.rtlText]}>
              {t('auth.forgotPasswordScreen.subtitle')}
            </Text>
            <TextInput
              placeholder={t('auth.forgotPasswordScreen.phonePlaceholder')}
              placeholderTextColor="#999"
              style={[styles.input, isRTL && styles.rtlInput]}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              textAlign={isRTL ? 'right' : 'left'}
            />
          </View>

          <TouchableOpacity style={styles.sendButton} onPress={handleSendOtp}>
            <Text style={styles.sendButtonText}>{t('auth.forgotPasswordScreen.sendOtpButton')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 20,
    color: '#2A2A2A',
    marginTop: 0,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    marginBottom: 25,
    fontWeight: '400',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 25,
    fontSize: 16,
    color: '#333',
  },
  rtlInput: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  sendButton: {
    backgroundColor: '#183E9F',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
