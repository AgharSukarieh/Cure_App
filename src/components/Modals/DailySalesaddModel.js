import { TouchableOpacity, Text, View, StyleSheet, Dimensions, Modal, ScrollView, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SelectDropdown from 'react-native-select-dropdown'
import Feather from 'react-native-vector-icons/Feather';
import { styles } from '../styles';
import Moment from 'moment';
import Constants from '../../config/globalConstants';
import { useAuth } from '../../contexts/AuthContext';
import { get, post } from '../../WebService/RequestBuilder';

const DailySalesaddModel = ({ show, hide, submit, date, area}) => {
    const {user} = useAuth();

    const [pharmacy_list, setpharmacy_list] = useState([]);
    const [pharam, setpharam] = useState(null)

    const currentTime = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });

    const getpharmacys = async() => {
        get(Constants.sales.pharmacy, null, {user_id: user.id, area_id: area.id})
        .then((res) => {
            setpharmacy_list(res.data)
        })
        .catch((err) => {})
        .finally(() => {
        })
    }

    useEffect(() => {
        getpharmacys()
    }, [])

    const submit2 = () => {
        const body = {
            sale_id: user.sales.id,
            pharmacy_id: pharam.id
        }
        post(Constants.visit.sales, body, null)
        .then((res) => {  
            submit(true)
        })
        .catch((err) => {})
        .finally(() => {
            hide()
            setpharam(null)
        })    
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
                                <Text style={style.lable}>Pharmacy</Text>
                                <SelectDropdown
                                    buttonStyle={{ ...styles.drop, flexDirection: 'row' }}
                                    buttonTextStyle={{ color: "#000", fontSize: 15, fontWeight: '600', marginTop: 0 }}
                                    defaultButtonText='Select'
                                    data={pharmacy_list}
                                    onSelect={(selectedItem, index) => {
                                        setpharam(selectedItem)
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
                                <TouchableOpacity disabled={pharam != '' ? false : true} style={{ ...styles.btn, backgroundColor: pharam != '' ? '#7189FF' : '#ddd' }} onPress={() => { submit2() }}>
                                    <Text style={{ fontSize: 18, fontWeight: '700', textTransform: 'capitalize', color: '#fff' }}>Start Visit</Text>
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
        height: '60%',
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