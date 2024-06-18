import { TouchableOpacity, Text, View, StyleSheet, Modal } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Moment from 'moment';
import { useEffect } from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import Feather from 'react-native-vector-icons/Feather';
import { styles } from './styles';
import { get } from "../WebService/RequestBuilder";
import Constants from "../config/globalConstants";

const Weeklyareaedit = ({ show, hide, data, submit, cityArea }) => {

    const [cityValue, setCityValue] = useState();
    const [areaValue, setAreaValue] = useState('');
    const [citylist, setcitylist] = useState([])
    const [arealist, setarealist] = useState([])
	const [citiesData, setCitiesData] = useState([]);
	const [citiesList, setCityList] = useState([]);
	const [areasData, setAreasData] = useState([]);
	const getCities = () => {
		// setCitiesData(citiesList);
	};

	const loadCities = () => {
		// call api to get cities
		get(Constants.get_cities).then((response) => {
			const list = [];
			response.forEach((city) => {
					list.push({
						value: city.id,
						label: city.name,
					});
				},
			);
			setCityList(response);
			setCitiesData(list);
		});
	};
	const getArea = (id) => {
		citiesList.forEach((city) => {
			if (city.id == id) {
				// console.log(city.areas);
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

    useEffect(() => {
		loadCities()
    }, [])

    const submit22 = () => {
        submit({ city: cityValue, area: areaValue })
        hide()
    }

    const doctorindex = citylist?.findIndex(item => item?.id === data?.city_id);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={show}
            coverScreen={false}
            onSwipeComplete={() => setModalVisible2(false)}
        >
            <View style={style.ModalContainer}>
                <View style={style.ModalView}>
                    <TouchableOpacity onPress={() => { hide() }}>
                        <AntDesign name="close" color='#469ED8' size={35} style={{ alignSelf: 'flex-end' }} />
                    </TouchableOpacity>
                    <Text style={style.title}>{data.item}</Text>
                    < View style={style.filterContainer}>
                        <Text style={style.calenderText}>City</Text>
                        <SelectDropdown
                            buttonStyle={{ ...styles.drop, flexDirection: 'row-reverse' }}
                            buttonTextStyle={{ color: "#000", fontSize: 15, fontWeight: '600', marginTop: 0 }}
                            defaultButtonText='Select'
                            data={citiesData}
                            onSelect={(selectedItem, index) => {
                                setCityValue(selectedItem.value);
                                getArea(selectedItem.value);
                            }}
                            rowTextForSelection={(item, index) => {
                                return (
                                    <>

                                        <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                            {item.label}
                                        </Text>
                                    </>
                                );
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return (
                                    <>
                                        <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                            {selectedItem.label}
                                        </Text>
                                    </>
                                );
                            }}
                            renderDropdownIcon={isOpened => {
                                return <Feather name={isOpened ? 'chevron-up' : 'map-pin'} color="#3A97D6" size={13} style={{ marginLeft: 0 }} />;
                            }}
                            dropdownStyle={{ backgroundColor: '#fff', borderRadius: 10 }}
                        />
                        {cityValue &&
                            <>
                                < Text style={style.calenderText}>Area</Text>
                                <SelectDropdown
                                    buttonStyle={{ ...styles.drop, flexDirection: 'row-reverse' }}
                                    buttonTextStyle={{ color: "#000", fontSize: 15, fontWeight: '600', marginTop: 0 }}
                                    defaultButtonText='Select'
                                    data={areasData}
                                    onSelect={(selectedItem, index) => {
                                        setAreaValue(selectedItem.value)
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return (
                                            <>
                                                <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                                    {item.label}
                                                </Text>
                                            </>
                                        );
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return (
                                            <>
                                                <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                                    {selectedItem.label}
                                                </Text>
                                            </>
                                        );
                                    }}
                                    renderDropdownIcon={isOpened => {
                                        return <Feather name={isOpened ? 'chevron-up' : 'map-pin'} color="#3A97D6" size={13} style={{ marginLeft: 0 }} />;
                                    }}
                                    dropdownStyle={{ backgroundColor: '#fff', borderRadius: 10 }}
                                />
                            </>}
                    </View>
                    <TouchableOpacity style={style.btn} onPress={() => { submit22() }}>
                        <Text style={{ fontSize: 18, fontWeight: '700', textTransform: 'capitalize', color: '#fff' }}>submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal >
    );
};

export default Weeklyareaedit;

const style = StyleSheet.create({
    ModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0707078c',
    },
    ModalView: {
        backgroundColor: "#fff",
        borderRadius: 22,
        width: '95%',
        height: '50%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding: 20
    },
    title: {
        fontSize: 25,
        color: '#469ED8',
    },
    filterContainer: {
        marginVertical: 20,
        width: '100%',
    },
    calenderText: {
        fontSize: 17,
        color: '#000',
        marginHorizontal: 7,
        marginBottom: 4,
        marginTop: 10
    },
    btn: {
        backgroundColor: '#469ED8',
        width: '90%',
        alignSelf: 'center',
        borderRadius: 13,
        padding: 7,
        alignItems: 'center',
        justifyContent: 'center'
    }

})
