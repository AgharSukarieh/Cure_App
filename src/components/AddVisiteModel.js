// AddVisiteModel.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, I18nManager } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Feather';
import AddDoctoerModel from './AddDoctoerModel';
import { useTranslation } from 'react-i18next';

// --- تم التعديل: تغيير اسم الخاصية onAddNewDoctor إلى onAddNewDoctorAndLog ---
const AddVisitModal = ({ visible, onClose, doctors, onLogVisit, onAddNewDoctorAndLog }) => {
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [isAddDoctorModalVisible, setAddDoctorModalVisible] = useState(false);

  const handleLogVisit = () => {
    if (selectedDoctorId) {
      onLogVisit(selectedDoctorId);
      setSelectedDoctorId(null);
      onClose();
    } else {
      Alert.alert(t('addVisitModal.selectDoctor'));
    }
  };

  const openAddNewDoctorModal = () => {
    onClose(); // إغلاق المودال الحالي قبل فتح الجديد لتجنب التداخل
    setTimeout(() => {
        setAddDoctorModalVisible(true);
    }, 300); // تأخير بسيط لتحسين الانتقال
  };

  // --- تم التعديل: هذه الدالة ستستدعي الدالة الجديدة من الشاشة الرئيسية ---
  const handleDoctorSubmit = (newDoctorData) => {
    setAddDoctorModalVisible(false); // إغلاق مودال إضافة الطبيب
    onAddNewDoctorAndLog(newDoctorData); // استدعاء الدالة الرئيسية من الشاشة الأم
    // لا حاجة لاستدعاء onClose() هنا لأنه تم إغلاقه بالفعل
  };

  const handleCloseAddDoctorModal = () => {
    setAddDoctorModalVisible(false);
  }

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isRTL && styles.rtlText]}>{t('addVisitModal.logNewVisit')}</Text>
              <TouchableOpacity onPress={onClose}>
                <Icon name="x" size={24} color="#555" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('addVisitModal.logVisitExisting')}</Text>
              <Dropdown
                style={styles.dropdown}
                data={doctors}
                labelField="doctor_name"
                valueField="id"
                placeholder={t('addVisitModal.selectDoctorFromList')}
                value={selectedDoctorId}
                onChange={item => setSelectedDoctorId(item.id)}
                search
                searchPlaceholder={t('addVisitModal.search')}
                itemTextStyle={{ color: '#333' }}
                selectedTextStyle={{ fontSize: 16, color: '#333' }}
                placeholderStyle={{ fontSize: 16, color: '#999' }}
              />
              <TouchableOpacity style={styles.button} onPress={handleLogVisit}>
                <Text style={[styles.buttonText, isRTL && styles.rtlText]}>{t('addVisitModal.confirmVisit')}</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>{t('addVisitModal.addNewDoctorVisited')}</Text>
              <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={openAddNewDoctorModal}>
                <Text style={[styles.buttonText, { color: '#183E9F' }, isRTL && styles.rtlText]}>{t('addVisitModal.addNewDoctor')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <AddDoctoerModel
        visible={isAddDoctorModalVisible}
        onClose={handleCloseAddDoctorModal}
        onSubmit={handleDoctorSubmit}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '90%', backgroundColor: 'white', borderRadius: 15, padding: 20, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10, marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#183E9F' },
  modalBody: {},
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 15 },
  dropdown: { height: 50, borderColor: '#E0E0E0', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, marginBottom: 15 },
  button: { backgroundColor: '#183E9F', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 25 },
  secondaryButton: { backgroundColor: '#E8EAF0' },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default AddVisitModal;
