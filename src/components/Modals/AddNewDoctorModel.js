import {
	TouchableOpacity,
	Text,
	View,
	StyleSheet,
	Modal,
	ScrollView,
	Alert,
	Dimensions,
	I18nManager,
} from "react-native";
import React, { useState, useEffect } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Dropdown } from "react-native-element-dropdown";
import Input from "../Input";
import GetLocation from "react-native-get-location";
import { get, post, setAuthToken } from "../../WebService/RequestBuilder";
import { fetchSpecialties } from "../../services/specialtyService";
import Constants from "../../config/globalConstants";
import { BASE_URL } from "../../config/apiConfig";
import MapView, { Marker } from "react-native-maps";
import LoadingScreen from "../LoadingScreen";
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../contexts/AuthContext";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCitiesAndAreas, updateAreasForCity } from '../../store/apps/cities';
import { useCurrentUser } from '../../hooks/useCurrentUser';

const { width, height } = Dimensions.get('window');

// دالة إنشاء طبيب جديدة
async function createDoctor(token, payload) {
  // Ensure Authorization header
  if (token) setAuthToken(token);

  const payloadBody = {
    name: (payload.name || '').trim(),
    activate_status: payload.activate_status ?? 1,
    city_id: payload.city_id,
    area_id: payload.area_id,
    speciality_id: payload.speciality_id,
    address: (payload.address || '').trim(),
    classification: payload.classification ?? '',
    country: (payload.country || '').trim(),
    email: (payload.email || '').trim(),
    phone: (payload.phone || '').trim(),
    availablity_for_visit: (payload.availablity_for_visit || '').trim(),
    // Send coordinates as strings to avoid type issues on backend
    longitude: payload.longitude != null && payload.longitude !== '' ? String(payload.longitude) : '',
    latitude: payload.latitude != null && payload.latitude !== '' ? String(payload.latitude) : '',
    status: payload.status || 'active',
    website: (payload.website || '').trim(),
  };

  const data = await post('sales/doctor', payloadBody);
  return data;
}

