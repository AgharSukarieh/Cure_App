import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
	View,
	SafeAreaView,
	StyleSheet,
	TextInput,
	Text,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	I18nManager,
	Modal,
	KeyboardAvoidingView,
	Platform,
	Alert,
} from "react-native";
import { useTranslation } from 'react-i18next';
import GoBack from '../components/GoBack';
const SuccessfullyModel = ({ show, hide, message }) => (
    <Modal transparent={true} visible={show} animationType="fade">
        <View style={styles.successModalOverlay}>
            <View style={styles.successModalContainer}>
                <AntDesign name="checkcircle" size={40} color="#28A745" />
                <Text style={styles.successModalText}>{message}</Text>
            </View>
        </View>
    </Modal>
);


import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";

// --- FAKE DATA ---
const FAKE_CITIES = [
	{ label: "Baghdad", value: 1 },
	{ label: "Basra", value: 2 },
	{ label: "Erbil", value: 3 },
];

const FAKE_AREAS = [
	{ label: "Karrada", value: 101, city_id: 1 },
	{ label: "Mansour", value: 102, city_id: 1 },
	{ label: "Adhamiyah", value: 103, city_id: 1 },
	{ label: "Al-Ashar", value: 201, city_id: 2 },
	{ label: "Maqal", value: 202, city_id: 2 },
	{ label: "Ankawa", value: 301, city_id: 3 },
];

const FAKE_SPECIALTIES = [
	{ label: "Cardiology", value: 1 },
	{ label: "Dermatology", value: 2 },
	{ label: "Pediatrics", value: 3 },
	{ label: "Neurology", value: 4 },
];

let FAKE_DOCTORS = [
	{ id: 1, name: "Dr. Ali Hassan", speciality_name: "Cardiology", city_name: "Baghdad", area_name: "Karrada", status: "Active", years_experience: 15, mobile: "07701234567" },
	{ id: 2, name: "Dr. Fatima Ahmed", speciality_name: "Dermatology", city_name: "Baghdad", area_name: "Mansour", status: "Active", years_experience: 8, mobile: "07801234567" },
	{ id: 3, name: "Dr. Omar Khalid", speciality_name: "Pediatrics", city_name: "Basra", area_name: "Al-Ashar", status: "Inactive", years_experience: 12, mobile: "07901234567" },
	{ id: 4, name: "Dr. Layla Ibrahim", speciality_name: "Neurology", city_name: "Erbil", area_name: "Ankawa", status: "Active", years_experience: 10, mobile: "07501234567" },
	{ id: 5, name: "Dr. Youssef Saad", speciality_name: "Cardiology", city_name: "Basra", area_name: "Maqal", status: "Pending", years_experience: 5, mobile: "07711234567" },
];

const { width, height } = Dimensions.get('window');
const FIXED_COLUMN_WIDTH = width * 0.35;
const SCROLLABLE_COLUMN_WIDTH = width * 0.3;
const ROW_HEIGHT = 60; // ارتفاع ثابت للصفوف لضمان المحاذاة

