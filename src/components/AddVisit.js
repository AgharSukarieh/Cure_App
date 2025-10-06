import React, { useState } from 'react';
import {
    View, Text, StyleSheet, Modal, TouchableOpacity,
    TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView, I18nManager
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Moment from 'moment';
import DatePicker from 'react-native-date-picker';
import { Dropdown } from 'react-native-element-dropdown';
import { useTranslation } from 'react-i18next';

const AddVisit = ({ visible, onClose, onSubmit, existingDoctors = [] }) => {
    const { t } = useTranslation();
    const isRTL = I18nManager.isRTL;
    const [doctorName, setDoctorName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [time, setTime] = useState(new Date());
    const [status, setStatus] = useState('Pending'); 
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);

    const handleDoctorSelect = (doctor) => {
        setDoctorName(doctor.doctorName);
        setSpecialty(doctor.specialty);
    };

    const handleSubmit = () => {
        if (!doctorName.trim() || !specialty.trim()) {
            Alert.alert(t('addVisit.missingInfo'), t('addVisit.fillDoctorInfo'));
            return;
        }

        const newVisitData = {
            id: Date.now(),
            doctorName,
            specialty,
            appointmentTime: Moment(time).format('hh:mm A'),
            lastVisit: Moment().format('YYYY-MM-DD'),
            status: status, 
            visitDate: Moment().format('YYYY-MM-DD'),
        };

        onSubmit(newVisitData);
        setDoctorName('');
        setSpecialty('');
        setTime(new Date());
        setStatus('Pending');
        onClose();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalOverlay}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, isRTL && styles.rtlText]}>{t('addVisit.addNewVisit')}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color="#A0AEC0" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={[styles.label, isRTL && styles.rtlText]}>{t('addVisit.selectExistingDoctor')}</Text>
                        <Dropdown
                            style={styles.input}
                            data={existingDoctors}
                            labelField="doctorName"
                            valueField="id"
                            placeholder={t('addVisit.chooseFromList')}
                            placeholderStyle={styles.placeholder}
                            onChange={handleDoctorSelect}
                            renderLeftIcon={() => <Feather name="user-check" size={20} color="#A0AEC0" style={styles.icon} />}
                        />

                        <View style={styles.dividerContainer}>
                            <View style={styles.divider} />
                            <Text style={[styles.dividerText, isRTL && styles.rtlText]}>{t('addVisit.or')}</Text>
                            <View style={styles.divider} />
                        </View>

                        <Text style={[styles.label, isRTL && styles.rtlText]}>{t('addVisit.doctorName')}</Text>
                        <TextInput
                            style={[styles.input, isRTL && styles.rtlText]}
                            placeholder={t('addVisit.enterDoctorName')}
                            placeholderTextColor="#A0AEC0"
                            value={doctorName}
                            onChangeText={setDoctorName}
                        />

                        <Text style={[styles.label, isRTL && styles.rtlText]}>{t('addVisit.specialty')}</Text>
                        <TextInput
                            style={[styles.input, isRTL && styles.rtlText]}
                            placeholder={t('addVisit.enterSpecialty')}
                            placeholderTextColor="#A0AEC0"
                            value={specialty}
                            onChangeText={setSpecialty}
                        />

                        {/* --- قسم الوقت والحالة --- */}
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <Text style={[styles.label, isRTL && styles.rtlText]}>{t('addVisit.time')}</Text>
                                <TouchableOpacity style={styles.input} onPress={() => setTimePickerVisible(true)}>
                                    <Text style={[styles.timeText, isRTL && styles.rtlText]}>{Moment(time).format('hh:mm A')}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.label, isRTL && styles.rtlText]}>{t('addVisit.status')}</Text>
                                <View style={styles.statusContainer}>
                                    <TouchableOpacity
                                        style={[styles.statusButton, status === 'Pending' && styles.statusPendingActive]}
                                        onPress={() => setStatus('Pending')}
                                    >
                                        <Text style={[styles.statusButtonText, status === 'Pending' && { color: '#FFF' }, isRTL && styles.rtlText]}>{t('addVisit.pending')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.statusButton, status === 'Visited' && styles.statusVisitedActive]}
                                        onPress={() => setStatus('Visited')}
                                    >
                                        <Text style={[styles.statusButtonText, status === 'Visited' && { color: '#FFF' }, isRTL && styles.rtlText]}>{t('addVisit.visited')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={[styles.submitButtonText, isRTL && styles.rtlText]}>{t('addVisit.confirmVisit')}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            <DatePicker
                modal
                open={isTimePickerVisible}
                date={time}
                mode="time"
                onConfirm={(selectedTime) => {
                    setTimePickerVisible(false);
                    setTime(selectedTime);
                }}
                onCancel={() => setTimePickerVisible(false)}
            />
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
    modalContainer: {
        width: '90%', maxHeight: '85%', backgroundColor: 'white', borderRadius: 20,
        padding: 20, elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10,
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EDF2F7', paddingBottom: 15, marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#2D3748' },
    label: { fontSize: 14, fontWeight: '600', color: '#718096', marginBottom: 8 },
    input: {
        backgroundColor: '#F7FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10,
        paddingHorizontal: 15, height: 50, justifyContent: 'center', fontSize: 16, color: '#2D3748', marginBottom: 15,
    },
    placeholder: { color: '#A0AEC0' },
    icon: { marginRight: 10 },
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 15 },
    divider: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
    dividerText: { marginHorizontal: 10, color: '#A0AEC0', fontWeight: '600' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    timeText: { fontSize: 16, color: '#2D3748' },
    statusContainer: {
        flexDirection: 'row', height: 50, borderWidth: 1, borderColor: '#E2E8F0',
        borderRadius: 10, overflow: 'hidden',
    },
    statusButton: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7FAFC' },
    statusButtonText: { fontWeight: '600', color: '#718096' },
    statusPendingActive: { backgroundColor: '#DD6B20' },
    statusVisitedActive: { backgroundColor: '#38A169' },
    submitButton: { backgroundColor: '#183E9F', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 20 },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    rtlText: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
});

export default AddVisit;
