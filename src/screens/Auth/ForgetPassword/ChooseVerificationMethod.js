import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  I18nManager,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import GoBack from '../../../components/GoBack';

const maskPhoneNumber = (phone) => {
  if (phone.length > 4) {
    return `***** ***${phone.slice(-2)}`;
  }
  return phone;
};

export default function ChooseVerificationMethodScreen({ navigation, route }) {
  const { t } = useTranslation();
  const phone = route.params?.phone || '';
  const isRTL = I18nManager.isRTL;

  const handleContinue = () => {
    navigation.navigate('VerificationScreen', { phone });
  };

  const styles = getStyles();

  return (
    <SafeAreaView style={styles.container}>
      <GoBack  />
      <View style={styles.innerContainer}>
        <View>
          <Text style={[styles.title, isRTL && styles.rtlText]}>
            {t('auth.chooseVerification.title')}
          </Text>
          <Text style={[styles.subtitle, isRTL && styles.rtlText]}>
            {t('auth.chooseVerification.subtitle')}
          </Text>

          <TouchableOpacity style={[
            styles.optionButton,
            isRTL ? styles.optionButtonRTL : styles.optionButtonLTR
          ]}>
            <View style={[
              styles.iconContainer,
              isRTL ? { marginLeft: 15 } : { marginRight: 15 }
            ]}>
              <Text style={styles.iconText}>💬</Text>
            </View>
            <View>
              <Text style={[styles.optionTitle, isRTL && styles.rtlText]}>
                {t('auth.chooseVerification.viaSms')}
              </Text>
              <Text style={[styles.optionValue, isRTL && styles.rtlText]}>
                {maskPhoneNumber(phone)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>{t('common.continue')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 0,
    
    marginBottom: 12,
    textAlign: 'center',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  optionButton: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#183E9F',
    borderRadius: 12,
    padding: 15,
    backgroundColor: '#F9FFFF',
  },
  optionButtonLTR: {
    flexDirection: 'row',
  },
  optionButtonRTL: {
    flexDirection: 'row-reverse',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  iconText: {
    fontSize: 24,
  },
  optionTitle: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  optionValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 5,
  },
  continueButton: {
    backgroundColor: '#183E9F',

    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