// --- Add New Doctor Modal Component ---
const AddNewDoctorModel = ({ show, hide, submit, cities, allAreas, specialties }) => {
    const { t } = useTranslation();
    const isRTL = I18nManager.isRTL;
    
    const [newDoctor, setNewDoctor] = useState({
        name: '',
        mobile: '',
        years_experience: '',
        speciality_id: null,
        city_id: null,
        area_id: null,
    });
    const [availableAreas, setAvailableAreas] = useState([]);
    const [errors, setErrors] = useState({});

    const handleInputChange = (key, value) => {
        setNewDoctor(prev => ({ ...prev, [key]: value }));
        if (key === 'city_id') {
            setAvailableAreas(allAreas.filter(area => area.city_id === value));
            setNewDoctor(prev => ({ ...prev, area_id: null }));
        }
    };

    const validate = () => {
        let valid = true;
        let newErrors = {};
        if (!newDoctor.name) { newErrors.name = t('clientDoctorList.addNewDoctorModal.nameRequired'); valid = false; }
        if (!newDoctor.mobile) { newErrors.mobile = t('clientDoctorList.addNewDoctorModal.phoneRequired'); valid = false; }
        if (!newDoctor.speciality_id) { newErrors.speciality_id = t('clientDoctorList.addNewDoctorModal.specialtyRequired'); valid = false; }
        if (!newDoctor.city_id) { newErrors.city_id = t('clientDoctorList.addNewDoctorModal.cityRequired'); valid = false; }
        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = () => {
        if (validate()) {
            const newId = FAKE_DOCTORS.length > 0 ? Math.max(...FAKE_DOCTORS.map(d => d.id)) + 1 : 1;
            const city = cities.find(c => c.value === newDoctor.city_id);
            const area = allAreas.find(a => a.value === newDoctor.area_id);
            const specialty = specialties.find(s => s.value === newDoctor.speciality_id);

            const doctorToAdd = {
                id: newId,
                name: newDoctor.name,
                mobile: newDoctor.mobile,
                years_experience: parseInt(newDoctor.years_experience) || 0,
                speciality_name: specialty?.label,
                city_name: city?.label,
                area_name: area?.label,
                status: 'Pending',
            };
            FAKE_DOCTORS.push(doctorToAdd);
            submit(true);
            resetForm();
        }
    };

    const resetForm = () => {
        setNewDoctor({ name: '', mobile: '', years_experience: '', speciality_id: null, city_id: null, area_id: null });
        setAvailableAreas([]);
        setErrors({});
    };

    const handleClose = () => {
        resetForm();
        hide();
    };

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={show}
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={[styles.modalHeader, isRTL && styles.rtlModalHeader]}>
                            <Text style={[styles.modalTitle, isRTL && styles.rtlText]}>{t('clientDoctorList.addNewDoctorModal.title')}</Text>
                            <TouchableOpacity onPress={handleClose}>
                                <AntDesign name="close" size={24} color="#555" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalBody}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, isRTL && styles.rtlText]}>{t('clientDoctorList.addNewDoctorModal.doctorName')}</Text>
                                <TextInput
                                    style={[styles.modalInput, errors.name && styles.errorInput]}
                                    placeholder={t('clientDoctorList.addNewDoctorModal.doctorNamePlaceholder')}
                                    value={newDoctor.name}
                                    onChangeText={text => handleInputChange('name', text)}
                                />
                                {errors.name && <Text style={[styles.errorText, isRTL && styles.rtlText]}>{errors.name}</Text>}
                            </View>
                             <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, isRTL && styles.rtlText]}>{t('clientDoctorList.addNewDoctorModal.phoneNumber')}</Text>
                                <TextInput
                                    style={[styles.modalInput, errors.mobile && styles.errorInput]}
                                    placeholder={t('clientDoctorList.addNewDoctorModal.phoneNumberPlaceholder')}
                                    value={newDoctor.mobile}
                                    onChangeText={text => handleInputChange('mobile', text)}
                                    keyboardType="phone-pad"
                                />
                                {errors.mobile && <Text style={[styles.errorText, isRTL && styles.rtlText]}>{errors.mobile}</Text>}
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, isRTL && styles.rtlText]}>{t('clientDoctorList.addNewDoctorModal.yearsOfExperience')}</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder={t('clientDoctorList.addNewDoctorModal.yearsOfExperiencePlaceholder')}
                                    value={newDoctor.years_experience}
                                    onChangeText={text => handleInputChange('years_experience', text)}
                                    keyboardType="number-pad"
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, isRTL && styles.rtlText]}>{t('clientDoctorList.addNewDoctorModal.specialty')}</Text>
                                <Dropdown
                                    style={[styles.dropdown, errors.speciality_id && styles.errorInput]}
                                    data={specialties}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={t('clientDoctorList.addNewDoctorModal.chooseSpecialty')}
                                    value={newDoctor.speciality_id}
                                    onChange={item => handleInputChange('speciality_id', item.value)}
                                    {...dropdownStyles}
                                />
                                {errors.speciality_id && <Text style={[styles.errorText, isRTL && styles.rtlText]}>{errors.speciality_id}</Text>}
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, isRTL && styles.rtlText]}>{t('clientDoctorList.addNewDoctorModal.city')}</Text>
                                <Dropdown
                                    style={[styles.dropdown, errors.city_id && styles.errorInput]}
                                    data={cities}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={t('clientDoctorList.addNewDoctorModal.chooseCity')}
                                    value={newDoctor.city_id}
                                    onChange={item => handleInputChange('city_id', item.value)}
                                    {...dropdownStyles}
                                />
                                {errors.city_id && <Text style={[styles.errorText, isRTL && styles.rtlText]}>{errors.city_id}</Text>}
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, isRTL && styles.rtlText]}>{t('clientDoctorList.addNewDoctorModal.area')}</Text>
                                <Dropdown
                                    style={styles.dropdown}
                                    data={availableAreas}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!newDoctor.city_id ? t('clientDoctorList.selectCityFirst') : t('clientDoctorList.addNewDoctorModal.chooseArea')}
                                    value={newDoctor.area_id}
                                    onChange={item => handleInputChange('area_id', item.value)}
                                    disable={!newDoctor.city_id}
                                    {...dropdownStyles}
                                />
                            </View>
                        </View>
                        <View style={[styles.modalFooter, isRTL && styles.rtlModalFooter]}>
                            <TouchableOpacity style={[styles.modalButton, styles.submitButton]} onPress={handleSubmit}>
                                <Text style={styles.modalButtonText}>{t('clientDoctorList.addNewDoctorModal.submit')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleClose}>
                                <Text style={[styles.modalButtonText, {color: '#333'}]}>{t('clientDoctorList.addNewDoctorModal.cancel')}</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};


