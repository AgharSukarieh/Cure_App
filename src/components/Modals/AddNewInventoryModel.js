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
import Input from '../Input';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const AddNewInventoryModel = ({ show, hide, submit }) => {
    const [item, setItem] = useState('');
    const [availability, setAvailability] = useState('')
    const [expired, setExpired] = useState('');
    const [batchNumber, setBatchNumber] = useState('');
    const data = {item,availability,expired,batchNumber}

    const submitBtn = () => {
        if (item != '' && availability != '' && expired != ''){
            submit(data)
            hide()
            setItem('')
            setAvailability('')
            setExpired('')
            setBatchNumber('')
        }
    }

    const scan = () => {

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
                    <TouchableOpacity  style={style.newbtn} onPress={() => {scan()}}>
                        <Text style={{color: 'white', fontSize: 18, paddingHorizontal: 10}}>Scan</Text>
                    </TouchableOpacity>
                    <Text style={style.maintitle}>Add new </Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ marginVertical: 0 }}>
                            <View style={style.card}>
                            <Input lable={'Item'} setData={setItem} style= {item ? styles.input : styles.inputError}/>
                            <Input lable={'Availability'} setData={setAvailability} style= {availability ? styles.input : styles.inputError} />
                            <Input lable={'Expired'} setData={setExpired} style= {expired ? styles.input : styles.inputError} />
                            <Input lable={'BatchNumber'} setData={setBatchNumber} />
                            </View>
                            <View style={style.card}>
                                <TouchableOpacity style={{ ...styles.btn, backgroundColor: '#7189FF' }} onPress={() => { submitBtn() }}>
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

export default AddNewInventoryModel;

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
        height: '70%',
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
    newbtn: {
        backgroundColor: '#7189FF',
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom:10
    },
    card: {
        marginVertical: 10,
        width: '100%',
    },
    lable: {
        marginBottom: 5,
        fontSize: 16,
        color: '#000',
        textTransform: 'capitalize'
    },

})