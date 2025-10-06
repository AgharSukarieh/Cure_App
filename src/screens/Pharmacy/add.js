// import React, { useState, useEffect } from "react";
// import {
//   TouchableOpacity,
//   Text,
//   View,
//   StyleSheet,
//   Modal,
//   ScrollView,
//   Alert,
//   Platform,
// } from "react-native";
// import AntDesign from "react-native-vector-icons/AntDesign";
// import { Dropdown } from "react-native-element-dropdown";
// import Input from "../Input"; // Custom Input component
// import GetLocation from "react-native-get-location";
// import { get, post } from "../WebService/RequestBuilder";
// import Constants from "../../config/globalConstants";
// import MapView, { Marker } from "react-native-maps";
// import LoadingScreen from "../LoadingScreen";

// const AddNewDoctorModel = ({ show, hide, submit, cityArea }) => {
//   const [doctorName, setDoctorName] = useState("");
//   const [classificationData, setClassificationData] = useState([]);
//   const [classificationValue, setClassificationValue] = useState(null);
//   const [address, setAddress] = useState("");
//   const [latitude, setLatitude] = useState(null);
//   const [longitude, setLongitude] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [citiesData, setCitiesData] = useState([]);
//   const [citiesList, setCityList] = useState([]);
//   const [cityValue, setCityValue] = useState(null);
//   const [areasData, setAreasData] = useState([]);
//   const [areaValue, setAreaValue] = useState(null);
//   const [specialtyData, setSpecialtyData] = useState([]);
//   const [specialtyValue, setSpecialtyValue] = useState(null);

//   const submitData = async () => {
//     if (!doctorName || !cityValue || !areaValue || !specialtyValue || !address) {
//       Alert.alert("Error", "Please fill in all required fields.");
//       return;
//     }

//     setIsLoading(true);
//     const body = {
//       name: doctorName,
//       activate_status: 1,
//       city_id: cityValue,
//       area_id: areaValue,
//       speciality_id: specialtyValue,
//       address: address,
//       classification: classificationValue,
//       longitude: longitude || null,
//       latitude: latitude || null,
//     };

//     try {
//       await post(Constants.doctor.allDoctors, body);
//       Alert.alert("Success", "Doctor added successfully!");
//       submit(true);
//       hide();
//     } catch (err) {
//       Alert.alert("Error", err.message || "Failed to add doctor.");
//       submit(false);
//     } finally {
//       setIsLoading(false);
//       // Reset form
//       setDoctorName("");
//       setClassificationValue(null);
//       setAddress("");
//       setLatitude(null);
//       setLongitude(null);
//       setCityValue(null);
//       setAreaValue(null);
//       setSpecialtyValue(null);
//     }
//   };

//   const getCurrentLocation = () => {
//     setIsLoading(true);
//     GetLocation.getCurrentPosition({
//       enableHighAccuracy: true,
//       timeout: 60000,
//     })
//       .then((location) => {
//         setLatitude(location.latitude);
//         setLongitude(location.longitude);
//         Alert.alert("Success", "Location fetched successfully!");
//       })
//       .catch((error) => {
//         Alert.alert("Error", "Unable to fetch location. Please try again.");
//         console.log(error);
//       })
//       .finally(() => setIsLoading(false));
//   };

//   const loadCities = async () => {
//     try {
//       const response = await get(Constants.get_cities);
//       const list = response.map((city) => ({
//         value: city.id,
//         label: city.name,
//       }));
//       setCityList(response);
//       setCitiesData(list);
//     } catch (err) {
//       Alert.alert("Error", "Failed to load cities.");
//     }
//   };

//   const getArea = (id) => {
//     const city = citiesList.find((city) => city.id === id);
//     if (city) {
//       const list = city.areas.map((area) => ({
//         value: area.id,
//         label: area.name,
//       }));
//       setAreasData(list);
//     } else {
//       setAreasData([]);
//     }
//   };

//   const getSpeciality = async () => {
//     try {
//       const res = await get(Constants.doctor.speciality);
//       const specialtyArray = res.speciality.map((item) => ({
//         value: item.id,
//         label: item.name,
//       }));
//       setSpecialtyData(specialtyArray);
//     } catch (err) {
//       Alert.alert("Error", "Failed to load specialties.");
//     }
//   };

//   const getClassification = () => {
//     const data = ["A", "B", "C", "D"];
//     const classificationArray = data.map((item) => ({
//       value: item,
//       label: item,
//     }));
//     setClassificationData(classificationArray);
//   };

