import {
	View,
	SafeAreaView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { styles } from "../components/styles";
import GoBack from "../components/GoBack";
import Feather from "react-native-vector-icons/Feather";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
import AddNewPharmacyModel from "../components/Modals/AddNewPharmacyModel";
import SuccessfullyModel from "../components/Modals/SuccessfullyModel";
import Constants from "../config/globalConstants";
import PharmacyHeaderTable from "../components/Tables/PharmacyHeaderTable";
import TableView from "../General/TableView";
import PharmacyItemTable from "../components/Tables/PharmacyItemTable";
import { useAuth } from "../contexts/AuthContext";
import globalConstants from "../config/globalConstants";
import { get } from "../WebService/RequestBuilder";

const getPharmacyEndpoint = Constants.sales.pharmacy;

const Clientpharmalist = ({ navigation, route, header = true }) => {

	const title = route?.params?.title;
	// const cityArea = route?.params?.cityArea

	const { user } = useAuth();
	const getCityAreaEndpoint = globalConstants.users.cityArea;
	const [cityArea, setCityArea] = useState(null);

	useEffect(() => {
		get(`${getCityAreaEndpoint}${user?.id}`)
			.then(response => {
				setCityArea(response.data);
			})
			.catch(err => {
				console.error(err);
			});
	}, []);


	const [modal, setModal] = useState(false);
	const [scModal, setScModal] = useState(false);

	const [search, setSearch] = useState(null);
	const [citiesData, setCitiesData] = useState([]);
	const [cityValue, setCityValue] = useState(null);
	const [areasData, setAreasData] = useState([]);
	const [areaValue, setAreaValue] = useState(null);
	const [filter, setFilter] = useState({ user_id: user?.id });

	const getCities = () => {
		var count = Object.keys(cityArea.cities).length;
		let cityArray = [];
		for (var i = 0; i < count; i++) {
			cityArray.push({
				value: cityArea.cities[i].id,
				label: cityArea.cities[i].name,
			});
		}
		setCitiesData(cityArray);
	};

	const getAreas = (id) => {
		let areaArray = [];
		cityArea?.areas?.forEach((area) => {
			if (area.city_id == id) {
				areaArray.push({
					value: area.id,
					label: area.name,
				});
			}
		});
		setAreasData(areaArray);
	};

	useEffect(() => {
		if (cityArea) getCities();
	}, [cityArea]);

	return (
		<>
			<SafeAreaView style={styles.container}>
				{header == true ? < GoBack text={"Client List"} /> : ""}

				<View style={{ width: "90%", alignSelf: "center", marginTop: 15 }}>
					<View style={styles.search}>
						<TextInput
							style={styles.searchinput}
							placeholder="Search"
							placeholderTextColor={"#808080"}
							onChangeText={text => {
								setSearch(text);
								setFilter((prev) => ({
									...prev,
									search_term: text,
								}));
							}}
							value={search}
						/>
						<TouchableOpacity
							onPress={() => {
								setSearch(null);
								setFilter({ user_id: user?.id });
								setCityValue(null);
								setAreaValue(null);
							}}
							style={{
								width: "15%",
								alignItems: "center",
								justifyContent: "center",
							}}>
							<Feather
								name="x"
								color="#A5BECC"
								size={27}
								style={{ marginHorizontal: 2 }}
							/>
						</TouchableOpacity>
					</View>

					<View
						style={{
							width: "100%",
							// flexDirection: 'row',
							alignSelf: "center",
							justifyContent: "space-between",
							marginBottom: 10,
						}}>
						<View style={style.container}>
							<Dropdown
								itemTextStyle={{ color: "#000000" }}
								style={style.dropdown}
								placeholderStyle={style.placeholderStyle}
								selectedTextStyle={style.selectedTextStyle}
								inputSearchStyle={style.inputSearchStyle}
								iconStyle={style.iconStyle}
								data={citiesData}
								search
								maxHeight={300}
								labelField="label"
								valueField="value"
								placeholder={!cityValue ? "Select City" : "..."}
								searchPlaceholder="Search..."
								value={cityValue}
								onBlur={() => {
								}}
								onChange={item => {
									setCityValue(item.value);
									getAreas(item.value);
									setFilter((prev) => ({
										...prev,
										city_id: item.value,
										area_id: null,
									}));
								}}
								renderLeftIcon={() => (
									<Feather
										style={styles.icon}
										color={cityValue ? "blue" : "black"}
										name="map-pin"
										size={20}
									/>
								)}
							/>
						</View>

						<View style={style.container}>
							<Dropdown
								itemTextStyle={{ color: "#000000" }}
								style={style.dropdown}
								placeholderStyle={style.placeholderStyle}
								selectedTextStyle={style.selectedTextStyle}
								inputSearchStyle={style.inputSearchStyle}
								iconStyle={style.iconStyle}
								data={areasData}
								search
								maxHeight={300}
								labelField="label"
								valueField="value"
								placeholder={!areaValue ? "Select Area" : "..."}
								searchPlaceholder="Search..."
								value={areaValue}
								onBlur={() => {
								}}
								onChange={item => {
									setAreaValue(item.value);
									setFilter((prev) => ({
										...prev,
										area_id: item.value ,
									}));
								}}
								renderLeftIcon={() => (
									<Feather
										style={styles.icon}
										color={cityValue ? "blue" : "black"}
										name="map-pin"
										size={20}
									/>
								)}
							/>
						</View>
					</View>

				</View>

				<View style={style.containerTable}>
					<PharmacyHeaderTable />
					<TableView
						apiEndpoint={getPharmacyEndpoint}
						enablePullToRefresh
						params={filter}
						renderItem={({ item }) => <PharmacyItemTable item={item} />}
					/>
				</View>

				<View style={style.rButton}>
					<TouchableOpacity onPress={() => setModal(true)}>
						<AntDesign name="plus" size={30} color={"#fff"} />
					</TouchableOpacity>
				</View>

				{cityArea && <AddNewPharmacyModel
					showM={modal}
					hideM={() => setModal(false)}
					data={cityArea}
					user={user}
					setFilter={setFilter}
					submit={e => {
						(e !== null) ? submitAddPharmacy(e) : null;
					}}
				/>}

				<SuccessfullyModel
					message={"The pharmacy has been added successfully."}
					show={scModal}
					hide={() => {
						setScModal(false);
					}}
				/>

			</SafeAreaView>

		</>
	);
};

export default Clientpharmalist;

export const style = StyleSheet.create({
	filterContainer: {
		justifyContent: "center",
		marginTop: 10,
		width: "50%",
	},
	calenderText: {
		fontSize: 16,
		color: "rgba(37, 50, 116, 0.6)",
		marginHorizontal: 10,
	},
	containerTable: {
		flex: 1,
		width: "98%",
		alignSelf: "center",
	},
	container: {
		backgroundColor: "white",
		width: "100%",
		marginTop: 15,
	},
	rButton: {
		backgroundColor: "#469ED8",
		height: 50,
		width: 50,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 25,
		position: "absolute",
		bottom: 70,
		right: 50,
		shadowColor: "#000000",
		shadowOpacity: 0.8,
		shadowRadius: 15,
		shadowOffset: {
			height: 1,
			width: 1,
		},
	},
	dropdown: {
		height: 50,
		borderColor: "#A5BECC",
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 8,
	},
	icon: {
		marginRight: 5,
	},
	label: {
		position: "absolute",
		backgroundColor: "white",
		left: 22,
		top: 8,
		zIndex: 999,
		paddingHorizontal: 8,
		fontSize: 14,
	},
	placeholderStyle: {
		fontSize: 16,
		color: "#808080",
	},
	selectedTextStyle: {
		fontSize: 16,
		color: "#000000",
	},
	iconStyle: {
		width: 20,
		height: 20,
	},
	inputSearchStyle: {
		height: 40,
		fontSize: 16,
		color: "#000000",
	},
});
