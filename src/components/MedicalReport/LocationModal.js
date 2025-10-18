import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { Dropdown } from 'react-native-element-dropdown';

const LocationModal = ({
    visible,
    onClose,
    citiesFormatted,
    areas,
    selectedCity,
    selectedArea,
    currentArea,
    locationsLoading,
    onCityChange,
    onAreaChange,
    onSave,
    t
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {t('medicalReportScreen.selectCityAndArea')}
                        </Text>
                        <TouchableOpacity 
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <Feather name="x" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.modalBody}>
                        {/* عرض حالة التحميل */}
                        {locationsLoading && (
                            <View style={{ padding: 20, alignItems: 'center' }}>
                                <ActivityIndicator size="large" color="#39a5e4" />
                                <Text style={{ marginTop: 10, color: '#666' }}>
                                    {t('medicalReportScreen.loadingLocations')}
                                </Text>
                            </View>
                        )}

                        {/* عرض المنطقة الحالية */}
                        {currentArea && (
                            <View style={styles.currentAreaInfo}>
                                <Feather name="map-pin" size={16} color="#28A745" />
                                <Text style={styles.currentAreaText}>
                                    {t('medicalReportScreen.currentAreaLabel')} 
                                    <Text style={{ fontWeight: 'bold' }}> {currentArea}</Text>
                                </Text>
                            </View>
                        )}

                        {/* اختيار المدينة */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>
                                {t('medicalReportScreen.city')} 
                                {citiesFormatted.length > 0 && 
                                    ` (${citiesFormatted.length} ${t('medicalReportScreen.available')})`
                                }
                            </Text>
                            {citiesFormatted.length === 0 && !locationsLoading && (
                                <Text style={{ color: 'red', fontSize: 12, marginBottom: 5 }}>
                                    ⚠️ {t('medicalReportScreen.noCitiesAvailable')}
                                </Text>
                            )}
                            <Dropdown
                                style={styles.dropdown}
                                data={citiesFormatted}
                                labelField="label"
                                valueField="value"
                                placeholder={t('medicalReportScreen.selectCity')}
                                value={selectedCity}
                                onChange={item => onCityChange(item.value)}
                                placeholderStyle={{ fontSize: 14, color: '#999' }}
                                selectedTextStyle={{ fontSize: 14 }}
                                maxHeight={200}
                                searchPlaceholder={t('medicalReportScreen.search')}
                            />
                        </View>

                        {/* اختيار المنطقة */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>
                                {t('medicalReportScreen.area')} 
                                {areas.length > 0 && 
                                    ` (${areas.length} ${t('medicalReportScreen.available')})`
                                }
                            </Text>
                            {selectedCity && areas.length === 0 && (
                                <Text style={{ color: 'orange', fontSize: 12, marginBottom: 5 }}>
                                    ⚠️ {t('medicalReportScreen.noAreasForCity')}
                                </Text>
                            )}
                            <Dropdown
                                style={[styles.dropdown, !selectedCity && styles.disabledDropdown]}
                                data={areas}
                                labelField="label"
                                valueField="value"
                                placeholder={
                                    selectedCity ? 
                                    t('medicalReportScreen.selectArea') : 
                                    t('medicalReportScreen.selectCityFirst')
                                }
                                value={selectedArea}
                                onChange={item => onAreaChange(item.value)}
                                disabled={!selectedCity}
                                placeholderStyle={{ fontSize: 14, color: '#999' }}
                                selectedTextStyle={{ fontSize: 14 }}
                                maxHeight={200}
                                searchPlaceholder={t('medicalReportScreen.search')}
                            />
                        </View>
                    </View>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity 
                            style={styles.cancelButton}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>
                                {t('medicalReportScreen.cancel')}
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[
                                styles.saveButton, 
                                (!selectedCity || !selectedArea) && styles.disabledButton
                            ]}
                            onPress={onSave}
                            disabled={!selectedCity || !selectedArea}
                        >
                            <Text style={styles.saveButtonText}>
                                {t('medicalReportScreen.save')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        width: '90%',
        maxHeight: '80%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#183E9F',
    },
    closeButton: {
        padding: 5,
    },
    modalBody: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    dropdown: {
        height: 50,
        borderColor: '#183E9F',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#FFFFFF',
    },
    disabledDropdown: {
        backgroundColor: '#F5F5F5',
        borderColor: '#CCC',
    },
    currentAreaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#28A745',
    },
    currentAreaText: {
        fontSize: 14,
        color: '#2E7D32',
        marginLeft: 8,
        flex: 1,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    cancelButton: {
        flex: 1,
        marginRight: 10,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#CCC',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    saveButton: {
        flex: 1,
        marginLeft: 10,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#183E9F',
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    disabledButton: {
        backgroundColor: '#CCC',
    },
});

export default LocationModal;

