import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../../components/styles';
import GoBack from '../../components/GoBack';
import moment from 'moment';
import DailyTable from '../../components/Tables/DailyTable';
import DailyaddModel from '../../components/Modals/DailyaddModel';
import Sweetalert from '../../components/sweetalert';
import Constants from '../../config/globalConstants';
import { get } from '../../WebService/RequestBuilder';
import { useAuth } from '../../contexts/AuthContext';

const Daily = ({ navigation, route }) => {
    const {user} = useAuth();
    const title = route.params.title
    const date = route.params.date
    const area = route.params.area
    const [modal, setModal] = useState(false)
    const [alert, setalert] = useState(false)
    const [rows, setrows] = useState([])

    const getDoctors = async() => {
        const params = {
            start_visit: moment(date, 'YYYY-M-D').format('YYYY-MM-DD'),
            // sale_id: user.sales.id,
            limit: 500
        }
        console.log(params);
        get(Constants.visit.medical, null, params)
        .then((res) => {
            setrows(res.data)
        })
        .catch((err) => {})
        .finally(() => {
            setIsLoading(false)
        })
    }

    useEffect(() => {
        getDoctors()
    }, [])

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
            <DailyaddModel show={modal} hide={() => { setModal(false) }} submit={(e) => { mainrow(e) }} date={date} area={area} />
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
    }
})