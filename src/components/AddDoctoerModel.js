// AddNewDoctorModal.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, I18nManager } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';

const AddNewDoctorModal = ({ visible, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [doctorName, setDoctorName] = useState('');
  const [doctorPhone, setDoctorPhone] = useState('');
  const [doctorAddress, setDoctorAddress] = useState('');

  const handleSubmit = () => {
    if (!doctorName.trim() || !doctorPhone.trim()) {
      Alert.alert(t('addDoctor.validationError'), t('addDoctor.requiredFields'));
      return;
    }
    const newDoctorData = {
      name: doctorName,
      phone: doctorPhone,
      address: doctorAddress,
    };
    onSubmit(newDoctorData);
    // Reset fields after submission
    setDoctorName('');
    setDoctorPhone('');
    setDoctorAddress('');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isRTL && styles.rtlText]}>{t('addDoctor.addNewDoctor')}</Text>
              <TouchableOpacity onPress={onClose}>
                <Icon name="x" size={24} color="#555" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={[styles.inputLabel, isRTL && styles.rtlText]}>{t('addDoctor.doctorName')}</Text>
              <TextInput
                style={[styles.input, isRTL && styles.rtlText]}
                placeholder={t('addDoctor.doctorNamePlaceholder')}
                value={doctorName}
                onChangeText={setDoctorName}
              />

              <Text style={[styles.inputLabel, isRTL && styles.rtlText]}>{t('addDoctor.phoneNumber')}</Text>
              <TextInput
                style={[styles.input, isRTL && styles.rtlText]}
                placeholder={t('addDoctor.phonePlaceholder')}
                value={doctorPhone}
                onChangeText={setDoctorPhone}
                keyboardType="phone-pad"
              />

              <Text style={[styles.inputLabel, isRTL && styles.rtlText]}>{t('addDoctor.address')}</Text>
              <TextInput
                style={[styles.input, isRTL && styles.rtlText]}
                placeholder={t('addDoctor.addressPlaceholder')}
                value={doctorAddress}
                onChangeText={setDoctorAddress}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={[styles.buttonText, isRTL && styles.rtlText]}>{t('addDoctor.addDoctorAndLogVisit')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '90%', maxHeight: '80%', backgroundColor: 'white', borderRadius: 15, padding: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10, marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#183E9F' },
  modalBody: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 10 },
  input: { height: 50, borderColor: '#E0E0E0', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, fontSize: 16 },
  button: { backgroundColor: '#10B981', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default AddNewDoctorModal;
