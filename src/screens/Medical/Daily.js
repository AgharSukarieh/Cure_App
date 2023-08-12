import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../../components/styles';
import GoBack from '../../components/GoBack';
import moment from 'moment';
import DailyaddModel from '../../components/Modals/DailyaddModel';
import Sweetalert from '../../components/sweetalert';
import Constants from '../../config/globalConstants';
import { useAuth } from '../../contexts/AuthContext';
import DailyMedicalHeaderTable from '../../components/Tables/DailyMedicalHeaderTable';
import TableView from '../../General/TableView';
import DailyMedicalItemTable from '../../components/Tables/DailyMedicalItemTable';

const Daily = ({ navigation, route }) => {
    const { user } = useAuth();
    const title = route.params.title
    const date = route.params.date
    const area = route.params.area
    const [modal, setModal] = useState(false)
    const [alert, setalert] = useState(false)

    const [refr, setrefr] = useState(false)

    const params = {
        medical_id: user?.medicals.id,
        start_visit: moment(date, 'YYYY-M-D').format('YYYY-MM-DD')
    }

    const mainrow = (e) => {
        console.log('cccccccccccccc');
        setalert(true)
        getdata()
        setrefr(true)
    }

    return (
        <SafeAreaView style={styles.container}>
            <GoBack text='Weekly Plan' isIcon={'calendar-o'} />

            <View style={{ marginVertical: 30, width: '90%', alignSelf: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 25, color: '#253274', fontWeight: '600', }}>{area?.area}</Text>
                    {moment(date, 'YYYY-M-D').format('YYYY-MM-DD') == moment().format('YYYY-MM-DD') ? <TouchableOpacity style={style.newbtn} onPress={() => { setModal(true) }}>
                        <Text style={{ color: '#fff', fontSize: 18 }}>Add new</Text>
                    </TouchableOpacity> : null}
                </View>
                <Text style={{ fontSize: 20, color: '#253274', fontWeight: '600', }}>{title}</Text>
            </View>

            <View style={style.container}>
                <DailyMedicalHeaderTable />
                <TableView
                    refr={refr}
                    apiEndpoint={Constants.visit.medical}
                    enablePullToRefresh
                    params={params}
                    onEndReached={false}
                    renderItem={({ item }) => <DailyMedicalItemTable item={item} />}
                />
            </View>

            <DailyaddModel show={modal} hide={() => { setModal(false) }} submit={(e) => { mainrow(e) }} date={date} area={area} />
            <Sweetalert show={alert} hide={() => { setalert(false) }} title='Record added successfully' />
        </SafeAreaView >
    );
};

export default Daily;

export const style = StyleSheet.create({
    container: {
        flex: 1,
        width: '98%',
        alignSelf: 'center',
    },
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