const AddNewDoctorModel = ({ show, hide, submit, cityArea }) => {
	const { t } = useTranslation();
	const isRTL = I18nManager.isRTL;
	const { user: currentUser } = useCurrentUser();
	const { token } = useAuth();
	
	// Redux
	const dispatch = useDispatch();
	const userLocationData = useSelector(state => state.cities.userLocationData);
	
	const [doctorName, setDoctorName] = useState("");
	const [classificationData, setClassificationData] = useState([
		{ value: 'A', label: 'A' },
		{ value: 'B', label: 'B' },
		{ value: 'C', label: 'C' },
		{ value: 'D', label: 'D' }
	]);
	const [classificationValue, setClassificationValue] = useState(null);
	const [address, setAddress] = useState("");
	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [country, setCountry] = useState("");
	const [status, setStatus] = useState("");
	const [website, setWebsite] = useState("");
	const [availablity_for_visit, setAvailablityForVisit] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [citiesData, setCitiesData] = useState([]);
	const [citiesList, setCityList] = useState([]);
	const [cityValue, setCityValue] = useState(null);
	const [areasData, setAreasData] = useState([]);
	const [areaValue, setAreaValue] = useState(null);
	const [specialtyData, setSpecialtyData] = useState([]);
	const [specialtyValue, setSpecialtyValue] = useState(null);

	const getArea = (cityId) => {
		if (!cityId) {
			setAreasData([]);
			return;
		}
		dispatch(updateAreasForCity(cityId));
		const filtered = (userLocationData.areas || [])
			.filter(a => String(a.city_id) === String(cityId))
			.map(a => ({ value: a.id, label: a.name }));
		setAreasData(filtered);
	};

	const submitData = async () => {
		if (!token) {
			Alert.alert(t('addNewDoctorModel.error'), "يجب تسجيل الدخول أولاً");
			return;
		}

		// التحقق من الحقول المطلوبة
		if (!doctorName?.trim()) {
			Alert.alert(t('addNewDoctorModel.error'), "يرجى إدخال اسم الطبيب");
			return;
		}
		if (!cityValue) {
			Alert.alert(t('addNewDoctorModel.error'), "يرجى اختيار المدينة");
			return;
		}
		if (!areaValue) {
			Alert.alert(t('addNewDoctorModel.error'), "يرجى اختيار المنطقة");
			return;
		}
		if (!specialtyValue) {
			Alert.alert(t('addNewDoctorModel.error'), "يرجى اختيار التخصص");
			return;
		}

		// Validations for optional fields
		const validateEmail = (val) => {
			if (!val) return true;
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRegex.test(val);
		};
		const validatePhone = (val) => {
			if (!val) return true;
			const digits = String(val).replace(/[^0-9]/g, '');
			return digits.length >= 9 && digits.length <= 15;
		};

		if (email && !validateEmail(email)) {
			Alert.alert("خطأ", "البريد الإلكتروني غير صحيح");
			return;
		}
		if (phone && !validatePhone(phone)) {
			Alert.alert("خطأ", "رقم الهاتف غير صحيح (يجب أن يكون 9-15 رقم)");
			return;
		}

		setIsLoading(true);
		
		const normalizedPhone = phone ? String(phone).replace(/[^0-9]/g, '') : '';
		const payload = {
			name: doctorName.trim(),
			activate_status: 1,
			city_id: cityValue,
			area_id: areaValue,
			speciality_id: specialtyValue,
			address: (address || '').trim(),
			classification: classificationValue || '',
			longitude: longitude,
			latitude: latitude,
			phone: normalizedPhone,
			email: (email || '').trim(),
			country: (country || '').trim(),
			status: "active",
			website: (website || '').trim(),
			availablity_for_visit: (availablity_for_visit || '').trim(),
		};

		try {
			const result = await createDoctor(token, payload);
			const isOk = (result && (result.code === 200 || result.status === true || result.message === "Created succussfully!"));
			if (isOk) {
				console.log("✅ تم إنشاء الطبيب بنجاح:", result);
			
				resetForm();
				submit(true);
				hide();
			} else {
				throw new Error(result?.message || "فشل في إضافة الطبيب");
			}
		} catch (error) {
			console.error("❌ خطأ في إنشاء الطبيب:", error);
			let errorMessage = "فشل في إضافة الطبيب";
			const messageText = error?.message || '';
			if (messageText.includes('401')) {
				errorMessage = "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى";
			} else if (messageText.includes('422')) {
				errorMessage = "البيانات المدخلة غير صحيحة";
			} else if (messageText.toLowerCase().includes('network')) {
				errorMessage = "تحقق من اتصال الإنترنت";
			} else if (messageText) {
				errorMessage = messageText;
			}
			Alert.alert(t('addNewDoctorModel.error'), errorMessage);
			submit(false);
		} finally {
			setIsLoading(false);
		}
	};

	const resetForm = () => {
		setDoctorName("");
		setClassificationValue(null);
		setAddress("");
		setLatitude("");
		setLongitude("");
		setPhone("");
		setEmail("");
		setCountry("");
		setStatus("");
		setWebsite("");
		setAvailablityForVisit("");
		setCityValue(null);
		setAreaValue(null);
		setSpecialtyValue(null);
		setAreasData([]);
	};

	const getCurrentLocation = () => {
		setIsLoading(true);
		GetLocation.getCurrentPosition({
			enableHighAccuracy: true,
			timeout: 60000,
		})
			.then(location => {
				setLatitude(location.latitude);
				setLongitude(location.longitude);
				setIsLoading(false);
			})
			.catch(error => {
				setIsLoading(false);
				console.log(error);
			});
	};

	useEffect(() => {
		const loadUserLocationData = async () => {
			if (token && !userLocationData.cities.length) {
				console.log('🔄 جلب المدن والمناطق من الـ API...');
				try {
					await dispatch(fetchCitiesAndAreas({ token }));
				} catch (error) {
					console.error('❌ خطأ في جلب المدن والمناطق:', error);
				}
			}
		};
		const loadSpecialties = async () => {
			try {
				const list = await fetchSpecialties();
				setSpecialtyData(list);
			} catch (error) {
				console.error('❌ خطأ في جلب التخصصات:', error?.message || error);
			}
		};
		
		loadUserLocationData();
		loadSpecialties();
	}, [token, userLocationData.cities.length, dispatch]);

	useEffect(() => {
		if (userLocationData.citiesFormatted.length > 0) {
			setCitiesData(userLocationData.citiesFormatted);
			const citiesList = userLocationData.cities.map((city) => ({
				value: city.id,
				label: city.name,
				areas: userLocationData.areas.filter(area => area.city_id === city.id)
			}));
			setCityList(citiesList);
			console.log('✅ تم تحديث بيانات المدن والمناطق من Redux');
		}
	}, [userLocationData.citiesFormatted, userLocationData.cities, userLocationData.areas]);

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={show}
			coverScreen={false}
			onRequestClose={hide}>
			<View style={styles.modalOverlay}>
				<View style={styles.bottomSheet}>
					{/* Header */}
					<View style={styles.header}>
						<View style={styles.headerDragHandle} />
						<Text style={styles.headerTitle}>{t('clientDoctorList.addNewDoctorModal.title')}</Text>
						<TouchableOpacity 
							style={styles.closeButton}
							onPress={() => {
								submit(null);
								hide();
							}}>
							<AntDesign name="close" color="#183E9F" size={24} />
						</TouchableOpacity>
					</View>

					{/* Content */}
					<View style={styles.content}>
						<ScrollView 
							style={styles.scrollView}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.scrollContent}>
							
							{/* الحقول الأساسية المطلوبة */}
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>{t('addNewDoctorModel.basicInfo') || t('clientDoctorList.addNewDoctorModal.title')}</Text>
								
								<Input
									lable={t('addNewDoctorModel.doctorName')}
									placeholder={t('addNewDoctorModel.doctorNamePlaceholder')}
									placeholderStyle={styles.placeholder}
									setData={setDoctorName}
									style={styles.input}
									value={doctorName}
									viewStyle={styles.inputView}
									required
								/>

								<View style={styles.dropdownContainer}>
									<Text style={styles.dropdownLabel}>{t('clientDoctorList.addNewDoctorModal.city')} *</Text>
									<Dropdown
										style={styles.dropdown}
										placeholderStyle={styles.placeholder}
										selectedTextStyle={styles.selectedText}
										inputSearchStyle={styles.searchInput}
										iconStyle={styles.dropdownIcon}
										data={citiesData}
										search
										maxHeight={height * 0.2}
										labelField="label"
										valueField="value"
										placeholder={t('clientDoctorList.addNewDoctorModal.chooseCity')}
										searchPlaceholder={t('addNewDoctorModel.search')}
										value={cityValue}
										onChange={item => {
											setCityValue(item.value);
											getArea(item.value);
											setAreaValue(null);
										}}
										renderLeftIcon={() => (
											<AntDesign
												style={styles.dropdownLeftIcon}
												color={cityValue ? "#183E9F" : "#666"}
												name="enviromento"
												size={18}
											/>
										)}
									/>
								</View>

								<View style={styles.dropdownContainer}>
									<Text style={styles.dropdownLabel}>{t('clientDoctorList.addNewDoctorModal.area')} *</Text>
									<Dropdown
										style={[styles.dropdown, !cityValue && styles.dropdownDisabled]}
										placeholderStyle={styles.placeholder}
										selectedTextStyle={styles.selectedText}
										inputSearchStyle={styles.searchInput}
										iconStyle={styles.dropdownIcon}
										data={areasData}
										search
										maxHeight={height * 0.2}
										labelField="label"
										valueField="value"
										placeholder={cityValue ? t('clientDoctorList.addNewDoctorModal.chooseArea') : t('clientDoctorList.selectCityFirst')}
										searchPlaceholder={t('addNewDoctorModel.search')}
										value={areaValue}
										onChange={item => setAreaValue(item.value)}
										disabled={!cityValue}
										renderLeftIcon={() => (
											<AntDesign
												style={styles.dropdownLeftIcon}
												color={areaValue ? "#183E9F" : "#666"}
												name="enviromento"
												size={18}
											/>
										)}
									/>
								</View>

								<View style={styles.dropdownContainer}>
									<Text style={styles.dropdownLabel}>{t('clientDoctorList.addNewDoctorModal.specialty')} *</Text>
									<Dropdown
										style={styles.dropdown}
										placeholderStyle={styles.placeholder}
										selectedTextStyle={styles.selectedText}
										inputSearchStyle={styles.searchInput}
										iconStyle={styles.dropdownIcon}
										data={specialtyData}
										search
										maxHeight={height * 0.2}
										labelField="label"
										valueField="value"
										placeholder={t('clientDoctorList.addNewDoctorModal.chooseSpecialty')}
										searchPlaceholder={t('addNewDoctorModel.search')}
										value={specialtyValue}
										onChange={item => setSpecialtyValue(item.value)}
										renderLeftIcon={() => (
											<AntDesign
												style={styles.dropdownLeftIcon}
												color={specialtyValue ? "#183E9F" : "#666"}
												name="medicinebox"
												size={18}
											/>
										)}
									/>
								</View>

								<View style={styles.dropdownContainer}>
									<Text style={styles.dropdownLabel}>{t('clientDoctorList.classification')}</Text>
									<Dropdown
										style={styles.dropdown}
										placeholderStyle={styles.placeholder}
										selectedTextStyle={styles.selectedText}
										inputSearchStyle={styles.searchInput}
										iconStyle={styles.dropdownIcon}
										data={classificationData}
										search
										maxHeight={height * 0.2}
										labelField="label"
										valueField="value"
										placeholder="اختر التصنيف"
										searchPlaceholder="ابحث عن التصنيف"
										value={classificationValue}
										onChange={item => setClassificationValue(item.value)}
										renderLeftIcon={() => (
											<AntDesign
												style={styles.dropdownLeftIcon}
												color={classificationValue ? "#183E9F" : "#666"}
												name="staro"
												size={18}
											/>
										)}
									/>
								</View>
							</View>

							{/* معلومات الاتصال */}
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>{t('profile.phone') || 'معلومات الاتصال'}</Text>
								
								<Input
									lable={t('clientDoctorList.addNewDoctorModal.phoneNumber')}
									placeholder={t('clientDoctorList.addNewDoctorModal.phoneNumberPlaceholder')}
    setData={setPhone}
    placeholderStyle={styles.placeholder}
    style={styles.input}
    value={phone}
    viewStyle={styles.inputView}
    keyboardType="phone-pad"
