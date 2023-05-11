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

const AddNewOfferModel = ({ show, hide, submit, item }) => {
    const [data, setData] = useState();
    console.log(item);
    const submitBtn = () => {
        // submit(data)
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
                    
                    <Text style={style.maintitle}>Add new Offer</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ marginVertical: 0 }}>
                            <View style={style.card}>
                            {/* Components */}
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

export default AddNewOfferModel;

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