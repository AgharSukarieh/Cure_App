import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../components/styles';
import GoBack from '../components/GoBack';
import Moment from 'moment';
import DailyTableSales from '../components/DailyTableSales';
import { pharams222, salesdata } from '../helpers/data';
import DailySalesModel from '../components/DailySalesModel';

const DailySales = ({ navigation, route }) => {

    const title = route.params.title
    const date = route.params.date
    const [modal, setModal] = useState(false)
    const [idSelected, setIdSelected] = useState(false)
    const [rows, setrows] = useState([])
    const mainrow = (e) => {
        if (!rows.includes(e)) {
            setrows([...rows, e])
        } else {
            console.log('');
        }
    }
 

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <GoBack text={title} />
                <View style={{ marginVertical: 30 }}>
                    {/* <TouchableOpacity style={style.newbtn} onPress={() => { setModal(true) }}>
                        <Text style={{ color: '#fff', fontSize: 18 }}>Add new</Text>
                    </TouchableOpacity> */}
                    <DailyTableSales data={pharams222} idSelected={idSelected} setIdSelected={setIdSelected} /> 
                </View>
            </ScrollView>
            <DailySalesModel id={idSelected} show={modal} hide={() => { setModal(false) }} submit={(e) => { mainrow(e) }} />
        </SafeAreaView >
    );
};

export default DailySales;

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
        marginHorizontal: 15
    }
})