/>
								<Input
									lable={t('auth.email')}
									placeholder={t('contactUs.form.emailPlaceholder')}
									setData={setEmail}
									placeholderStyle={styles.placeholder}
									style={styles.input}
									value={email}
									viewStyle={styles.inputView}
									keyboardType="email-address"
								/>

								<Input
									lable={t('clientDoctorList.address')}
									placeholder={t('addNewDoctorModel.addressPlaceholder')}
									setData={setAddress}
									placeholderStyle={styles.placeholder}
									style={[styles.input, styles.textArea]}
									value={address}
									viewStyle={styles.inputView}
									multiline
									numberOfLines={3}
								/>
							</View>

							{/* الموقع الجغرافي */}
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>{t('addNewDoctorModel.location')}</Text>
								
								<TouchableOpacity 
									style={[styles.locationButton, latitude && styles.locationButtonActive]} 
									onPress={getCurrentLocation}>
									<AntDesign 
										name="enviroment" 
										size={20} 
										color={latitude ? "#fff" : "#183E9F"} 
									/>
									<Text style={[styles.locationButtonText, latitude && styles.locationButtonTextActive]}>
										{latitude ? t('locationMessage.locationShared', { defaultValue: 'تم تحديد الموقع' }) : t('addNewDoctorModel.getLocation')}
									</Text>
								</TouchableOpacity>

								{latitude && longitude && (
									<View style={styles.mapContainer}>
										<MapView
											style={styles.map}
											initialRegion={{
												latitude: latitude,
												longitude: longitude,
												latitudeDelta: 0.005,
												longitudeDelta: 0.005,
											}}
											showsUserLocation={true}>
											<Marker
												coordinate={{ latitude: latitude, longitude: longitude }}
											/>
										</MapView>
									</View>
								)}
							</View>

							{/* معلومات إضافية */}
							{/* <View style={styles.section}>
								<Text style={styles.sectionTitle}>معلومات إضافية</Text>
								
								<Input
									lable="الموقع الإلكتروني"
									placeholder="أدخل رابط الموقع الإلكتروني"
									setData={setWebsite}
									placeholderStyle={styles.placeholder}
									style={styles.input}
									value={website}
									viewStyle={styles.inputView}
									keyboardType="url"
								/>

								<Input
									lable="إتاحة الزيارات"
									placeholder="معلومات إتاحة الزيارات"
									setData={setAvailablityForVisit}
									placeholderStyle={styles.placeholder}
									style={styles.input}
									value={availablity_for_visit}
									viewStyle={styles.inputView}
								/>
							</View> */}

							{/* أزرار الإجراء */}
							<View style={styles.actionsContainer}>
								<TouchableOpacity 
									style={[styles.button, styles.cancelButton]} 
									onPress={hide}>
								<Text style={styles.cancelButtonText}>{t('clientDoctorList.addNewDoctorModal.cancel')}</Text>
								</TouchableOpacity>
								
								<TouchableOpacity 
									style={[styles.button, styles.submitButton]} 
									onPress={submitData}
									disabled={isLoading}>
									{isLoading ? (
									<Text style={styles.submitButtonText}>{t('common.loading') || 'جاري الإضافة...'}</Text>
									) : (
									<Text style={styles.submitButtonText}>{t('clientDoctorList.addNewDoctor')}</Text>
									)}
								</TouchableOpacity>
							</View>
						</ScrollView>
					</View>
				</View>
			</View>
			{isLoading && <LoadingScreen />}
		</Modal>
	);
};

