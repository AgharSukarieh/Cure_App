import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import SkuModel from '../Modals/skuModel';
import SkueditModel from '../Modals/skueditModel';

const DailyMedicalItemTable = ({ item }) => {
    const [modal, setModal] = useState(false)
    const [editmodal, seteditmodal] = useState(false)
    const [rowdata, setrowdata] = useState(false)

    const rowModal = (rowdata) => {
        setrowdata(rowdata)
        setModal(true)
    }
    const editrowModal = (rowdata) => {
        setrowdata(rowdata)
        seteditmodal(true)
    }
    return (
        <>
            {/* <View style={{ ...styles.row, backgroundColor: item?.id % 2 == 0 ? '#7189FF' : '#fff' }}> */}
            <View style={{ ...styles.row, }}>

                <View style={{ ...styles.filtterel, width: '40%', }}>
                    <TouchableOpacity style={styles.filtterbtn} onPress={() => { }}>
                        <Text style={styles.filtterbtntext}>{item?.doctor?.name}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.verticalline} />

                <View style={{ ...styles.filtterel, width: '23%', }}>
                    <TouchableOpacity style={styles.filtterbtn} onPress={() => { }}>
                        <Text style={styles.filtterbtntext}>{item?.doctor?.speciality?.name}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.verticalline} />

                <View style={{ ...styles.filtterel, width: '22%', }}>
                    <TouchableOpacity style={styles.filtterbtn} onPress={() => { }}>
                        <Text style={styles.filtterbtntext}>{moment(item?.start_visit).format('h:m A')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.verticalline} />

                <View style={{ ...styles.filtterel, flexDirection: 'row', width: '15%', justifyContent: 'space-around', alignItems: 'center' }} >
                    <TouchableOpacity style={{ marginHorizontal: 2 }} onPress={() => { rowModal(item) }}>
                        <AntDesign name="infocirlce" color='#7189FF' size={20} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginHorizontal: 2 }} onPress={() => { editrowModal(item) }}>
                        <Feather name="edit" color='#000' size={17} />
                    </TouchableOpacity>
                </View>

            </View>
            <SkuModel show={modal} data={rowdata} hide={() => { setModal(false) }} submit={(e) => { console.log(e) }} />
            <SkueditModel show={editmodal} data={rowdata} hide={() => { seteditmodal(false) }} submit={(e) => { }} />
        </>
    )
}

export default DailyMedicalItemTable

const styles = StyleSheet.create({
    filtterrow1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '98%',
        alignSelf: 'center',
        borderColor: '#7189FF',
        borderWidth: 1,
        marginTop: 10,
        borderRadius: 7,
        paddingVertical: 7
    },
    filtterrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '98%',
        alignSelf: 'center',
        borderColor: '#7189FF',
        borderBottomWidth: 1,
        marginTop: 10,
        paddingVertical: 7,
        borderRadius: 7
    },
    filtterel: {
        width: '29%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 4
    },
    filtterbtn: {
        width: '90%',
        paddingVertical: 5,
        borderRadius: 7
    },
    filtterbtn2: {
        width: '32%',
        paddingVertical: 5,
        borderRadius: 7
    },
    filtterbtntext: {
        textAlign: 'center',
        fontSize: 15,
        textTransform: 'capitalize',
        color: '#000',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        // borderWidth: 1,
        borderColor: '#000',
        marginTop: 10,
        paddingBottom: 10,
        // borderRadius: 7
        borderBottomWidth: 1.5,
        borderStyle: 'dashed'
    },
    verticalline: {
        height: '90%',
        borderWidth: 1,
        alignSelf: 'center',
        borderStyle: 'dashed',
        borderColor: '#000',
    },
    rowel: {
        width: '29%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 4
    },
    rowel_tetx: {
        textAlign: 'center',
        fontSize: 15,
        textTransform: 'capitalize',
        color: '#000',
        height: 20,
    },
    rowel_tetx2: {
        textAlign: 'center',
        fontSize: 15,
        textTransform: 'capitalize',
        color: '#fff',
        height: 20,
    },

});