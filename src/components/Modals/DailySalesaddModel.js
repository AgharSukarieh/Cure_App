import { TouchableOpacity, Text, View, StyleSheet, Dimensions, Modal, ScrollView, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SelectDropdown from 'react-native-select-dropdown'
import { pharams } from '../../helpers/data';
import Feather from 'react-native-vector-icons/Feather';
import { styles } from '../styles';
import Moment from 'moment';
import DatePicker from 'react-native-date-picker'
import { GET_PHARMACY, SAL_ADD_REPORT } from '../../Provider/ApiRequest';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const DailySalesaddModel = ({ show, hide, submit, date }) => {

    const [user, setuser] = useState('');
    const getlogs = async () => {
        const a = await AsyncStorage.getItem('userInfo')
        setuser(JSON.parse(a))
    }
    useEffect(() => {
        getlogs()
    }, []);

    const [pharam, setpharam] = useState('')
    const currentTime = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
    const submit2 = () => {
        let data = {
            user_id: user.id,
            pharam: pharam,
            date: date + ' ' + currentTime,
        }
        axios({
            method: "POST",
            url: SAL_ADD_REPORT,
            data: data
        }).then((response) => {
            console.log(response.data);
            if (response.data.message == 'done') {
                submit(data)
                hide()
                setpharam('')
            }
        }).catch((error) => { console.log("🚀 ~ file: DailyaddModel.js ~ line 26 ~ getdoctors ~ error", error) })
    }


    const [pharmacy_list, setpharmacy_list] = useState([]);
    const getpharmacys = () => {
        axios({
            method: "POST",
            url: GET_PHARMACY,
        }).then((response) => {
            // console.log(response.data)
            setpharmacy_list(response.data)
        }).catch((error) => { console.log("🚀 ~ file: DailyaddModel.js ~ line 43 ~ getdoctors ~ error", error) })
    }
    useEffect(() => {
        getpharmacys()
    }, [show])

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
                                <Text style={style.lable}>Pharmacy</Text>
                                <SelectDropdown
                                    buttonStyle={{ ...styles.drop, flexDirection: 'row' }}
                                    buttonTextStyle={{ color: "#000", fontSize: 15, fontWeight: '600', marginTop: 0 }}
                                    defaultButtonText='Select'
                                    data={pharmacy_list}
                                    onSelect={(selectedItem, index) => {
                                        setpharam(selectedItem.ph_id)
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return (
                                            <>
                                                <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                                    {item.pharmacy_name}
                                                </Text>
                                            </>
                                        );
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return (
                                            <>
                                                <Text style={{ fontSize: 16, paddingHorizontal: 0, color: "#000", fontWeight: '600' }}>
                                                    {selectedItem.pharmacy_name}
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
                                <TouchableOpacity disabled={pharam != '' ? false : true} style={{ ...styles.btn, backgroundColor: pharam != '' ? '#7189FF' : '#ddd' }} onPress={() => { submit2() }}>
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

export default DailySalesaddModel;

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
        height: '40%',
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
    filterbuttontext2: {

    }

})