export default AddNewDoctorModel;

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'flex-end',
	},
	bottomSheet: {
		backgroundColor: '#fff',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		height: '85%',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: -2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 16,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#f0f0f0',
		position: 'relative',
	},
	headerDragHandle: {
		width: 40,
		height: 4,
		backgroundColor: '#ddd',
		borderRadius: 2,
		position: 'absolute',
		top: 8,
		alignSelf: 'center',
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#183E9F',
	},
	closeButton: {
		position: 'absolute',
		left: 20,
		padding: 4,
	},
	content: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: 20,
		paddingBottom: 40,
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#183E9F',
		marginBottom: 16,
		paddingBottom: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#f0f0f0',
	},
	inputView: {
		width: '100%',
		marginBottom: 16,
	},
	input: {
		height: 50,
		borderColor: '#E0E0E0',
		borderWidth: 1,
		paddingHorizontal: 16,
		borderRadius: 12,
		color: '#333',
		fontSize: 16,
		backgroundColor: '#fff',
	},
	textArea: {
		height: 80,
		textAlignVertical: 'top',
		paddingTop: 12,
	},
	placeholder: {
		fontSize: 14,
		color: '#999',
	},
	dropdownContainer: {
		marginBottom: 16,
	},
	dropdownLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: '#333',
		marginBottom: 8,
	},
	dropdown: {
		height: 50,
		borderColor: '#E0E0E0',
		borderWidth: 1,
		borderRadius: 12,
		paddingHorizontal: 16,
		backgroundColor: '#fff',
	},
	dropdownDisabled: {
		backgroundColor: '#f5f5f5',
		opacity: 0.6,
	},
	selectedText: {
		fontSize: 16,
		color: '#333',
	},
	searchInput: {
		height: 40,
		fontSize: 16,
		color: '#333',
	},
	dropdownIcon: {
		width: 20,
		height: 20,
	},
	dropdownLeftIcon: {
		marginRight: 8,
	},
	locationButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 50,
		borderWidth: 2,
		borderColor: '#183E9F',
		borderRadius: 12,
		backgroundColor: '#fff',
		paddingHorizontal: 16,
		marginBottom: 16,
	},
	locationButtonActive: {
		backgroundColor: '#183E9F',
	},
	locationButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#183E9F',
		marginLeft: 8,
	},
	locationButtonTextActive: {
		color: '#fff',
	},
	mapContainer: {
		marginTop: 8,
	},
	map: {
		width: '100%',
		height: 150,
		borderRadius: 12,
	},
	actionsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 24,
		gap: 12,
	},
	button: {
		flex: 1,
		height: 50,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	cancelButton: {
		backgroundColor: '#f5f5f5',
		borderWidth: 1,
		borderColor: '#E0E0E0',
	},
	submitButton: {
		backgroundColor: '#183E9F',
	},
	cancelButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#666',
	},
	submitButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#fff',
	},
});