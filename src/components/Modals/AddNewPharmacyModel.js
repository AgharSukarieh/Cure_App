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

const AddNewPharmacyModel = ({ show, hide, submit, cities, allAreas, specialties }) => {
	const [pharmacyName, setPharmacyName] = useState("");
	const [responsible, setResponsible] = useState("");
	const [phone, setPhone] = useState("");
	const [classificationValue, setClassificationValue] = useState(null);
	const [classificationData, setClassificationData] = useState([]);
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
			const filteredAreas = allAreas.filter((area) => area.city_id == cityValue);
			setAvailableAreas(filteredAreas);
			setAreaValue(null); // إعادة تعيين المنطقة
		} else {
			setAvailableAreas([]);
		}
	}, [cityValue, allAreas]);

	// تحميل التصنيفات عند فتح المودال
	useEffect(() => {
		getClassification();
	}, []);

	const submitData = async () => {
		// Validation
		if (!pharmacyName || !responsible || !phone || !cityValue || !areaValue || !classificationValue) {
			Alert.alert(
				"Required Fields", 
				"Pharmacy Name, Responsible, Phone, City, Area and Classification are required"
			);
			return;
		}

		setIsLoading(true);
		try {
			const bodyData = {
				name: pharmacyName,
				responsible_pharmacist_name: responsible,
				phone: phone,
				activate_status: 1,
				city_id: cityValue,
				area_id: areaValue,
				classification: classificationValue,
				latitude: latitude,
				longitude: longitude,
				images: imagesBase64,
			};
			
			const response = await post(Constants.sales.pharmacy, bodyData);
			
			if (response) {
				resetForm();
				hide();
				submit(true); // إشعار بالنجاح
			}
		} catch (err) {
			console.log("Error submitting pharmacy:", err);
			Alert.alert("Error", "Failed to add pharmacy. Please try again.");
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
				setLatitude(location.latitude);
				setLongitude(location.longitude);
				setIsLoading(false);
			})
			.catch(error => {
				setIsLoading(false);
				Alert.alert("Location Error", "Could not get current location");
				console.log(error);
			});
	};

	const onPicker = async () => {
		try {
			const singleSelectedMode = true;
			const response = await openPicker({
				selectedAssets: images,
				isExportThumbnail: true,
				maxVideo: 1,
				doneTitle: "Done",
				singleSelectedMode,
				isCrop: false,
			});
			
			const crop = response.crop;
			if (crop) {
				response.path = crop.path;
				response.width = crop.width;
				response.height = crop.height;
			}

			setImages([response]);
			let arr = [response];

			if (Platform.OS === "ios") {
				const base = await Promise.all(arr.map(async (img) => {
					const data = await fetch(arr[0].path);
					const blob = await data.blob();
					return new Promise((resolve) => {
						const reader = new FileReader();
						reader.readAsDataURL(blob);
						reader.onloadend = () => {
							const base64data = reader.result;
							resolve(base64data);
						};
					});
				}));
				setImagesBase64([base]);
			} else {
				const base64Image = await getImageBaser64ToAndroid(arr[0].realPath);
				if (base64Image) {
					setImagesBase64([base64Image]);
				}
			}
		} catch (e) {
			console.log("Image picker error:", e);
		}
	};

	const getImageBaser64ToAndroid = async (imagePath) => {
		try {
			const base64Data = await RNFetchBlob.fs.readFile(imagePath, "base64");
			return base64Data;
		} catch (error) {
			console.error("Error converting image to base64:", error);
			return null;
		}
	};

	const resetForm = () => {
		setPharmacyName("");
		setResponsible("");
		setPhone("");
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
  const getClassification = () => {
		const data = ["A", "B", "C", "D"];
		var count = Object.keys(data).length;
		let classificationArray = [];
		for (var i = 0; i < count; i++) {
			classificationArray.push({
				value: data[i],
				label: data[i],
			});
		}
		setClassificationData(classificationArray);
	};

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={show}
			onRequestClose={handleClose}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.modalOverlay}
			>
				<View style={styles.modalContainer}>
					<ScrollView showsVerticalScrollIndicator={false}>
						{/* Header */}
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Add New Pharmacy</Text>
							<TouchableOpacity onPress={handleClose}>
								<AntDesign name="close" size={24} color="#555" />
							</TouchableOpacity>
						</View>

						{/* Body */}
						<View style={styles.modalBody}>
							{/* Pharmacy Name */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>
									Pharmacy Name <Text style={styles.requiredStar}>*</Text>
								</Text>
								<TextInput
									style={styles.modalInput}
									placeholder="Enter pharmacy name"
									value={pharmacyName}
									onChangeText={setPharmacyName}
									placeholderTextColor="#999"
								/>
							</View>

							{/* Responsible */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>
									Responsible <Text style={styles.requiredStar}>*</Text>
								</Text>
								<TextInput
									style={styles.modalInput}
									placeholder="Enter responsible person name"
									value={responsible}
									onChangeText={setResponsible}
									placeholderTextColor="#999"
								/>
							</View>

							{/* Phone */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>
									Phone <Text style={styles.requiredStar}>*</Text>
								</Text>
								<TextInput
									style={styles.modalInput}
									placeholder="Enter phone number"
									value={phone}
									onChangeText={setPhone}
									placeholderTextColor="#999"
									keyboardType="phone-pad"
								/>
							</View>

							{/* Classification Dropdown */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>
									Classification <Text style={styles.requiredStar}>*</Text>
								</Text>
								<Dropdown
									style={styles.dropdown}
									data={classificationData || []}
									labelField="label"
									valueField="value"
									placeholder="Select Classification"
									searchPlaceholder="Search..."
									value={classificationValue}
									search
									onChange={item => {
										setClassificationValue(item.value);
									}}
									{...dropdownStyles}
								/>
							</View>

							{/* City Dropdown */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>
									City <Text style={styles.requiredStar}>*</Text>
								</Text>
								<Dropdown
									style={styles.dropdown}
									data={cities || []}
									labelField="label"
									valueField="value"
									placeholder="Select City"
									searchPlaceholder="Search..."
									value={cityValue}
									search
									onChange={item => {
										setCityValue(item.value);
									}}
									{...dropdownStyles}
								/>
							</View>

							{/* Area Dropdown */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>
									Area <Text style={styles.requiredStar}>*</Text>
								</Text>
								<Dropdown
									style={styles.dropdown}
									data={availableAreas}
									labelField="label"
									valueField="value"
									placeholder={
										!cityValue
											? "Select City First"
											: availableAreas.length === 0
											? "No areas available"
											: "Select Area"
									}
									searchPlaceholder="Search..."
									value={areaValue}
									search
									disable={!cityValue || availableAreas.length === 0}
									onChange={item => {
										setAreaValue(item.value);
									}}
									{...dropdownStyles}
								/>
							</View>

							{/* Location Button */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>Location</Text>
								<TouchableOpacity
									style={[
										styles.locationButton,
										latitude && styles.locationButtonActive
									]}
									onPress={getCurrentLocation}
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
										{latitude ? "Location Added ✓" : "Get Current Location"}
									</Text>
								</TouchableOpacity>
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
										/>
									</MapView>
								</View>
							)}

							{/* Attachments */}
							<View style={styles.inputGroup}>
								<Text style={styles.inputLabel}>Attachments (Optional)</Text>
								<TouchableOpacity
									style={styles.attachmentButton}
									onPress={onPicker}
								>
									<Text style={styles.attachmentButtonText}>
										{images.length > 0 ? "Change Image" : "Add Image"}
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
								style={[styles.modalButton, styles.submitButton]}
								onPress={submitData}
							>
								<Text style={styles.modalButtonText}>Submit</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.modalButton, styles.cancelButton]}
								onPress={handleClose}
							>
								<Text style={[styles.modalButtonText, { color: "#333" }]}>
									Cancel
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
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	modalContainer: {
		width: "100%",
		maxHeight: "85%",
		backgroundColor: "white",
		borderRadius: 15,
		padding: 20,
		elevation: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
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
	modalInput: {
		height: 50,
		borderColor: "#E0E0E0",
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 12,
		backgroundColor: "#F8F9FA",
		fontSize: 16,
		color: "#000",
	},
	dropdown: {
		height: 50,
		borderColor: "#E0E0E0",
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 12,
		backgroundColor: "#F8F9FA",
	},
	locationButton: {
		height: 50,
		borderWidth: 1,
		borderColor: "#183E9F",
		borderRadius: 8,
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
		marginTop: 10,
	},
	modalButton: {
		height: 50,
		borderRadius: 8,
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
});