const ClientDoctorList = ({ navigation, header = true }) => {
	const { t } = useTranslation();
	const isRTL = I18nManager.isRTL;
	
	const [allDoctors, setAllDoctors] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [cities, setCities] = useState([]);
	const [areas, setAreas] = useState([]);
	const [specialties, setSpecialties] = useState([]);
	const [allAreas, setAllAreas] = useState([]);

	const [filters, setFilters] = useState({
		city_id: null,
		area_id: null,
		speciality_id: null,
		searchTerm: "",
	});

	const [addDoctorModalVisible, setAddDoctorModalVisible] = useState(false);
	const [successModalVisible, setSuccessModalVisible] = useState(false);

	const fetchData = useCallback(() => {
		setIsLoading(true);
		setTimeout(() => {
			setCities(FAKE_CITIES);
			setAllAreas(FAKE_AREAS);
			setSpecialties(FAKE_SPECIALTIES);
			setAllDoctors([...FAKE_DOCTORS]);
			setIsLoading(false);
		}, 1000);
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const filteredDoctors = useMemo(() => {
		if (isLoading) return [];
		return allDoctors.filter(doctor => {
			const searchTermLower = filters.searchTerm.toLowerCase();
			const nameMatch = (doctor.name || '').toLowerCase().includes(searchTermLower);
			const cityFilterMatch = !filters.city_id || FAKE_CITIES.find(c => c.value === filters.city_id)?.label === doctor.city_name;
			const areaFilterMatch = !filters.area_id || FAKE_AREAS.find(a => a.value === filters.area_id)?.label === doctor.area_name;
			const specialtyFilterMatch = !filters.speciality_id || FAKE_SPECIALTIES.find(s => s.value === filters.speciality_id)?.label === doctor.speciality_name;
			return nameMatch && cityFilterMatch && areaFilterMatch && specialtyFilterMatch;
		});
	}, [allDoctors, filters, isLoading]);

	const handleFilterChange = useCallback((key, value) => {
		setFilters(prev => {
			const newFilters = { ...prev, [key]: value };
			if (key === 'city_id') {
				newFilters.area_id = null;
				setAreas(allAreas.filter(area => area.city_id == value));
			}
			return newFilters;
		});
	}, [allAreas]);

	const onDoctorAdded = (success) => {
		setAddDoctorModalVisible(false);
		if (success) {
			setSuccessModalVisible(true);
			fetchData();
            setTimeout(() => setSuccessModalVisible(false), 2000);
		}
	};

	const getStatusColor = (status) => {
		switch (status?.toLowerCase()) {
			case 'active': return '#28A745';
			case 'inactive': return '#DC3545';
			case 'pending': return '#007BFF';
			default: return '#6C757D';
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			{header && <GoBack text={t('clientDoctorList.headerTitle')} />}
			<ScrollView
				style={styles.container}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				{/* Filters Section */}
				<View style={styles.filtersContainer}>
					<View style={[styles.searchContainer, isRTL && styles.rtlSearchContainer]}>
						<TextInput
							style={[styles.searchInput, isRTL && styles.rtlText]}
							placeholder={t('clientDoctorList.searchPlaceholder')}
							placeholderTextColor="#888"
							value={filters.searchTerm}
							onChangeText={text => handleFilterChange('searchTerm', text)}
						/>
						<Feather name="search" size={20} color="#888" />
					</View>
					<View style={styles.filterRow}>
						<View style={styles.filterBox}>
							<Text style={[styles.filterLabel, isRTL && styles.rtlText]}>{t('clientDoctorList.filterByCity')}</Text>
							<Dropdown style={styles.dropdown} data={cities} labelField="label" valueField="value" placeholder={t('clientDoctorList.allCities')} value={filters.city_id} onChange={item => handleFilterChange('city_id', item.value)} {...dropdownStyles} />
						</View>
						<View style={styles.filterBox}>
							<Text style={[styles.filterLabel, isRTL && styles.rtlText]}>{t('clientDoctorList.filterByArea')}</Text>
							<Dropdown style={styles.dropdown} data={areas} labelField="label" valueField="value" placeholder={!filters.city_id ? t('clientDoctorList.selectCityFirst') : t('clientDoctorList.allAreas')} value={filters.area_id} onChange={item => handleFilterChange('area_id', item.value)} disable={!filters.city_id} {...dropdownStyles} />
						</View>
					</View>
					<View style={styles.filterBoxFullWidth}>
						<Text style={[styles.filterLabel, isRTL && styles.rtlText]}>{t('clientDoctorList.filterBySpecialty')}</Text>
						<Dropdown style={styles.dropdown} data={specialties} labelField="label" valueField="value" placeholder={t('clientDoctorList.allSpecialties')} value={filters.speciality_id} onChange={item => handleFilterChange('speciality_id', item.value)} {...dropdownStyles} />
					</View>
				</View>

				{/* Table */}
                <View style={styles.tableContainer}>
                    {isLoading ? (
                        <View style={styles.emptyContainer}><Text style={[styles.emptyText, isRTL && styles.rtlText]}>{t('clientDoctorList.loading')}</Text></View>
                    ) : filteredDoctors.length > 0 ? (
                        <View style={styles.table}>
                            {/* Fixed Column */}
                            <View style={styles.fixedColumn}>
                                {/* Fixed Header */}
                                <View style={styles.fixedHeaderCell}>
                                    <Text style={[styles.fixedHeaderText, isRTL && styles.rtlText]}>{t('clientDoctorList.doctorName')}</Text>
                                </View>
                                {/* Fixed Data Cells */}
                                {filteredDoctors.map((item, index) => (
                                    <View key={item.id} style={[styles.fixedCell, index % 2 === 1 ? styles.oddRow : styles.evenRow]}>
                                        <Text style={styles.fixedCellText}>{item.name}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Scrollable Part */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                                <View style={styles.scrollablePart}>
                                    {/* Scrollable Header */}
                                    <View style={styles.scrollableHeaderRow}>
                                        <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t('clientDoctorList.specialty')}</Text></View>
                                        <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t('clientDoctorList.city')}</Text></View>
                                        <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t('clientDoctorList.area')}</Text></View>
                                        <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t('clientDoctorList.phone')}</Text></View>
                                        <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t('clientDoctorList.experience')}</Text></View>
                                        <View style={styles.scrollableHeaderCell}><Text style={[styles.scrollableHeaderText, isRTL && styles.rtlText]}>{t('clientDoctorList.status')}</Text></View>
                                    </View>
                                    {/* Scrollable Data Rows */}
                                    {filteredDoctors.map((item, index) => (
                                        <View key={item.id} style={[styles.scrollableDataRow, index % 2 === 1 ? styles.oddRow : styles.evenRow]}>
                                            <View style={styles.scrollableCell}><Text style={styles.scrollableCellText}>{item.speciality_name}</Text></View>
                                            <View style={styles.scrollableCell}><Text style={styles.scrollableCellText}>{item.city_name}</Text></View>
                                            <View style={styles.scrollableCell}><Text style={styles.scrollableCellText}>{item.area_name}</Text></View>
                                            <View style={styles.scrollableCell}><Text style={styles.scrollableCellText}>{item.mobile}</Text></View>
                                            <View style={styles.scrollableCell}><Text style={styles.scrollableCellText}>{`${item.years_experience} ${t('clientDoctorList.years')}`}</Text></View>
                                            <View style={styles.scrollableCell}>
                                                <Text style={[styles.scrollableCellText, { color: getStatusColor(item.status), fontWeight: 'bold' }]}>
                                                    {item.status}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}><Text style={[styles.emptyText, isRTL && styles.rtlText]}>{t('clientDoctorList.noData')}</Text></View>
                    )}
                </View>
			</ScrollView>

			<TouchableOpacity style={styles.addButton} onPress={() => setAddDoctorModalVisible(true)}>
				<AntDesign name="plus" size={24} color="#FFF" />
			</TouchableOpacity>
			<AddNewDoctorModel
                show={addDoctorModalVisible}
                hide={() => setAddDoctorModalVisible(false)}
                submit={onDoctorAdded}
                cities={cities}
                allAreas={allAreas}
                specialties={specialties}
            />
			<SuccessfullyModel show={successModalVisible} hide={() => setSuccessModalVisible(false)} message={t('clientDoctorList.addNewDoctorModal.successMessage')} />
		</SafeAreaView>
	);
};

const dropdownStyles = {
	itemTextStyle: { color: '#333', fontSize: 14, textAlign: 'left' },
	selectedTextStyle: { fontSize: 14, color: '#333' },
	placeholderStyle: { fontSize: 14, color: '#999' },
	containerStyle: { borderRadius: 8 },
};

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    header: {
      padding: 15,
      backgroundColor: '#FFF',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: '#EEE'
    },
    headerText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#183E9F'
    },
    container: {
      flex: 1,
    },
    filtersContainer: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: '#FFFFFF',
      margin: 15,
      borderRadius: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F4F6F8',
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      height: 45,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: '#333',
      paddingHorizontal: 5
    },
    filterRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    filterBox: {
      flex: 1,
      marginHorizontal: 5,
    },
    filterBoxFullWidth: {
      marginHorizontal: 5,
    },
    filterLabel: {
      fontSize: 14,
      color: '#555',
      marginBottom: 8,
      fontWeight: '600',
    },
    dropdown: {
      height: 45,
      borderColor: '#E0E0E0',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      backgroundColor: '#FFF',
    },
    tableContainer: {
      marginHorizontal: 15,
    },
    table: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        overflow: 'hidden',
    },
    fixedColumn: {
        width: FIXED_COLUMN_WIDTH,
        backgroundColor: '#FFFFFF',
        borderRightWidth: 1,
        borderRightColor: '#E0E0E0',
    },
    scrollablePart: {
        flex: 1,
    },
    fixedHeaderCell: {
        height: ROW_HEIGHT,
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#F1F3F5',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    fixedHeaderText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#183E9F',
        textAlign: 'left',
    },
    fixedCell: {
        height: ROW_HEIGHT,
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    fixedCellText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'left',
    },
    scrollableHeaderRow: {
        flexDirection: 'row',
        height: ROW_HEIGHT,
        backgroundColor: '#F1F3F5',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    scrollableDataRow: {
        flexDirection: 'row',
        height: ROW_HEIGHT,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    scrollableHeaderCell: {
        width: SCROLLABLE_COLUMN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    scrollableHeaderText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1A46BE',
        textAlign: 'center',
    },
    scrollableCell: {
        width: SCROLLABLE_COLUMN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    scrollableCellText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
    },
    evenRow: {
      backgroundColor: '#FFFFFF',
    },
    oddRow: {
      backgroundColor: '#FAFAFA',
    },
    emptyContainer: {
      height: 200,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 8,
    },
    emptyText: {
      fontSize: 16,
      color: '#888',
      textAlign: 'center'
    },
    addButton: {
      position: 'absolute',
      bottom: 30,
      right: 30,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#183E9F',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5
    },
    // --- Modal Styles ---
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.9,
        maxHeight: height * 0.85,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#183E9F',
    },
    modalBody: {
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
        fontWeight: '600',
    },
    modalInput: {
        height: 45,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#F8F9FA',
        fontSize: 16,
    },
    errorInput: {
        borderColor: '#DC3545',
    },
    errorText: {
        color: '#DC3545',
        fontSize: 12,
        marginTop: 4,
    },
    modalFooter: {
        marginTop: 10,
    },
    modalButton: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: '#007BFF',
    },
    cancelButton: {
        backgroundColor: '#E9ECEF',
    },
    modalButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    successModalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    successModalContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 25,
        alignItems: 'center',
        elevation: 5,
    },
    successModalText: {
        marginTop: 15,
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    rtlText: {
        textAlign: 'right',
    },
    rtlModalHeader: {
        flexDirection: 'row-reverse',
    },
    rtlModalFooter: {
        flexDirection: 'row-reverse',
    },
    rtlSearchContainer: {
        flexDirection: 'row-reverse',
    },
});

export default ClientDoctorList;
