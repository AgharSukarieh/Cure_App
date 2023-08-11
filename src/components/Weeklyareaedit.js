import { TouchableOpacity, Text, View, StyleSheet, Modal } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Moment from 'moment';
import { useEffect } from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import Feather from 'react-native-vector-icons/Feather';
import { styles } from './styles';

const Weeklyareaedit = ({ show, hide, data, submit, cityArea }) => {

    const [cityValue, setCityValue] = useState();
    const [areaValue, setAreaValue] = useState('');
    const [citylist, setcitylist] = useState([])
    const [arealist, setarealist] = useState([])

    const getcity = () => {
        setcitylist(cityArea.areas);
    }
    const getArea = (id) => {
        const arr = [];
        cityArea.areas.forEach((area) => {
            if (area.city_id == id) {
                arr.push(area);
            }
        });
        setarealist(arr);
    }

    useEffect(() => {
        getcity()
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
                        <AntDesign name="close" color='#7189FF' size={35} style={{ alignSelf: 'flex-end' }} />
                    </TouchableOpacity>
                    <Text style={style.title}>{data.item}</Text>
                    < View style={style.filterContainer}>
                        <Text style={style.calenderText}>City</Text>
                        <SelectDropdown
                            buttonStyle={{ ...styles.drop, flexDirection: 'row-reverse' }}
                            buttonTextStyle={{ color: "#000", fontSize: 15, fontWeight: '600', marginTop: 0 }}
                            defaultButtonText='Select'
                            data={citylist}
                            onSelect={(selectedItem, index) => {
                                setCityValue(selectedItem.id);
                                getArea(selectedItem.id);
                            }}
                            rowTextForSelection={(item, index) => {
                                return (
                                    <>
                                        <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                            {item.name}
                                        </Text>
                                    </>
                                );
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return (
                                    <>
                                        <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                            {selectedItem.name}
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
                                    data={arealist}
                                    onSelect={(selectedItem, index) => {
                                        setAreaValue(selectedItem.id)
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return (
                                            <>
                                                <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                                    {item.name}
                                                </Text>
                                            </>
                                        );
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return (
                                            <>
                                                <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                                    {selectedItem.name}
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
        color: '#7189FF',
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
        backgroundColor: '#7189FF',
        width: '90%',
        alignSelf: 'center',
        borderRadius: 13,
        padding: 7,
        alignItems: 'center',
        justifyContent: 'center'
    }

})