import {
	TouchableOpacity,
	Text,
	View,
	StyleSheet,
	Modal,
	ScrollView,
	Alert,
	Platform,
	KeyboardAvoidingView,
	TextInput,
	Animated,
	Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import { styles } from "../styles";
import Constants from "../../config/globalConstants";
import { get, post, put } from "../../WebService/RequestBuilder";
import { useAuth } from "../../contexts/AuthContext";
import { MultiSelect, Dropdown } from "react-native-element-dropdown";
import GetLocation from "react-native-get-location";
import { useTranslation } from "react-i18next";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const DailyaddModel = ({ show, hide, onAddVisit, area, date, areaId, cityId, onRefresh }) => {
	const { user } = useAuth();
	const { t } = useTranslation();

	const [location, setlocation] = useState(null);
	const [selected, setSelected] = useState([]);
	const [productData, setProductData] = useState([]);
	const [specialitiesData, setSpecialitiesData] = useState([]);
	const [specialitiesValue, setSpecialitiesValue] = useState(null);
	const [doctorsData, setDoctorsData] = useState([]);
	const [doctorsValue, setDoctorsValue] = useState(null);
	const [note, setnote] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [activeVisit, setActiveVisit] = useState(null);
	
	const [bottomSheetAnim] = useState(new Animated.Value(SCREEN_HEIGHT));
	const [backdropOpacity] = useState(new Animated.Value(0));

	const showBottomSheet = () => {
		Animated.parallel([
			Animated.timing(backdropOpacity, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}),
			Animated.spring(bottomSheetAnim, {
				toValue: 0,
				duration: 400,
				useNativeDriver: true,
				bounciness: 0,
			}),
		]).start();
	};

	const hideBottomSheet = () => {
		Animated.parallel([
			Animated.timing(backdropOpacity, {
				toValue: 0,
				duration: 250,
				useNativeDriver: true,
			}),
			Animated.timing(bottomSheetAnim, {
				toValue: SCREEN_HEIGHT,
				duration: 300,
				useNativeDriver: true,
			}),
		]).start(() => {
			handleClose();
		});
	};

	useEffect(() => {
		if (show) {
			showBottomSheet();
		} else {
			hideBottomSheet();
		}
	}, [show]);

	function getLocation() {
		GetLocation.getCurrentPosition({
			enableHighAccuracy: true,
			timeout: 60000,
		})
			.then(location => {
				setlocation(location);
			})
			.catch(error => {
				Alert.alert("Location Error", "Could not get current location");
				console.log(error);
			});
	}

	useEffect(() => {
		getLocation();
	}, [user]);

	useEffect(() => {
		getSpecialities();
		getProducts();
	}, []);
	
	useEffect(() => {
		if (show && user) {
			checkActiveVisit();
		}
	}, [show, user]);


	const checkActiveVisit = async () => {
		try {
			console.log('🔍 التحقق من الزيارات النشطة...');
			
			const today = new Date().toISOString().split('T')[0];
			const res = await get(Constants.visit.medical, null, {
				medical_id: user?.medicals?.id || user?.id,
				date: today
			});
			
			if (res?.data && Array.isArray(res.data)) {
		
				const pending = res.data.find(visit => !visit.end_visit);
				
				if (pending) {
					setActiveVisit(pending);
					console.log('⚠️ زيارة نشطة موجودة:', pending);
					console.log('   - Visit ID:', pending.id);
					console.log('   - Doctor:', pending.doctor?.name || pending.doctor_id);
					console.log('   - Start:', pending.start_visit);
				} else {
					setActiveVisit(null);
					console.log('✅ لا توجد زيارات نشطة');
				}
			}
		} catch (err) {
			console.error('❌ خطأ في التحقق من الزيارات:', err);
		}
	};


	const endActiveVisit = async () => {
		if (!activeVisit) {
			Alert.alert('Error', 'No active visit found');
			return;
		}
		
		if (!location) {
			Alert.alert('Location Required', 'Please enable location to end visit');
			return;
		}
		
		try {
			console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
			console.log('🔚 إنهاء الزيارة النشطة...');
			console.log('   - Visit ID:', activeVisit.id);
			
		
			const res = await put(`medical-visits/${activeVisit.id}`, {
				longitude: location.longitude,
				latitude: location.latitude,
			});
			
			console.log('📥 Response:', res);
			
			if (res?.code === 200) {
				Alert.alert('Success', 'Previous visit ended successfully!');
				setActiveVisit(null);
				console.log('✅ تم إنهاء الزيارة بنجاح');
				
				// ✅ إضافة refresh للصفحة بعد إنهاء الزيارة
				if (onRefresh) {
					console.log('🔄 تحديث الصفحة...');
					onRefresh();
				}
				
				console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
			} else {
				throw new Error(res?.message || 'Failed to end visit');
			}
		} catch (err) {
			console.error('❌ خطأ في إنهاء الزيارة:', err);
			console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
			Alert.alert('Error', 'Failed to end previous visit. Please try again.');
		} finally {
		}
	};

	const getSpecialities = async () => {
		try {
			console.log('📋 جلب التخصصات...');
			
		
			const res = await get('specialties'); 
			
			console.log('📥 Response:', res);
			
			if (res && res.status && res.data) {
			
				setSpecialitiesData(res.data);
				console.log(`✅ تم جلب ${res.data.length} تخصص`);
			} else {
				console.warn('⚠️ Response غير متوقع:', res);
				Alert.alert('Warning', 'No specialities found');
			}
		} catch (err) {
			console.error('❌ خطأ في جلب التخصصات:', err);
			Alert.alert('Error', 'Failed to load specialities');
		}
	};

	const getDoctors = async (specialityId) => {
		try {
			console.log('👨‍⚕️ جلب الأطباء للتخصص:', specialityId);
			setDoctorsData([]);
			setDoctorsValue(null);
			
			
			const res = await get('doctors', null, { 
				speciality_id: specialityId,
				paginate: false, 
			});
			
			console.log('📥 Response:', res);
			console.log('📊 عدد الأطباء:', res.data?.length);
			
			if (res && res.status && res.data && Array.isArray(res.data)) {
				const doctorsArray = res.data.map(doc => ({
					value: doc.id,
					label: doc.name,
				
					phone: doc.phone || '',
					email: doc.email || '',
					address: doc.address || '',
				
					area: doc.area?.name || '',
					city: doc.city?.name || '',
					
					area_id: doc.area_id || doc.area?.id,
					city_id: doc.city_id || doc.city?.id,
				
					speciality: doc.speciality?.name || '',
					speciality_id: doc.speciality_id || doc.speciality?.id,
				
					classification: doc.classification || 'N/A',
				}));
				
				setDoctorsData(doctorsArray);
				console.log(`✅ تم جلب ${doctorsArray.length} طبيب`);
				console.log('📋 أول طبيب:', doctorsArray[0]);
				
				if (doctorsArray.length === 0) {
					Alert.alert('Info', 'No doctors found for this specialty');
				}
			} else {
				console.warn('⚠️ Response غير متوقع:', res);
				setDoctorsData([]);
			}
			
		} catch (err) {
			console.error('❌ خطأ في جلب الأطباء:', err);
			setDoctorsData([]);
			Alert.alert('Error', 'Failed to load doctors');
		}
	};

	const getProducts = async () => {
		try {
			console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
			console.log('📦 جلب المنتجات...');
			
		
			const res = await get('product', null, { 
				limit: 10000 
			});
			
			console.log('📥 Response received');
			console.log('Type:', typeof res);
			console.log('Has data:', !!res?.data);
			console.log('Data is array:', Array.isArray(res?.data));
			
			let products = [];
			
			if (res?.data) {
				if (Array.isArray(res.data)) {
					products = res.data;
					console.log('✅ Direct array format');
				} else if (Array.isArray(res.data.data)) {
					products = res.data.data;
					console.log('✅ Paginated format');
				}
			}
			
			console.log('📊 Products found:', products.length);
			
			if (products.length > 0) {
				const productsArray = products.map((prod, index) => {
					if (index < 3) {
						console.log(`Product ${index + 1}:`, prod.name);
					}
					return {
						value: prod.id,
						label: prod.name,
						price: prod.public_price,
						barcode: prod.barcode,
						company: prod.company?.name,
						status: prod.status,
						batch_number: prod.batch_number,
						in_stock: prod.in_stock,
					};
				});
				
				setProductData(productsArray);
				console.log('✅ تم تحميل', productsArray.length, 'منتج في Dropdown');
				console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
			} else {
				console.warn('⚠️ لا توجد منتجات!');
				console.warn('Response structure:', res ? Object.keys(res) : 'null');
				console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
				setProductData([]);
			}
			
		} catch (err) {
			console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
			console.error('❌ خطأ في جلب المنتجات:');
			console.error('Message:', err.message);
			console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
			setProductData([]);
		
		}
	};

	const submit2 = async () => {

		if (!doctorsValue) {
			Alert.alert("Required Field", "Please select a doctor");
			return;
		}

		if (!location) {
			Alert.alert("Location Required", "Please enable location to start visit");
			return;
		}

		if (isSubmitting) {
			return; 
		}

		try {
			setIsSubmitting(true);

			console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
			console.log('🏥 بدء زيارة جديدة');
			console.log('👨‍⚕️ الطبيب:', doctorsValue);
			console.log('🏘️ المنطقة (area_id):', areaId);
			console.log('🏙️ المدينة (city_id):', cityId);
			console.log('📦 عدد المنتجات:', selected.length);
			console.log('📍 الموقع:', { lat: location.latitude, lng: location.longitude });
			
			
			const visitData = {
				medical_id: user?.medicals?.id || user?.id,
				doctor_id: doctorsValue,
				area_id: areaId, 
				notes: note || '',
				longitude: location.longitude,
				latitude: location.latitude,
			};
			
			console.log('📤 إرسال بيانات الزيارة...');
			console.log('📋 بيانات الزيارة المرسلة:', visitData);
			const visitResponse = await post(Constants.visit.medical, visitData);
			
			if (!visitResponse || visitResponse.code !== 200) {
				throw new Error(visitResponse?.message || 'Failed to create visit');
			}
			
			console.log('✅ تم إنشاء الزيارة بنجاح:', visitResponse.data);
			const visitId = visitResponse.data.id;

		
			if (selected && selected.length > 0) {
				console.log('📦 إضافة المنتجات للزيارة...');
				const sampleProductsData = {
					visit_id: visitId,
					product_ids: selected, 
				};
				
				const productsResponse = await post(
					Constants.product.sample_products, 
					sampleProductsData
				);
				
				if (productsResponse && productsResponse.code === 200) {
					console.log('✅ تم إضافة المنتجات بنجاح');
				} else {
					console.warn('⚠️ فشل إضافة المنتجات:', productsResponse);
				}
			}

			// ✅ إزالة Alert المكرر - سيتم إظهار alert واحد فقط من MedicalReportScreen

			// ✅ إضافة refresh للصفحة بعد إنشاء الزيارة
			if (onRefresh) {
				console.log('🔄 تحديث الصفحة بعد إنشاء الزيارة...');
				onRefresh();
			}

			if (onAddVisit) {
			
				const selectedDoctor = doctorsData.find(doc => doc.value === doctorsValue);
				
				console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
				console.log('👨‍⚕️ معلومات الدكتور المحددة:', selectedDoctor);
				console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
				
			
				const completeVisitData = {
					...visitResponse.data,
					
					city_id: selectedDoctor?.city_id || null,
					area_id: selectedDoctor?.area_id || null,
				
					doctor: {
						id: doctorsValue,
						name: selectedDoctor?.label || 'Unknown Doctor',
					
						phone: selectedDoctor?.phone || '',
						email: selectedDoctor?.email || '',
						address: selectedDoctor?.address || '',
					
						city_id: selectedDoctor?.city_id || null,
						area_id: selectedDoctor?.area_id || null,
						speciality_id: selectedDoctor?.speciality_id || null,
						
						speciality: selectedDoctor?.speciality ? {
							id: selectedDoctor.speciality_id,
							name: selectedDoctor.speciality
						} : null,
					
						area: selectedDoctor?.area ? {
							id: selectedDoctor.area_id,
							name: selectedDoctor.area,
							city_id: selectedDoctor.city_id
						} : null,
					
						city: selectedDoctor?.city ? {
							id: selectedDoctor.city_id,
							name: selectedDoctor.city
						} : null,
					
						classification: selectedDoctor?.classification || 'N/A',
					},
				sample_product: selected.map(productId => {
					const product = productData.find(p => p.value === productId);
					return {
						product_id: productId,
						quantity: 1, 
						product: {
							id: productId,
							name: product?.label || 'Unknown Product',
							public_price: product?.price || '0',
							pharmacy_price: product?.pharmacy_price || '0',
							barcode: product?.barcode || '',
						}
					};
				})
				};
				
				console.log('📤 إرسال البيانات الكاملة إلى القائمة:', completeVisitData);
				onAddVisit(completeVisitData);
			}

			
			resetForm();
			hideBottomSheet();
			
			console.log('✅ اكتملت العملية بنجاح');
			console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
			
		} catch (err) {
			console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
			console.error('❌ خطأ في إنشاء الزيارة:');
			console.error('Error:', err);
			console.error('Message:', err.message);
			console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
			
			
			let errorTitle = 'Error';
			let errorMessage = err.message || 'Failed to start visit. Please try again.';
			
			if (err.message && err.message.includes('need to end your last visit')) {
				errorTitle = 'Active Visit';
				errorMessage = 'You have an active visit. Please end it before starting a new one.\n\nThe "End Previous Visit" button should appear above.';
			
				checkActiveVisit();
			}
			
			Alert.alert(
				errorTitle,
				errorMessage,
				[{ text: 'OK' }]
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetForm = () => {
		setSelected([]);
		setSpecialitiesValue(null);
		setDoctorsValue(null);
		setDoctorsData([]);
		setnote("");
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
			animationType="none"
			transparent={true}
			visible={show}
			onRequestClose={hideBottomSheet}
			statusBarTranslucent={true}
		>
			<View style={style.modalOverlay}>
			
				<Animated.View 
					style={[
						style.backdrop,
						{ opacity: backdropOpacity }
					]}
				>
					<TouchableOpacity 
						style={style.backdropTouchable}
						onPress={hideBottomSheet}
						activeOpacity={1}
					/>
				</Animated.View>

		
				<Animated.View 
					style={[
						style.bottomSheetContainer,
						{ 
							transform: [{ translateY: bottomSheetAnim }] 
						}
					]}
				>
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
						style={style.keyboardAvoidingView}
						keyboardVerticalOffset={Platform.OS === "ios" ? -50 : -60}
						enabled={true}
						keyboardShouldPersistTaps="handled"
					>
						
						<View style={style.dragHandleContainer}>
							<View style={style.dragHandle} />
						</View>

						<ScrollView 
							showsVerticalScrollIndicator={true}
							style={style.scrollView}
							contentContainerStyle={style.scrollViewContent}
							keyboardShouldPersistTaps="handled"
							nestedScrollEnabled={true}
							automaticallyAdjustKeyboardInsets={true}
							keyboardDismissMode="interactive"
						>
						
							<View style={style.modalHeader}>
								<Text style={style.modalTitle}>{t('dailyaddModal.startNewVisit')}</Text>
								<TouchableOpacity 
									onPress={hideBottomSheet}
									style={style.closeButton}
								>
									<AntDesign name="close" size={24} color="#555" />
								</TouchableOpacity>
							</View>

							
							<View style={style.modalBody}>
								
								{activeVisit && (
									<View style={style.warningContainer}>
										<View style={style.warningHeader}>
											<AntDesign name="exclamationcircle" size={20} color="#FF6B6B" />
											<Text style={style.warningTitle}>Active Visit Found</Text>
										</View>
										<Text style={style.warningText}>
											You have an active visit with Dr. {activeVisit.doctor?.name || `#${activeVisit.doctor_id}`}.
											{'\n'}Please end it before starting a new one.
										</Text>
										<TouchableOpacity
											style={[
												style.endVisitButton,
												!location && style.endVisitButtonDisabled
											]}
											onPress={endActiveVisit}
											disabled={!location}
										>
											<Text style={style.endVisitButtonText}>
												{location ? t('dailyaddModal.endPreviousVisit') : t('dailyaddModal.waitingForLocation')}
											</Text>
										</TouchableOpacity>
									</View>
								)}
								
							
								<View style={style.inputGroup}>
									<Text style={style.inputLabel}>
										{t('dailyaddModal.speciality')} <Text style={style.requiredStar}>*</Text>
									</Text>
									<Dropdown
										style={style.dropdown}
										data={specialitiesData}
										search
										maxHeight={300}
										labelField="label"
										valueField="value"
										placeholder={t('dailyaddModal.selectSpeciality')}
										searchPlaceholder={t('dailyaddModal.search')}
										value={specialitiesValue}
										onChange={item => {
											setSpecialitiesValue(item.value);
											getDoctors(item.value);
										}}
										itemTextStyle={dropdownStyles.itemTextStyle}
										selectedTextStyle={dropdownStyles.selectedTextStyle}
										placeholderStyle={dropdownStyles.placeholderStyle}
										renderLeftIcon={() => (
											<AntDesign
												style={style.dropdownIcon}
												color={specialitiesValue ? "#183E9F" : "#999"}
												name="medicinebox"
												size={20}
											/>
										)}
									/>
								</View>

							
								<View style={style.inputGroup}>
									<Text style={style.inputLabel}>
										{t('dailyaddModal.doctor')} <Text style={style.requiredStar}>*</Text>
									</Text>
									<Dropdown
										style={style.dropdown}
										data={doctorsData}
										search
										maxHeight={300}
										labelField="label"
										valueField="value"
										placeholder={t('dailyaddModal.selectDoctor')}
										searchPlaceholder={t('dailyaddModal.search')}
										value={doctorsValue}
										disable={!specialitiesValue}
										onChange={item => {
											setDoctorsValue(item.value);
										}}
										itemTextStyle={dropdownStyles.itemTextStyle}
										selectedTextStyle={dropdownStyles.selectedTextStyle}
										placeholderStyle={dropdownStyles.placeholderStyle}
										renderLeftIcon={() => (
											<AntDesign
												style={style.dropdownIcon}
												color={doctorsValue ? "#183E9F" : "#999"}
												name="user"
												size={20}
											/>
										)}
									/>
								</View>

								<View style={style.inputGroup}>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
										<Text style={style.inputLabel}>{t('dailyaddModal.productsOptional')}</Text>
										{selected.length > 0 && (
											<Text style={style.selectedCount}>
												{selected.length} {t('dailyaddModal.selected')}
											</Text>
										)}
									</View>
									<MultiSelect
										style={style.dropdown}
										data={productData}
										search
										labelField="label"
										valueField="value"
										placeholder={t('dailyaddModal.selectProducts')}
										searchPlaceholder={t('dailyaddModal.search')}
										value={selected}
										onChange={item => {
											setSelected(item);
										}}
										itemTextStyle={dropdownStyles.itemTextStyle}
										selectedTextStyle={dropdownStyles.selectedTextStyle}
										placeholderStyle={dropdownStyles.placeholderStyle}
										renderLeftIcon={() => (
											<AntDesign
												style={style.dropdownIcon}
												color={"#183E9F"}
												name="shoppingcart"
												size={20}
											/>
										)}
									/>
								</View>

								{/* Notes */}
								<View style={style.inputGroup}>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
										<Text style={style.inputLabel}>{t('dailyaddModal.notesOptional')}</Text>
										<Text style={style.characterCount}>
											{note.length}/300
										</Text>
									</View>
									<TextInput
										onChangeText={setnote}
										value={note}
										placeholder={t('dailyaddModal.enterNotes')}
										placeholderTextColor={"#999"}
										style={style.textArea}
										maxLength={300}
										multiline
										numberOfLines={4}
										textAlignVertical="top"
									/>
								</View>

								{/* Location Status */}
								<View style={style.inputGroup}>
									<Text style={style.inputLabel}>
										{t('dailyaddModal.location')} <Text style={style.requiredStar}>*</Text>
									</Text>
									<TouchableOpacity
										style={[
											style.locationButton,
											location && style.locationButtonActive
										]}
										onPress={getLocation}
									>
										<AntDesign
											name="enviromento"
											size={20}
											color={location ? "#FFF" : "#183E9F"}
											style={{ marginRight: 8 }}
										/>
										<Text style={[
											style.locationButtonText,
											location && style.locationButtonTextActive
										]}>
											{location ? t('dailyaddModal.locationReady') : t('dailyaddModal.getCurrentLocation')}
										</Text>
									</TouchableOpacity>
									{location && (
										<View style={style.coordinatesContainer}>
											<Text style={style.coordinatesText}>
												📍 Lat: {location.latitude.toFixed(5)}, Lng: {location.longitude.toFixed(5)}
											</Text>
										</View>
									)}
								</View>
							</View>

							{/* Footer */}
							<View style={style.modalFooter}>
								<TouchableOpacity
									style={[
										style.modalButton, 
										style.submitButton,
										(isSubmitting || !doctorsValue || !location) && style.submitButtonDisabled
									]}
									onPress={submit2}
									disabled={isSubmitting || !doctorsValue || !location}
								>
									<Text style={style.modalButtonText}>
										{isSubmitting ? t('dailyaddModal.starting') : t('dailyaddModal.startVisit')}
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[style.modalButton, style.cancelButton]}
									onPress={hideBottomSheet}
									disabled={isSubmitting}
								>
									<Text style={[style.modalButtonText, { color: "#333" }]}>
										{t('dailyaddModal.cancel')}
									</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
					</KeyboardAvoidingView>
				</Animated.View>
			</View>
		</Modal>
	);
};

export default DailyaddModel;

const style = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: "transparent",
	},
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	backdropTouchable: {
		flex: 1,
	},
	bottomSheetContainer: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "white",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		maxHeight: SCREEN_HEIGHT * 0.98,
		minHeight: SCREEN_HEIGHT * 0.5, // ✅ حد أدنى للارتفاع
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: -2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	keyboardAvoidingView: {
		flex: 1,
		justifyContent: 'flex-end', // ✅ محاذاة من الأسفل
		paddingBottom: 0, // ✅ مساحة إضافية من الأسفل
	},
	dragHandleContainer: {
		alignItems: "center",
		paddingVertical: 8,
	},
	dragHandle: {
		width: 40,
		height: 4,
		backgroundColor: "#E0E0E0",
		borderRadius: 2,
	},
	scrollView: {
		flex: 1,
		maxHeight: SCREEN_HEIGHT * 0.75,
		flexGrow: 1, // ✅ يسمح بالتوسع مع الكيبورد
	},
	scrollViewContent: {
		flexGrow: 1,
		paddingHorizontal: 20,
		paddingBottom: 30,
		paddingTop: 10, // ✅ مساحة إضافية من الأعلى
		minHeight: SCREEN_HEIGHT * 0.9, // ✅ حد أدنى للمحتوى
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
		paddingBottom: 15,
		marginBottom: 20,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#183E9F",
		flex: 1,
	},
	closeButton: {
		padding: 4,
	},
	modalBody: {
		marginBottom: 20,
	},
	inputGroup: {
		marginBottom: 20,
	},
	inputLabel: {
		fontSize: 16,
		color: "#555",
		marginBottom: 8,
		fontWeight: "600",
	},
	dropdown: {
		height: 50,
		borderColor: "#E0E0E0",
		borderWidth: 1,
		borderRadius: 12,
		paddingHorizontal: 12,
		backgroundColor: "#F8F9FA",
	},
	dropdownIcon: {
		marginHorizontal: 8,
	},
	textArea: {
		height: 100,
		borderColor: "#E0E0E0",
		borderWidth: 1,
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 12,
		backgroundColor: "#F8F9FA",
		fontSize: 16,
		color: "#000",
		textAlignVertical: "top",
	},
	locationButton: {
		height: 50,
		borderWidth: 1,
		borderColor: "#183E9F",
		borderRadius: 12,
		backgroundColor: "#FFF",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	locationButtonActive: {
		backgroundColor: "#183E9F",
	},
	locationButtonText: {
		fontSize: 16,
		color: "#183E9F",
		fontWeight: "600",
	},
	locationButtonTextActive: {
		color: "#FFF",
	},
	modalFooter: {
		marginTop: 10,
	},
	modalButton: {
		height: 50,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
	},
	submitButton: {
		backgroundColor: "#183E9F",
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
	},
	requiredStar: {
		color: "#DC3545",
		fontSize: 16,
		fontWeight: "bold",
	},
	selectedCount: {
		fontSize: 13,
		color: "#183E9F",
		fontWeight: "600",
		backgroundColor: "#E7F0FF",
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 4,
	},
	characterCount: {
		fontSize: 13,
		color: "#999",
		fontWeight: "500",
	},
	coordinatesContainer: {
		marginTop: 8,
		padding: 8,
		backgroundColor: "#F8F9FA",
		borderRadius: 8,
		borderLeftWidth: 3,
		borderLeftColor: "#183E9F",
	},
	coordinatesText: {
		fontSize: 12,
		color: "#555",
		fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
	},
	submitButtonDisabled: {
		backgroundColor: "#B0BEC5",
		opacity: 0.6,
	},
	warningContainer: {
		backgroundColor: "#FFF3CD",
		borderLeftWidth: 4,
		borderLeftColor: "#FF6B6B",
		borderRadius: 12,
		padding: 15,
		marginBottom: 20,
	},
	warningHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	warningTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#FF6B6B",
		marginLeft: 8,
	},
	warningText: {
		fontSize: 14,
		color: "#856404",
		marginBottom: 12,
		lineHeight: 20,
	},
	endVisitButton: {
		backgroundColor: "#FF6B6B",
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		alignItems: "center",
	},
	endVisitButtonText: {
		color: "#FFF",
		fontSize: 14,
		fontWeight: "600",
	},
	endVisitButtonDisabled: {
		backgroundColor: "#FFB3B3",
		opacity: 0.6,
	},
});