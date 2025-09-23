import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  I18nManager,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import GoBack from '../../../components/GoBack';
export default function VerificationScreen({ navigation }) {
  const { t } = useTranslation();
  const [code, setCode] = useState(['', '', '', '', '']);
  const inputs = useRef([]);
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const isRTL = I18nManager.isRTL;

  useEffect(() => {
    let interval;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(interval);
            setIsTimerActive(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerActive]);

  const handleChange = (text, index) => {
    const newCode = [...code];
    
    if (text.length === 5 && index === 0) {
      const chars = text.split('');
      for (let i = 0; i < 5; i++) {
        newCode[i] = chars[i] || '';
      }
      setCode(newCode);
      inputs.current[4]?.focus();
      return;
    }

    newCode[index] = text;
    setCode(newCode);

    if (text && index < 4) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = code.join('');
    if (fullCode.length === 5) {
      navigation.navigate('SetNewPasswordScreen');
    } else {
      Alert.alert(t('common.error'), t('auth.verificationScreen.errorIncompleteCode'));
    }
  };

  const handleResend = () => {
    if (!isTimerActive) {
      Alert.alert(t('auth.verificationScreen.codeResentAlert'));
      setTimer(60);
      setIsTimerActive(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <GoBack />
        <View style={styles.innerContainer}>
          <View style={styles.content}>
            <Text style={[styles.title, isRTL && styles.rtlText]}>
              {t('auth.verificationScreen.title')}
            </Text>
            <Text style={[styles.subtitle, isRTL && styles.rtlText]}>
              {t('auth.verificationScreen.subtitle')}
            </Text>
            <View style={[
              styles.codeContainer,
              isRTL ? styles.codeContainerLTR : styles.codeContainerRTL
            ]}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(el) => { inputs.current[index] = el; }}
                  style={[styles.input, digit ? styles.inputActive : styles.inputInactive]}
                  keyboardType="number-pad"
                  maxLength={index === 0 ? 5 : 1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  autoFocus={index === 0}
                />
              ))}
            </View>
            <View style={styles.resendContainer}>
              {isTimerActive ? (
                <Text style={[styles.resendText, isRTL && styles.rtlText]}>
                  {t('auth.verificationScreen.resendAfter')}{' '}
                  <Text style={styles.timerText}>{`00:${timer.toString().padStart(2, '0')}`}</Text>
                </Text>
              ) : (
                <Text style={[styles.resendText, isRTL && styles.rtlText]}>
                  {t('auth.verificationScreen.resendText')}{' '}
                  <Text style={styles.resendLink} onPress={handleResend}>
                    {t('auth.verificationScreen.resendLink')}
                  </Text>
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
            <Text style={styles.verifyButtonText}>{t('auth.verificationScreen.verifyButton')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
   
  },
  content: {
  
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#2A2A2A',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    marginBottom: 40,
  },
  codeContainer: {
    justifyContent: 'center',
    gap: 12,
    marginBottom: 30,
  },
  codeContainerLTR: {
    flexDirection: 'row-reverse',
  },
  codeContainerRTL: {
    flexDirection: 'row',
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 1.5,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 22,
    backgroundColor: '#f9f9f9',
  },
  inputInactive: {
    borderColor: '#E0E0E0',
  },
  inputActive: {
    borderColor: '#183E9F',
    color: '#222',
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 16,
    color: '#5A5A5A',
    fontWeight: '500',
  },
  timerText: {
    color: '#FEAC39',
    fontWeight: 'bold',
  },
  resendLink: {
    color: '#2F86A6',
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: '#183E9F',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
  },
});
