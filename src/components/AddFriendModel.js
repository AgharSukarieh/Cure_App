import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
  Modal,
  Alert,
  I18nManager,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dropdown } from 'react-native-element-dropdown';
import { useTranslation } from 'react-i18next';

const COUNTRIES = [
  { label: 'Jordan', value: 'JO', code: '+962' },
  { label: 'Iraq', value: 'IQ', code: '+964' },
  { label: 'Saudi Arabia', value: 'SA', code: '+966' },
  { label: 'Egypt', value: 'EG', code: '+20' },
  { label: 'United States', value: 'US', code: '+1' },
];

const AddFriendModal = ({ visible, onClose, onAddContact }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState({ label: 'Jordan', value: 'JO', code: '+962' });
  const [syncToPhone, setSyncToPhone] = useState(true);
  const [isDoneEnabled, setIsDoneEnabled] = useState(false);

  useEffect(() => {
    setIsDoneEnabled(phoneNumber.trim().length > 0);
  }, [phoneNumber]);

  const handleDone = () => {
    if (!isDoneEnabled) return;

    const newContact = {
      id: `contact_${Date.now()}`,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim() || t('addFriend.contactPrefix') + ` ${phoneNumber}`,
      phone: `${country.code}${phoneNumber}`,
      country: country.label,
      avatar: `https://ui-avatars.com/api/?name=${firstName || 'N'}+${lastName || 'C'}&background=random`,
    };

    onAddContact(newContact );
    
    setFirstName('');
    setLastName('');
    setPhoneNumber('');

    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F4F7FC" />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.headerButtonText, isRTL && styles.rtlText]}>{t('addFriend.cancel')}</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isRTL && styles.rtlText]}>{t('addFriend.newContact')}</Text>
          <TouchableOpacity onPress={handleDone} disabled={!isDoneEnabled}>
            <Text style={[styles.headerButtonText, { color: isDoneEnabled ? '#183E9F' : '#B0B0B0' }, isRTL && styles.rtlText]}>
              {t('addFriend.done')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, isRTL && styles.rtlText]}
              placeholder={t('addFriend.firstName')}
              placeholderTextColor="#8E8E93"
              value={firstName}
              onChangeText={setFirstName}
            />
            <View style={styles.separator} />
            <TextInput
              style={[styles.input, isRTL && styles.rtlText]}
              placeholder={t('addFriend.lastName')}
              placeholderTextColor="#8E8E93"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              itemTextStyle={styles.dropdownItemText}
              selectedTextStyle={styles.dropdownSelectedText}
              data={COUNTRIES}
              labelField="label"
              valueField="value"
              value={country.value}
              onChange={item => setCountry(item)}
              renderLeftIcon={() => <Text style={[styles.inputLabel, isRTL && styles.rtlText]}>{t('addFriend.country')}</Text>}
            />
            <View style={styles.separator} />
            <View style={styles.phoneInputContainer}>
              <Text style={styles.countryCode}>{country.code}</Text>
              <TextInput
                style={[styles.input, { flex: 1 }, isRTL && styles.rtlText]}
                placeholder={t('addFriend.phone')}
                placeholderTextColor="#8E8E93"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.syncContainer}>
              <Text style={[styles.inputLabel, isRTL && styles.rtlText]}>{t('addFriend.syncContact')}</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={syncToPhone ? '#183E9F' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => setSyncToPhone(previousState => !previousState)}
                value={syncToPhone}
              />
            </View>
          </View>

          {/* <TouchableOpacity style={styles.qrButton}>
            <MaterialCommunityIcons name="qrcode-scan" size={20} color="#183E9F" />
            <Text style={styles.qrButtonText}>Add via QR code</Text>
          </TouchableOpacity> */}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  headerButtonText: { fontSize: 17, color: '#183E9F' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#000' },
  formContainer: { padding: 20 },
  inputGroup: { backgroundColor: '#fff', borderRadius: 10, marginBottom: 25, borderWidth: 1, borderColor: '#E0E0E0' },
  input: { fontSize: 17, paddingHorizontal: 15, height: 50 },
  separator: { height: 1, backgroundColor: '#E0E0E0', marginLeft: 15 },
  inputLabel: { fontSize: 17, color: '#000', marginRight: 'auto', paddingLeft: 15 },
  phoneInputContainer: { flexDirection: 'row', alignItems: 'center', paddingLeft: 15 },
  countryCode: { fontSize: 17, color: '#183E9F', marginRight: 10 },
  dropdown: { height: 50, paddingRight: 15 },
  dropdownContainer: { borderRadius: 10 },
  dropdownItemText: { fontSize: 16, color: '#000' },
  dropdownSelectedText: { fontSize: 17, color: '#183E9F', fontWeight: '500' },
  syncContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 50, paddingRight: 15 },
  qrButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  qrButtonText: { marginLeft: 10, fontSize: 16, color: '#183E9F', fontWeight: '500' },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default AddFriendModal;
