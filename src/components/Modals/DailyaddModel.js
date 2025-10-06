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
} from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import { styles } from "../styles";
import Constants from "../../config/globalConstants";
import { get, post } from "../../WebService/RequestBuilder";
import { useAuth } from "../../contexts/AuthContext";
import { MultiSelect, Dropdown } from "react-native-element-dropdown";
import GetLocation from "react-native-get-location";
import LoadingScreen from "../LoadingScreen";

const DailyaddModel = ({ show, hide, area, date }) => {
	const { user } = useAuth();

	const [location, setlocation] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [selected, setSelected] = useState([]);
	const [productData, setProductData] = useState([]);
	const [specialitiesData, setSpecialitiesData] = useState([]);
	const [specialitiesValue, setSpecialitiesValue] = useState(null);
	const [doctorsData, setDoctorsData] = useState([]);
	const [doctorsValue, setDoctorsValue] = useState(null);
	const [note, setnote] = useState("");

	function getLocation() {
		setIsLoading(true);
		GetLocation.getCurrentPosition({
			enableHighAccuracy: true,
			timeout: 60000,
		})
			.then(location => {
				setlocation(location);
				setIsLoading(false);
			})
			.catch(error => {
				setIsLoading(false);
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

	const getSpecialities = async () => {
		get(Constants.doctor.speciality)
			.then((res) => {
				var count = Object.keys(res.speciality).length;
				let specialitiesArray = [];
				for (var i = 0; i < count; i++) {
					specialitiesArray.push({
						value: res.speciality[i].id,
						label: res.speciality[i].name,
					});
				}
				setSpecialitiesData(specialitiesArray);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getDoctors = async (specialityId) => {
		get(Constants.doctor.doctor_speciality, null, { limit: 1000, speciality_id: specialityId })
			.then((res) => {
				var count = Object.keys(res.data).length;
				let doctorsArray = [];
				for (var i = 0; i < count; i++) {
					doctorsArray.push({
						value: res.data[i].id,
						label: res.data[i].name,
					});
				}
				setDoctorsData(doctorsArray);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const getProducts = async () => {
		get(Constants.product.products, null, { limit: 10000 })
			.then((res) => {
				var count = Object.keys(res.data).length;
				let productsArray = [];
				for (var i = 0; i < count; i++) {
					productsArray.push({
						value: res.data[i].id,
						label: res.data[i].name,
					});
				}
				setProductData(productsArray);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const submit2 = () => {
		// Validation
		if (!doctorsValue || !location) {
			Alert.alert(
				"Required Fields", 
				"Doctor and Location are required to start visit"
			);
			return;
		}

		setIsLoading(true);
		const data = {
			medical_id: user?.medicals.id,
			doctor_id: doctorsValue,
			notes: note,
			longitude: location.longitude,
			latitude: location.latitude,
		};
		
		post(Constants.visit.medical, data)
			.then((res) => {
				const sampleProductsData = {
					visit_id: res.data.id,
					"product_ids[]": selected,
				};
				return post(Constants.product.sample_products, sampleProductsData);
			})
			.then((res) => {
				submit(true);
				resetForm();
				hide();
			})
			.catch((err) => {
				console.log(err);
				Alert.alert("Error", "Failed to submit visit. Please try again.");
				submit(false);
			})
			.finally(() => {
				setIsLoading(false);
			});
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
			animationType="fade"
			transparent={true}
			visible={show}
			onRequestClose={handleClose}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={style.modalOverlay}
			>
				<View style={style.modalContainer}>
					<ScrollView showsVerticalScrollIndicator={false}>
						{/* Header */}
						<View style={style.modalHeader}>
							<Text style={style.modalTitle}>Start New Visit</Text>
							<TouchableOpacity onPress={handleClose}>
								<AntDesign name="close" size={24} color="#555" />
							</TouchableOpacity>
						</View>

						{/* Body */}
						<View style={style.modalBody}>
							{/* Speciality Dropdown */}
							<View style={style.inputGroup}>
								<Text style={style.inputLabel}>
									Speciality <Text style={style.requiredStar}>*</Text>
								</Text>
								<Dropdown
									style={style.dropdown}
									data={specialitiesData}
									search
									maxHeight={300}
									labelField="label"
									valueField="value"
									placeholder="Select speciality"
									searchPlaceholder="Search..."
									value={specialitiesValue}
									onChange={item => {
										setSpecialitiesValue(item.value);
										getDoctors(item.value);
									}}
									{...dropdownStyles}
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

							{/* Doctor Dropdown */}
							<View style={style.inputGroup}>
								<Text style={style.inputLabel}>
									Doctor <Text style={style.requiredStar}>*</Text>
								</Text>
								<Dropdown
									style={style.dropdown}
									data={doctorsData}
									search
									maxHeight={300}
									labelField="label"
									valueField="value"
									placeholder="Select doctor"
									searchPlaceholder="Search..."
									value={doctorsValue}
									disable={!specialitiesValue}
									onChange={item => {
										setDoctorsValue(item.value);
									}}
									{...dropdownStyles}
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

							{/* Products MultiSelect */}
							<View style={style.inputGroup}>
								<Text style={style.inputLabel}>Products (Optional)</Text>
								<MultiSelect
									style={style.dropdown}
									data={productData}
									search
									labelField="label"
									valueField="value"
									placeholder="Select Products"
									searchPlaceholder="Search..."
									value={selected}
									onChange={item => {
										setSelected(item);
									}}
									{...dropdownStyles}
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
								<Text style={style.inputLabel}>Notes (Optional)</Text>
								<TextInput
									onChangeText={setnote}
									value={note}
									placeholder="Enter notes here..."
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
									Location <Text style={style.requiredStar}>*</Text>
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
										{location ? "Location Ready ✓" : "Get Current Location"}
									</Text>
								</TouchableOpacity>
							</View>
						</View>

						{/* Footer */}
						<View style={style.modalFooter}>
							<TouchableOpacity
								style={[style.modalButton, style.submitButton]}
								onPress={submit2}
							>
								<Text style={style.modalButtonText}>Start Visit</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[style.modalButton, style.cancelButton]}
								onPress={handleClose}
							>
								<Text style={[style.modalButtonText, { color: "#333" }]}>
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

export default DailyaddModel;

const style = StyleSheet.create({
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
	dropdown: {
		height: 50,
		borderColor: "#E0E0E0",
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 12,
		backgroundColor: "#F8F9FA",
	},
	dropdownIcon: {
		marginRight: 8,
	},
	textArea: {
		height: 100,
		borderColor: "#E0E0E0",
		borderWidth: 1,
		borderRadius: 8,
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