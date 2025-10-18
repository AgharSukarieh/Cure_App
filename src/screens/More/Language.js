import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  I18nManager,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import GoBack from '../../components/GoBack';
import { useTranslation } from 'react-i18next';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';

const languagesData = (t) => [
  {
    id: 'ar',
    title: t('changeLanguageScreen.languages.ar.title'),
    subtitle: t('changeLanguageScreen.languages.ar.subtitle'),
    flag: require('../../../assets/images/ps.png'),
  },
  {
    id: 'en',
    title: t('changeLanguageScreen.languages.en.title'  ),
    subtitle: t('changeLanguageScreen.languages.en.subtitle'),
    flag: require('../../../assets/images/us.png'),
  },
];

const ChangeLanguageScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const languages = languagesData(t);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [isLoading, setIsLoading] = useState(false);


  const handleSave = async () => {
    if (selectedLanguage === i18n.language) {
      navigation.goBack();
      return;
    }

    setIsLoading(true);

    try {
      await AsyncStorage.setItem('user-language', selectedLanguage);

      i18n.changeLanguage(selectedLanguage);
      const isRTL = selectedLanguage === 'ar';
      I18nManager.forceRTL(isRTL);
      I18nManager.allowRTL(isRTL);

      setTimeout(() => {
        RNRestart.Restart();
      }, 1500);
    } catch (error) {
      console.error("Failed to save language or restart the app.", error);
      setIsLoading(false);
      Alert.alert("Error", "Could not save the language settings. Please try again.");
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
       
     
       <GoBack text={t("changeLanguageScreen.headerTitle")}/> 
 
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {languages.map((item) => {
          const selected = selectedLanguage === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.languageCard,
                selected && styles.languageCardSelected,
              ]}
              onPress={() => setSelectedLanguage(item.id)}
            >
              <View style={styles.languageRow}>
                <Image source={item.flag} style={styles.flag} />
                <View style={{ marginLeft: 14 }}>
                  <Text style={styles.languageTitle}>{item.title}</Text>
                  <Text style={styles.languageSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <FontAwesome
                name="check-circle"
                size={20}
                color={selected ? '#1b90b4' : '#ccc'}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity 
        style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
        onPress={handleSave} 
        disabled={isLoading}
      >
        <Text style={styles.saveButtonText}>
          {isLoading ? 'تغيير اللغة...' : t('changeLanguageScreen.saveButtonText')}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={isLoading}
        animationType="fade"
      >
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2C8EB3" />
            <Text style={styles.loadingText}>تغيير اللغة...</Text>
            <Text style={styles.loadingSubText}>يرجى الانتظار بينما نقوم بإعادة تشغيل التطبيق</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ChangeLanguageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  languageCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  languageCardSelected: {
    borderColor: '#1b90b4',
  },
  languageRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  flag: {
    width: 42,
    height: 32,
    borderRadius: 6,
    marginLeft: 8,
  },
  languageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  languageSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  saveButton: {
    backgroundColor: '#183E9F',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom:30
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    minWidth: 200,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    textAlign: 'center',
  },
  loadingSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});