//   useEffect(() => {
//     loadCities();
//     getSpeciality();
//     getClassification();
//   }, []);

//   return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={show}
//       onRequestClose={hide}
//     >
//       <View style={styles.modalContainer}>
//         <View style={styles.modalView}>
//           {/* Modal Header */}
//           <View style={styles.header}>
//             <Text style={styles.headerText}>Add New Doctor</Text>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => {
//                 submit(null);
//                 hide();
//               }}
//               accessibilityLabel="Close modal"
//               accessibilityHint="Closes the add doctor form"
//             >
//               <AntDesign name="close" color="#1E88E5" size={28} />
//             </TouchableOpacity>
//           </View>

//           <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
//             <View style={styles.formContainer}>
//               {/* Doctor Name */}
//               <Input
//                 label="Doctor Name *"
//                 placeholder="Enter doctor name"
//                 setData={setDoctorName}
//                 style={styles.input}
//                 value={doctorName}
//                 viewStyle={styles.inputContainer}
//                 accessibilityLabel="Doctor name input"
//               />

//               {/* City Dropdown */}
//               <View style={styles.dropdownContainer}>
//                 <Dropdown
//                   style={styles.dropdown}
//                   placeholderStyle={styles.placeholderStyle}
//                   selectedTextStyle={styles.selectedTextStyle}
//                   inputSearchStyle={styles.inputSearchStyle}
//                   iconStyle={styles.iconStyle}
//                   data={citiesData}
//                   search
//                   maxHeight={300}
//                   labelField="label"
//                   valueField="value"
//                   placeholder="Select City *"
//                   searchPlaceholder="Search city..."
//                   value={cityValue}
//                   onChange={(item) => {
//                     setCityValue(item.value);
//                     getArea(item.value);
//                     setAreaValue(null); // Reset area when city changes
//                   }}
//                   renderLeftIcon={() => (
//                     <AntDesign
//                       style={styles.icon}
//                       color={cityValue ? "#1E88E5" : "#757575"}
//                       name="enviroment"
//                       size={20}
//                     />
//                   )}
//                   accessibilityLabel="City selection dropdown"
//                 />
//               </View>

//               {/* Area Dropdown */}
//               <View style={styles.dropdownContainer}>
//                 <Dropdown
//                   style={styles.dropdown}
//                   placeholderStyle={styles.placeholderStyle}
//                   selectedTextStyle={styles.selectedTextStyle}
//                   inputSearchStyle={styles.inputSearchStyle}
//                   iconStyle={styles.iconStyle}
//                   data={areasData}
//                   search
//                   maxHeight={300}
//                   labelField="label"
//                   valueField="value"
//                   placeholder="Select Area *"
//                   searchPlaceholder="Search area..."
//                   value={areaValue}
//                   onChange={(item) => setAreaValue(item.value)}
//                   renderLeftIcon={() => (
//                     <AntDesign
//                       style={styles.icon}
//                       color={areaValue ? "#1E88E5" : "#757575"}
//                       name="enviroment"
//                       size={20}
//                     />
//                   )}
//                   accessibilityLabel="Area selection dropdown"
//                 />
//               </View>

//               {/* Specialty Dropdown */}
//               <View style={styles.dropdownContainer}>
//                 <Dropdown
//                   style={styles.dropdown}
//                   placeholderStyle={styles.placeholderStyle}
//                   selectedTextStyle={styles.selectedTextStyle}
//                   inputSearchStyle={styles.inputSearchStyle}
//                   iconStyle={styles.iconStyle}
//                   data={specialtyData}
//                   search
//                   maxHeight={300}
//                   labelField="label"
//                   valueField="value"
//                   placeholder="Select Specialty *"
//                   searchPlaceholder="Search specialty..."
//                   value={specialtyValue}
//                   onChange={(item) => setSpecialtyValue(item.value)}
//                   renderLeftIcon={() => (
//                     <AntDesign
//                       style={styles.icon}
//                       color={specialtyValue ? "#1E88E5" : "#757575"}
//                       name="medicinebox"
//                       size={20}
//                     />
//                   )}
//                   accessibilityLabel="Specialty selection dropdown"
//                 />
//               </View>

