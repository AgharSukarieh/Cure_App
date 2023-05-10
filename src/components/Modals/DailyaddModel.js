import { TouchableOpacity, Text, View, StyleSheet, Dimensions, Modal, ScrollView, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SelectDropdown from 'react-native-select-dropdown'
import { classification, doctors, drugs, Specialty } from '../../helpers/data';
import Feather from 'react-native-vector-icons/Feather';
import { styles } from '../styles';
import Moment from 'moment';
import { GET_DOCTORS_LIST, GET_Products, MED_ADD_DAILY } from '../../Provider/ApiRequest';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetLocation from 'react-native-get-location'


const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const DailyaddModel = ({ show, hide, areaid, submit, date }) => {
    const [user, setuser] = useState('');
    const getlogs = async () => {
        const a = await AsyncStorage.getItem('userInfo')
        setuser(JSON.parse(a))
    }
    useEffect(() => {
        getlogs()
    }, []);



    const [doctorslist, setdoctorslist] = useState([])
    const [Productslist, setdProductslist] = useState([])

    const getdoctors = () => {
        axios({
            method: "POST",
            url: GET_DOCTORS_LIST,
        }).then((response) => {
            setdoctorslist(response.data)
        }).catch((error) => { console.log("🚀 ~ file: DailyaddModel.js ~ line 26 ~ getdoctors ~ error", error) })
    }

    const getproducts = () => {
        axios({
            method: "POST",
            url: GET_Products,
        }).then((response) => {
            setdProductslist(response.data)
            // console.log(response.data);
        }).catch((error) => { console.log("🚀 ~ file: DailyaddModel.js ~ line 26 ~ getdoctors ~ error", error) })
    }

    useEffect(() => {
        getdoctors()
        getproducts()
    }, [])

    // ///////////////////////////

    const [docname, setdocname] = useState('')
    const [docSpecialty, setdocSpecialty] = useState('')
    const [docclass, setdocclass] = useState('')
    const [drug1, setdrug1] = useState('')
    const [drug2, setdrug2] = useState('')
    const [drug3, setdrug3] = useState('')
    const [note, setnote] = useState('')

    const [textInputHeight, setTextInputHeight] = useState(40);

    const handleContentSizeChange = (event) => {
        const { height } = event.nativeEvent.contentSize;
        setTextInputHeight(height);
    };
    const currentTime = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
    const submit2 = () => {
        const latitude = ''
        const longitude = ''
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
        })
            .then(location => {
                submit3(location.latitude, location.longitude)
            })
            .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
            })

    }

    const submit3 = (latitude, longitude) => {
        let data = {
            user_id: user.id,
            area_id: areaid,
            doctor: docname.doc_id,
            drug1: drug1.pro_id,
            drug2: drug2.pro_id,
            drug3: drug3.pro_id,
            note: note,
            date: date + ' ' + currentTime,
            latitude: latitude,
            longitude: longitude
        }
        axios({
            method: "POST",
            url: MED_ADD_DAILY,
            data: data
        }).then((response) => {
            console.log(response.data);
            if (response.data.message == 'done') {
                submit(data)
                hide()
            }
        }).catch((error) => { console.log("🚀 ~ file: DailyaddModel.js ~ line 26 ~ getdoctors ~ error", error) })
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

                    <Text style={style.maintitle}>Add new</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ marginVertical: 10 }}>
                            <View style={style.card}>
                                <Text style={style.lable}>Doctor name</Text>
                                <SelectDropdown
                                    buttonStyle={{ ...styles.drop, flexDirection: 'row' }}
                                    buttonTextStyle={{ color: "#000", fontSize: 15, fontWeight: '600', marginTop: 0 }}
                                    defaultButtonText='Select'
                                    data={doctorslist}
                                    onSelect={(selectedItem, index) => {
                                        setdocname(selectedItem)
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return (
                                            <>
                                                <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                                    {item.doc_name}
                                                </Text>
                                            </>
                                        );
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return (
                                            <>
                                                <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                                    {selectedItem.doc_name}
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
                            {/* <View style={style.card}>
                                <Text style={style.lable}>Doctor Specialty</Text>
                                <SelectDropdown
                                    buttonStyle={{ ...styles.drop, flexDirection: 'row' }}
                                    buttonTextStyle={{ color: "#000", fontSize: 15, fontWeight: '600', marginTop: 0 }}
                                    defaultButtonText='Select'
                                    data={Specialty}
                                    onSelect={(selectedItem, index) => {
                                        setdocSpecialty(selectedItem)
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
                                        return <Feather name={isOpened ? 'chevron-up' : 'chevron-down'} color="#000" size={13} style={{ marginLeft: 0 }} />;
                                    }}
                                    dropdownStyle={{ backgroundColor: '#fff', borderRadius: 10 }}
                                />
                            </View>
                            <View style={style.card}>
                                <Text style={style.lable}>Doctor classification</Text>
                                <SelectDropdown
                                    buttonStyle={{ ...styles.drop, flexDirection: 'row' }}
                                    buttonTextStyle={{ color: "#000", fontSize: 15, fontWeight: '600', marginTop: 0 }}
                                    defaultButtonText='Select'
                                    data={classification}
                                    onSelect={(selectedItem, index) => {
                                        setdocclass(selectedItem)
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
                                        return <Feather name={isOpened ? 'chevron-up' : 'chevron-down'} color="#000" size={13} style={{ marginLeft: 0 }} />;
                                    }}
                                    dropdownStyle={{ backgroundColor: '#fff', borderRadius: 10 }}
                                />
                            </View> */}
                            <View style={style.card}>
                                <Text style={style.lable}>item 1</Text>
                                <SelectDropdown
                                    buttonStyle={{ ...styles.drop, flexDirection: 'row' }}
                                    buttonTextStyle={{ color: "#000", fontSize: 15, fontWeight: '600', marginTop: 0 }}
                                    defaultButtonText='Select'
                                    data={Productslist}
                                    onSelect={(selectedItem, index) => {
                                        setdrug1(selectedItem)
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return (
                                            <>
                                                <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                                    {item.product_name}
                                                </Text>
                                            </>
                                        );
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return (
                                            <>
                                                <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                                    {selectedItem.product_name}
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
                            <View style={style.card}>
                                <Text style={style.lable}>item 2</Text>
                                <SelectDropdown
                                    buttonStyle={{ ...styles.drop, flexDirection: 'row' }}
                                    buttonTextStyle={{ color: "#000", fontSize: 15, fontWeight: '600', marginTop: 0 }}
                                    defaultButtonText='Select'
                                    data={Productslist}
                                    onSelect={(selectedItem, index) => {
                                        setdrug2(selectedItem)
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return (
                                            <>
                                                <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                                    {item.product_name}
                                                </Text>
                                            </>
                                        );
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return (
                                            <>
                                                <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                                    {selectedItem.product_name}
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
                            <View style={style.card}>
                                <Text style={style.lable}>item 3</Text>
                                <SelectDropdown
                                    buttonStyle={{ ...styles.drop, flexDirection: 'row' }}
                                    buttonTextStyle={{ color: "#000", fontSize: 15, fontWeight: '600', marginTop: 0 }}
                                    defaultButtonText='Select'
                                    data={Productslist}
                                    onSelect={(selectedItem, index) => {
                                        setdrug3(selectedItem)
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return (
                                            <>
                                                <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                                    {item.product_name}
                                                </Text>
                                            </>
                                        );
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return (
                                            <>
                                                <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                                    {selectedItem.product_name}
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
                            <View style={style.card}>
                                <Text style={style.lable}>note</Text>
                                <TextInput
                                    onChangeText={(text) => { setnote(text) }}
                                    placeholder='Note'
                                    style={{ ...styles.drop, height: textInputHeight, paddingHorizontal: 10 }}
                                    maxLength={300}
                                    multiline
                                    numberOfLines={10}
                                    textAlignVertical='top'
                                    onContentSizeChange={handleContentSizeChange}
                                />
                            </View>
                            <View style={style.card}>
                                <TouchableOpacity style={styles.btn} onPress={() => { submit2() }}>
                                    <Text style={{ fontSize: 18, fontWeight: '700', textTransform: 'capitalize', color: '#fff' }}>submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default DailyaddModel;

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
        height: '90%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding: 20
    },
    maintitle: {
        fontSize: 25,
        textTransform: 'capitalize',
        color: '#7189FF'
    },
    card: {
        marginVertical: 15,
        width: '100%',
    },
    lable: {
        marginBottom: 5,
        fontSize: 16,
        color: '#000',
        textTransform: 'capitalize'
    },


})