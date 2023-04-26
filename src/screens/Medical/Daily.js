import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../../components/styles';
import GoBack from '../../components/GoBack';
import Moment from 'moment';
import DailyTable from '../../components/Tables/DailyTable';
import { salesdata } from '../../helpers/data';
import DailyaddModel from '../../components/Modals/DailyaddModel';
import Sweetalert from '../../components/sweetalert';
import axios from 'axios';
import { GET_DOCTORS_LIST, MED_GET_DAILY } from '../../Provider/ApiRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Daily = ({ navigation, route }) => {

    const [user, setuser] = useState('');
    const getlogs = async () => {
        const a = await AsyncStorage.getItem('userInfo')
        setuser(JSON.parse(a))
    }
    useEffect(() => {
        getlogs()
    }, []);


    const title = route.params.title
    const date = route.params.date
    const area = route.params.area
    const [modal, setModal] = useState(false)
    const [alert, setalert] = useState(false)
    const [rows, setrows] = useState([])
    const [Productslist, setdProductslist] = useState([])
    const getdata = () => {
        let data = {
            userid: user.id,
            date: date
        }
        axios({
            method: "POST",
            url: MED_GET_DAILY,
            data: data
        }).then((response) => {
            setrows(response.data)
        }).catch((error) => { console.log("🚀 ~ file: DailyaddModel.js ~ line 43 ~ getdoctors ~ error", error) })
    }
    useEffect(() => {
        getdata()
    }, [user])


    const mainrow = (e) => {
        setalert(true)
        getdata()
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <GoBack text={title} />
                <View style={{ marginVertical: 30 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignSelf: 'center' }}>
                        <Text style={{ fontSize: 25, color: '#253274', fontWeight: '600', }}>{area?.area_name}</Text>
                        <TouchableOpacity style={style.newbtn} onPress={() => { setModal(true) }}>
                            <Text style={{ color: '#fff', fontSize: 18 }}>Add new</Text>
                        </TouchableOpacity>
                    </View>
                    <DailyTable data={rows} refresh={() => { getdata() }} />
                </View>
            </ScrollView>
            <DailyaddModel show={modal} hide={() => { setModal(false) }} submit={(e) => { mainrow(e) }} date={date} areaid={area.areaid} />
            <Sweetalert show={alert} hide={() => { setalert(false) }} title='Record added successfully' />
        </SafeAreaView >
    );
};

export default Daily;

export const style = StyleSheet.create({
    card: {
        width: '12%',
        height: 80,
        marginBottom: 25,
    },
    newbtn: {
        backgroundColor: '#7189FF',
        width: '25%',
        paddingVertical: 5,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        // marginHorizontal: 15
    }
})