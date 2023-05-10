import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../../components/styles';
import Moment from 'moment';
import GoBack from '../../components/GoBack';
import DailySalesaddModel from '../../components/Modals/DailySalesaddModel';
import DailySalesTable from '../../components/Tables/DailyTableSales';
import { useEffect } from 'react';
import axios from 'axios';
import { SAL_GET_REPORT } from '../../Provider/ApiRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DailySales = ({ navigation, route }) => {

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
    const [rows, setrows] = useState([])

    const getpharmacys = () => {
        let data = {
            date: date,
            user_id: user.id
        }
        axios({
            method: "POST",
            url: SAL_GET_REPORT,
            data: data
        }).then((response) => {
            setrows(response.data)
        }).catch((error) => { console.log("🚀 ~ file: DailyaddModel.js ~ line 43 ~ getdoctors ~ error", error) })
    }
    useEffect(() => {
        getpharmacys()
    }, [user])



    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <GoBack text={title} />
                <View style={{ marginVertical: 30 }}>
                    <TouchableOpacity style={style.newbtn} onPress={() => { setModal(true) }}>
                        <Text style={{ color: '#fff', fontSize: 18 }}>Add Pharmacy</Text>
                    </TouchableOpacity>
                    <View style={style.div}>
                        {rows && rows.map((item, index) => (
                            <TouchableOpacity key={index} style={style.card} onPress={() => { navigation.navigate('Sal_rep_pharm', { item: item, area: area });
                             }}>
                                <Text style={{ color: "#fff", fontSize: 17, fontWeight: '700' }}>{item?.pharm_id?.pharmacy_name}</Text>
                            </TouchableOpacity>

                        ))}
                    </View>
                </View>
            </ScrollView>
            <DailySalesaddModel show={modal} hide={() => { setModal(false) }} submit={(e) => { getpharmacys() }} date={date} />
        </SafeAreaView >
    );
};

export default DailySales;

export const style = StyleSheet.create({
    div: { flexDirection: 'row', flexWrap: 'wrap', width: '90%', justifyContent: 'space-between', alignSelf: 'center', marginTop: 25 },
    card: {
        width: '48%',
        backgroundColor: '#7189FF',
        height: 80,
        marginBottom: 15,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
    },
    newbtn: {
        backgroundColor: '#7189FF',
        // width: '25%',
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginHorizontal: 15
    }
})