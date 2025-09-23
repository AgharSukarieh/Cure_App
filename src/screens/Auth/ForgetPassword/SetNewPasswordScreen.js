import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  I18nManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import GoBack from '../../../components/GoBack';

export default function SetNewPasswordScreen({ navigation }) {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSave = () => {
    if (password.length < 6) {
      Alert.alert(t('common.error'), t('auth.setNewPasswordScreen.passwordTooShort'));
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t('common.error'), t('auth.setNewPasswordScreen.passwordsDoNotMatch'));
      return;
    }
    Alert.alert(t('common.error'), t('auth.setNewPasswordScreen.passwordTooShort'));
    navigation.navigate('SuccessUpdatePassword');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <GoBack />
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>{t('auth.setNewPasswordScreen.title')}</Text>
            <Text style={styles.subtitle}>{t('auth.setNewPasswordScreen.subtitle')}</Text>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder={t('auth.setNewPasswordScreen.passwordPlaceholder')}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity style={styles.icon} onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color="#B8B8B8"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder={t('auth.setNewPasswordScreen.confirmPasswordPlaceholder')}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity style={styles.icon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                 <Icon
                   name={showConfirmPassword ? 'eye' : 'eye-off'}
                   size={20}
                   color="#B8B8B8"
                 />
              </TouchableOpacity>
            </View>

            <Text style={styles.note}>{t('auth.setNewPasswordScreen.note')}</Text>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>{t('common.save')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    
  },
  content: {
    width: '100%',
    alignItems: 'center',
    
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#414141',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#A0A0A0',
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '400',
  },
  inputWrapper: {
    flexDirection:  I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#183E9F',
    borderRadius: 10,
    width: '100%',
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlign: I18nManager.isRTL ? 'right' : 'left', 
  },
  icon: {
    marginLeft: 10,
  },
  note: {
    fontSize: 14,
    color: '#A6A6A6',
    paddingHorizontal: 5,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    width: '100%',
    fontWeight: "500",
  },
  saveBtn: {
    backgroundColor: '#183E9F',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