//               {/* Classification Dropdown */}
//               <View style={styles.dropdownContainer}>
//                 <Dropdown
//                   style={styles.dropdown}
//                   placeholderStyle={styles.placeholderStyle}
//                   selectedTextStyle={styles.selectedTextStyle}
//                   inputSearchStyle={styles.inputSearchStyle}
//                   iconStyle={styles.iconStyle}
//                   data={classificationData}
//                   search
//                   maxHeight={300}
//                   labelField="label"
//                   valueField="value"
//                   placeholder="Select Classification"
//                   searchPlaceholder="Search classification..."
//                   value={classificationValue}
//                   onChange={(item) => setClassificationValue(item.value)}
//                   renderLeftIcon={() => (
//                     <AntDesign
//                       style={styles.icon}
//                       color={classificationValue ? "#1E88E5" : "#757575"}
//                       name="star"
//                       size={20}
//                     />
//                   )}
//                   accessibilityLabel="Classification selection dropdown"
//                 />
//               </View>

//               {/* Address */}
//               <Input
//                 label="Address *"
//                 placeholder="Enter address"
//                 setData={setAddress}
//                 style={styles.input}
//                 value={address}
//                 viewStyle={styles.inputContainer}
//                 accessibilityLabel="Address input"
//               />

//               {/* Location Button */}
//               <TouchableOpacity
//                 style={[
//                   styles.locationButton,
//                   { backgroundColor: latitude ? "#1E88E5" : "#E3F2FD" },
//                 ]}
//                 onPress={getCurrentLocation}
//                 accessibilityLabel="Fetch current location"
//               >
//                 <Text
//                   style={[
//                     styles.locationButtonText,
//                     { color: latitude ? "#FFFFFF" : "#1E88E5" },
//                   ]}
//                 >
//                   {latitude ? "Location Selected" : "Get Current Location"}
//                 </Text>
//               </TouchableOpacity>

//               {/* Map View */}
//               {latitude && longitude && (
//                 <View style={styles.mapContainer}>
//                   <MapView
//                     style={styles.map}
//                     initialRegion={{
//                       latitude: latitude,
//                       longitude: longitude,
//                       latitudeDelta: 0.005,
//                       longitudeDelta: 0.005,
//                     }}
//                     showsUserLocation={true}
//                   >
//                     <Marker coordinate={{ latitude, longitude }} />
//                   </MapView>
//                 </View>
//               )}

//               {/* Submit Button */}
//               <TouchableOpacity
//                 style={styles.submitButton}
//                 onPress={submitData}
//                 accessibilityLabel="Submit doctor details"
//               >
//                 <Text style={styles.submitButtonText}>Submit</Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         </View>
//       </View>
//       {isLoading && <LoadingScreen />}
//     </Modal>
//   );
// };

// export default AddNewDoctorModel;

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalView: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     width: "90%",
//     maxHeight: "80%",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//     padding: 20,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#1E88E5",
//   },
//   closeButton: {
//     padding: 10,
//   },
//   scrollView: {
//     flexGrow: 1,
//   },
//   formContainer: {
//     alignItems: "center",
//     paddingBottom: 20,
//   },
//   inputContainer: {
//     width: "100%",
//     marginBottom: 20,
//   },
//   input: {
//     height: 50,
//     borderColor: "#B0BEC5",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     fontSize: 16,
//     color: "#212121",
//     backgroundColor: "#FAFAFA",
//   },
//   dropdownContainer: {
//     width: "100%",
//     marginBottom: 20,
//   },
//   dropdown: {
//     height: 50,
//     borderColor: "#B0BEC5",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     backgroundColor: "#FAFAFA",
//   },
//   placeholderStyle: {
//     fontSize: 16,
//     color: "#757575",
//   },
//   selectedTextStyle: {
//     fontSize: 16,
//     color: "#212121",
//   },
//   inputSearchStyle: {
//     height: 40,
//     fontSize: 16,
//     color: "#212121",
//   },
//   iconStyle: {
//     width: 24,
//     height: 24,
//   },
//   icon: {
//     marginRight: 10,
//   },
//   locationButton: {
//     width: "100%",
//     height: 50,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "#1E88E5",
//   },
//   locationButtonText: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   mapContainer: {
//     width: "100%",
//     height: 200,
//     borderRadius: 8,
//     overflow: "hidden",
//     marginBottom: 20,
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   submitButton: {
//     width: "100%",
//     height: 50,
//     backgroundColor: "#1E88E5",
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   submitButtonText: {
//     color: "#FFFFFF",
//     fontSize: 18,
//     fontWeight: "600",
//   },
// });