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
import { get, post } from "../../WebService/RequestBuilder";
import Constants from "../../config/globalConstants";
import MapView, { Marker } from "react-native-maps";
import LoadingScreen from "../LoadingScreen";
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

const AddNewDoctorModel = ({ show, hide, submit, cityArea }) => {
	const { t } = useTranslation();
	const isRTL = I18nManager.isRTL;
	
	const [doctorName, setDoctorName] = useState("");
	const [classificationData, setClassificationData] = useState([]);
	const [classificationValue, setClassificationValue] = useState(null);
	const [address, setAddress] = useState("");
	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [citiesData, setCitiesData] = useState([]);
	const [citiesList, setCityList] = useState([]);
	const [cityValue, setCityValue] = useState(null);
	const [areasData, setAreasData] = useState([]);
	const [areaValue, setAreaValue] = useState(null);
	const [specialtyData, setSpecialtyData] = useState([]);
	const [specialtyValue, setSpecialtyValue] = useState(null);

	const submitData = async () => {
		const body = {
			name: doctorName,
			activate_status: 1,
			city_id: cityValue,
			area_id: areaValue,
			speciality_id: specialtyValue,
			address: address,
			classification: classificationValue,
			longitude: longitude,
			latitude: latitude,
		};
		await post(Constants.doctor.allDoctors, body)
			.then((res) => {
				Alert.alert(t('addNewDoctorModel.success'), "");
				submit(true);
				hide();
			})
			.catch((err) => {
				Alert.alert(t('addNewDoctorModel.error'), err.message || "");
				submit(false);
				hide();
			})
			.finally(() => {
				resetForm();
			});
	};

	const resetForm = () => {
		setDoctorName("");
		setClassificationValue(null);
		setAddress("");
		setLatitude("");
		setLongitude("");
		setCityValue(null);
		setAreaValue(null);
		setSpecialtyValue(null);
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

	const loadCities = () => {
		get(Constants.get_cities).then((response) => {
			const list = [];
			response.forEach((city) => {
				list.push({
					value: city.id,
					label: city.name,
				});
			});
			setCityList(response);
			setCitiesData(list);
		});
	};

	const getArea = (id) => {
		citiesList.forEach((city) => {
			if (city.id == id) {
				const list = [];
				city.areas.forEach((area) => {
					list.push({
						value: area.id,
						label: area.name,
					});
				});
				setAreasData(list);
			}
		});
	};

	const getSpeciality = async () => {
		await get(Constants.doctor.speciality)
			.then((res) => {
				var count = Object.keys(res.speciality).length;
				let specialtyArray = [];
				for (var i = 0; i < count; i++) {
					specialtyArray.push({
						value: res.speciality[i].id,
						label: res.speciality[i].name,
					});
				}
				setSpecialtyData(specialtyArray);
			})
			.catch((err) => {
				Alert.alert(t('addNewDoctorModel.error'), err.message || "");
			});
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

	useEffect(() => {
		if (cityArea) loadCities();
		getSpeciality();
		getClassification();
		loadCities();
	}, []);

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={show}
			coverScreen={false}
			onSwipeComplete={() => setModalVisible2(false)}>
			<View style={styles.ModalContainer}>
				<View style={styles.ModalView}>
					<TouchableOpacity
						onPress={() => {
							submit(null);
							hide();
						}}
						style={[styles.closeButton, isRTL && styles.rtlCloseButton]}>
						<AntDesign
							name="close"
							color="#469ED8"
							size={width * 0.08}
							style={{ alignSelf: "flex-end" }}
						/>
					</TouchableOpacity>

					<View style={styles.scrollContainer}>
						<ScrollView showsVerticalScrollIndicator={false}>
							<View style={styles.formContainer}>
								<Input
									lable={t('addNewDoctorModel.doctorName')}
									placeholder={t('addNewDoctorModel.doctorNamePlaceholder')}
									placeholderStyle={{ color: "#808080" }}
									setData={setDoctorName}
									style={[styles.inputModel, { backgroundColor: "white" }]}
									value={doctorName}
									viewStyle={{ width: "90%" }}
								/>

								<View style={[styles.container, { marginTop: height * 0.02 }]}>
									<Dropdown
										itemTextStyle={{ color: "#000000" }}
										style={styles.dropdown}
										placeholderStyle={styles.placeholderStyle}
										selectedTextStyle={styles.selectedTextStyle}
										inputSearchStyle={styles.inputSearchStyle}
										iconStyle={styles.iconStyle}
										data={citiesData}
										search
										maxHeight={height * 0.3}
										labelField="label"
										valueField="value"
										placeholder={!cityValue ? t('addNewDoctorModel.selectCity') : "..."}
										searchPlaceholder={t('addNewDoctorModel.search')}
										value={cityValue}
										onBlur={() => {}}
										onChange={item => {
											setCityValue(item.value);
											getArea(item.value);
										}}
										renderLeftIcon={() => (
											<AntDesign
												style={[styles.icon, isRTL && styles.rtlIcon]}
												color={cityValue ? "blue" : "black"}
												name="Safety"
												size={width * 0.05}
											/>
										)}
									/>
								</View>

								<View style={[styles.container, { marginTop: height * 0.02 }]}>
									<Dropdown
										itemTextStyle={{ color: "#000000" }}
										style={styles.dropdown}
										placeholderStyle={styles.placeholderStyle}
										selectedTextStyle={styles.selectedTextStyle}
										inputSearchStyle={styles.inputSearchStyle}
										iconStyle={styles.iconStyle}
										data={areasData}
										search
										maxHeight={height * 0.3}
										labelField="label"
										valueField="value"
										placeholder={!areaValue ? t('addNewDoctorModel.selectArea') : "..."}
										searchPlaceholder={t('addNewDoctorModel.search')}
										value={areaValue}
										onBlur={() => {}}
										onChange={item => {
											setAreaValue(item.value);
										}}
										renderLeftIcon={() => (
											<AntDesign
												style={[styles.icon, isRTL && styles.rtlIcon]}
												color={areaValue ? "blue" : "black"}
												name="Safety"
												size={width * 0.05}
											/>
										)}
									/>
								</View>

								<View style={[styles.container, { marginTop: height * 0.02 }]}>
									<Dropdown
										itemTextStyle={{ color: "#000000" }}
										style={styles.dropdown}
										placeholderStyle={styles.placeholderStyle}
										selectedTextStyle={styles.selectedTextStyle}
										inputSearchStyle={styles.inputSearchStyle}
										iconStyle={styles.iconStyle}
										data={specialtyData}
										search
										maxHeight={height * 0.3}
										labelField="label"
										valueField="value"
										placeholder={!specialtyValue ? t('addNewDoctorModel.selectSpecialty') : "..."}
										searchPlaceholder={t('addNewDoctorModel.search')}
										value={specialtyValue}
										onBlur={() => {}}
										onChange={item => {
											setSpecialtyValue(item.value);
										}}
										renderLeftIcon={() => (
											<AntDesign
												style={[styles.icon, isRTL && styles.rtlIcon]}
												color={specialtyValue ? "blue" : "black"}
												name="Safety"
												size={width * 0.05}
											/>
										)}
									/>
								</View>

								<View style={[styles.container, { marginTop: height * 0.02 }]}>
									<Dropdown
										itemTextStyle={{ color: "#000000" }}
										style={styles.dropdown}
										placeholderStyle={styles.placeholderStyle}
										selectedTextStyle={styles.selectedTextStyle}
										inputSearchStyle={styles.inputSearchStyle}
										iconStyle={styles.iconStyle}
										data={classificationData}
										search
										maxHeight={height * 0.3}
										labelField="label"
										valueField="value"
										placeholder={!classificationValue ? t('addNewDoctorModel.selectClassification') : "..."}
										searchPlaceholder={t('addNewDoctorModel.search')}
										value={classificationValue}
										onBlur={() => {}}
										onChange={item => {
											setClassificationValue(item.value);
										}}
										renderLeftIcon={() => (
											<AntDesign
												style={[styles.icon, isRTL && styles.rtlIcon]}
												color={classificationValue ? "blue" : "black"}
												name="Safety"
												size={width * 0.05}
											/>
										)}
									/>
								</View>

								<Input
									lable={t('addNewDoctorModel.address')}
									placeholder={t('addNewDoctorModel.addressPlaceholder')}
									setData={setAddress}
									placeholderStyle={{ color: "#808080" }}
									style={[styles.inputModel, { backgroundColor: "white" }]}
									value={address}
									viewStyle={{ width: "90%" }}
								/>

								<TouchableOpacity 
									style={[styles.locationButton, { 
										backgroundColor: latitude ? "#469ED8" : "#fff",
										marginTop: height * 0.02,
									}]} 
									onPress={getCurrentLocation}>
									<Text style={[styles.locationButtonText, {
										color: latitude ? "#fff" : "#469ED8",
									}]}>
										{t('addNewDoctorModel.getLocation')}
									</Text>
								</TouchableOpacity>

								{(latitude && longitude) && (
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
								)}

								<View style={[styles.submitContainer, { marginTop: height * 0.02 }]}>
									<TouchableOpacity style={styles.submitButton} onPress={submitData}>
										<Text style={styles.submitButtonText}>
											{t('addNewDoctorModel.submit')}
										</Text>
									</TouchableOpacity>
								</View>
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
	ModalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#0707078c",
	},
	ModalView: {
		backgroundColor: "#fff",
		borderRadius: 10,
		width: "95%",
		height: "80%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		padding: width * 0.025,
		paddingBottom: height * 0.02,
	},
	closeButton: {
		alignSelf: "flex-end",
		marginBottom: height * 0.01,
	},
	rtlCloseButton: {
		alignSelf: "flex-start",
	},
	scrollContainer: {
		flex: 1,
	},
	formContainer: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		paddingBottom: height * 0.05,
	},
	container: {
		backgroundColor: "white",
		width: "90%",
		marginTop: height * 0.015,
	},
	dropdown: {
		height: height * 0.06,
		borderColor: "#469ED8",
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: width * 0.02,
	},
	icon: {
		marginRight: width * 0.01,
	},
	rtlIcon: {
		marginRight: 0,
		marginLeft: width * 0.01,
	},
	placeholderStyle: {
		fontSize: width < 375 ? 14 : 16,
		color: "#808080",
	},
	selectedTextStyle: {
		fontSize: width < 375 ? 14 : 16,
		color: "#000000",
	},
	inputSearchStyle: {
		height: height * 0.05,
		fontSize: width < 375 ? 14 : 16,
		color: "#000000",
	},
	iconStyle: {
		width: width * 0.05,
		height: width * 0.05,
	},
	locationButton: {
		width: "90%",
		height: height * 0.06,
		borderWidth: 2,
		borderColor: "#469ED8",
		borderRadius: 5,
		justifyContent: "center",
		alignItems: "center",
	},
	locationButtonText: {
		textAlign: "center",
		fontSize: width < 375 ? 15 : 17,
		fontWeight: "bold",
	},
	map: {
		width: "90%",
		height: height * 0.25,
		marginTop: height * 0.01,
	},
	submitContainer: {
		justifyContent: "center",
		alignItems: "center",
		marginBottom: height * 0.05,
	},
	submitButton: {
		backgroundColor: "#469ED8",
		height: height * 0.06,
		paddingVertical: height * 0.006,
		paddingHorizontal: width * 0.1,
		borderRadius: 7,
		justifyContent: "center",
		alignItems: "center",
	},
	submitButtonText: {
		color: "#fff",
		fontSize: width < 375 ? 16 : 18,
		textAlign: "center",
		fontWeight: "bold",
	},
	inputModel: {
		height: height * 0.05,
		borderColor: "#469ED8",
		borderWidth: 1,
		paddingLeft: width * 0.025,
		borderRadius: 5,
		color: "#000000",
		fontSize: width < 375 ? 14 : 16,
	},
});