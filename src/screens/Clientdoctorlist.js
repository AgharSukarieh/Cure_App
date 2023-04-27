import { View, Text, SafeAreaView, Dimensions, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../components/styles';
import GoBack from '../components/GoBack';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { areas, classification, pharams, Specialty } from '../helpers/data';
import ClientdoctorTable from '../components/Tables/ClientdoctorTable';
import Feather from 'react-native-vector-icons/Feather';
import { useEffect } from 'react';
import axios from 'axios';
import { GET_Areas, GET_CITY, GET_MED_CLIENT, GET_SPECIALTIES } from '../Provider/ApiRequest';
import SelectDropdown from 'react-native-select-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';

const wwidth = Dimensions.get('window').width
const Clientdoctorlist = () => {

    const [userinfo, setuserinfo] = useState([])
    const getlogs = async () => {
        const a = await AsyncStorage.getItem('userInfo')
        setuserinfo(JSON.parse(a))
    }
    useEffect(() => {
        getlogs()
    }, [])
    // ////////////////////////////////
    // ////////////////////////////////
    // ////////////////////////////////


    const [citylist, setcitylist] = useState([])
    const [selectedcity, setselectedcity] = useState('');
    const [arealist, setarealist] = useState([])
    const [selectedarea, setselectedarea] = useState()
    const [specialtieslist, setspecialtieslist] = useState([])
    const [selectedspecialty, setselectedspecialty] = useState()
    const [clientslist, setclientslist] = useState([])

    const getdoctors = () => {
        axios({
            method: "POST",
            url: GET_CITY,
        }).then((response) => {
            setcitylist(response.data)
        }).catch((error) => { console.log("🚀 ~ file: Sales.js ~ line 26 ~ getdoctors ~ error", error) })
    }

    const getarea = () => {
        let data = {
            city_id: selectedcity
        }
        axios({
            method: "POST",
            url: GET_Areas,
            data: data
        }).then((response) => {
            setarealist(response.data)
        }).catch((error) => { console.log("🚀 ~ file: Sales.js ~ line 39 ~ getarea ~ error", error) })
    }

    const getspecialties = () => {
        axios({
            method: "POST",
            url: GET_SPECIALTIES,
        }).then((response) => {
            setspecialtieslist(response.data)
        }).catch((error) => { console.log("🚀 ~ file: Sales.js ~ line 26 ~ getdoctors ~ error", error) })
    }


    useEffect(() => {
        getdoctors()
        getarea()
        getspecialties()
    }, [selectedcity])

    // //////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////

    const get_med_client = () => {
        let data = {
            userid: userinfo.id,
            specialty_id: selectedspecialty,
            area_id: selectedarea
        }
        console.log(data);
        axios({
            method: "POST",
            url: GET_MED_CLIENT,
            data: data
        }).then((response) => {
            setclientslist(response.data)
            console.log('response', response.data.length);
        }).catch((error) => { console.log("🚀 ~ file: Sales.js ~ line 26 ~ getdoctors ~ error", error) })
    }

    useEffect(() => {
        get_med_client()
    }, [userinfo, selectedspecialty, selectedarea])

    // //////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////
    const [filterValue, setFilterValue] = useState('');

    const [Specialtyfilter, setSpecialtyfilter] = useState('');
    const [classfilter, setclassfilter] = useState('');


    return (
        <SafeAreaView style={styles.container}>
            <GoBack text={'Client List'} />
            <View style={{ width: '90%', alignSelf: 'center' }}>
                <View style={styles.calenderContainer}>
                    <View style={styles.calenderSubContainer}>
                        <Text style={{ ...styles.calenderText, marginBottom: 5 }}>City</Text>
                        <SelectDropdown
                            buttonStyle={{ ...styles.drop, flexDirection: 'row' }}
                            buttonTextStyle={{ color: "#000", fontSize: 15, fontWeight: '600', marginTop: 0 }}
                            defaultButtonText='Select'
                            data={citylist}
                            onSelect={(selectedItem, index) => {
                                setselectedcity(selectedItem.city_id)
                            }}
                            rowTextForSelection={(item, index) => {
                                return (
                                    <>
                                        <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                            {item.city_name}
                                        </Text>
                                    </>
                                );
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return (
                                    <>
                                        <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                            {selectedItem.city_name}
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
                    <View style={styles.calenderSubContainer}>
                        <Text style={{ ...styles.calenderText, marginBottom: 5 }}>Area</Text>
                        <SelectDropdown
                            disabled={selectedcity ? false : true}
                            buttonStyle={{ ...styles.drop, flexDirection: 'row' }}
                            buttonTextStyle={{ color: "#000", fontSize: 15, fontWeight: '600', marginTop: 0 }}
                            defaultButtonText='Select'
                            data={arealist}
                            onSelect={(selectedItem, index) => {
                                setselectedarea(selectedItem.area_id)
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

                </View>
                <View style={styles.calenderContainer}>
                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ ...styles.calenderText, marginBottom: 5 }}>Specialty</Text>
                        <SelectDropdown
                            buttonStyle={{ ...styles.drop, flexDirection: 'row' }}
                            buttonTextStyle={{ color: "#000", fontSize: 15, fontWeight: '600', marginTop: 0 }}
                            defaultButtonText='Select'
                            data={specialtieslist}
                            onSelect={(selectedItem, index) => {
                                setselectedspecialty(selectedItem.sp_id)
                            }}
                            rowTextForSelection={(item, index) => {
                                return (
                                    <>
                                        <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                            {item.sp_name}
                                        </Text>
                                    </>
                                );
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return (
                                    <>
                                        <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                            {selectedItem.sp_name}
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

                </View>
                {/* <View style={{ width: '100%', flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between' }}>
                    < View style={style.filterContainer}>
                        <Text style={style.calenderText}>Specialty</Text>
                        <SelectDropdown
                            buttonStyle={{ ...styles.drop, flexDirection: 'row' }}
                            buttonTextStyle={{ color: "#000", fontSize: 15, fontWeight: '600', marginTop: 0 }}
                            defaultButtonText='Select'
                            data={specialtieslist}
                            onSelect={(selectedItem, index) => {
                                setselectedspecialty(selectedItem.city_id)
                            }}
                            rowTextForSelection={(item, index) => {
                                return (
                                    <>
                                        <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                            {item.sp_name}
                                        </Text>
                                    </>
                                );
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return (
                                    <>
                                        <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                            {selectedItem.sp_name}
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
                    {/* < View style={style.filterContainer}>
                        <Text style={style.calenderText}>Classification</Text>
                        <SearchableDropdown
                            onItemSelect={(item) => { setclassfilter(item) }}
                            onRemoveItem={(item, index) => {
                                setclassfilter('')
                            }}
                            containerStyle={{ padding: 5, width: '90%', height: 50 }}
                            itemStyle={{
                                padding: 10,
                                backgroundColor: '#fff',
                                borderColor: '#bbb',
                                borderWidth: 1,
                            }}
                            itemTextStyle={{ color: '#000', }}
                            itemsContainerStyle={{ maxHeight: 140, width: '100%' }}
                            items={classification}
                            resetValue={false}
                            textInputProps={
                                {
                                    placeholder: classfilter != '' ? classfilter.name : 'Select Specialty',
                                    underlineColorAndroid: "transparent",
                                    style: {
                                        padding: 12,
                                        borderWidth: 1,
                                        borderColor: classfilter != '' ? '#7189FF' : '#7189FF',
                                        borderRadius: 5,
                                    },
                                }
                            }
                        />
                    </View>
                </View>   */}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <ClientdoctorTable data={clientslist} />
            </ScrollView>
        </SafeAreaView >
    );
};

export default Clientdoctorlist;

export const style = StyleSheet.create({
    filterContainer: {
        justifyContent: 'center',
        // alignItems: 'center',
        marginTop: 10,
        width: '50%',
    },
    calenderText: {
        fontSize: 16,
        color: 'rgba(37, 50, 116, 0.6)',
        marginHorizontal: 10
    },
})
