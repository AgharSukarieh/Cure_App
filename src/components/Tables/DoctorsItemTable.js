import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import SkuModel from '../Modals/skuModel'


const DoctorsItemTable = ({ item }) => {
    const [modal, setModal] = useState(false)
    const [rowdata, setrowdata] = useState(false)
    const rowModal = (rowdata) => {
        setrowdata(rowdata)
        setModal(true)
    }

    return (
        <>
            <View style={styles.row}>
                <View style={{ ...styles.filtterel, width: '38%', }}>
                    <TouchableOpacity style={styles.filtterbtn} onPress={() => { }}>
                        <Text style={styles.filtterbtntext}>{item?.name}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.verticalline} />

                <View style={{ ...styles.filtterel, width: '24%', }}>
                    <TouchableOpacity style={styles.filtterbtn} onPress={() => { }}>
                        <Text style={styles.filtterbtntext}>{item.speciality}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.verticalline} />

                <View style={{ ...styles.filtterel, width: '38%', }}>
                    <TouchableOpacity style={styles.filtterbtn} onPress={() => { }}>
                        <Text style={styles.filtterbtntext}>{item.area}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <SkuModel show={modal} data={rowdata} hide={() => { setModal(false) }} submit={(e) => { console.log(e) }} />
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
        width: '33%',
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

