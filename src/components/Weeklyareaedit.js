import { TouchableOpacity, Text, View, StyleSheet, Dimensions, Modal, ScrollView } from 'react-native';
import React, { useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Moment from 'moment';
import { areas } from '../helpers/data';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { GET_Areas } from '../Provider/ApiRequest';
import { useEffect } from 'react';
import axios from 'axios';
import SelectDropdown from 'react-native-select-dropdown';
import Feather from 'react-native-vector-icons/Feather';
import { styles } from './styles';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const Weeklyareaedit = ({ show, hide, data, submit }) => {
    const [filterValue, setFilterValue] = useState('');

    const [arealist, setarealist] = useState([])

    const getarea = () => {
        axios({
            method: "POST",
            url: GET_Areas,
        }).then((response) => {
            setarealist(response.data)
        }).catch((error) => { console.log("🚀 ~ file: Weeklyareaedit.js ~ line 27 ~ getarea ~ error", error) })
    }

    useEffect(() => {
        getarea()
    }, [])
    const submit22 = () => {
        submit(filterValue)
        hide()
    }

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
                        <Text style={style.calenderText}>Area</Text>

                        <SelectDropdown
                            buttonStyle={{ ...styles.drop, flexDirection: 'row' }}
                            buttonTextStyle={{ color: "#000", fontSize: 15, fontWeight: '600', marginTop: 0 }}
                            defaultButtonText='Select'
                            data={arealist}
                            onSelect={(selectedItem, index) => {
                                setFilterValue(selectedItem)
                            }}
                            rowTextForSelection={(item, index) => {
                                return (
                                    <>
                                        <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                            {item.area_name}
                                        </Text>
                                    </>
                                );
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return (
                                    <>
                                        <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                            {selectedItem.area_name}
                                        </Text>
                                    </>
                                );
                            }}
                            renderDropdownIcon={isOpened => {
                                return <Feather name={isOpened ? 'chevron-up' : 'chevron-down'} color="#000" size={13} style={{ marginLeft: 0 }} />;
                            }}
                            dropdownStyle={{ backgroundColor: '#fff', borderRadius: 10 }}
                        />

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
        borderRadius: 10,
        width: '95%',
        height: '60%',
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
        color: 'rgba(37, 50, 116, 0.6)',
        marginHorizontal: 15
    },
    btn: {
        backgroundColor: '#7189FF',
        width: '90%',
        alignSelf: 'center',
        borderRadius: 7,
        padding: 7,
        alignItems: 'center',
        justifyContent: 'center'
    }

})