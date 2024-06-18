import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import SkuModel from '../Modals/skuModel'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import DoctorlistModal from '../Modals/DoctorlistModal';
import EditDoctorprofle from '../Modals/EditDoctorprofle';


const DoctorsItemTable = ({ item, cityArea, specialtyData ,setFilter,user }) => {
    const [modal, setModal] = useState(false)
    const [rowdata, setrowdata] = useState(false)
    const [edModal, setEdModal] = useState(false);

    const rowModal = (rowdata) => {
        setrowdata(rowdata)
        setModal(true)
    }

    const EdModal = (rowdata) => {
        setrowdata(rowdata)
        setEdModal(true)
    }

    return (
        <>
            <View style={styles.row}>
                <View style={{ ...styles.filtterel, width: '33%', }}>
                    <TouchableOpacity style={styles.filtterbtn} onPress={() => { }}>
                        <Text style={styles.filtterbtntext}>{item?.name}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.verticalline} />

                <View style={{ ...styles.filtterel, width: '21%', }}>
                    <TouchableOpacity style={styles.filtterbtn} onPress={() => { }}>
                        <Text style={styles.filtterbtntext}>{item.speciality}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.verticalline} />

                <View style={{ ...styles.filtterel, width: '28%', }}>
                    <TouchableOpacity style={styles.filtterbtn} onPress={() => { }}>
                        <Text style={styles.filtterbtntext}>{item.area}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.verticalline} />
                <View style={{ ...styles.filtterel, flexDirection: 'row', width: '15%', justifyContent: 'space-around', alignItems: 'center' }} >
                    <TouchableOpacity style={{ marginHorizontal: 2 }} onPress={() => { rowModal(item) }}>
                        <AntDesign name="infocirlce" color='#469ED8' size={20} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginHorizontal: 2 }} onPress={() => { EdModal(item) }}>
                        <Feather name="edit" color='#000' size={17} />
                    </TouchableOpacity>
                </View>
            </View>

            <DoctorlistModal show={modal} data={rowdata} hide={() => { setModal(false) }} submit={(e) => { console.log(e) }} />
            <EditDoctorprofle item={item} show={edModal} cityArea={cityArea} specialtyData={specialtyData} hide={() => { setEdModal(false); }} submit={e => { setFilter({ user_id: user?.id });}}/>
        </>
    )
}

export default DoctorsItemTable

const styles = StyleSheet.create({
    filtterrow1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '98%',
        alignSelf: 'center',
        borderColor: '#469ED8',
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
        borderColor: '#469ED8',
        borderBottomWidth: 1,
        marginTop: 10,
        paddingVertical: 7,
        borderRadius: 7
    },
    filtterel: {
        width: '33%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 4
    },
    filtterbtn: {
        width: '90%',
        paddingVertical: 5,
        borderRadius: 7,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        flexDirection: 'row', // This keeps the text on a single line
        maxWidth: '100%',
        overflow: 'hidden',
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
    verticalline: {
        height: '90%',
        borderWidth: 1,
        alignSelf: 'center',
        borderStyle: 'dashed',
        borderColor: '#000',
    },
})

