import {
	TouchableOpacity,
	Text,
	View,
	StyleSheet,
	Modal,
	ScrollView,
	Image,
	Alert,
	Platform,
	KeyboardAvoidingView,
	TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Dropdown } from "react-native-element-dropdown";
import GetLocation from "react-native-get-location";
import { openPicker } from "@baronha/react-native-multiple-image-picker";
import { post } from "../../WebService/RequestBuilder";
import Constants from "../../config/globalConstants";
import LoadingScreen from "../LoadingScreen";
import RNFetchBlob from "rn-fetch-blob";
import MapView, { Marker } from "react-native-maps";
import { useTranslation } from 'react-i18next';
import { useAlert } from "../Alert/AlertProvider";

const AddNewPharmacyModel = ({ show, hide, submit, cities, allAreas }) => {
	const { t } = useTranslation();
	const alert = useAlert();
	
	const [pharmacyName, setPharmacyName] = useState("");
	const [responsible, setResponsible] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [address, setAddress] = useState("");
	const [classificationValue, setClassificationValue] = useState(null);
	const [classificationData, setClassificationData] = useState([
		{ value: "A", label: "A" },
		{ value: "B", label: "B" },
		{ value: "C", label: "C" },
		{ value: "D", label: "D" },
	]);
	const [cityValue, setCityValue] = useState(null);
	const [areaValue, setAreaValue] = useState(null);
	const [availableAreas, setAvailableAreas] = useState([]);
	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);
	const [images, setImages] = useState([]);
	const [imagesBase64, setImagesBase64] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	// تحديث المناطق عند تغيير المدينة
	useEffect(() => {
		if (cityValue && allAreas) {
			console.log('🏙️ تغيير المدينة إلى:', cityValue);
			const filteredAreas = allAreas.filter((area) => 
				String(area.city_id) === String(cityValue)
			);
			console.log('📍 المناطق المتاحة:', filteredAreas.length);
			setAvailableAreas(filteredAreas);
			setAreaValue(null);
		} else {
			setAvailableAreas([]);
		}
	}, [cityValue, allAreas]);

	const submitData = async () => {
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
		console.log('📤 إرسال بيانات صيدلية جديدة');
		
		// ✅ Validation محسّن مع Custom Alert
		if (!pharmacyName?.trim()) {
			alert.showError(t('addNewPharmacyModel.required'), t('addNewPharmacyModel.pharmacyNameRequired'));
			return;
		}
		if (!responsible?.trim()) {
			alert.showError(t('addNewPharmacyModel.required'), t('addNewPharmacyModel.responsibleRequired'));
			return;
		}
		if (!phone?.trim()) {
			alert.showError(t('addNewPharmacyModel.required'), t('addNewPharmacyModel.phoneRequired'));
			return;
		}
		if (!cityValue) {
			alert.showError(t('addNewPharmacyModel.required'), t('addNewPharmacyModel.cityRequired'));
			return;
		}
		if (!areaValue) {
			alert.showError(t('addNewPharmacyModel.required'), t('addNewPharmacyModel.areaRequired'));
			return;
		}
		if (!classificationValue) {
			alert.showError(t('addNewPharmacyModel.required'), t('addNewPharmacyModel.classificationRequired'));
			return;
		}

		setIsLoading(true);
		
		try {
			// ✅ تجهيز البيانات
			const bodyData = {
				name: pharmacyName.trim(),
				responsible_pharmacist_name: responsible.trim(),
				phone: phone.trim(),
				email: email.trim(),
				address: address.trim(),
				activate_status: "active",  // ✅ إصلاح: استخدم "active" بدلاً من 1
				status: "active",  // ✅ إضافة status
				city_id: cityValue,
				area_id: areaValue,
				classification: classificationValue,
				latitude: latitude || null,
				longitude: longitude || null,
				images: imagesBase64.length > 0 ? imagesBase64 : [],
			};
			
			console.log('📋 البيانات المرسلة:', {
				...bodyData,
				images: bodyData.images.length > 0 ? `${bodyData.images.length} image(s)` : 'no images'
			});
			
			// ✅ إرسال البيانات
			const response = await post(Constants.sales.pharmacy, bodyData);
			
			console.log('📥 Response:', response);
			
			if (response && (response.code === 200 || response.message === 'Created succussfully!')) {
				console.log('✅ تم إضافة الصيدلية بنجاح');
				
				// ✅ استخدام Custom Alert للنجاح
				alert.showSuccess(
					'تم بنجاح! 🎉',
					'تم إضافة الصيدلية بنجاح',
					{
						duration: 3000,
						showCloseButton: false,
						animationType: 'slide',
						position: 'top'
					}
				);
				
				resetForm();
				hide();
				submit(true);
			} else {
				throw new Error(response?.message || 'Failed to add pharmacy');
			}
			
			console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
			
		} catch (err) {
			console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
			console.error('❌ خطأ في إضافة الصيدلية:');
			console.error('Error:', err);
			console.error('Message:', err.message);
			console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
			
			// ✅ معالجة أفضل للأخطاء
			let errorMessage = t('addNewPharmacyModel.errorMessage');
			
			if (err.message) {
				if (err.message.includes('401') || err.message.includes('Unauthorized')) {
					errorMessage = 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى';
				} else if (err.message.includes('422') || err.message.includes('validation')) {
					errorMessage = 'البيانات المدخلة غير صحيحة';
				} else if (err.message.includes('network') || err.message.includes('Network')) {
					errorMessage = 'تحقق من اتصال الإنترنت';
				} else if (err.message.includes('timeout')) {
					errorMessage = 'انتهت مهلة الاتصال، حاول مرة أخرى';
				} else {
					errorMessage = err.message;
				}
			}
			
			// ✅ استخدام Custom Alert للأخطاء
			alert.showError(
				t('addNewPharmacyModel.error'), 
				errorMessage,
				{
					duration: 4000,
					showCloseButton: true,
					animationType: 'slide',
					position: 'top'
				}
			);
			submit(false);
		} finally {
			setIsLoading(false);
		}
	};

	const getCurrentLocation = () => {
		setIsLoading(true);
		GetLocation.getCurrentPosition({
			enableHighAccuracy: true,
			timeout: 60000,
		})
			.then(location => {
				console.log('📍 تم الحصول على الموقع:', {
					lat: location.latitude,
					lng: location.longitude
				});
				setLatitude(location.latitude);
				setLongitude(location.longitude);
				setIsLoading(false);
			})
			.catch(error => {
				setIsLoading(false);
				// ✅ استخدام Custom Alert لخطأ الموقع
				alert.showError("خطأ في الموقع", "لا يمكن الحصول على الموقع الحالي");
				console.error('❌ Location Error:', error);
			});
	};

	const onPicker = async () => {
		try {
			console.log('📸 فتح محدد الصور...');
			
			const response = await openPicker({
				selectedAssets: images,
				isExportThumbnail: true,
				maxVideo: 1,
				doneTitle: "Done",
				singleSelectedMode: true,
				isCrop: false,
			});
			
			console.log('✅ تم اختيار الصورة:', response.path);
			
			const crop = response.crop;
			if (crop) {
				response.path = crop.path;
				response.width = crop.width;
				response.height = crop.height;
			}

			setImages([response]);

			if (Platform.OS === "ios") {
				try {
					const data = await fetch(response.path);
					const blob = await data.blob();
					const base64data = await new Promise((resolve, reject) => {
						const reader = new FileReader();
						reader.readAsDataURL(blob);
						reader.onloadend = () => {
							resolve(reader.result);
						};
						reader.onerror = reject;
					});
					setImagesBase64([base64data]);
					console.log('✅ iOS: تم تحويل الصورة إلى base64');
				} catch (iosError) {
					console.error('❌ iOS Base64 conversion error:', iosError);
					alert.showError('خطأ', 'فشل في تحويل الصورة');
				}
			} else {
				try {
					const base64Image = await getImageBaser64ToAndroid(response.realPath);
					if (base64Image) {
						// ✅ إضافة data:image prefix للصورة
						const fullBase64 = `data:image/jpeg;base64,${base64Image}`;
						setImagesBase64([fullBase64]);
						console.log('✅ Android: تم تحويل الصورة إلى base64');
					} else {
						alert.showError('خطأ', 'فشل في تحويل الصورة');
					}
				} catch (androidError) {
					console.error('❌ Android Base64 conversion error:', androidError);
					alert.showError('خطأ', 'فشل في تحويل الصورة');
				}
			}
		} catch (e) {
			console.error('❌ Image picker error:', e);
			// ✅ إضافة معالجة أفضل للأخطاء
			if (e.message && e.message.includes('User cancelled')) {
				console.log('👤 المستخدم ألغى اختيار الصورة');
			} else if (e.message && e.message.includes('Permission')) {
				alert.showError('خطأ', 'يجب السماح بالوصول إلى الصور');
			} else {
				alert.showError('خطأ', 'فشل في اختيار الصورة');
			}
		}
	};

	const getImageBaser64ToAndroid = async (imagePath) => {
		try {
			console.log('🔄 تحويل الصورة إلى base64:', imagePath);
			
			// ✅ التحقق من وجود الملف
			const fileExists = await RNFetchBlob.fs.exists(imagePath);
			if (!fileExists) {
				console.error('❌ الملف غير موجود:', imagePath);
				return null;
			}
			
			const base64Data = await RNFetchBlob.fs.readFile(imagePath, "base64");
			console.log('✅ تم تحويل الصورة بنجاح، الحجم:', base64Data.length);
			
			return base64Data;
		} catch (error) {
			console.error("❌ Error converting image to base64:", error);
			console.error("❌ Image path:", imagePath);
			return null;
		}
	};

	const resetForm = () => {
		setPharmacyName("");
		setResponsible("");
		setPhone("");
		setEmail("");
		setAddress("");
		setClassificationValue(null);
		setCityValue(null);
		setAreaValue(null);
		setAvailableAreas([]);
		setLatitude(null);
		setLongitude(null);
		setImages([]);
		setImagesBase64([]);
	};

	const handleClose = () => {
		resetForm();
		hide();
	};

	const dropdownStyles = {
		itemTextStyle: { color: "#333", fontSize: 14 },
		selectedTextStyle: { fontSize: 14, color: "#333" },
		placeholderStyle: { fontSize: 14, color: "#999" },
		maxHeight: 200,
	};

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={show}
			onRequestClose={handleClose}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.modalOverlay}
			>
				<TouchableOpacity 
					style={styles.backdrop} 
					activeOpacity={1} 
					onPress={handleClose}
				/>
				
				<View style={styles.bottomSheet}>
					{/* Drag Indicator */}
					<View style={styles.dragIndicatorContainer}>
						<View style={styles.dragIndicator} />
					</View>

					{/* Header */}
					<View style={styles.modalHeader}>
						<View style={styles.headerContent}>
							<AntDesign name="medicinebox" size={24} color="#183E9F" />
							<Text style={styles.modalTitle}>{t('addNewPharmacyModel.title')}</Text>
						</View>
						<TouchableOpacity onPress={handleClose} style={styles.closeButton}>
							<AntDesign name="close" size={22} color="#666" />
						</TouchableOpacity>
					</View>

					<ScrollView 
						showsVerticalScrollIndicator={false}
						contentContainerStyle={styles.scrollContent}
					>

						{/* Body */}
						<View style={styles.modalBody}>
							{/* Pharmacy Name */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>
									{t('addNewPharmacyModel.pharmacyName')} <Text style={styles.requiredStar}>*</Text>
								</Text>
								<TextInput
									style={styles.modalInput}
									placeholder={t('addNewPharmacyModel.pharmacyNamePlaceholder')}
									value={pharmacyName}
									onChangeText={setPharmacyName}
									placeholderTextColor="#999"
								/>
							</View>

							{/* Responsible */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>
									{t('addNewPharmacyModel.responsible')} <Text style={styles.requiredStar}>*</Text>
								</Text>
								<TextInput
									style={styles.modalInput}
									placeholder={t('addNewPharmacyModel.responsiblePlaceholder')}
									value={responsible}
									onChangeText={setResponsible}
									placeholderTextColor="#999"
								/>
							</View>

							{/* Phone */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>
									{t('addNewPharmacyModel.phone')} <Text style={styles.requiredStar}>*</Text>
								</Text>
								<TextInput
									style={styles.modalInput}
									placeholder={t('addNewPharmacyModel.phonePlaceholder')}
									value={phone}
									onChangeText={setPhone}
									placeholderTextColor="#999"
									keyboardType="phone-pad"
								/>
							</View>

							{/* Email */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>
									{t('addNewPharmacyModel.email')}
								</Text>
								<TextInput
									style={styles.modalInput}
									placeholder={t('addNewPharmacyModel.emailPlaceholder')}
									value={email}
									onChangeText={setEmail}
									placeholderTextColor="#999"
									keyboardType="email-address"
									autoCapitalize="none"
								/>
							</View>

							{/* Address */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>
									{t('addNewPharmacyModel.address')}
								</Text>
								<TextInput
									style={[styles.modalInput, styles.textArea]}
									placeholder={t('addNewPharmacyModel.addressPlaceholder')}
									value={address}
									onChangeText={setAddress}
									placeholderTextColor="#999"
									multiline
									numberOfLines={3}
									textAlignVertical="top"
								/>
							</View>

							{/* Classification */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>
									{t('addNewPharmacyModel.classification')} <Text style={styles.requiredStar}>*</Text>
								</Text>
							<Dropdown
								style={styles.dropdown}
								data={classificationData}
								labelField="label"
								valueField="value"
								placeholder={t('addNewPharmacyModel.selectClassification')}
								value={classificationValue}
								onChange={item => setClassificationValue(item.value)}
								itemTextStyle={dropdownStyles.itemTextStyle}
								selectedTextStyle={dropdownStyles.selectedTextStyle}
								placeholderStyle={dropdownStyles.placeholderStyle}
								maxHeight={dropdownStyles.maxHeight}
							/>
							</View>

							{/* City */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>
									{t('addNewPharmacyModel.city')} <Text style={styles.requiredStar}>*</Text>
								</Text>
							<Dropdown
								style={styles.dropdown}
								data={cities || []}
								labelField="label"
								valueField="value"
								placeholder={t('addNewPharmacyModel.selectCity')}
								search
								searchPlaceholder={t('addNewPharmacyModel.search')}
								value={cityValue}
								onChange={item => setCityValue(item.value)}
								itemTextStyle={dropdownStyles.itemTextStyle}
								selectedTextStyle={dropdownStyles.selectedTextStyle}
								placeholderStyle={dropdownStyles.placeholderStyle}
								maxHeight={dropdownStyles.maxHeight}
							/>
							</View>

							{/* Area */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>
									{t('addNewPharmacyModel.area')} <Text style={styles.requiredStar}>*</Text>
								</Text>
							<Dropdown
								style={[
									styles.dropdown,
									(!cityValue || availableAreas.length === 0) && styles.dropdownDisabled
								]}
								data={availableAreas}
								labelField="label"
								valueField="value"
								placeholder={
									!cityValue
										? t('addNewPharmacyModel.selectCityFirst')
										: availableAreas.length === 0
										? t('addNewPharmacyModel.noAreas')
										: t('addNewPharmacyModel.selectArea')
								}
								search
								searchPlaceholder={t('addNewPharmacyModel.search')}
								value={areaValue}
								disable={!cityValue || availableAreas.length === 0}
								onChange={item => setAreaValue(item.value)}
								itemTextStyle={dropdownStyles.itemTextStyle}
								selectedTextStyle={dropdownStyles.selectedTextStyle}
								placeholderStyle={dropdownStyles.placeholderStyle}
								maxHeight={dropdownStyles.maxHeight}
							/>
								{cityValue && availableAreas.length > 0 && (
									<Text style={styles.helperText}>
										{availableAreas.length} {t('addNewPharmacyModel.areasAvailable')}
									</Text>
								)}
							</View>

							{/* Location */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>{t('addNewPharmacyModel.location')}</Text>
								<TouchableOpacity
									style={[
										styles.locationButton,
										latitude && styles.locationButtonActive
									]}
									onPress={getCurrentLocation}
									disabled={isLoading}
								>
									<AntDesign
										name="enviromento"
										size={20}
										color={latitude ? "#FFF" : "#183E9F"}
										style={{ marginRight: 8 }}
									/>
									<Text style={[
										styles.locationButtonText,
										latitude && styles.locationButtonTextActive
									]}>
										{latitude 
											? t('addNewPharmacyModel.locationAdded')
											: isLoading 
												? t('addNewPharmacyModel.gettingLocation')
												: t('addNewPharmacyModel.getLocation')
										}
									</Text>
								</TouchableOpacity>
								{latitude && longitude && (
									<Text style={styles.coordinatesText}>
										📍 Lat: {latitude.toFixed(5)}, Lng: {longitude.toFixed(5)}
									</Text>
								)}
							</View>

							{/* Map View */}
							{(latitude && longitude) && (
								<View style={styles.inputGroup}>
									<MapView
										style={styles.map}
										initialRegion={{
											latitude: latitude,
											longitude: longitude,
											latitudeDelta: 0.005,
											longitudeDelta: 0.005,
										}}
										showsUserLocation={true}
									>
										<Marker
											coordinate={{ latitude: latitude, longitude: longitude }}
											title={pharmacyName || "New Pharmacy"}
										/>
									</MapView>
								</View>
							)}

							{/* Attachments */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>{t('addNewPharmacyModel.image')}</Text>
								<TouchableOpacity
									style={styles.attachmentButton}
									onPress={onPicker}
								>
									<Text style={styles.attachmentButtonText}>
										{images.length > 0 ? t('addNewPharmacyModel.changeImage') : t('addNewPharmacyModel.addImage')}
									</Text>
									<AntDesign
										name="camerao"
										size={20}
										color="#183E9F"
									/>
								</TouchableOpacity>

								{images.length > 0 && (
									<View style={styles.imagePreviewContainer}>
										<Image
											style={styles.imagePreview}
											source={{
												uri: Platform.OS === "ios"
													? images[0].path
													: `file://${images[0].realPath}`
											}}
										/>
										<TouchableOpacity
											style={styles.removeImageButton}
											onPress={() => {
												setImages([]);
												setImagesBase64([]);
											}}
										>
											<AntDesign
												name="closecircle"
												size={24}
												color="#DC3545"
											/>
										</TouchableOpacity>
									</View>
								)}
							</View>
						</View>

						{/* Footer */}
						<View style={styles.modalFooter}>
							<TouchableOpacity
								style={[
									styles.modalButton, 
									styles.submitButton,
									isLoading && styles.submitButtonDisabled
								]}
								onPress={submitData}
								disabled={isLoading}
								activeOpacity={0.8}
							>
								{isLoading ? (
									<View style={styles.loadingContainer}>
										<Text style={styles.modalButtonText}>{t('addNewPharmacyModel.adding')}</Text>
									</View>
								) : (
									<View style={styles.loadingContainer}>
										<AntDesign name="check" size={20} color="#FFF" />
										<Text style={styles.modalButtonText}>{t('addNewPharmacyModel.submit')}</Text>
									</View>
								)}
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.modalButton, styles.cancelButton]}
								onPress={handleClose}
								disabled={isLoading}
								activeOpacity={0.7}
							>
								<AntDesign name="close" size={18} color="#333" />
								<Text style={[styles.modalButtonText, { color: "#333", marginLeft: 6 }]}>
									{t('addNewPharmacyModel.cancel')}
								</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</View>
			</KeyboardAvoidingView>
			{isLoading && <LoadingScreen />}
		</Modal>
	);
};

export default AddNewPharmacyModel;

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		justifyContent: "flex-end",
	},
	backdrop: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.6)",
	},
	bottomSheet: {
		backgroundColor: "white",
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		maxHeight: "92%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -4 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 10,
	},
	dragIndicatorContainer: {
		alignItems: "center",
		paddingTop: 12,
		paddingBottom: 8,
	},
	dragIndicator: {
		width: 40,
		height: 4,
		backgroundColor: "#D1D5DB",
		borderRadius: 2,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#F3F4F6",
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#183E9F",
	},
	closeButton: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: "#F3F4F6",
		justifyContent: "center",
		alignItems: "center",
	},
	scrollContent: {
		paddingBottom: 30,
	},
	modalBody: {
		paddingHorizontal: 20,
		paddingTop: 10,
	},
	inputGroup: {
		marginBottom: 18,
	},
	inputLabel: {
		fontSize: 14,
		color: "#374151",
		marginBottom: 8,
		fontWeight: "600",
		letterSpacing: 0.3,
	},
	requiredStar: {
		color: "#EF4444",
		fontSize: 14,
		fontWeight: "bold",
		marginLeft: 2,
	},
	modalInput: {
		height: 50,
		borderColor: "#E5E7EB",
		borderWidth: 1.5,
		borderRadius: 12,
		paddingHorizontal: 16,
		backgroundColor: "#F9FAFB",
		fontSize: 15,
		color: "#111827",
		fontWeight: "500",
	},
	textArea: {
		height: 90,
		paddingTop: 14,
		paddingBottom: 14,
		textAlignVertical: "top",
	},
	dropdown: {
		height: 50,
		borderColor: "#E5E7EB",
		borderWidth: 1.5,
		borderRadius: 12,
		paddingHorizontal: 16,
		backgroundColor: "#F9FAFB",
	},
	dropdownDisabled: {
		backgroundColor: "#F3F4F6",
		opacity: 0.7,
		borderColor: "#D1D5DB",
	},
	helperText: {
		fontSize: 12,
		color: "#6B7280",
		marginTop: 6,
		fontWeight: "500",
	},
	coordinatesText: {
		fontSize: 12,
		color: "#666",
		marginTop: 8,
		backgroundColor: "#F8F9FA",
		padding: 8,
		borderRadius: 6,
		fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
	},
	locationButton: {
		height: 50,
		borderWidth: 1.5,
		borderColor: "#183E9F",
		borderRadius: 12,
		backgroundColor: "#F9FAFB",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	locationButtonActive: {
		backgroundColor: "#183E9F",
		borderColor: "#183E9F",
	},
	locationButtonText: {
		fontSize: 15,
		color: "#183E9F",
		fontWeight: "600",
		marginLeft: 8,
	},
	locationButtonTextActive: {
		color: "#FFF",
	},
	map: {
		width: "100%",
		height: 200,
		borderRadius: 8,
		overflow: "hidden",
	},
	attachmentButton: {
		height: 50,
		borderWidth: 1,
		borderColor: "#183E9F",
		borderRadius: 8,
		backgroundColor: "#FFF",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 15,
	},
	attachmentButtonText: {
		fontSize: 16,
		color: "#183E9F",
		fontWeight: "600",
	},
	imagePreviewContainer: {
		marginTop: 15,
		position: "relative",
		alignSelf: "center",
	},
	imagePreview: {
		width: 120,
		height: 120,
		borderRadius: 8,
	},
	removeImageButton: {
		position: "absolute",
		top: -10,
		right: -10,
		backgroundColor: "#FFF",
		borderRadius: 12,
	},
	modalFooter: {
		flexDirection: "row",
		gap: 12,
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 10,
		borderTopWidth: 1,
		borderTopColor: "#F3F4F6",
		marginTop: 10,
	},
	modalButton: {
		flex: 1,
		height: 54,
		borderRadius: 14,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
	},
	submitButton: {
		backgroundColor: "#183E9F",
		shadowColor: "#183E9F",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 6,
	},
	submitButtonDisabled: {
		backgroundColor: "#9CA3AF",
		opacity: 0.7,
		shadowOpacity: 0,
		elevation: 0,
	},
	loadingContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	buttonDisabled: {
		backgroundColor: "#B0BEC5",
		opacity: 0.6,
	},
	cancelButton: {
		backgroundColor: "#E9ECEF",
		borderWidth: 1,
		borderColor: "#DEE2E6",
	},
	modalButtonText: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "bold",
		marginLeft: 8,
	},
});