import { TouchableOpacity, Text, View, StyleSheet, Dimensions, Modal, ScrollView, TextInput, Alert } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import SelectDropdown from "react-native-select-dropdown";
import Feather from "react-native-vector-icons/Feather";
import { styles } from "../styles";
import Moment from "moment";
import Constants from "../../config/globalConstants";
import { useAuth } from "../../contexts/AuthContext";
import { get, isLoadingIndicatorVisible, post, put } from "../../WebService/RequestBuilder";
import GetLocation from "react-native-get-location";
import LoadingScreen from "../LoadingScreen";

const DailySalesaddModel = ({ show, hide, submit, date, area, navigation, onRefresh }) => {
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [location, setLocation] = useState(null);
	const [locationError, setLocationError] = useState(null);
	const [pharmacy_list, setPharmacyList] = useState([]);
	const [selectedPharmacy, setSelectedPharmacy] = useState(null);
	const [refreshingPharmacies, setRefreshingPharmacies] = useState(false);
	
	// ✅ إضافة state للزيارة النشطة
	const [activeVisit, setActiveVisit] = useState(null);

	// Get user location
	const getUserLocation = useCallback(async () => {
		try {
			setLocationError(null);
			const userLocation = await GetLocation.getCurrentPosition({
				enableHighAccuracy: true,
				timeout: 60000,
			});
			setLocation(userLocation);
		} catch (error) {
			console.log('Location error:', error);
			setLocationError('Unable to get current location');
		}
	}, []);

	useEffect(() => {
		if (show && user) {
			getUserLocation();
			checkActiveVisit();
		}
	}, [show, user, getUserLocation]);

	// ✅ دالة للتحقق من الزيارات النشطة للصيدليات
	const checkActiveVisit = async () => {
		try {
			console.log('🔍 التحقق من الزيارات النشطة للصيدليات...');
			
			const today = new Date().toISOString().split('T')[0];
			const res = await get(Constants.visit.sales, null, {
				sale_id: user?.sales?.id,
				date: today
			});
			
			if (res?.data && Array.isArray(res.data)) {
				const pending = res.data.find(visit => !visit.end_visit);
				
				if (pending) {
					setActiveVisit(pending);
					console.log('⚠️ زيارة نشطة موجودة:', pending);
					console.log('   - Visit ID:', pending.id);
					console.log('   - Pharmacy:', pending.pharmacy?.name || pending.pharmacy_name);
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

	// ✅ دالة إنهاء الزيارة النشطة
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
			console.log('🔚 إنهاء الزيارة النشطة للصيدلية...');
			console.log('   - Visit ID:', activeVisit.id);
			console.log('   - Pharmacy:', activeVisit.pharmacy?.name || activeVisit.pharmacy_name);
			
			// ✅ استخدام نفس المنطق من SalRepSpharm.js
			const response = await put(
				`${Constants.visit.sales}/${activeVisit.id}`,
				{
					longitude: location.longitude,
					latitude: location.latitude
				},
				null
			);
			
			console.log('📥 Response:', response);
			
			if (response?.code === 200) {
				Alert.alert('Success', 'Previous visit ended successfully!');
				setActiveVisit(null);
				console.log('✅ تم إنهاء الزيارة بنجاح');
				
				// ✅ إضافة refresh للجدول بعد إنهاء الزيارة
				if (onRefresh) {
					console.log('🔄 تحديث الجدول بعد إنهاء الزيارة...');
					onRefresh();
				}
				
				console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
			} else {
				throw new Error(response?.message || 'Failed to end visit');
			}
		} catch (err) {
			console.error('❌ خطأ في إنهاء الزيارة:', err);
			console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
			Alert.alert('Error', 'Failed to end previous visit. Please try again.');
		}
	};

	// Fetch pharmacies
	const getPharmacies = useCallback(async () => {
		if (!area?.area_id) {
			console.log('⚠️ No area selected, cannot fetch pharmacies');
			setPharmacyList([]);
			return;
		}

		setRefreshingPharmacies(true);
		try {
			console.log('📍 Fetching pharmacies for area:', area.area_id);
			const response = await get(Constants.sales.pharmacy, null, { 
				user_id: user.id, 
				area_id: area.area_id 
			});
			console.log('✅ Retrieved', response.data?.length || 0, 'pharmacies');
			setPharmacyList(response.data || []);
		} catch (error) {
			console.error('❌ Error fetching pharmacies:', error);
			setPharmacyList([]);
			Alert.alert('Error', 'Failed to load pharmacies');
		} finally {
			setRefreshingPharmacies(false);
		}
	}, [area?.area_id, user?.id]);

	useEffect(() => {
		if (show) {
			getPharmacies();
		}
	}, [show, area?.area_id, getPharmacies]);

	const handleSubmit = async () => {
		if (!selectedPharmacy) {
			Alert.alert('Validation Error', 'Please select a pharmacy');
			return;
		}
	
		if (!location) {
			Alert.alert('Location Required', 'Unable to get your current location');
			return;
		}
	
		setLoading(true);
		try {
			const body = {
				sale_id: user.sales.id,
				pharmacy_id: selectedPharmacy.id,
				longitude: location.longitude,
				latitude: location.latitude,
			};
	
			console.log('📤 إرسال طلب بدء الزيارة:', body);
			
			const response = await post(Constants.visit.sales, body, null);
			
			console.log('✅ استجابة الـ API:', response);
			
			// ✅ تجهيز البيانات الصحيحة من الـ API Response
			const visitData = {
				// ═══════════════════════════════════════
				// 📦 من الـ API Response (البيانات الأساسية)
				// ═══════════════════════════════════════
				id: response.data?.id,
				sale_id: response.data?.sale_id,
				pharmacy_id: response.data?.pharmacy_id,
				start_visit: response.data?.start_visit,
				end_visit: response.data?.end_visit,
				start_visit_latitude: response.data?.start_visit_latitude,
				start_visit_longitude: response.data?.start_visit_longitude,
				created_at: response.data?.created_at,
				updated_at: response.data?.updated_at,
				
				// ═══════════════════════════════════════
			// 🏪 من selectedPharmacy (معلومات الصيدلية)
			// ═══════════════════════════════════════
			pharmacy_name: selectedPharmacy.name,
			name: selectedPharmacy.name,  // ✅ للتوافق مع الـ API response
			pharmacy_phone: selectedPharmacy.phone,
			pharmacy_address: selectedPharmacy.address,
			pharmacy_email: selectedPharmacy.email,
				
			// الموقع (دعم جميع الصيغ)
			city_id: selectedPharmacy.city_id,
			area_id: selectedPharmacy.area_id,
			city: selectedPharmacy.city,
			area: selectedPharmacy.area,
			city_name: selectedPharmacy.city?.name || selectedPharmacy.city || '',
			area_name: selectedPharmacy.area?.name || selectedPharmacy.area || '',
				
				// تفاصيل إضافية
				classification: selectedPharmacy.classification,
				status: selectedPharmacy.status,
				activate_status: selectedPharmacy.activate_status,
				owner_name: selectedPharmacy.owner_name,
				owner_phone: selectedPharmacy.owner_phone,
				owner_email: selectedPharmacy.owner_email,
				responsible_pharmacist_name: selectedPharmacy.responsible_pharmacist_name,
				country: selectedPharmacy.country,
				
				// معلومات مالية (من الصيدلية - للعرض فقط)
				credit_amount: selectedPharmacy.credit_amount || 0,
				price_ceiling: selectedPharmacy.price_ceiling || 0,
				
				// ═══════════════════════════════════════
				// 👤 من المستخدم (معلومات المندوب)
				// ═══════════════════════════════════════
				sale_name: user.sales.name || user.name,
				user_id: user.id,
				distributor_id: user.distributor_id,
				
				// ═══════════════════════════════════════
				// 🔄 الحالة
				// ═══════════════════════════════════════
				visit_status: 'Active', // الزيارة نشطة (لم تنتهي بعد)
			};
			
			console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
			console.log('📦 البيانات النهائية المرسلة للصفحة:');
			console.log(JSON.stringify(visitData, null, 2));
			console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
			
			// إرسال البيانات الكاملة للـ parent
			submit(visitData);
			
			// ✅ فتح صفحة Sal_rep_pharm مباشرة
			if (navigation) {
				console.log('🚀 فتح صفحة Sal_rep_pharm...');
				navigation.navigate('SalRepSpharm', { 
					item: visitData,
					visit_id: response.data?.id
				});
			}
			
			resetForm();
			hide();
			
		} catch (error) {
			console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
			console.error('❌ خطأ في إرسال الزيارة:', error);
			console.error('📥 Error Details:', JSON.stringify(error, null, 2));
			console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
			
			// رسالة خطأ أوضح
			const errorMessage = error.response?.data?.message 
				|| error.message 
				|| 'Failed to start visit. Please try again.';
				
			Alert.alert('Error', errorMessage);
		} finally {
			setLoading(false);
		}
	};

	// Reset form state
	const resetForm = () => {
		setSelectedPharmacy(null);
		setLocationError(null);
	};

	// Handle modal close
	const handleClose = () => {
		resetForm();
		hide();
	};

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={show}
			onRequestClose={handleClose}
		>
			<View style={style.modalContainer}>
				<View style={style.modalView}>
					{/* Header without close button */}
					<View style={style.header}>
						<Text style={style.mainTitle}>Start New Visit</Text>
					</View>
					
					<ScrollView 
						showsVerticalScrollIndicator={false}
						contentContainerStyle={style.scrollContent}
					>
						{/* Location Status */}
						{locationError && (
							<View style={style.warningBanner}>
								<Text style={style.warningText}>
									📍 {locationError}
								</Text>
							</View>
						)}

						{/* ✅ Active Visit Warning */}
						{activeVisit && (
							<View style={style.activeVisitBanner}>
								<View style={style.activeVisitHeader}>
									<Feather name="alert-circle" size={20} color="#F59E0B" />
									<Text style={style.activeVisitTitle}>Active Visit Found</Text>
								</View>
								<Text style={style.activeVisitMessage}>
									You have an active visit with {activeVisit.pharmacy?.name || activeVisit.pharmacy_name || `Pharmacy #${activeVisit.pharmacy_id}`}.
									Please end this visit before starting a new one.
								</Text>
								<TouchableOpacity
									style={style.endVisitButton}
									onPress={endActiveVisit}
								>
									<Text style={style.endVisitButtonText}>End Previous Visit</Text>
								</TouchableOpacity>
							</View>
						)}

						{/* Area Selection Warning */}
						{!area?.area_id && (
							<View style={style.warningBanner}>
								<Text style={style.warningText}>
									⚠️ Please select an area first to view pharmacies
								</Text>
							</View>
						)}

						{/* Pharmacy Selection */}
						<View style={style.card}>
							<Text style={style.label}>Select Pharmacy</Text>
							<SelectDropdown
								buttonStyle={style.dropdownButton}
								buttonTextStyle={style.dropdownButtonText}
								defaultButtonText="Choose pharmacy"
								data={pharmacy_list}
								onSelect={setSelectedPharmacy}
								buttonTextAfterSelection={(item) => item.name}
								rowTextForSelection={(item) => item.name}
								renderDropdownIcon={(isOpened) => (
									<Feather 
										name={isOpened ? "chevron-up" : "chevron-down"} 
										color="#183E9F" 
										size={18} 
									/>
								)}
								dropdownStyle={style.dropdown}
								dropdownIconPosition="right"
								disabled={!area?.area_id || refreshingPharmacies}
							/>
							{refreshingPharmacies && (
								<Text style={style.loadingText}>Loading pharmacies...</Text>
							)}
						</View>

						{/* Selected Pharmacy Info */}
						{selectedPharmacy && (
							<View style={style.selectedPharmacyCard}>
								<Text style={style.selectedPharmacyText}>
									Selected: {selectedPharmacy.name}
								</Text>
								{selectedPharmacy.address && (
									<Text style={style.pharmacyAddress}>
										{selectedPharmacy.address}
									</Text>
								)}
							</View>
						)}

					</ScrollView>

					{/* Action Buttons */}
					<View style={style.actionsContainer}>
						<TouchableOpacity 
							style={style.cancelButton}
							onPress={handleClose}
						>
							<Text style={style.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>
						
						<TouchableOpacity 
							style={[
								style.submitButton,
								(!selectedPharmacy || !location) && style.disabledButton
							]} 
							onPress={handleSubmit}
							disabled={!selectedPharmacy || !location || loading}
						>
							<Text style={style.submitButtonText}>
								{loading ? 'Starting...' : 'Start Visit'}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			
			{loading && <LoadingScreen />}
		</Modal>
	);
};

export default DailySalesaddModel;

const style = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(7, 7, 7, 0.7)",
		padding: 20,
	},
	modalView: {
		backgroundColor: "#fff",
		borderRadius: 20,
		width: "100%",
		maxHeight: "85%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 12,
		elevation: 8,
		overflow: "hidden",
	},
	header: {
		paddingHorizontal: 24,
		paddingTop: 24,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	mainTitle: {
		fontSize: 22,
		fontWeight: "700",
		color: "#183E9F",
		textAlign: "center",
	},
	scrollContent: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingVertical: 16,
	},
	card: {
		marginBottom: 20,
	},
	label: {
		marginBottom: 10,
		fontSize: 16,
		fontWeight: "600",
		color: "#183E9F",
	},
	dropdownButton: {
		backgroundColor: "#f8f9fa",
		borderWidth: 2,
		borderColor: "#e9ecef",
		borderRadius: 12,
		width: "100%",
		height: 55,
	},
	dropdownButtonText: {
		color: "#183E9F",
		fontSize: 16,
		fontWeight: "500",
		textAlign: "left",
	},
	dropdown: {
		backgroundColor: "#fff",
		borderRadius: 12,
		borderWidth: 2,
		borderColor: "#e9ecef",
		marginTop: 5,
	},
	warningBanner: {
		backgroundColor: '#FFF3CD',
		padding: 16,
		borderRadius: 12,
		marginBottom: 20,
		borderLeftWidth: 4,
		borderLeftColor: '#FFC107'
	},
	warningText: {
		color: '#856404',
		fontSize: 14,
		fontWeight: '500',
	},
	selectedPharmacyCard: {
		backgroundColor: '#e8f4fd',
		padding: 16,
		borderRadius: 12,
		marginBottom: 20,
		borderLeftWidth: 4,
		borderLeftColor: '#183E9F'
	},
	selectedPharmacyText: {
		fontSize: 15,
		fontWeight: '600',
		color: '#183E9F',
		marginBottom: 4,
	},
	pharmacyAddress: {
		fontSize: 13,
		color: '#666',
		lineHeight: 18,
	},
	infoCard: {
		backgroundColor: '#f8f9fa',
		padding: 16,
		borderRadius: 12,
		marginBottom: 10,
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	infoLabel: {
		fontSize: 14,
		fontWeight: '500',
		color: '#666',
	},
	infoValue: {
		fontSize: 14,
		fontWeight: '600',
		color: '#183E9F',
	},
	actionsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 24,
		paddingVertical: 20,
		borderTopWidth: 1,
		borderTopColor: '#f0f0f0',
		backgroundColor: '#fafafa',
	},
	cancelButton: {
		flex: 1,
		paddingVertical: 14,
		paddingHorizontal: 24,
		borderWidth: 2,
		borderColor: '#183E9F',
		borderRadius: 12,
		backgroundColor: 'transparent',
		marginRight: 12,
		alignItems: 'center',
	},
	cancelButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#183E9F',
	},
	submitButton: {
		flex: 2,
		paddingVertical: 14,
		paddingHorizontal: 24,
		backgroundColor: '#183E9F',
		borderRadius: 12,
		alignItems: 'center',
		shadowColor: '#183E9F',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 4,
	},
	disabledButton: {
		backgroundColor: '#ccc',
		shadowOpacity: 0,
		elevation: 0,
	},
	submitButtonText: {
		fontSize: 16,
		fontWeight: '700',
		color: '#fff',
	},
	loadingText: {
		fontSize: 12,
		color: '#666',
		fontStyle: 'italic',
		marginTop: 8,
		textAlign: 'center',
	},
	// ✅ Styles للزيارة النشطة
	activeVisitBanner: {
		backgroundColor: "#FEF3C7",
		borderWidth: 1,
		borderColor: "#F59E0B",
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
	},
	activeVisitHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	activeVisitTitle: {
		fontSize: 16,
		fontWeight: "700",
		color: "#92400E",
		marginLeft: 8,
	},
	activeVisitMessage: {
		fontSize: 14,
		color: "#92400E",
		lineHeight: 20,
		marginBottom: 12,
	},
	endVisitButton: {
		backgroundColor: "#EF4444",
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		alignSelf: "flex-start",
	},
	endVisitButtonText: {
		color: "#FFFFFF",
		fontSize: 14,
		fontWeight: "600",
	},
});